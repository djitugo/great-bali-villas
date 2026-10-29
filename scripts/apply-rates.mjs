// Apply "start from" rates from the internal rate sheet
// (Internal Rate Detail - update.xlsx -> scripts/data/rates-sheet.json).
// Each website listing maps to a villa in the sheet; `room` narrows to the
// matching room-type rows when a listing is one specific unit. Every rate is the
// LOWEST value found (daily = min of low / high / peak season).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEET = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "rates-sheet.json"), "utf8"));
const TARGETS = [
  path.join(__dirname, "..", "src", "data", "properties.json"),
  path.join(__dirname, "data", "properties.json"),
];

// slug -> { d: daily sheet name, l: long-term sheet name, room: RegExp on room type }
const MAP = {
  // long-term / direct listings
  "vienna-villas-prime-location-between-seminyak-canggu": { d: "Vienna Villas", l: "Vienna Villas" },
  "villa-putih-susu-3-br-relaxing-family-getaway-ungasan": { d: "Putih Susu Villa", l: "Putih Susu Villa" },
  "villa-eysteinn-your-exquisite-bali-haven-in-canggu": { d: "Villa Eysteinn", l: "Villa Eysteinn" },
  "where-productivity-meets-island-relaxation": { d: "Olivia Suite Workstay", l: "Olivia Suite Workstay" },
  "baile-bali-villa-your-minimalist-home-in-jimbaran": { d: "Baile Bali Villa", l: "Baile Bali Villa" },
  "villa-rumma-lanna": { d: "Rumma Lanna", l: "Rumma Lanna" },
  "secluded-jungle-sanctuary-ubud": { d: "Sebatu Cottage", l: "Sebatu Hill Cottage" },
  "askana-suites-payangan": { d: "Askana Suite", l: "Askana Suite" },
  "the-twenty-eight-ungasan": { d: "The Twenty Eight", l: "The Twenty Eight" },
  "sakha-sari-villa": { d: "Sakha Sari Villa", l: "Sakha Sari Villa" },
  "puri-bagus-legian": { d: "Puri Bagus Villa", l: "Villa Puri Bagus" },
  "amalfi-dream-villa": { d: "Amalfi Dream Villa" },

  // Airbnb listings identified by the villa name in their own description / title
  "villa-in-kuta-2-bedrooms-2-beds-2-private-baths-086078": { d: "Kuta Beach Villas", room: /Mediterranean/i },
  "villa-in-kuta-2-bedrooms-2-beds-2-private-baths-928499": { d: "Kuta Beach Villas", room: /2 Bedrooms – V1/i },
  "home-in-kuta-new-3-bedrooms-3-beds-3-private-baths-355223": { d: "Anchor Villa" },
  "guesthouse-in-kuta-new-1-bedroom-1-bed-1-private-bath-957940": { d: "Dukuh Segara" },
  "home-in-kuta-3-bedrooms-3-beds-3-private-baths-096912": { d: "Puri Bagus Villa", l: "Villa Puri Bagus" },
  "villa-in-kecamatan-kuta-utara-2-bedrooms-2-beds-2-private-ba-982022": { d: "Vienna Villas", l: "Vienna Villas", room: /2 Bedrooms/i },
  "rental-unit-in-denpasar-selatan-1-bedroom-1-bed-1-private-ba-119847": { d: "Olivia Suite Workstay", l: "Olivia Suite Workstay", room: /Deluxe/i },
  "rental-unit-in-denpasar-selatan-1-bedroom-1-bed-1-private-ba-029767": { d: "Olivia Suite Workstay", l: "Olivia Suite Workstay", room: /Deluxe/i },
  "rental-unit-in-denpasar-selatan-2-bedrooms-2-beds-1-private--312151": { d: "Olivia Suite Workstay", l: "Olivia Suite Workstay" },
  "home-in-kalasan-3-bedrooms-3-beds-2-private-baths-528233": { d: "Casa Amarilla" },
  "home-in-kalasan-5-0-3-bedrooms-3-beds-2-private-baths-999417": { d: "Casa Amarilla" },
};

const min = (xs) => {
  const v = xs.filter((x) => Number.isFinite(x) && x > 0);
  return v.length ? Math.min(...v) : undefined;
};

function ratesFor(m) {
  const pick = (entry) => {
    if (!entry) return [];
    const rows = entry.rows;
    const narrowed = m.room ? rows.filter((r) => m.room.test(r.room)) : rows;
    return narrowed.length ? narrowed : rows;
  };
  if (m.d && !SHEET.daily[m.d]) throw new Error(`daily sheet has no "${m.d}"`);
  if (m.l && !SHEET.longterm[m.l]) throw new Error(`long-term sheet has no "${m.l}"`);
  const d = pick(SHEET.daily[m.d]);
  const l = pick(SHEET.longterm[m.l]);
  const r = {
    daily: min(d.flatMap((x) => [x.low, x.high, x.peak])),
    monthly: min(l.map((x) => x.monthly)),
    yearly: min(l.map((x) => x.yearly)),
  };
  for (const k of Object.keys(r)) if (r[k] === undefined) delete r[k];
  return r;
}

let summary;
for (const target of TARGETS) {
  if (!fs.existsSync(target)) continue;
  const props = JSON.parse(fs.readFileSync(target, "utf8"));
  const bySlug = new Map(props.map((p) => [p.slug, p]));
  for (const slug of Object.keys(MAP)) if (!bySlug.has(slug)) throw new Error(`no listing ${slug}`);

  summary = [];
  for (const p of props) {
    // the old single price/period (scraped from the previous site) is replaced by sheet rates
    delete p.rates;
    p.price = null;
    p.period = null;
    p.priceText = "";
    const m = MAP[p.slug];
    if (!m) continue;
    const r = ratesFor(m);
    if (Object.keys(r).length) {
      p.rates = r;
      summary.push([p.slug, r]);
    }
  }
  fs.writeFileSync(target, JSON.stringify(props, null, 2));
}
console.log(`rated ${summary.length} listings`);
for (const [slug, r] of summary) {
  console.log(
    slug.slice(0, 52).padEnd(53),
    ["daily", "monthly", "yearly"].map((k) => (r[k] ? `${k[0]}:${(r[k] / 1e6).toFixed(2)}M` : "")).filter(Boolean).join("  ")
  );
}
