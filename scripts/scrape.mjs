// Scraper for greatbalivillas.com (WordPress + Houzez theme)
// Extracts all /property/* and /longterm/* listings -> scripts/data/properties.json
import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "data");
fs.mkdirSync(OUT, { recursive: true });

const BASE = "https://greatbalivillas.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const CONCURRENCY = 8;
const IMG_CAP = parseInt(process.env.IMG_CAP || "10", 10);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1500 * (i + 1));
    }
  }
}

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
const stripDim = (u) => (u || "").replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp|avif)$)/i, "");
const parseSitemap = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

function parseProperty(html, url, kind) {
  const $ = cheerio.load(html);
  const slug = url.replace(/\/$/, "").split("/").pop();

  let title = clean($('meta[property="og:title"]').attr("content")) || clean($("h1").first().text());
  const name = title.replace(/\s*[-|–]\s*Great Bali Villas.*$/i, "").trim() || slug;

  const priceText = clean($("li.item-price").first().text());
  const priceNum = parseInt(((priceText.match(/[\d.,]+/) || [""])[0]).replace(/[.,]/g, ""), 10) || null;
  const currency = /idr|rp/i.test(priceText) ? "IDR" : /usd|\$/.test(priceText) ? "USD" : "IDR";
  const period = /night/i.test(priceText) ? "night" : /month/i.test(priceText) ? "month" : null;

  // Overview blocks: each <ul> has a value (.property-overview-item strong) + label (.hz-meta-label)
  const overview = {};
  $(".property-overview-data > ul").each((_, ul) => {
    const val = clean($(ul).find(".property-overview-item strong").text());
    const label = clean($(ul).find(".hz-meta-label").text());
    if (label) overview[label.toLowerCase()] = val;
  });
  let type = overview["property type"] || "";
  let bedrooms = null, bathrooms = null;
  for (const [k, v] of Object.entries(overview)) {
    if (/bed/.test(k)) bedrooms = parseInt(v) || bedrooms;
    if (/bath/.test(k)) bathrooms = parseInt(v) || bathrooms;
  }

  const descEl = $("#property-description-wrap .block-content-wrap");
  const description = descEl
    .find("p")
    .map((_, p) => clean($(p).text()))
    .get()
    .filter(Boolean)
    .join("\n\n");

  const features = [
    ...new Set(
      $("#property-features-wrap .block-content-wrap li a")
        .map((_, a) => clean($(a).text()))
        .get()
        .filter(Boolean)
    ),
  ];

  const fld = (sel) => clean($(sel).find("span").text());
  const address = fld(".detail-address");
  const city = fld(".detail-city");
  const area = fld(".detail-area");
  const state = fld(".detail-state");
  const zip = fld(".detail-zip");
  const country = fld(".detail-country");

  // Gallery: full-res images inside #property-gallery-js
  let imgs = $("#property-gallery-js img")
    .map((_, img) => $(img).attr("src") || $(img).attr("data-src"))
    .get();
  const og = $('meta[property="og:image"]').attr("content");
  imgs = imgs.concat(og ? [og] : []);
  imgs = [...new Set(imgs.map(stripDim))].filter(
    (u) => u && /wp-content\/uploads/i.test(u) && !/logo|cropped|placeholder|avatar/i.test(u)
  );
  const featured = stripDim(og || imgs[0] || "");
  let gallery = featured ? [featured, ...imgs.filter((u) => u !== featured)] : imgs;
  gallery = gallery.slice(0, IMG_CAP);

  return {
    slug, kind, name, url, priceText, price: priceNum, currency, period,
    type, bedrooms, bathrooms, area, city, state, zip, country, address,
    description, features, images: gallery,
  };
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0, done = 0;
  return new Promise((resolve) => {
    const next = () => {
      if (idx >= items.length) { if (done === items.length) resolve(results); return; }
      const cur = idx++;
      fn(items[cur], cur)
        .then((r) => { results[cur] = r; })
        .catch((e) => { results[cur] = { error: String(e), item: items[cur] }; })
        .finally(() => { done++; if (done % 25 === 0) console.log(`  ...${done}/${items.length}`); next(); });
    };
    for (let i = 0; i < Math.min(limit, items.length); i++) next();
  });
}

async function main() {
  console.log("Fetching sitemaps...");
  const [propXml, longXml] = await Promise.all([
    fetchText(`${BASE}/property-sitemap.xml`),
    fetchText(`${BASE}/longterm-sitemap.xml`),
  ]);
  const propUrls = parseSitemap(propXml).filter((u) => /\/property\/[^/]+\/?$/.test(u) && !/\/property\/?$/.test(u));
  const longUrls = parseSitemap(longXml).filter((u) => /\/longterm\/[^/]+\/?$/.test(u) && !/\/longterm\/?$/.test(u));
  console.log(`Found ${propUrls.length} properties + ${longUrls.length} longterm`);

  let all = [
    ...propUrls.map((u) => ({ u, kind: "rental" })),
    ...longUrls.map((u) => ({ u, kind: "longterm" })),
  ];
  const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;
  if (Number.isFinite(LIMIT)) all = all.slice(0, LIMIT);

  console.log("Scraping property pages...");
  const data = await mapLimit(all, CONCURRENCY, async ({ u, kind }) => {
    const html = await fetchText(u);
    return parseProperty(html, u, kind);
  });

  const ok = data.filter((d) => d && !d.error);
  const errs = data.filter((d) => d && d.error);
  fs.writeFileSync(path.join(OUT, process.env.OUTFILE || "properties.json"), JSON.stringify(ok, null, 2));
  if (errs.length) fs.writeFileSync(path.join(OUT, "errors.json"), JSON.stringify(errs, null, 2));

  // Stats
  const withPrice = ok.filter((d) => d.price).length;
  const withImgs = ok.filter((d) => d.images.length).length;
  const totalImgs = ok.reduce((s, d) => s + d.images.length, 0);
  const types = {}; const areas = {};
  ok.forEach((d) => { types[d.type] = (types[d.type] || 0) + 1; areas[d.area] = (areas[d.area] || 0) + 1; });
  console.log(`\nDONE: ${ok.length} scraped, ${errs.length} errors`);
  console.log(`  with price: ${withPrice}, with images: ${withImgs}, total images: ${totalImgs}`);
  console.log(`  types:`, types);
  console.log(`  areas:`, Object.keys(areas).length, "distinct");
}

main();
