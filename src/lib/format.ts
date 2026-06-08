// Currency conversion is approximate, for display only. Base prices are in IDR.
export const CURRENCIES = {
  IDR: { symbol: "Rp", rate: 1, locale: "id-ID", decimals: 0 },
  USD: { symbol: "$", rate: 1 / 16200, locale: "en-US", decimals: 0 },
  EUR: { symbol: "€", rate: 1 / 17600, locale: "de-DE", decimals: 0 },
  AUD: { symbol: "A$", rate: 1 / 10600, locale: "en-AU", decimals: 0 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatPrice(idr: number | null, currency: CurrencyCode = "IDR"): string {
  if (!idr) return "On request";
  const c = CURRENCIES[currency];
  const value = idr * c.rate;
  const rounded =
    currency === "IDR" ? value : value < 100 ? Math.round(value) : Math.round(value / 5) * 5;
  return `${c.symbol}${rounded.toLocaleString(c.locale, { maximumFractionDigits: c.decimals })}`;
}

export function slugToTitle(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export function typeToSlug(t: string) {
  return t.toLowerCase().replace(/\s+/g, "-");
}
