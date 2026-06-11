// Build contact sheets (4 villas x up to 15 thumbs in 2 rows of 8) so vision
// agents can pick the bedroom-interior cover image per villa.
// Output: scripts/data/sheets/sheet-XXX.jpg + scripts/data/sheets-map.json
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROPS = path.join(__dirname, "..", "src", "data", "properties.json");
const OUTDIR = path.join(__dirname, "data", "sheets");
fs.rmSync(OUTDIR, { recursive: true, force: true });
fs.mkdirSync(OUTDIR, { recursive: true });

const THUMB_W = 180, THUMB_H = 135, LABEL_H = 24, GAP = 6, MARGIN = 10;
const PER_ROW = 8, MAX_IMG = 15, PER_SHEET = 4;

const limit = pLimit(16);
async function thumb(url) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    return await sharp(buf).resize(THUMB_W, THUMB_H, { fit: "cover" }).jpeg({ quality: 70 }).toBuffer();
  } catch {
    return await sharp({ create: { width: THUMB_W, height: THUMB_H, channels: 3, background: "#cccccc" } })
      .jpeg().toBuffer();
  }
}

function labelSvg(text, width, height, size = 13) {
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return Buffer.from(
    `<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#ffffff"/><text x="4" y="${height - 7}" font-family="Arial" font-size="${size}" font-weight="bold" fill="#000">${esc}</text></svg>`
  );
}

async function main() {
  const props = JSON.parse(fs.readFileSync(PROPS, "utf8"));
  const sheets = [];
  const sheetW = MARGIN * 2 + PER_ROW * THUMB_W + (PER_ROW - 1) * GAP;
  const villaBlockH = LABEL_H + 2 * (THUMB_H + GAP);

  for (let s = 0; s * PER_SHEET < props.length; s++) {
    const batch = props.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    const sheetH = MARGIN * 2 + batch.length * villaBlockH;
    const composites = [];

    const thumbBufs = await Promise.all(
      batch.map((p) => Promise.all(p.images.slice(0, MAX_IMG).map((u) => limit(() => thumb(u)))))
    );

    batch.forEach((p, vi) => {
      const y0 = MARGIN + vi * villaBlockH;
      composites.push({ input: labelSvg(`V${vi + 1}: ${p.slug}`.slice(0, 95), sheetW - 20, LABEL_H), left: MARGIN, top: y0 });
      thumbBufs[vi].forEach((buf, ii) => {
        const row = Math.floor(ii / PER_ROW);
        const col = ii % PER_ROW;
        const x = MARGIN + col * (THUMB_W + GAP);
        const y = y0 + LABEL_H + row * (THUMB_H + GAP);
        composites.push({ input: buf, left: x, top: y });
        composites.push({ input: labelSvg(String(ii + 1), 26, 18, 14), left: x + 2, top: y + 2 });
      });
    });

    const file = `sheet-${String(s + 1).padStart(3, "0")}.jpg`;
    await sharp({ create: { width: sheetW, height: sheetH, channels: 3, background: "#ffffff" } })
      .composite(composites)
      .jpeg({ quality: 80 })
      .toFile(path.join(OUTDIR, file));

    sheets.push({ file, villas: batch.map((p) => ({ slug: p.slug, count: Math.min(p.images.length, MAX_IMG) })) });
    if ((s + 1) % 25 === 0) console.log(`  sheet ${s + 1}`);
  }

  fs.writeFileSync(path.join(__dirname, "data", "sheets-map.json"), JSON.stringify(sheets, null, 2));
  console.log("DONE:", sheets.length, "sheets");
}
main();
