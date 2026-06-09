// Seed Supabase from scraped JSON. Requires SUPABASE_SERVICE_KEY and that
// the schema (0001_init.sql) has already been applied.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "src", "data");

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bhwpyermrhoprtwgybtz.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) { console.error("Set SUPABASE_SERVICE_KEY"); process.exit(1); }

const sb = createClient(URL, KEY, { auth: { persistSession: false } });

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function seedProperties() {
  const props = JSON.parse(fs.readFileSync(path.join(DATA, "properties.json"), "utf8"));
  const featuredSlugs = new Set(
    [...props].sort((a, b) => b.images.length - a.images.length).slice(0, 24).map((p) => p.slug)
  );
  const rows = props.map((p) => ({
    slug: p.slug,
    kind: p.kind,
    name: p.name,
    source_url: p.url,
    price_text: p.priceText,
    price: p.price,
    currency: p.currency,
    period: p.period,
    type: p.type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    area_raw: p.areaRaw,
    city: p.city,
    state: p.state,
    zip: p.zip,
    country: p.country,
    address: p.address,
    description: p.description,
    features: p.features,
    images: p.images,
    featured: featuredSlugs.has(p.slug),
  }));
  let done = 0;
  for (const batch of chunk(rows, 200)) {
    const { error } = await sb.from("gbv_properties").upsert(batch, { onConflict: "slug" });
    if (error) throw error;
    done += batch.length;
    console.log(`  properties ${done}/${rows.length}`);
  }
}

async function seedBlog() {
  const posts = JSON.parse(fs.readFileSync(path.join(DATA, "blog.json"), "utf8"));
  const rows = posts.map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, date: p.date, cover: p.cover, body: p.body,
  }));
  const { error } = await sb.from("gbv_blog_posts").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`  blog ${rows.length}`);
}

async function main() {
  console.log("Seeding properties...");
  await seedProperties();
  console.log("Seeding blog...");
  await seedBlog();
  console.log("Done.");
}
main().catch((e) => { console.error(e); process.exit(1); });
