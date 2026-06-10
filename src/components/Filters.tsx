"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Facets } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

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
          className="w-full appearance-none border border-ink/15 bg-cream px-4 py-2.5 pr-9 text-sm text-ink outline-none transition-colors hover:border-ink/30 focus:border-ink"
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
  const { t } = useI18n();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((sp.get("search") ?? "") !== search) setParam({ search: search || undefined });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const type = sp.get("type") ?? "";
  const area = sp.get("area") ?? "";
  const bedrooms = sp.get("bedrooms") ?? "";
  const sort = sp.get("sort") ?? "featured";
  const hasFilters = !!(type || area || bedrooms || sp.get("search"));

  const SORTS = [
    ["featured", t("filters.sortFeatured")],
    ["price-asc", t("filters.sortPriceAsc")],
    ["price-desc", t("filters.sortPriceDesc")],
    ["name", t("filters.sortName")],
  ] as const;

  return (
    <div className="sticky top-[4.5rem] z-40 border-y border-ink/10 bg-sand/90 backdrop-blur-xl lg:top-[5.5rem]">
      <div className="container-x py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-end">
            <label className="relative col-span-2 flex flex-col sm:col-span-1 lg:w-56">
              <span className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
                {t("filters.search")}
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("filters.searchPh")}
                className="border border-ink/15 bg-cream px-4 py-2.5 text-sm outline-none transition-colors hover:border-ink/30 focus:border-ink"
              />
            </label>

            <Select label={t("filters.type")} value={type} onChange={(v) => setParam({ type: v || undefined })}>
              <option value="">{t("filters.allTypes")}</option>
              {facets.types.map((x) => (
                <option key={x.value} value={x.value}>
                  {x.value} ({x.count})
                </option>
              ))}
            </Select>

            <Select label={t("filters.dest")} value={area} onChange={(v) => setParam({ area: v || undefined })}>
              <option value="">{t("filters.allAreas")}</option>
              {facets.areas.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.value} ({a.count})
                </option>
              ))}
            </Select>

            <Select label={t("filters.bedrooms")} value={bedrooms} onChange={(v) => setParam({ bedrooms: v || undefined })}>
              <option value="">{t("filters.any")}</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={String(n)}>
                  {t("filters.nBeds", { n })}
                </option>
              ))}
            </Select>

            <Select label={t("filters.sort")} value={sort} onChange={(v) => setParam({ sort: v })}>
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <span className="text-sm text-muted">
              <span className="font-medium text-ink">{total}</span> {t("filters.villas")}
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
              {t("filters.clear")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
