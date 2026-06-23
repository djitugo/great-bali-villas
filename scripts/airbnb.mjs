// Scrape Airbnb active listings: title, photos, beds, area -> upload to CDN -> airbnb-properties.json
// Resumable via airbnb-done.json. Photos from a0.muscache.com (listing hosting pictures).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "data");
const LIST = JSON.parse(fs.readFileSync(path.join(DATA, "airbnb-listings.json"), "utf8"));
const OUT = path.join(DATA, "airbnb-properties.json");
const DONE = path.join(DATA, "airbnb-done.json");

const SUPA = "https://bhwpyermrhoprtwgybtz.supabase.co";
const BUCKET = "property-images";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE) { console.error("Set SUPABASE_SERVICE_KEY"); process.exit(1); }

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const IMG_CAP = 15;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const AREAS = ["Nusa Dua","Tanjung Benoa","Sanur","Seminyak","Petitenget","Kerobokan","Canggu","Pererenan","Berawa","Umalas","Bumbak","Legian","Kuta","Jimbaran","Uluwatu","Ungasan","Pecatu","Balangan","Ubud","Tegallalang","Payangan","Sayan","Ketewel","Keramas","Sukawati","Gianyar","Kemenuh","Kintamani","Mengwi","Tabanan","Tibubeneng","Denpasar","Pasut","Kedungu","Tanah Lot","Nyanyi","Selukat","Saba","Pererenan","Yogya"];

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
const titleCase = (s) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));

let done = {};
if (fs.existsSync(DONE)) done = JSON.parse(fs.readFileSync(DONE, "utf8"));
let out = [];
if (fs.existsSync(OUT)) out = JSON.parse(fs.readFileSync(OUT, "utf8"));

async function fetchHtml(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9", Accept: "text/html" },
        signal: AbortSignal.timeout(30000),
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(2500 * (i + 1));
    }
  }
}

async function upload(key, buf) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${key}`, {
        method: "POST",
        headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "image/webp", "x-upsert": "true", "cache-control": "31536000" },
        body: buf,
        signal: AbortSignal.timeout(60000),
      });
      if (!r.ok && r.status !== 409) throw new Error("up " + r.status);
      return;
    } catch (e) {
      if (i === 2) throw e;
      await sleep(1500 * (i + 1));
    }
  }
}

function parseListing(html, item) {
  const og = (p) => (html.match(new RegExp(`<meta property="${p}" content="([^"]+)"`)) || [])[1] || "";
  let title = clean(og("og:title")) || item.name || item.id;
  title = title.replace(/\s*-\s*(Houses|Villas|Condos|Places|Guesthouses|Serviced apartments|Bungalows|Apartments|Cottages|Cabins|Entire)\b.*$/i, "")
               .replace(/\s*\|\s*Airbnb.*$/i, "").trim();
  const desc = clean(og("og:description"));

  // listing photos
  let imgs = [...new Set([...html.matchAll(/https:\/\/a0\.muscache\.com\/im\/pictures\/[^"'\\ )]+/g)].map((m) => m[0]))]
    .filter((u) => !/airbnb-platform-assets|\/user\/|profile_pic|favicon/i.test(u))
    .filter((u) => /\/(hosting|miso|prohost-api|monicon)\//i.test(u) || /hosting/i.test(u));
  imgs = [...new Set(imgs.map((u) => u.split("?")[0]))].map((u) => `${u}?im_w=1920`).slice(0, IMG_CAP);

  const bedMatch = title.match(/(\d+)\s*(?:-?\s*)(?:br|bdr|bedroom|bed|bd)\b/i) || desc.match(/(\d+)\s*bedroom/i);
  const bedrooms = bedMatch ? parseInt(bedMatch[1]) : null;
  const t = title.toLowerCase();
  let type = "Private Villa";
  if (/\bvilla\b/.test(t)) type = "Private Villa";
  else if (/cottage/.test(t)) type = "Cottage";
  else if (/bungalow/.test(t)) type = "Bungalow";
  else if (/room|suite|loft|studio|inn|mezzanine/.test(t)) type = "Room";
  const area = AREAS.find((a) => new RegExp(`\\b${a}\\b`, "i").test(title)) || AREAS.find((a) => new RegExp(`\\b${a}\\b`, "i").test(desc)) || "Bali";

  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  const slug = `${baseSlug || "villa"}-${item.id.slice(-6)}`;

  return { slug, kind: "rental", source: "airbnb", airbnbId: item.id, url: item.url,
    name: titleCase(title), type, bedrooms, bathrooms: bedrooms, area, areaRaw: area,
    city: "", state: "Bali", zip: "", country: "Indonesia", address: `${area}, Bali`,
    priceText: "", price: null, currency: "IDR", period: "night",
    description: desc, features: [], rawImgs: imgs };
}

const limit = pLimit(4);
const imgLimit = pLimit(8);
let processed = 0, failed = 0, noimg = 0;

async function handle(item) {
  if (done[item.id]) return;
  try {
    const html = await fetchHtml(item.url);
    const p = parseListing(html, item);
    if (!p.rawImgs.length) { noimg++; done[item.id] = "noimg"; return; }
    const urls = new Array(p.rawImgs.length).fill(null);
    await Promise.all(p.rawImgs.map((src, idx) => imgLimit(async () => {
      try {
        const r = await fetch(src, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(30000) });
        if (!r.ok) return;
        const raw = Buffer.from(await r.arrayBuffer());
        const webp = await sharp(raw).rotate().resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
        const key = `airbnb/${item.id}/${idx}.webp`;
        await upload(key, webp);
        urls[idx] = `${SUPA}/storage/v1/object/public/${BUCKET}/${key}`;
      } catch {}
    })));
    p.images = urls.filter(Boolean);
    p.cover = p.images[0] || null;
    delete p.rawImgs;
    if (!p.images.length) { noimg++; done[item.id] = "noimg"; return; }
    out.push(p);
    done[item.id] = "ok";
  } catch (e) {
    failed++;
    if (failed <= 8) console.error("fail", item.id, String(e).slice(0, 60));
  } finally {
    processed++;
    if (processed % 10 === 0) {
      fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
      fs.writeFileSync(DONE, JSON.stringify(done));
      console.log(`  ${processed}/${LIST.length} | ok ${out.length} | noimg ${noimg} | failed ${failed}`);
    }
    await sleep(400);
  }
}

async function main() {
  console.log("Scraping", LIST.length, "Airbnb listings...");
  await Promise.all(LIST.map((it) => limit(() => handle(it))));
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  fs.writeFileSync(DONE, JSON.stringify(done));
  console.log(`DONE: ${out.length} listings with photos, ${noimg} no-img, ${failed} failed`);
}
main();
