// Apply vision-agent photo ordering. covers/batch-*.json maps slug -> ordered
// array of 1-based thumbnail indices (category priority). Reorders p.images,
// appends any unlisted images at the end, sets cover = images[0].
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COVERS = path.join(__dirname, "data", "covers");
const TARGETS = [
  path.join(__dirname, "..", "src", "data", "properties.json"),
  path.join(__dirname, "data", "properties.json"),
];

const order = {};
for (const f of fs.readdirSync(COVERS).filter((f) => f.endsWith(".json"))) {
  Object.assign(order, JSON.parse(fs.readFileSync(path.join(COVERS, f), "utf8")));
}
console.log("orderings:", Object.keys(order).length);

for (const target of TARGETS) {
  if (!fs.existsSync(target)) continue;
  const props = JSON.parse(fs.readFileSync(target, "utf8"));
  let reordered = 0;
  for (const p of props) {
    const ord = order[p.slug];
    if (!Array.isArray(ord) || !p.images || p.images.length < 2) continue;
    const n = p.images.length;
    const seen = new Set();
    const next = [];
    for (const oneBased of ord) {
      const i = oneBased - 1;
      if (Number.isInteger(i) && i >= 0 && i < n && !seen.has(i)) {
        seen.add(i);
        next.push(p.images[i]);
      }
    }
    // append any images not referenced, preserving original order
    for (let i = 0; i < n; i++) if (!seen.has(i)) next.push(p.images[i]);
    if (next.length === n) {
      p.images = next;
      p.cover = next[0];
      reordered++;
    }
  }
  fs.writeFileSync(target, JSON.stringify(props, null, 2));
  console.log(`${target.split(/[\\/]/).slice(-2).join("/")}: reordered ${reordered}`);
}
