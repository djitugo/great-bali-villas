import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "data");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36";
const SUPA = "https://bhwpyermrhoprtwgybtz.supabase.co";
const BUCKET = "property-images";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;

const URLS = [
  "7-balis-secret-gems", "8-best-gyms-in-bali", "the-best-spas-in-bali", "the-best-cafes-in-bali",
  "3-places-to-get-unique-souvenir-in-bali", "5-best-beach-club-in-bali", "the-best-restaurants-in-seminyak",
  "top-5-beaches-in-bali", "5-temples-have-to-see-in-bali", "stay-in-villa", "where-to-stay-in-bali",
];

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

async function fetchText(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.text();
}

async function uploadImage(origUrl, slug) {
  if (!origUrl || !SERVICE) return origUrl;
  try {
    const r = await fetch(origUrl, { headers: { "User-Agent": UA } });
    if (!r.ok) return origUrl;
    const buf = Buffer.from(await r.arrayBuffer());
    const webp = await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const key = `blog/${slug}.webp`;
    const up = await fetch(`${SUPA}/storage/v1/object/${BUCKET}/${key}`, {
      method: "POST",
      headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "image/webp", "x-upsert": "true", "cache-control": "31536000" },
      body: webp,
    });
    if (!up.ok && up.status !== 409) return origUrl;
    return `${SUPA}/storage/v1/object/public/${BUCKET}/${key}`;
  } catch {
    return origUrl;
  }
}

async function main() {
  const posts = [];
  for (const slug of URLS) {
    try {
      const html = await fetchText(`https://greatbalivillas.com/${slug}/`);
      const $ = cheerio.load(html);
      const title = clean($('meta[property="og:title"]').attr("content")).replace(/\s*[-|–]\s*Great Bali Villas.*$/i, "") || clean($("h1").first().text());
      const excerpt = clean($('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content"));
      const date = $('meta[property="article:published_time"]').attr("content") || "2024-05-16";
      const ogImage = $('meta[property="og:image"]').attr("content");

      // content paragraphs
      let paras = $(".entry-content p, .elementor-widget-theme-post-content p, article p")
        .map((_, p) => clean($(p).text()))
        .get()
        .filter((t) => t.length > 40);
      paras = [...new Set(paras)].slice(0, 20);

      const cover = await uploadImage(ogImage, slug);
      posts.push({ slug, title, excerpt, date: date.slice(0, 10), cover, body: paras });
      console.log("ok:", slug, "-", paras.length, "paras");
    } catch (e) {
      console.log("FAIL", slug, String(e));
    }
  }
  fs.writeFileSync(path.join(OUT, "blog.json"), JSON.stringify(posts, null, 2));
  console.log("wrote", posts.length, "posts");
}
main();
