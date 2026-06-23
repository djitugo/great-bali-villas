import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const F = path.join(__dirname, "data", "airbnb-properties.json");
const a = JSON.parse(fs.readFileSync(F, "utf8"));

// order: more specific / sub-areas first
const AREAS = [
  "Nusa Dua", "Tanjung Benoa", "Benoa Bay", "Sanur", "Petitenget", "Seminyak", "Kerobokan",
  "Berawa", "Pererenan", "Umalas", "Bumbak", "Tibubeneng", "Echo Beach", "Batu Bolong", "Nelayan", "Canggu",
  "Legian", "Kuta", "Jimbaran", "Balangan", "Bingin", "Dreamland", "Pecatu", "Ungasan", "Pandawa", "Melasti", "Uluwatu",
  "Tegallalang", "Payangan", "Sayan", "Ubud", "Ketewel", "Keramas", "Saba", "Selukat", "Sukawati", "Kemenuh", "Gianyar",
  "Kintamani", "Mengwi", "Nyanyi", "Kedungu", "Pasut", "Tanah Lot", "Tabanan", "Pererenan",
  "Prambanan", "Yogya",
];
const CANON = {
  "Benoa Bay": "Nusa Dua", Petitenget: "Seminyak", Berawa: "Canggu", Pererenan: "Canggu",
  "Echo Beach": "Canggu", "Batu Bolong": "Canggu", Nelayan: "Canggu", Tibubeneng: "Canggu",
  Umalas: "Kerobokan", Bumbak: "Kerobokan", Balangan: "Uluwatu", Bingin: "Uluwatu",
  Dreamland: "Uluwatu", Pandawa: "Ungasan", Melasti: "Ungasan", Sayan: "Ubud",
  Saba: "Gianyar", Selukat: "Gianyar", Keramas: "Gianyar", Kemenuh: "Gianyar",
  Nyanyi: "Tabanan", Kedungu: "Tabanan", Pasut: "Tabanan", Prambanan: "Yogyakarta", Yogya: "Yogyakarta",
};

const areas = {};
for (const p of a) {
  const name = p.name || "";
  let found = "";
  for (const ar of AREAS) {
    const re = new RegExp(`\\b${ar.replace(/ /g, "\\s")}\\b`, "i");
    if (re.test(name)) { found = ar; break; }
  }
  const area = found ? CANON[found] || found : "Bali";
  p.area = area;
  p.areaRaw = area;
  p.address = `${area}, Bali`;
  areas[area] = (areas[area] || 0) + 1;
}
fs.writeFileSync(F, JSON.stringify(a, null, 2));
console.log("areas:", Object.entries(areas).sort((x, y) => y[1] - x[1]));
