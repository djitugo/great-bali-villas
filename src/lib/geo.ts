import type { Property } from "./types";

// Accurate centroids for every area present in the catalogue.
export const AREA_COORDS: Record<string, [number, number]> = {
  Seminyak: [-8.6906, 115.1686],
  Ubud: [-8.5069, 115.2625],
  Canggu: [-8.6478, 115.1385],
  Berawa: [-8.665, 115.138],
  Kuta: [-8.718, 115.1686],
  Legian: [-8.705, 115.17],
  Jimbaran: [-8.7908, 115.159],
  "Nusa Dua": [-8.8008, 115.2317],
  "Tanjung Benoa": [-8.756, 115.23],
  Kerobokan: [-8.67, 115.155],
  Sanur: [-8.688, 115.262],
  Ketewel: [-8.615, 115.287],
  Keramas: [-8.587, 115.338],
  Uluwatu: [-8.8294, 115.0849],
  Ungasan: [-8.82, 115.148],
  Pecatu: [-8.815, 115.105],
  Gianyar: [-8.543, 115.326],
  "Tanah Lot": [-8.6212, 115.0868],
  Tabanan: [-8.538, 115.123],
  "Nusa Penida": [-8.7273, 115.5444],
  "Nusa Lembongan": [-8.68, 115.45],
  Payangan: [-8.436, 115.24],
  Sukawati: [-8.595, 115.281],
  Kintamani: [-8.249, 115.312],
  Tegallalang: [-8.435, 115.279],
  Denpasar: [-8.6705, 115.2126],
  Bali: [-8.4095, 115.1889],
};

// Precise overrides for specific villas (exact address / resolved Google Maps).
const SLUG_COORDS: Record<string, [number, number]> = {
  "baile-bali-villa-your-minimalist-home-in-jimbaran": [-8.7841585, 115.1809118],
  "villa-rumma-lanna": [-8.523, 115.248], // Singakerta, Ubud
  "secluded-jungle-sanctuary-ubud": [-8.417, 115.288], // Sebatu
  "sakha-sari-villa": [-8.63, 115.13], // Padonan, Canggu
  "amalfi-dream-villa": [-8.8, 115.162], // Puri Gading, Jimbaran
  "villa-eysteinn-your-exquisite-bali-haven-in-canggu": [-8.645, 115.13], // Kayu Tulang
  "where-productivity-meets-island-relaxation": [-8.7, 115.254], // Sanur Kauh
  "askana-suites-payangan": [-8.436, 115.24],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic coordinate for a property: precise override, else area centroid
 * with a small stable per-slug offset (~±400 m) so pins don't stack exactly. */
export function coordFor(p: Pick<Property, "slug" | "area">): [number, number] {
  if (SLUG_COORDS[p.slug]) return SLUG_COORDS[p.slug];
  const base = AREA_COORDS[p.area] || AREA_COORDS.Bali;
  const h = hash(p.slug);
  const dLat = ((h % 1000) / 1000 - 0.5) * 0.008;
  const dLng = (((h >> 10) % 1000) / 1000 - 0.5) * 0.008;
  return [base[0] + dLat, base[1] + dLng];
}
