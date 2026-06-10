// Merge agent cover picks (scripts/data/covers/batch-*.json) into properties.json:
// sets p.cover to the chosen bedroom-interior image URL. images order unchanged.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COVERS = path.join(__dirname, "data", "covers");
const TARGETS = [
  path.join(__dirname, "..", "src", "data", "properties.json"),
  path.join(__dirname, "data", "properties.json"),
];

const picks = {};
for (const f of fs.readdirSync(COVERS).filter((f) => f.endsWith(".json"))) {
  Object.assign(picks, JSON.parse(fs.readFileSync(path.join(COVERS, f), "utf8")));
}
console.log("picks:", Object.keys(picks).length);

for (const target of TARGETS) {
  if (!fs.existsSync(target)) continue;
  const props = JSON.parse(fs.readFileSync(target, "utf8"));
  let set = 0, fallback = 0, dist = {};
  for (const p of props) {
    const n = picks[p.slug];
    if (n && n >= 1 && n <= p.images.length) {
      p.cover = p.images[n - 1];
      set++;
      dist[n] = (dist[n] || 0) + 1;
    } else {
      p.cover = p.images[0];
      fallback++;
    }
  }
  fs.writeFileSync(target, JSON.stringify(props, null, 2));
  console.log(path.basename(path.dirname(target)) + "/properties.json:", set, "covers set,", fallback, "fallback. pick distribution:", dist);
}
