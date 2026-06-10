import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPropertyBySlug, getRelated } from "@/lib/properties";
import { Gallery } from "@/components/Gallery";
import { InquiryForm } from "@/components/InquiryForm";
import { Price } from "@/components/Price";
import { PropertyCard } from "@/components/PropertyCard";
import { Reveal } from "@/components/Reveal";
import { BedIcon, BathIcon, PinIcon, CheckIcon, ArrowIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) return { title: "Villa not found" };
  return {
    title: p.name,
    description: p.description?.slice(0, 155) || `${p.type} in ${p.area}, Bali.`,
    openGraph: { images: p.images[0] ? [p.images[0]] : [], title: p.name },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPropertyBySlug(slug);
  if (!p) notFound();
  const related = getRelated(p, 3);

  const facts = [
    p.bedrooms != null && { icon: BedIcon, label: "detail.bedrooms" as const, value: p.bedrooms },
    p.bathrooms != null && { icon: BathIcon, label: "detail.bathrooms" as const, value: p.bathrooms },
    { icon: PinIcon, label: "detail.area" as const, value: p.area },
    { icon: CheckIcon, label: "detail.type" as const, value: p.type },
  ].filter(Boolean) as {
    icon: typeof BedIcon;
    label: "detail.bedrooms" | "detail.bathrooms" | "detail.area" | "detail.type";
    value: string | number;
  }[];

  const descParas = p.description ? p.description.split("\n\n").filter(Boolean) : [];

  return (
    <>
      <div className="container-x pt-28 lg:pt-36">
        {/* breadcrumb + title */}
        <Reveal>
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ink"><T k="detail.home" /></Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-ink"><T k="detail.villas" /></Link>
            <span>/</span>
            <Link href={`/properties?area=${encodeURIComponent(p.area)}`} className="hover:text-ink">{p.area}</Link>
          </nav>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl font-display text-4xl tracking-tight lg:text-6xl">{p.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-muted">
                <PinIcon className="h-4 w-4" /> {p.address || `${p.area}, Bali`}
              </p>
            </div>
            <div className="shrink-0 lg:text-right">
              <p className="text-sm text-muted"><T k="common.from" /></p>
              <Price idr={p.price} period={p.period} className="font-display text-3xl text-ink" suffixClassName="text-sm" />
            </div>
          </div>
        </Reveal>

        {/* gallery */}
        <Reveal delay={0.05}>
          <Gallery images={p.images} name={p.name} />
        </Reveal>

        {/* body grid */}
        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            {/* key facts */}
            <div className="grid grid-cols-2 gap-4 border-b border-sand-200 pb-10 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <f.icon className="h-6 w-6 text-muted" />
                  <p className="mt-3 font-display text-2xl text-ink">{f.value}</p>
                  <p className="text-sm text-muted"><T k={f.label} /></p>
                </div>
              ))}
            </div>

            {/* description */}
            {descParas.length > 0 && (
              <div className="border-b border-sand-200 py-10">
                <h2 className="mb-5 font-display text-3xl"><T k="detail.about" /></h2>
                <div className="space-y-4 leading-relaxed text-ink-soft">
                  {descParas.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* features */}
            {p.features.length > 0 && (
              <div className="py-10">
                <h2 className="mb-6 font-display text-3xl"><T k="detail.features" /></h2>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckIcon className="h-4 w-4 shrink-0 text-ink" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* sticky enquiry */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-none border border-sand-200 bg-cream p-6 shadow-xl shadow-ink/5">
                <div className="mb-5 flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-muted"><T k="common.from" /></p>
                    <Price idr={p.price} period={p.period} className="font-display text-2xl text-ink" suffixClassName="text-xs" />
                  </div>
                  <span className="rounded-none bg-sand px-3 py-1 text-xs font-medium">{p.type}</span>
                </div>
                <InquiryForm propertyName={p.name} propertySlug={p.slug} />
                <p className="mt-4 text-center text-xs text-muted">
                  <T k="detail.call" vars={{phone: SITE.phoneOffice}} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="bg-cream">
          <div className="container-x py-16 lg:py-24">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-display text-3xl tracking-tight lg:text-4xl"><T k="detail.also" /></h2>
              <Link href="/properties" className="group inline-flex items-center gap-2 text-sm font-medium">
                <T k="detail.all" /> <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <PropertyCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
