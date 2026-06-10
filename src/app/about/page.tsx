import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getFeatured } from "@/lib/properties";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";
import { ArrowIcon, KeyIcon, BellIcon, ShieldIcon, ChatIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Great Bali Villas is a boutique villa rental and management company based in Bali since 2014, with a local team and hotel-grade service.",
};

const VALUES = [
  { icon: KeyIcon, t: "about.v1t", d: "about.v1d" },
  { icon: BellIcon, t: "about.v2t", d: "about.v2d" },
  { icon: ShieldIcon, t: "about.v3t", d: "about.v3d" },
  { icon: ChatIcon, t: "about.v4t", d: "about.v4d" },
] as const;

export default function AboutPage() {
  const showcase = getFeatured(2);

  return (
    <>
      <section className="bg-sand pt-32 lg:pt-44">
        <div className="container-x pb-16 lg:pb-24">
          <Reveal>
            <p className="eyebrow mb-4 text-muted"><T k="about.eyebrow" vars={{ year: SITE.since }} /></p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.02] tracking-tight lg:text-7xl">
              <T k="about.title" />
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-lg text-muted">
              <T k="about.body" vars={{ legal: SITE.legalName, year: SITE.since, n: SITE.stats.villas }} />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x grid gap-3 py-3 sm:grid-cols-2">
          {showcase.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={p.images[0]} alt={p.name} fill sizes="50vw" quality={85} className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-4xl tracking-tight lg:text-5xl"><T k="about.believe" /></h2>
          </Reveal>
          <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:col-span-7">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.07}>
                <div className="h-full bg-cream p-7">
                  <v.icon className="h-7 w-7 text-ink" />
                  <h3 className="mt-5 text-lg font-medium"><T k={v.t} /></h3>
                  <p className="mt-2 text-sm text-muted"><T k={v.d} /></p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="container-x grid gap-10 py-20 lg:grid-cols-3 lg:py-24">
          {[
            [SITE.stats.villas, "about.s1"],
            [`${SITE.stats.years}+`, "about.s2"],
            ["100%", "about.s3"],
          ].map(([n, k]) => (
            <Reveal key={k}>
              <p className="font-display text-6xl">{n}</p>
              <p className="mt-2 text-cream/60"><T k={k as "about.s1"} /></p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x flex flex-col items-start justify-between gap-8 py-20 lg:flex-row lg:items-center lg:py-28">
          <h2 className="max-w-xl font-display text-4xl tracking-tight lg:text-5xl">
            <T k="about.own" />
          </h2>
          <div className="flex gap-3">
            <Link href="/contact" className="btn btn-dark">
              <T k="about.talk" /> <ArrowIcon className="h-4 w-4" />
            </Link>
            <Link href="/properties" className="btn btn-outline-dark">
              <T k="about.browse" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
