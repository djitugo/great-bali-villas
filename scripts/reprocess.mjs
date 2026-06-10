// Re-process all property images at higher quality (2000px, q85) from the
// ORIGINAL site URLs (via image-manifest.json) and upsert over the same
// Supabase Storage keys, so all CDN URLs stay unchanged.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(__dirname, "data", "image-manifest.json");

const SUPA = "https://bhwpyermrhoprtwgybtz.supabase.co";
const BUCKET = "property-images";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE) { console.error("Set SUPABASE_SERVICE_KEY"); process.exit(1); }

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36";
const MAX_W = 2000;
const QUALITY = 85;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

process.on("unhandledRejection", (e) => console.error("UNHANDLED:", String(e).slice(0, 200)));
process.on("uncaughtException", (e) => console.error("UNCAUGHT:", String(e).slice(0, 200)));

const DONE_FILE = path.join(__dirname, "data", "reprocess-done.json");
let doneSet = new Set();
if (fs.existsSync(DONE_FILE)) doneSet = new Set(JSON.parse(fs.readFileSync(DONE_FILE, "utf8")));

async function download(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(30000) });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1200 * (i + 1));
    }
  }
}

async function upload(key, buf, tries = 3) {
  for (let i = 0; i < tries; i++) {
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
        signal: AbortSignal.timeout(60000),
      });
      if (!r.ok && r.status !== 409) throw new Error("upload HTTP " + r.status);
      return;
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1200 * (i + 1));
    }
  }
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const entries = Object.entries(manifest)
    .filter(([, cdn]) => cdn.includes("/property-images/"))
    .filter(([orig]) => !doneSet.has(orig));
  console.log("Reprocessing", entries.length, "images at", MAX_W + "px q" + QUALITY, `(${doneSet.size} already done)`);

  const limit = pLimit(8);
  let done = 0, failed = 0;
  await Promise.all(
    entries.map(([orig, cdn]) =>
      limit(async () => {
        try {
          const key = decodeURIComponent(cdn.split(`/property-images/`)[1]);
          const raw = await download(orig);
          const webp = await sharp(raw)
            .rotate()
            .resize({ width: MAX_W, withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toBuffer();
          await upload(key, webp);
          doneSet.add(orig);
        } catch (e) {
          failed++;
          if (failed <= 5) console.error("fail:", String(e).slice(0, 120));
        } finally {
          done++;
          if (done % 200 === 0) {
            console.log(`  ${done}/${entries.length} (failed ${failed})`);
            fs.writeFileSync(DONE_FILE, JSON.stringify([...doneSet]));
          }
        }
      })
    )
  );
  fs.writeFileSync(DONE_FILE, JSON.stringify([...doneSet]));
  console.log(`DONE: ${done} processed, ${failed} failed (kept previous version)`);
}
main();
