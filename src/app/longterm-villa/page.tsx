import type { Metadata } from "next";
import { queryProperties } from "@/lib/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Long-term Villas",
  description:
    "Villas for monthly and long-stay rentals across Bali. Tell us your dates and budget, and we'll match you with the right home.",
};

export default function LongtermPage() {
  const { items } = queryProperties({ kind: "longterm", perPage: 100 });

  return (
    <section className="bg-sand pt-32 lg:pt-40">
      <div className="container-x pb-20 lg:pb-28">
        <Reveal>
          <p className="eyebrow mb-4 text-muted"><T k="lt.eyebrow" /></p>
          <h1 className="max-w-3xl font-display text-5xl tracking-tight lg:text-7xl">
            <T k="lt.title1" />
            <span className="italic"><T k="lt.title2" /></span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted"><T k="lt.sub" /></p>
          <a
            href={`${SITE.whatsappHref}?text=${encodeURIComponent("Hi Great Bali Villas! I'm interested in a long-term villa rental.")}`}
            target="_blank"
            rel="noopener"
            className="btn btn-dark mt-8"
          >
            <T k="lt.cta" />
          </a>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06}>
              <PropertyCard p={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
