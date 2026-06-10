import Link from "next/link";
import type { Metadata } from "next";
import { queryProperties, getFacets } from "@/lib/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { Filters } from "@/components/Filters";
import { Reveal } from "@/components/Reveal";
import { T } from "@/lib/i18n";
import type { PropertyQuery } from "@/lib/types";

export const metadata: Metadata = {
  title: "All Villas",
  description: "Browse handpicked private villas across Bali. Filter by destination, type, bedrooms and price.",
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
            <p className="eyebrow mb-4 text-muted">
              <T k="list.eyebrow" vars={{ n: total }} />
            </p>
            <h1 className="max-w-3xl font-display text-5xl tracking-tight lg:text-6xl">
              {q.area ? (
                <T k="list.titleArea" vars={{ x: q.area }} />
              ) : q.type ? (
                q.type
              ) : (
                <T k="list.title" />
              )}
            </h1>
          </Reveal>
        </div>
      </section>

      <Filters facets={facets} total={total} />

      <section className="bg-sand">
        <div className="container-x py-12 lg:py-16">
          {items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-3xl"><T k="list.empty" /></p>
              <Link href="/properties" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
                <T k="list.clear" />
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
            <nav className="mt-16 flex flex-wrap items-center justify-center gap-2">
              {page > 1 && (
                <Link href={buildHref(page - 1)} className="border border-ink/20 px-5 py-2.5 text-sm hover:bg-cream">
                  &larr; <T k="list.prev" />
                </Link>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1)
                .map((n, idx, arr) => (
                  <span key={n} className="flex items-center gap-2">
                    {idx > 0 && arr[idx - 1] !== n - 1 && <span className="text-muted">&hellip;</span>}
                    <Link
                      href={buildHref(n)}
                      className={`flex h-10 min-w-10 items-center justify-center px-3 text-sm transition-colors ${
                        n === page ? "bg-ink text-cream" : "border border-ink/20 hover:bg-cream"
                      }`}
                    >
                      {n}
                    </Link>
                  </span>
                ))}
              {page < pages && (
                <Link href={buildHref(page + 1)} className="border border-ink/20 px-5 py-2.5 text-sm hover:bg-cream">
                  <T k="list.next" /> &rarr;
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
