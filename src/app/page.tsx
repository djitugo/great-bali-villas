import Link from "next/link";
import Image from "next/image";
import { getFeatured, getAllProperties, getTypes, getAreas } from "@/lib/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { Price } from "@/components/Price";
import { Reveal } from "@/components/Reveal";
import { SITE, HERO_AREAS } from "@/lib/site";
import { ArrowIcon, ArrowUpRight } from "@/components/icons";
import type { Property } from "@/lib/types";

function coverFor(predicate: (p: Property) => boolean) {
  const all = getAllProperties();
  const match = all.find((p) => predicate(p) && p.images[0]);
  return match?.images[0] ?? all[0].images[0];
}

export default function HomePage() {
  const featured = getFeatured(7);
  const hero = featured[0];
  const lead = featured[1];
  const rest = featured.slice(2);
  const total = getAllProperties().length;
  const types = getTypes();
  const areas = getAreas();

  const destinations = HERO_AREAS.map((area) => ({
    area,
    count: areas.find((a) => a.value === area)?.count ?? 0,
    cover: coverFor((p) => p.area === area),
  }));

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <Image src={hero.images[0]} alt={hero.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink/80" />

        <div className="container-x relative z-10 w-full pb-10 pt-36 text-cream">
          <Reveal>
            <p className="eyebrow mb-6 text-cream/70">
              Villa rental &amp; management &middot; Bali &middot; est. {SITE.since}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-5xl font-display text-[2.9rem] font-medium leading-[0.98] tracking-tight sm:text-7xl lg:text-[6.5rem]">
              Your private Bali,
              <br />
              <span className="italic font-normal">beautifully managed.</span>
            </h1>
          </Reveal>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal delay={0.16}>
              <p className="max-w-md text-base leading-relaxed text-cream/80">
                {total}+ handpicked villas — from romantic one-bedroom hideaways to beachfront
                estates. Booked direct, cared for by a local team that answers in hours.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="flex flex-wrap gap-3">
                <Link href="/properties" className="btn btn-light group">
                  Explore villas
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href={SITE.whatsappHref} target="_blank" rel="noopener" className="btn btn-outline-light">
                  Talk to our team
                </a>
              </div>
            </Reveal>
          </div>

          {/* stat bar */}
          <Reveal delay={0.3}>
            <dl className="mt-12 grid grid-cols-2 gap-px border border-cream/20 bg-cream/20 sm:grid-cols-4">
              {[
                [`${total}+`, "Handpicked villas"],
                [SITE.stats.areas, "Destinations"],
                [`${SITE.stats.years} yrs`, "On the ground"],
                ["100%", "Best-price direct"],
              ].map(([n, l]) => (
                <div key={l} className="bg-ink/30 px-5 py-4 backdrop-blur-sm">
                  <dt className="font-display text-2xl text-cream lg:text-3xl">{n}</dt>
                  <dd className="eyebrow mt-1 text-cream/55">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ============ DESTINATION MARQUEE ============ */}
      <div className="overflow-hidden border-b border-ink/10 bg-cream py-4">
        <div className="gbv-marquee-fast flex w-max items-center gap-10 whitespace-nowrap">
          {[...HERO_AREAS, ...HERO_AREAS, ...HERO_AREAS, ...HERO_AREAS].map((a, i) => (
            <Link
              key={`${a}-${i}`}
              href={`/properties?area=${encodeURIComponent(a)}`}
              className="flex items-center gap-10 font-display text-xl text-ink transition-opacity hover:opacity-50"
            >
              {a} <span aria-hidden className="text-sm text-muted">&#10022;</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ============ INTRO ============ */}
      <section className="bg-cream">
        <div className="container-x grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-6 text-muted">The difference</p>
            <h2 className="font-display text-3xl leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              We&apos;re not a listing site. We&apos;re the team that{" "}
              <span className="italic">actually runs</span> the villas — so what you see is what
              you get.
            </h2>
          </Reveal>
          <div className="flex flex-col justify-end lg:col-span-5 lg:pl-12">
            <Reveal delay={0.12}>
              <p className="border-t border-ink/15 pt-6 text-sm leading-relaxed text-muted">
                {SITE.legalName} has managed private villas across Bali and Lombok since {SITE.since}.
                Every home is visited, photographed and serviced by our own staff — with hotel-grade
                housekeeping, airport transfers and a concierge a message away.
              </p>
              <Link href="/about" className="eyebrow mt-6 inline-block border-b border-ink pb-1 transition-opacity hover:opacity-60">
                About us
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="border-t border-ink/10 bg-sand">
        <div className="container-x py-20 lg:py-28">
          <div className="mb-12 flex items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow mb-4 text-muted">Editor&apos;s picks</p>
              <h2 className="font-display text-4xl tracking-tight lg:text-6xl">Featured villas</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/properties" className="group hidden items-center gap-2 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] sm:inline-flex">
                View all {total}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>

          {/* lead feature */}
          <Reveal>
            <Link href={`/properties/${lead.slug}`} className="group mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="relative aspect-[16/9] overflow-hidden bg-sand-100 lg:col-span-8 lg:aspect-[16/8]">
                <Image
                  src={lead.images[0]}
                  alt={lead.name}
                  fill
                  sizes="(max-width:1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <span className="absolute left-0 top-0 bg-cream px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                  01 &middot; {lead.type}
                </span>
              </div>
              <div className="lg:col-span-4 lg:pb-2">
                <p className="eyebrow text-muted">{lead.area} &middot; {lead.bedrooms} bd &middot; {lead.bathrooms} ba</p>
                <h3 className="mt-3 font-display text-2xl leading-snug transition-opacity group-hover:opacity-60 lg:text-3xl">
                  {lead.name}
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{lead.description}</p>
                <p className="mt-5 border-t border-ink/15 pt-4 text-sm">
                  <span className="text-muted">from </span>
                  <Price idr={lead.price} period={lead.period} className="font-medium text-ink" suffixClassName="text-xs" />
                </p>
              </div>
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 5) * 0.06}>
                <PropertyCard p={p} priority={i < 2} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DESTINATIONS ============ */}
      <section className="border-t border-ink/10 bg-cream">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4 text-muted">Where to stay</p>
            <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-6xl">
              Find <span className="italic">your</span> corner of the island
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 lg:grid-cols-3">
            {destinations.map((d, i) => (
              <Link
                key={d.area}
                href={`/properties?area=${encodeURIComponent(d.area)}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-sand-100 lg:aspect-[4/3]"
              >
                <Image
                  src={d.cover}
                  alt={d.area}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                <span className="eyebrow absolute left-4 top-4 text-cream/70 lg:left-5 lg:top-5">
                  0{i + 1}
                </span>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-cream lg:inset-x-5 lg:bottom-5">
                  <div>
                    <p className="font-display text-2xl lg:text-3xl">{d.area}</p>
                    <p className="eyebrow mt-1 text-cream/60">{d.count} villas</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BY TYPE ============ */}
      <section className="border-t border-ink/10 bg-sand">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4 text-muted">The collection</p>
            <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-6xl">Browse by style</h2>
          </Reveal>
          <div className="border-t border-ink/15">
            {types.map((t, i) => (
              <Reveal key={t.value} delay={i * 0.04}>
                <Link
                  href={`/properties?type=${encodeURIComponent(t.value)}`}
                  className="group flex items-baseline justify-between border-b border-ink/15 py-6 transition-all hover:px-3 lg:py-8"
                >
                  <span className="flex items-baseline gap-6">
                    <span className="eyebrow text-muted">0{i + 1}</span>
                    <span className="font-display text-3xl text-ink transition-opacity group-hover:opacity-60 lg:text-5xl">
                      {t.value}
                    </span>
                  </span>
                  <span className="flex items-center gap-5">
                    <span className="eyebrow hidden text-muted sm:inline">{t.count} villas</span>
                    <ArrowUpRight className="h-5 w-5 text-muted transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink lg:h-7 lg:w-7" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="bg-ink text-cream">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4 text-cream/40">Why book direct</p>
            <h2 className="mb-14 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight lg:text-6xl">
              Hotel-grade service, the freedom of{" "}
              <span className="italic">your own</span> villa.
            </h2>
          </Reveal>
          <div className="grid gap-px border border-cream/15 bg-cream/15 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Best price, direct", "Book straight with the manager — no platform mark-up, 100% best-price guarantee."],
              ["Real, managed homes", "Every villa is run by our own staff. Verified photos, honest descriptions."],
              ["Concierge included", "Airport transfers, private chef, spa, tours and dining — sorted before you land."],
              ["Replies in hours", "An English-speaking local team on WhatsApp, not a faceless inbox."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="h-full bg-ink p-8 lg:p-9">
                  <span className="font-display text-3xl italic text-cream/30">0{i + 1}</span>
                  <h3 className="mt-6 font-display text-xl text-cream">{t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/55">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-cream">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-4 text-muted">How it works</p>
            <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
              Booking, the <span className="italic">easy</span> way
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              No endless tabs. Tell us what you want, and we&apos;ll curate it for you.
            </p>
            <a href={SITE.whatsappHref} target="_blank" rel="noopener" className="btn btn-dark group mt-8">
              Start on WhatsApp
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
          <div className="border-t border-ink/15 lg:col-span-8 lg:border-t-0 lg:pl-12">
            {[
              ["Tell us the brief", "Your dates, group size, vibe and budget. One message is enough."],
              ["Get curated options", "We send a tailored shortlist with real photos and honest prices."],
              ["Book direct & relax", "Secure your villa, and let concierge handle the rest before you arrive."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="flex gap-7 border-b border-ink/15 py-7 lg:py-8">
                  <span className="font-display text-2xl italic text-muted">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl lg:text-2xl">{t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
