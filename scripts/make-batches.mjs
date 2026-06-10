import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "sheets-map.json"), "utf8"));
const dir = path.join(__dirname, "data", "agent-batches");
fs.mkdirSync(dir, { recursive: true });
fs.mkdirSync(path.join(__dirname, "data", "covers"), { recursive: true });

const N = 7;
const per = Math.ceil(map.length / N);
for (let i = 0; i < N; i++) {
  const chunk = map.slice(i * per, (i + 1) * per).map((s) => ({
    sheet: path.resolve(__dirname, "data", "sheets", s.file).split(path.sep).join("/"),
    villas: s.villas.map((v) => v.slug),
  }));
  fs.writeFileSync(path.join(dir, `batch-${i + 1}.json`), JSON.stringify(chunk, null, 1));
}
console.log("wrote", N, "batches,", per, "sheets each");
