// Merge the fresh 15-photo scrape into the enriched dataset:
// keep all enriched fields, replace images with the new list (<=15),
// reusing existing CDN uploads via the manifest and uploading new ones (2000px q85).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CUR = path.join(__dirname, "..", "src", "data", "properties.json");
const FRESH = path.join(__dirname, "data", "properties-15.json");
const MANIFEST = path.join(__dirname, "data", "image-manifest.json");

const SUPA = "https://bhwpyermrhoprtwgybtz.supabase.co";
const BUCKET = "property-images";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE) { console.error("Set SUPABASE_SERVICE_KEY"); process.exit(1); }

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
process.on("unhandledRejection", (e) => console.error("UNHANDLED:", String(e).slice(0, 150)));

const cur = JSON.parse(fs.readFileSync(CUR, "utf8"));
const fresh = JSON.parse(fs.readFileSync(FRESH, "utf8"));
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const freshBySlug = new Map(fresh.map((p) => [p.slug, p]));

async function fetchBuf(url, opts = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(45000) });
      if (!r.ok && r.status !== 409) throw new Error("HTTP " + r.status);
      return r;
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1200 * (i + 1));
    }
  }
}

async function uploadNew(orig, key) {
  const res = await fetchBuf(orig, { headers: { "User-Agent": UA } });
  const raw = Buffer.from(await res.arrayBuffer());
  const webp = await sharp(raw).rotate().resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  await fetchBuf(`${SUPA}/storage/v1/object/${BUCKET}/${key}`, {
    method: "POST",
    headers: {
      apikey: SERVICE, Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "image/webp", "x-upsert": "true", "cache-control": "31536000",
    },
    body: webp,
  });
  return `${SUPA}/storage/v1/object/public/${BUCKET}/${key}`;
}

const limit = pLimit(10);
let uploaded = 0, reused = 0, failed = 0, done = 0;

async function main() {
  const tasks = [];
  for (const p of cur) {
    const f = freshBySlug.get(p.slug);
    if (!f || !f.images?.length) continue;
    const slots = new Array(f.images.length).fill(null);
    f.images.forEach((orig, idx) => {
      tasks.push(
        limit(async () => {
          try {
            if (manifest[orig]) {
              slots[idx] = manifest[orig] + "?v=2";
              reused++;
            } else {
              const key = `${p.slug}/n${idx}.webp`;
              const url = await uploadNew(orig, key);
              manifest[orig] = url;
              slots[idx] = url + "?v=2";
              uploaded++;
            }
          } catch {
            failed++;
          } finally {
            done++;
            if (done % 300 === 0) {
              console.log(`  ${done} (reused ${reused}, new ${uploaded}, failed ${failed})`);
              fs.writeFileSync(MANIFEST, JSON.stringify(manifest));
            }
          }
        })
      );
    });
    p._newImages = slots;
  }

  await Promise.all(tasks);
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest));

  for (const p of cur) {
    if (!p._newImages) continue;
    const imgs = p._newImages.filter(Boolean);
    if (imgs.length >= Math.min(p.images.length, 5)) p.images = imgs; // only replace if healthy
    delete p._newImages;
    if (p.cover && !p.images.includes(p.cover)) {
      // cover should still exist (same URLs); if not, fall back to first image
      p.cover = p.images[0];
    }
  }

  fs.writeFileSync(CUR, JSON.stringify(cur, null, 2));
  fs.copyFileSync(CUR, path.join(__dirname, "data", "properties.json"));
  const total = cur.reduce((s, p) => s + p.images.length, 0);
  console.log(`DONE merge: reused ${reused}, uploaded ${uploaded}, failed ${failed}. total images now ${total}`);
}
main();
