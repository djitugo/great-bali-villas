// New catalogue = long-term villas (kept) + Airbnb active listings.
// Replaces src/data/properties.json. Run AFTER airbnb.mjs finishes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fixName } from "./fix-names.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "src", "data", "properties.json");
const SCRIPTS = path.join(__dirname, "data", "properties.json");
const AIRBNB = path.join(__dirname, "data", "airbnb-properties.json");

const current = JSON.parse(fs.readFileSync(SRC, "utf8"));
const longterm = current.filter((p) => p.kind === "longterm");
const airbnb = JSON.parse(fs.readFileSync(AIRBNB, "utf8"))
  .filter((p) => p.images && p.images.length)
  .map((p) => ({
    ...p,
    name: fixName(p.name),
    areaRaw: p.area,
    features: p.features || [],
    bathrooms: p.bathrooms ?? p.bedrooms ?? null,
  }));

// merge, dedupe by slug (longterm wins)
const bySlug = new Map();
for (const p of [...longterm, ...airbnb]) {
  if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
}
const merged = [...bySlug.values()];

fs.writeFileSync(SRC, JSON.stringify(merged, null, 2));
fs.writeFileSync(SCRIPTS, JSON.stringify(merged, null, 2));

const types = {}, areas = {};
merged.forEach((p) => { types[p.type] = (types[p.type] || 0) + 1; areas[p.area] = (areas[p.area] || 0) + 1; });
console.log(`New catalogue: ${merged.length} (longterm ${longterm.length} + airbnb ${airbnb.length})`);
console.log("types:", types);
console.log("areas:", Object.entries(areas).sort((a, b) => b[1] - a[1]).slice(0, 12));
