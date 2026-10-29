import type { Property, RateKind } from "./types";

export const RATE_KINDS: RateKind[] = ["daily", "monthly", "yearly"];

/** The rate to display: the requested stay length, else the shortest one the villa offers. */
export function rateOf(p: Property, kind?: RateKind): { kind: RateKind; amount: number } | null {
  const r = p.rates || {};
  if (kind) return r[kind] ? { kind, amount: r[kind]! } : null;
  for (const k of RATE_KINDS) if (r[k]) return { kind: k, amount: r[k]! };
  return null;
}
