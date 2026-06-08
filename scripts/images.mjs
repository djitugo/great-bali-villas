// Download property images -> compress to webp -> upload to Supabase Storage.
// Resumable via manifest. Rewrites properties.json image URLs to CDN URLs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "data");
const PROPS = path.join(DATA, "properties.json");
const MANIFEST = path.join(DATA, "image-manifest.json");

const SUPA = "https://bhwpyermrhoprtwgybtz.supabase.co";
const BUCKET = "property-images";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE) { console.error("Set SUPABASE_SERVICE_KEY env"); process.exit(1); }

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36";
const MAX_W = 1600;
const QUALITY = 78;
const CONCURRENCY = 10;

const publicUrl = (key) => `${SUPA}/storage/v1/object/public/${BUCKET}/${key}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let manifest = {};
if (fs.existsSync(MANIFEST)) manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

async function download(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1000 * (i + 1));
    }
  }
}

async function upload(key, buf) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${key}`, {
        method: "POST",
        headers: {
          apikey: SERVICE,
          Authorization: `Bearer ${SERVICE}`,
          "Content-Type": "image/webp",
          "x-upsert": "true",
          "cache-control": "31536000",
        },
        body: buf,
      });
      if (!r.ok && r.status !== 409) throw new Error("upload HTTP " + r.status + " " + (await r.text()).slice(0, 120));
      return;
    } catch (e) {
      if (i === 2) throw e;
      await sleep(1000 * (i + 1));
    }
  }
}

async function processImage(origUrl, key) {
  if (manifest[origUrl]) return manifest[origUrl];
  const raw = await download(origUrl);
  const webp = await sharp(raw).rotate().resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer();
  await upload(key, webp);
  const url = publicUrl(key);
  manifest[origUrl] = url;
  return url;
}

async function main() {
  const props = JSON.parse(fs.readFileSync(PROPS, "utf8"));
  const limit = pLimit(CONCURRENCY);
  let done = 0, failed = 0, totalImgs = 0;
  const tasks = [];

  for (const p of props) {
    const newImgs = [];
    p.images.forEach((origUrl, idx) => {
      totalImgs++;
      const ext = "webp";
      const key = `${p.slug}/${idx}.${ext}`;
      tasks.push(
        limit(async () => {
          try {
            const url = await processImage(origUrl, key);
            newImgs[idx] = url;
          } catch (e) {
            failed++;
            newImgs[idx] = origUrl; // fallback to original if upload fails
          } finally {
            done++;
            if (done % 100 === 0) {
              console.log(`  ${done}/${totalImgs} (failed ${failed})`);
              fs.writeFileSync(MANIFEST, JSON.stringify(manifest));
            }
          }
        })
      );
    });
    p._newImages = newImgs;
  }

  await Promise.all(tasks);
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest));

  // Rewrite image arrays to CDN urls
  for (const p of props) {
    p.images = p._newImages.filter(Boolean);
    delete p._newImages;
  }
  fs.writeFileSync(PROPS, JSON.stringify(props, null, 2));
  console.log(`\nDONE images: ${done} processed, ${failed} failed (fell back to original URL)`);
}

main();
