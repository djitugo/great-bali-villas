import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getFeatured } from "@/lib/properties";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Great Bali Villas is a boutique villa rental and management company based in Bali since 2014, with a local team and hotel-grade service.",
};

const VALUES = [
  ["Owned, not aggregated", "We don't resell listings. We manage these villas ourselves — staffing, cleaning, maintenance and guest care."],
  ["Hotel service, villa freedom", "Daily housekeeping, airport pick-up, private chef and concierge — the comfort of a resort in your own home."],
  ["Honest by default", "Real photos, transparent pricing, and a 100% best-price guarantee when you book direct."],
  ["A local team", "An English-speaking crew on the ground in Bali, reachable on WhatsApp and quick to reply."],
];

export default function AboutPage() {
  const showcase = getFeatured(2);

  return (
    <>
      <section className="bg-sand pt-32 lg:pt-44">
        <div className="container-x pb-16 lg:pb-24">
          <Reveal>
            <p className="mb-4 text-sm uppercase tracking-[0.22em] text-muted">Since {SITE.since}</p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.02] tracking-tight lg:text-7xl">
              A Bali villa company run by people who live here.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-lg text-muted">
              {SITE.legalName} began in {SITE.since} with a simple idea: give villa guests the
              reliability of a hotel without giving up the privacy of their own home. Today our team
              manages {SITE.stats.villas} private villas, resorts and bungalows across Bali and Lombok.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x grid gap-3 py-3 sm:grid-cols-2">
          {showcase.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={p.images[0]} alt={p.name} fill sizes="50vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-4xl tracking-tight lg:text-5xl">What we believe</h2>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-sand-200 sm:grid-cols-2 lg:col-span-7">
            {VALUES.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="h-full bg-cream p-7">
                  <h3 className="text-lg font-medium">{t}</h3>
                  <p className="mt-2 text-sm text-muted">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-jungle text-cream">
        <div className="container-x grid gap-10 py-20 lg:grid-cols-3 lg:py-24">
          {[
            [SITE.stats.villas, "Villas under management"],
            [`${SITE.stats.years}+`, "Years on the island"],
            ["100%", "Best-price guarantee"],
          ].map(([n, l]) => (
            <Reveal key={l}>
              <p className="font-display text-6xl">{n}</p>
              <p className="mt-2 text-cream/60">{l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x flex flex-col items-start justify-between gap-8 py-20 lg:flex-row lg:items-center lg:py-28">
          <h2 className="max-w-xl font-display text-4xl tracking-tight lg:text-5xl">
            Own a villa? We&apos;ll run it like our own.
          </h2>
          <div className="flex gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-jungle px-7 py-4 font-medium text-cream transition-colors hover:bg-jungle-600">
              Talk to us <ArrowIcon className="h-4 w-4" />
            </Link>
            <Link href="/properties" className="inline-flex items-center rounded-full border border-sand-300 px-7 py-4 font-medium transition-colors hover:bg-sand">
              Browse villas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
