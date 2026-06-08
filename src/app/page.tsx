import Link from "next/link";
import Image from "next/image";
import { getFeatured, getAllProperties, getTypes, getAreas } from "@/lib/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { Reveal } from "@/components/Reveal";
import { SITE, HERO_AREAS } from "@/lib/site";
import { ArrowIcon, ArrowUpRight, SparkleIcon } from "@/components/icons";
import type { Property } from "@/lib/types";

function coverFor(predicate: (p: Property) => boolean) {
  const all = getAllProperties();
  const match = all.find((p) => predicate(p) && p.images[0]);
  return match?.images[0] ?? all[0].images[0];
}

export default function HomePage() {
  const featured = getFeatured(6);
  const hero = featured[0];
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
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <Image src={hero.images[0]} alt={hero.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/15 to-ink/75" />

        <div className="container-x relative z-10 w-full pb-16 pt-32 text-cream lg:pb-24">
          <Reveal>
            <p className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-cream/80">
              <SparkleIcon className="h-4 w-4" /> Bali &middot; since {SITE.since}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-4xl font-display text-5xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-8xl">
              Your private Bali, beautifully managed.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg text-cream/85">
              {total}+ handpicked villas — from romantic one-bedroom hideaways to beachfront estates.
              Booked direct, cared for by a local team that answers in hours.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/properties"
                className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-4 font-medium text-ink transition-transform hover:-translate-y-0.5"
              >
                Explore villas
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-4 font-medium text-cream backdrop-blur transition-colors hover:bg-cream/10"
              >
                Talk to our team
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-12 flex flex-wrap gap-2">
              {HERO_AREAS.map((a) => (
                <Link
                  key={a}
                  href={`/properties?area=${encodeURIComponent(a)}`}
                  className="rounded-full border border-cream/25 px-4 py-1.5 text-sm text-cream/90 transition-colors hover:border-cream hover:bg-cream/10"
                >
                  {a}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ STATS / INTRO ============ */}
      <section className="bg-cream">
        <div className="container-x grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-7">
            <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              We&apos;re not a listing site. We&apos;re the team that actually runs the villas — so
              what you see is what you get.
            </h2>
          </Reveal>
          <div className="lg:col-span-5 lg:pl-10">
            <Reveal delay={0.1}>
              <p className="text-muted">
                {SITE.legalName} has managed private villas across Bali and Lombok since {SITE.since}.
                Every home is visited, photographed and serviced by our own staff — with hotel-grade
                housekeeping, airport transfers and a concierge a message away.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-sand-200 pt-8">
                {[
                  [SITE.stats.villas, "Managed villas"],
                  [`${SITE.stats.years} yrs`, "On the ground"],
                  [SITE.stats.areas, "Destinations"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="font-display text-4xl text-ink">{n}</dt>
                    <dd className="mt-1 text-sm text-muted">{l}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="bg-sand">
        <div className="container-x py-20 lg:py-28">
          <div className="mb-12 flex items-end justify-between gap-6">
            <Reveal>
              <p className="mb-3 text-sm uppercase tracking-[0.22em] text-muted">Editor&apos;s picks</p>
              <h2 className="font-display text-4xl tracking-tight lg:text-5xl">Featured villas</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/properties" className="group hidden items-center gap-2 text-sm font-medium sm:inline-flex">
                View all {total}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <PropertyCard p={p} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DESTINATIONS ============ */}
      <section className="bg-cream">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-muted">Where to stay</p>
            <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-5xl">
              Find your corner of the island
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {destinations.map((d, i) => (
              <Reveal key={d.area} delay={(i % 3) * 0.06}>
                <Link
                  href={`/properties?area=${encodeURIComponent(d.area)}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-2xl lg:aspect-[4/3]"
                >
                  <Image
                    src={d.cover}
                    alt={d.area}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5 text-cream">
                    <p className="font-display text-2xl">{d.area}</p>
                    <p className="text-sm text-cream/75">{d.count} villas</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BY TYPE ============ */}
      <section className="bg-sand">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-5xl">Browse by style</h2>
          </Reveal>
          <div className="divide-y divide-sand-200 border-y border-sand-200">
            {types.map((t, i) => (
              <Reveal key={t.value} delay={i * 0.05}>
                <Link
                  href={`/properties?type=${encodeURIComponent(t.value)}`}
                  className="group flex items-center justify-between py-7 transition-all hover:px-2"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-display text-3xl text-ink transition-colors group-hover:text-muted lg:text-4xl">
                      {t.value}
                    </span>
                    <span className="text-sm text-muted">{t.count} villas</span>
                  </span>
                  <ArrowUpRight className="h-6 w-6 text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="bg-jungle text-cream">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-cream/50">Why book direct</p>
            <h2 className="mb-14 max-w-2xl font-display text-4xl tracking-tight lg:text-5xl">
              Hotel-grade service, the freedom of your own villa.
            </h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Best price, direct", "Book straight with the manager — no platform mark-up, 100% best-price guarantee."],
              ["Real, managed homes", "Every villa is run by our own staff. Verified photos, honest descriptions."],
              ["Concierge included", "Airport transfers, private chef, spa, tours and dining — sorted before you land."],
              ["Replies in hours", "An English-speaking local team on WhatsApp, not a faceless inbox."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08}>
                <div className="h-full bg-jungle p-8">
                  <span className="font-display text-2xl text-cream">0{i + 1}</span>
                  <h3 className="mt-5 text-lg font-medium">{t}</h3>
                  <p className="mt-2 text-sm text-cream/65">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-cream">
        <div className="container-x py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className="font-display text-4xl tracking-tight lg:text-5xl">Booking, the easy way</h2>
              <p className="mt-5 text-muted">
                No endless tabs. Tell us what you want, and we&apos;ll curate it for you.
              </p>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-jungle px-7 py-4 font-medium text-cream transition-colors hover:bg-jungle-600"
              >
                Start on WhatsApp
                <ArrowIcon className="h-4 w-4" />
              </a>
            </Reveal>
            <div className="lg:col-span-8 lg:pl-10">
              {[
                ["Tell us the brief", "Your dates, group size, vibe and budget. One message is enough."],
                ["Get curated options", "We send a tailored shortlist with real photos and honest prices."],
                ["Book direct & relax", "Secure your villa, and let concierge handle the rest before you arrive."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.08}>
                  <div className="flex gap-6 border-b border-sand-200 py-7">
                    <span className="font-display text-2xl text-muted">0{i + 1}</span>
                    <div>
                      <h3 className="text-xl font-medium">{t}</h3>
                      <p className="mt-1.5 text-muted">{d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
