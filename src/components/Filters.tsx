"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Facets } from "@/lib/types";
import { cn } from "@/lib/cn";

const SORTS = [
  ["featured", "Featured"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["name", "Name A–Z"],
] as const;

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative flex flex-col">
      <span className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-sand-200 bg-cream px-4 py-2.5 pr-9 text-sm text-ink outline-none transition-colors hover:border-sand-300 focus:border-ink"
        >
          {children}
        </select>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </label>
  );
}

export function Filters({ facets, total }: { facets: Facets; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(sp.get("search") ?? "");

  const setParam = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (!v) params.delete(k);
        else params.set(k, v);
      }
      params.delete("page");
      startTransition(() => router.push(`${pathname}?${params.toString()}`, { scroll: false }));
    },
    [router, pathname, sp]
  );

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if ((sp.get("search") ?? "") !== search) setParam({ search: search || undefined });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const type = sp.get("type") ?? "";
  const area = sp.get("area") ?? "";
  const bedrooms = sp.get("bedrooms") ?? "";
  const sort = sp.get("sort") ?? "featured";
  const hasFilters = !!(type || area || bedrooms || sp.get("search"));

  return (
    <div className="sticky top-[4.5rem] z-40 border-y border-sand-200 bg-sand/90 backdrop-blur-xl lg:top-[5.25rem]">
      <div className="container-x py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-end">
            <label className="relative col-span-2 flex flex-col sm:col-span-1 lg:w-56">
              <span className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
                Search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, area, feature…"
                className="rounded-xl border border-sand-200 bg-cream px-4 py-2.5 text-sm outline-none transition-colors hover:border-sand-300 focus:border-ink"
              />
            </label>

            <Select label="Type" value={type} onChange={(v) => setParam({ type: v || undefined })}>
              <option value="">All types</option>
              {facets.types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.value} ({t.count})
                </option>
              ))}
            </Select>

            <Select label="Destination" value={area} onChange={(v) => setParam({ area: v || undefined })}>
              <option value="">All areas</option>
              {facets.areas.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.value} ({a.count})
                </option>
              ))}
            </Select>

            <Select label="Bedrooms" value={bedrooms} onChange={(v) => setParam({ bedrooms: v || undefined })}>
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={String(n)}>
                  {n}+ bedrooms
                </option>
              ))}
            </Select>

            <Select label="Sort" value={sort} onChange={(v) => setParam({ sort: v })}>
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <span className="text-sm text-muted">
              <span className="font-medium text-ink">{total}</span> villas
            </span>
            <button
              onClick={() => {
                setSearch("");
                startTransition(() => router.push(pathname, { scroll: false }));
              }}
              className={cn(
                "text-sm font-medium underline-offset-4 transition-opacity hover:underline",
                hasFilters ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
