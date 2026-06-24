import raw from "@/data/properties.json";
import type { Property, Facets, PropertyQuery } from "./types";

const ALL = (raw as Property[]).filter((p) => p.images && p.images.length > 0);

// Deterministic "featured" ordering: villas with most images + a price, stable by slug.
const score = (p: Property) =>
  (p.images.length >= 8 ? 100 : p.images.length * 10) +
  (p.price ? 20 : 0) +
  (p.description?.length > 300 ? 15 : 0) +
  (p.bedrooms ? 5 : 0);

const FEATURED_ORDER = [...ALL].sort((a, b) => score(b) - score(a) || a.slug.localeCompare(b.slug));

export function getAllProperties(): Property[] {
  return ALL;
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return ALL.find((p) => p.slug === slug);
}

export function getFeatured(n = 6): Property[] {
  return FEATURED_ORDER.slice(0, n);
}

export function getRelated(p: Property, n = 3): Property[] {
  const sameArea = ALL.filter((x) => x.slug !== p.slug && x.area === p.area).sort(
    (a, b) => score(b) - score(a)
  );
  const fill = FEATURED_ORDER.filter((x) => x.slug !== p.slug);
  const out: Property[] = [];
  const seen = new Set<string>([p.slug]);
  for (const x of [...sameArea, ...fill]) {
    if (seen.has(x.slug)) continue;
    seen.add(x.slug);
    out.push(x);
    if (out.length >= n) break;
  }
  return out;
}

const TYPE_ORDER = ["Private Villa", "Villa", "Room", "Bungalow", "Cottage"];

export function getTypes() {
  const counts = new Map<string, number>();
  for (const p of ALL) counts.set(p.type, (counts.get(p.type) || 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => {
      const ai = TYPE_ORDER.indexOf(a.value);
      const bi = TYPE_ORDER.indexOf(b.value);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });
}

export function getAreas() {
  const counts = new Map<string, number>();
  for (const p of ALL) counts.set(p.area, (counts.get(p.area) || 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

export function getFacets(): Facets {
  const types = getTypes();
  const areas = getAreas();
  const bedCounts = new Map<number, number>();
  let priceMin = Infinity;
  let priceMax = 0;
  for (const p of ALL) {
    if (p.bedrooms) bedCounts.set(p.bedrooms, (bedCounts.get(p.bedrooms) || 0) + 1);
    if (p.price) {
      priceMin = Math.min(priceMin, p.price);
      priceMax = Math.max(priceMax, p.price);
    }
  }
  return {
    types,
    areas,
    bedrooms: [...bedCounts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value - b.value),
    priceMin: Number.isFinite(priceMin) ? priceMin : 0,
    priceMax,
    total: ALL.length,
  };
}

export function queryProperties(q: PropertyQuery) {
  let list = q.sort === "featured" || !q.sort ? [...FEATURED_ORDER] : [...ALL];

  if (q.kind) list = list.filter((p) => p.kind === q.kind);
  if (q.type) list = list.filter((p) => p.type === q.type);
  if (q.area) list = list.filter((p) => p.area === q.area);
  if (q.bedrooms) list = list.filter((p) => (p.bedrooms || 0) >= q.bedrooms!);
  if (q.minPrice) list = list.filter((p) => (p.price || 0) >= q.minPrice!);
  if (q.maxPrice) list = list.filter((p) => (p.price || 0) <= q.maxPrice!);
  if (q.search) {
    const s = q.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.area.toLowerCase().includes(s) ||
        p.type.toLowerCase().includes(s) ||
        (p.bedrooms != null && String(p.bedrooms) === s) ||
        (p.bathrooms != null && String(p.bathrooms) === s) ||
        p.features.some((f) => f.toLowerCase().includes(s))
    );
  }

  switch (q.sort) {
    case "price-asc":
      list.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
      break;
    case "price-desc":
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const perPage = q.perPage || 12;
  const page = q.page || 1;
  const total = list.length;
  const items = list.slice((page - 1) * perPage, page * perPage);
  return { items, total, page, perPage, pages: Math.ceil(total / perPage) };
}

export function getAllSlugs() {
  return ALL.map((p) => p.slug);
}
