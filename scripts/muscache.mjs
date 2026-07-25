// Re-point Airbnb villa photos straight at Airbnb's own CDN (a0.muscache.com),
// so images work without any storage host of our own (Supabase bucket is over
// quota / 402). Preserves the curated photo order: the number in each existing
// Supabase URL (/airbnb/<id>/<N>.webp) is the original scrape index, so we remap
// the freshly scraped muscache list by that same index sequence.
//
// Usage: node scripts/muscache.mjs [limit]   (limit = process only first N airbnb villas, for testing)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILES = [
  path.join(__dirname, "..", "src", "data", "properties.json"),
  path.join(__dirname, "data", "properties.json"),
];
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const IMG_CAP = 15;
const LIMIT = parseInt(process.argv[2] || "0", 10);

const props = JSON.parse(fs.readFileSync(FILES[0], "utf8"));

const roomId = (u) => {
  const m = (u || "").match(/rooms\/(\d+)/);
  return m ? m[1] : null;
};
// original scrape index encoded in a Supabase image URL: .../airbnb/<id>/<N>.webp
const scrapeIndex = (u) => {
  const m = (u || "").match(/\/airbnb\/\d+\/(\d+)\.webp/);
  return m ? parseInt(m[1], 10) : null;
};

async function fetchHtml(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
        signal: AbortSignal.timeout(30000),
      });
      if (r.ok) return await r.text();
    } catch {}
    await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
  }
  return null;
}

function extractPhotos(html) {
  // Only real listing photos: /im/pictures/(hosting|miso)/Hosting-.../original/<uuid>
  const all = [...html.matchAll(/https:\/\/a0\.muscache\.com\/im\/pictures\/[^"'\\ )]+/g)].map(
    (m) => m[0].split("?")[0]
  );
  const seen = new Set();
  const out = [];
  for (const u of all) {
    if (!/\/im\/pictures\/(hosting|miso)\/Hosting-/.test(u)) continue; // skip platform assets/avatars
    const uuid = u.split("/").pop(); // dedupe hosting/ vs miso/ variants of same photo
    if (seen.has(uuid)) continue;
    seen.add(uuid);
    out.push(u);
  }
  return out;
}

const targets = props.filter((p) => roomId(p.url));
const list = LIMIT ? targets.slice(0, LIMIT) : targets;
const limit = pLimit(6);
let ok = 0,
  fail = 0,
  reordered = 0;
const failed = [];

await Promise.all(
  list.map((p) =>
    limit(async () => {
      const id = roomId(p.url);
      const order = p.images.map(scrapeIndex); // desired sequence in original indices
      const html = await fetchHtml(`https://www.airbnb.com/rooms/${id}`);
      if (!html) {
        fail++;
        failed.push(id);
        return;
      }
      const fresh = extractPhotos(html); // page order == original scrape order
      if (!fresh.length) {
        fail++;
        failed.push(id);
        return;
      }
      let imgs;
      const validOrder = order.every((n) => n != null && n < fresh.length);
      if (validOrder && order.length) {
        imgs = order.map((n) => fresh[n]);
        reordered++;
      } else {
        imgs = fresh.slice(0, IMG_CAP);
      }
      imgs = imgs.filter(Boolean).map((u) => `${u}?im_w=1920`);
      if (!imgs.length) {
        fail++;
        failed.push(id);
        return;
      }
      p.images = imgs;
      p.cover = imgs[0];
      ok++;
    })
  )
);

for (const f of FILES) {
  if (fs.existsSync(f)) fs.writeFileSync(f, JSON.stringify(props, null, 2));
}
console.log(`done: ok=${ok} (order-preserved=${reordered}) fail=${fail} of ${list.length}`);
if (failed.length) {
  fs.writeFileSync(path.join(__dirname, "data", "muscache-failed.json"), JSON.stringify(failed));
  console.log("failed ids saved:", failed.slice(0, 20));
}
