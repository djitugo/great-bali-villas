// Process new listings: read downloaded Drive images per slug, compress to webp,
// upload to Supabase Storage, then merge into properties.json (update or insert).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEW = path.join(__dirname, "data", "new-listings.json");
const DRIVE = path.join(__dirname, "data", "drive");
const TARGETS = [
  path.join(__dirname, "..", "src", "data", "properties.json"),
  path.join(__dirname, "data", "properties.json"),
];

const SUPA = "https://bhwpyermrhoprtwgybtz.supabase.co";
const BUCKET = "property-images";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE) { console.error("Set SUPABASE_SERVICE_KEY"); process.exit(1); }

const IMG_CAP = 15;
const PLACEHOLDER = "/placeholder-villa.webp";
const publicUrl = (key) => `${SUPA}/storage/v1/object/public/${BUCKET}/${key}?v=2`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const IMG_RE = /\.(jpe?g|png|webp|heic|avif)$/i;

async function upload(key, buf, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${key}`, {
        method: "POST",
        headers: {
          apikey: SERVICE, Authorization: `Bearer ${SERVICE}`,
          "Content-Type": "image/webp", "x-upsert": "true", "cache-control": "31536000",
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

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

const limit = pLimit(8);

async function processListing(l) {
  const dir = path.join(DRIVE, l.slug);
  if (!fs.existsSync(dir)) { console.log("  NO DIR for", l.slug); return []; }
  const files = fs.readdirSync(dir).filter((f) => IMG_RE.test(f)).sort(naturalSort).slice(0, IMG_CAP);
  const urls = new Array(files.length).fill(null);
  await Promise.all(files.map((f, idx) => limit(async () => {
    try {
      const raw = fs.readFileSync(path.join(dir, f));
      const webp = await sharp(raw).rotate().resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
      const key = `${l.slug}/d${idx}.webp`;
      await upload(key, webp);
      urls[idx] = publicUrl(key);
    } catch (e) {
      console.log("    img fail", l.slug, f, String(e).slice(0, 60));
    }
  })));
  return urls.filter(Boolean);
}

function toEntry(l, images) {
  return {
    slug: l.slug,
    kind: l.kind || "longterm",
    name: l.name,
    url: l.mapsUrl || "",
    priceText: `IDR ${Number(l.price).toLocaleString("en-US")}`,
    price: l.price,
    currency: l.currency || "IDR",
    period: l.period || "month",
    type: l.type,
    bedrooms: l.bedrooms ?? null,
    bathrooms: l.bathrooms ?? null,
    area: l.area,
    areaRaw: l.area,
    city: l.city || "",
    state: l.state || "Bali",
    zip: l.zip || "",
    country: l.country || "Indonesia",
    address: l.address || "",
    description: l.description || "",
    features: l.features || [],
    images: images.length ? images : [PLACEHOLDER],
    cover: images[0] || PLACEHOLDER,
    needsPhotos: images.length === 0,
  };
}

async function main() {
  const listings = JSON.parse(fs.readFileSync(NEW, "utf8"));
  const processed = [];
  for (const l of listings) {
    const images = await processListing(l);
    console.log(`  ${l.slug}: ${images.length} images`);
    processed.push({ l, images });
  }

  for (const target of TARGETS) {
    if (!fs.existsSync(target)) continue;
    const props = JSON.parse(fs.readFileSync(target, "utf8"));
    const bySlug = new Map(props.map((p, i) => [p.slug, i]));
    let updated = 0, added = 0;
    for (const { l, images } of processed) {
      const entry = toEntry(l, images);
      if (bySlug.has(l.slug)) {
        const existing = props[bySlug.get(l.slug)];
        const merged = { ...existing, ...entry };
        // Don't overwrite real existing photos with a placeholder
        const existingHasReal = existing.images?.length && !existing.images[0].includes("placeholder-villa");
        if (entry.needsPhotos && existingHasReal) {
          merged.images = existing.images;
          merged.cover = existing.cover || existing.images[0];
          merged.needsPhotos = false;
        }
        props[bySlug.get(l.slug)] = merged;
        updated++;
      } else {
        props.push(entry);
        added++;
      }
    }
    fs.writeFileSync(target, JSON.stringify(props, null, 2));
    console.log(`${target.split(/[\\/]/).slice(-2).join("/")}: +${added} new, ${updated} updated, total ${props.length}`);
  }
}
main();
