import Link from "next/link";
import Image from "next/image";
import { getFeatured, getAllProperties, getTypes, getAreas } from "@/lib/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { Reveal } from "@/components/Reveal";
import { SITE, HERO_AREAS, HERO_IMAGES } from "@/lib/site";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { T } from "@/lib/i18n";
import {
  ArrowIcon,
  ArrowUpRight,
  TagIcon,
  KeyIcon,
  BellIcon,
  ChatIcon,
  ListIcon,
} from "@/components/icons";
import type { Property } from "@/lib/types";

function coverFor(predicate: (p: Property) => boolean) {
  const all = getAllProperties();
  const match = all.find((p) => predicate(p) && p.images[0]);
  return match?.images[0] ?? all[0].images[0];
}

const WHY = [
  { icon: TagIcon, t: "why.1t", d: "why.1d" },
  { icon: KeyIcon, t: "why.2t", d: "why.2d" },
  { icon: BellIcon, t: "why.3t", d: "why.3d" },
  { icon: ChatIcon, t: "why.4t", d: "why.4d" },
] as const;

const HOW = [
  { icon: ChatIcon, t: "how.1t", d: "how.1d" },
  { icon: ListIcon, t: "how.2t", d: "how.2d" },
  { icon: KeyIcon, t: "how.3t", d: "how.3d" },
] as const;

export default function HomePage() {
  const featured = getFeatured(6);
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
        <HeroSlideshow images={HERO_IMAGES} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/35 to-ink/85" />

        <div className="container-x relative z-10 w-full pb-10 pt-36 text-cream">
          <Reveal>
            <p className="eyebrow mb-6 text-cream/70"><T k="hero.eyebrow" /></p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-5xl font-display text-[2.9rem] font-medium leading-[0.98] tracking-tight sm:text-7xl lg:text-[6.5rem]">
              <T k="hero.title1" />
              <br />
              <span className="italic font-normal"><T k="hero.title2" /></span>
            </h1>
          </Reveal>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal delay={0.16}>
              <p className="max-w-md text-base leading-relaxed text-cream/80">
                <T k="hero.sub" vars={{ n: total }} />
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="flex flex-wrap gap-3">
                <Link href="/properties" className="btn btn-light group">
                  <T k="hero.cta1" />
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href={SITE.whatsappHref} target="_blank" rel="noopener" className="btn btn-outline-light">
                  <T k="hero.cta2" />
                </a>
              </div>
            </Reveal>
          </div>

          {/* stat bar */}
          <Reveal delay={0.3}>
            <dl className="mt-12 grid grid-cols-2 gap-px border border-cream/10 bg-cream/10 sm:grid-cols-4">
              {[
                [`${total}+`, "hero.stat1"],
                [SITE.stats.areas, "hero.stat2"],
                [`${SITE.stats.years}`, "hero.stat3"],
                ["100%", "hero.stat4"],
              ].map(([n, k]) => (
                <div key={k} className="bg-ink/30 px-5 py-4 backdrop-blur-sm">
                  <dt className="font-display text-2xl text-cream lg:text-3xl">{n}</dt>
                  <dd className="eyebrow mt-1 text-cream/55"><T k={k as "hero.stat1"} /></dd>
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
            <p className="eyebrow mb-6 text-muted"><T k="intro.eyebrow" /></p>
            <h2 className="font-display text-3xl leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              <T k="intro.t1" />
              <span className="italic"><T k="intro.t2" /></span>
              <T k="intro.t3" />
            </h2>
          </Reveal>
          <div className="flex flex-col justify-end lg:col-span-5 lg:pl-12">
            <Reveal delay={0.12}>
              <p className="border-t border-ink/10 pt-6 text-sm leading-relaxed text-muted">
                <T k="intro.body" vars={{ legal: SITE.legalName, year: SITE.since }} />
              </p>
              <Link href="/about" className="eyebrow mt-6 inline-block border-b border-ink pb-1 transition-opacity hover:opacity-60">
                <T k="intro.link" />
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
              <p className="eyebrow mb-4 text-muted"><T k="featured.eyebrow" /></p>
              <h2 className="font-display text-4xl tracking-tight lg:text-6xl"><T k="featured.title" /></h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/properties" className="group hidden items-center gap-2 border-b border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] sm:inline-flex">
                <T k="featured.viewAll" vars={{ n: total }} />
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.07}>
                <PropertyCard p={p} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DESTINATIONS ============ */}
      <section className="border-t border-ink/10 bg-cream">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4 text-muted"><T k="dest.eyebrow" /></p>
            <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-6xl">
              <T k="dest.t1" />
              <span className="italic"><T k="dest.t2" /></span>
              <T k="dest.t3" />
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
                  quality={85}
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                <span className="eyebrow absolute left-4 top-4 text-cream/70 lg:left-5 lg:top-5">
                  0{i + 1}
                </span>
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-cream lg:inset-x-5 lg:bottom-5">
                  <div>
                    <p className="font-display text-2xl lg:text-3xl">{d.area}</p>
                    <p className="eyebrow mt-1 text-cream/60"><T k="dest.count" vars={{ n: d.count }} /></p>
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
            <p className="eyebrow mb-4 text-muted"><T k="types.eyebrow" /></p>
            <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-6xl"><T k="types.title" /></h2>
          </Reveal>
          <div className="border-t border-ink/10">
            {types.map((t, i) => (
              <Reveal key={t.value} delay={i * 0.04}>
                <Link
                  href={`/properties?type=${encodeURIComponent(t.value)}`}
                  className="group flex items-baseline justify-between border-b border-ink/10 py-6 transition-all hover:px-3 lg:py-8"
                >
                  <span className="flex items-baseline gap-6">
                    <span className="eyebrow text-muted">0{i + 1}</span>
                    <span className="font-display text-3xl text-ink transition-opacity group-hover:opacity-60 lg:text-5xl">
                      {t.value}
                    </span>
                  </span>
                  <span className="flex items-center gap-5">
                    <span className="eyebrow hidden text-muted sm:inline"><T k="types.count" vars={{ n: t.count }} /></span>
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
            <p className="eyebrow mb-4 text-cream/40"><T k="why.eyebrow" /></p>
            <h2 className="mb-14 max-w-3xl font-display text-4xl leading-[1.08] tracking-tight lg:text-6xl">
              <T k="why.t1" />
              <span className="italic"><T k="why.t2" /></span>
              <T k="why.t3" />
            </h2>
          </Reveal>
          <div className="grid gap-px border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item, i) => (
              <Reveal key={item.t} delay={i * 0.07}>
                <div className="h-full bg-ink p-8 lg:p-9">
                  <item.icon className="h-8 w-8 text-cream/80" />
                  <h3 className="mt-6 font-display text-xl text-cream"><T k={item.t} /></h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/55"><T k={item.d} /></p>
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
            <p className="eyebrow mb-4 text-muted"><T k="how.eyebrow" /></p>
            <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
              <T k="how.t1" />
              <span className="italic"><T k="how.t2" /></span>
              <T k="how.t3" />
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted"><T k="how.sub" /></p>
            <a href={SITE.whatsappHref} target="_blank" rel="noopener" className="btn btn-dark group mt-8">
              <T k="how.cta" />
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
          <div className="border-t border-ink/10 lg:col-span-8 lg:border-t-0 lg:pl-12">
            {HOW.map((item, i) => (
              <Reveal key={item.t} delay={i * 0.07}>
                <div className="flex gap-7 border-b border-ink/10 py-7 lg:py-8">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-ink/10">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl lg:text-2xl"><T k={item.t} /></h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted"><T k={item.d} /></p>
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
