// Normalize villa names: "1 BR/1-BR/1BDR/2 Bdr" -> "1 Bedroom", fix typos,
// and apply Title Case with lowercase minor words.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILES = [
  path.join(__dirname, "..", "src", "data", "properties.json"),
  path.join(__dirname, "data", "properties.json"),
];

const MINOR = new Set(["with", "in", "at", "the", "for", "and", "by", "near", "to", "on", "of", "a", "an", "from"]);
const TYPOS = {
  invinity: "infinity",
  beahfront: "beachfront",
  spacoius: "spacious",
  midle: "middle",
  poola: "pool",
  withprivate: "with private",
  closeby: "close by",
  "twobedroom": "two bedroom",
};

export function fixName(raw) {
  let s = (raw || "").replace(/\s+/g, " ").trim();
  // w/ -> with
  s = s.replace(/\bw\/\s*/gi, "with ");
  s = s.replace(/\bw\b(?=\s+(private|pool|garden|sea|ocean|jacuzzi|bathtub))/gi, "with");
  // digit + BR/BDR/BD/Bedroom(s) variants -> "N Bedroom"
  s = s.replace(/(\d+)\s*-?\s*(?:brv)\b/gi, "$1 Bedroom Villa");
  s = s.replace(/(\d+)\s*-?\s*(?:bedrooms?|bdrs?|brs?|bds?)\b/gi, "$1 Bedroom");
  // word-number + variants -> "Word Bedroom"
  s = s.replace(/\b(one|two|three|four|five|six|seven|eight)\s*-?\s*(?:bedrooms?|bdrs?|brs?|bds?)\b/gi, "$1 Bedroom");
  // typos
  for (const [bad, good] of Object.entries(TYPOS)) {
    s = s.replace(new RegExp(`\\b${bad}\\b`, "gi"), good);
  }
  // trailing "Private Poo" -> Pool
  s = s.replace(/\bpoo\b/gi, "pool");
  // collapse again
  s = s.replace(/\s+/g, " ").trim();
  // Title Case
  const words = s.toLowerCase().split(" ");
  const out = words.map((w, i) => {
    if (i !== 0 && i !== words.length - 1 && MINOR.has(w)) return w;
    if (/^\d/.test(w)) return w;
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
  return out.join(" ");
}

const isMain = process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]));
if (isMain) {
  for (const f of FILES) {
    if (!fs.existsSync(f)) continue;
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let changed = 0;
    const samples = [];
    for (const p of d) {
      const fixed = fixName(p.name);
      if (fixed !== p.name) {
        if (samples.length < 8) samples.push(`${p.name}  ->  ${fixed}`);
        p.name = fixed;
        changed++;
      }
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2));
    console.log(f.split(/[\\/]/).slice(-3).join("/"), "changed:", changed);
    samples.forEach((s) => console.log("  ", s));
  }
}
