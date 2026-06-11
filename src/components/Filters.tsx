"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Facets } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";

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
                className="border border-ink/10 bg-cream px-4 py-2.5 text-sm outline-none transition-colors hover:border-ink/30 focus:border-ink"
              />
            </label>

            <Select
              label={t("filters.type")}
              value={type}
              onChange={(v) => setParam({ type: v || undefined })}
              className="lg:w-44"
              options={[
                { value: "", label: t("filters.allTypes") },
                ...facets.types.map((x) => ({ value: x.value, label: `${x.value} (${x.count})` })),
              ]}
            />

            <Select
              label={t("filters.dest")}
              value={area}
              onChange={(v) => setParam({ area: v || undefined })}
              className="lg:w-44"
              options={[
                { value: "", label: t("filters.allAreas") },
                ...facets.areas.map((a) => ({ value: a.value, label: `${a.value} (${a.count})` })),
              ]}
            />

            <Select
              label={t("filters.bedrooms")}
              value={bedrooms}
              onChange={(v) => setParam({ bedrooms: v || undefined })}
              className="lg:w-40"
              options={[
                { value: "", label: t("filters.any") },
                ...[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: t("filters.nBeds", { n }) })),
              ]}
            />

            <Select
              label={t("filters.sort")}
              value={sort}
              onChange={(v) => setParam({ sort: v })}
              className="lg:w-48"
              options={[
                { value: "featured", label: t("filters.sortFeatured") },
                { value: "price-asc", label: t("filters.sortPriceAsc") },
                { value: "price-desc", label: t("filters.sortPriceDesc") },
                { value: "name", label: t("filters.sortName") },
              ]}
            />
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
