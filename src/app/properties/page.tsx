import Link from "next/link";
import type { Metadata } from "next";
import { queryProperties, getFacets } from "@/lib/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { Filters } from "@/components/Filters";
import { Reveal } from "@/components/Reveal";
import type { PropertyQuery } from "@/lib/types";

export const metadata: Metadata = {
  title: "All Villas",
  description: "Browse handpicked private villas across Bali — filter by destination, type, bedrooms and price.",
};

type SP = Promise<{ [key: string]: string | string[] | undefined }>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PropertiesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const facets = getFacets();

  const q: PropertyQuery = {
    type: one(sp.type),
    area: one(sp.area),
    bedrooms: one(sp.bedrooms) ? Number(one(sp.bedrooms)) : undefined,
    search: one(sp.search),
    sort: (one(sp.sort) as PropertyQuery["sort"]) || "featured",
    page: one(sp.page) ? Number(one(sp.page)) : 1,
    perPage: 12,
  };

  const { items, total, page, pages } = queryProperties(q);

  const title = q.area
    ? `Villas in ${q.area}`
    : q.type
    ? `${q.type}s`
    : "Every villa, handpicked";

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(sp).forEach(([k, v]) => {
      const val = one(v);
      if (val && k !== "page") params.set(k, val);
    });
    params.set("page", String(p));
    return `/properties?${params.toString()}`;
  };

  return (
    <>
      <section className="bg-sand pt-32 lg:pt-40">
        <div className="container-x pb-8">
          <Reveal>
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-muted">
              {total} villas across Bali
            </p>
            <h1 className="max-w-3xl font-display text-5xl tracking-tight lg:text-6xl">{title}</h1>
          </Reveal>
        </div>
      </section>

      <Filters facets={facets} total={total} />

      <section className="bg-sand">
        <div className="container-x py-12 lg:py-16">
          {items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-3xl">No villas match those filters.</p>
              <Link href="/properties" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                  <PropertyCard p={p} priority={i < 3} />
                </Reveal>
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav className="mt-16 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={buildHref(page - 1)} className="rounded-full border border-sand-300 px-5 py-2.5 text-sm hover:bg-cream" scroll>
                  ← Prev
                </Link>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1)
                .map((n, idx, arr) => (
                  <span key={n} className="flex items-center gap-2">
                    {idx > 0 && arr[idx - 1] !== n - 1 && <span className="text-muted">…</span>}
                    <Link
                      href={buildHref(n)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm transition-colors ${
                        n === page ? "bg-ink text-cream" : "border border-sand-300 hover:bg-cream"
                      }`}
                    >
                      {n}
                    </Link>
                  </span>
                ))}
              {page < pages && (
                <Link href={buildHref(page + 1)} className="rounded-full border border-sand-300 px-5 py-2.5 text-sm hover:bg-cream">
                  Next →
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
