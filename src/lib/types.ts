export type PropertyKind = "rental" | "longterm";

export interface Property {
  slug: string;
  kind: PropertyKind;
  name: string;
  url: string;
  priceText: string;
  price: number | null;
  currency: string;
  period: string | null;
  type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string;
  areaRaw?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  address: string;
  description: string;
  features: string[];
  cover?: string;
  images: string[];
}

export interface Facets {
  types: { value: string; count: number }[];
  areas: { value: string; count: number }[];
  bedrooms: { value: number; count: number }[];
  priceMin: number;
  priceMax: number;
  total: number;
}

export interface PropertyQuery {
  type?: string;
  area?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  kind?: PropertyKind;
  search?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "name";
  page?: number;
  perPage?: number;
}
