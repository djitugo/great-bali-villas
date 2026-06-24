import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getFeatured } from "@/lib/properties";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";
import { TagIcon, BellIcon, ShieldIcon, ListIcon, CheckIcon } from "@/components/icons";
import { VmPackages } from "@/components/VmPackages";

export const metadata: Metadata = {
  title: "Villa Management",
  description:
    "End-to-end villa management in Bali since 2014: marketing, bookings, guest care and maintenance with full financial transparency.",
};

const SERVICES = [
  { icon: TagIcon, t: "vm.s1t", d: "vm.s1d" },
  { icon: BellIcon, t: "vm.s2t", d: "vm.s2d" },
  { icon: ShieldIcon, t: "vm.s3t", d: "vm.s3d" },
  { icon: ListIcon, t: "vm.s4t", d: "vm.s4d" },
] as const;

const WHY = ["vm.w1", "vm.w2", "vm.w3", "vm.w4"] as const;

export default function VillaManagementPage() {
  const showcase = getFeatured(3);

  return (
    <>
      <section className="bg-sand pt-32 lg:pt-44">
        <div className="container-x pb-16 lg:pb-24">
          <Reveal>
            <p className="eyebrow mb-4 text-muted"><T k="vm.eyebrow" /></p>
            <h1 className="max-w-4xl font-display text-5xl leading-[1.02] tracking-tight lg:text-7xl">
              <T k="vm.title1" />
              <span className="italic"><T k="vm.title2" /></span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-lg text-muted"><T k="vm.sub" /></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`${SITE.whatsappCtaHref}?text=${encodeURIComponent("Hi Great Bali Villas! I own a villa and would like a free management consultation.")}`}
                target="_blank"
                rel="noopener"
                className="btn btn-dark"
              >
                <T k="vm.cta" />
              </a>
              <Link href="/contact" className="btn btn-outline-dark">
                <T k="vm.cta2" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x grid gap-3 pb-3 pt-12 sm:grid-cols-3 lg:pt-20">
          {showcase.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={p.images[0]} alt={p.name} fill sizes="33vw" quality={85} className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x py-20 lg:py-28">
          <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.06}>
                <div className="h-full bg-cream p-8">
                  <s.icon className="h-8 w-8 text-ink" />
                  <h3 className="mt-6 font-display text-xl"><T k={s.t} /></h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted"><T k={s.d} /></p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Package comparison */}
      <VmPackages />

      <section className="bg-ink text-cream">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-24">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-4xl tracking-tight lg:text-5xl"><T k="vm.why" /></h2>
            <a
              href={`${SITE.whatsappCtaHref}?text=${encodeURIComponent("Hi Great Bali Villas! I own a villa and would like a free management consultation.")}`}
              target="_blank"
              rel="noopener"
              className="btn btn-light mt-8"
            >
              <T k="vm.cta" />
            </a>
          </Reveal>
          <ul className="space-y-5 lg:col-span-7 lg:pl-12">
            {WHY.map((k, i) => (
              <Reveal key={k} delay={i * 0.06}>
                <li className="flex items-start gap-4 border-b border-cream/10 pb-5">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-cream/70" />
                  <span className="text-cream/85"><T k={k} /></span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
