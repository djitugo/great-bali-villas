import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getFeatured } from "@/lib/properties";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";
import {
  SparkleIcon,
  CalendarIcon,
  GlobeWebIcon,
  ChatIcon,
  KeyIcon,
  TagIcon,
  ListIcon,
  ShieldIcon,
  CheckIcon,
} from "@/components/icons";
import { VmPackages } from "@/components/VmPackages";
import { VmOwnerForm } from "@/components/VmOwnerForm";

export const metadata: Metadata = {
  title: "Villa Management",
  description:
    "End-to-end villa management in Bali since 2014: marketing, OTA distribution, bookings, guest care and maintenance with full financial transparency.",
};

const SERVICES = [
  { icon: SparkleIcon, t: "vm.s1t", d: "vm.s1d" },
  { icon: CalendarIcon, t: "vm.s2t", d: "vm.s2d" },
  { icon: GlobeWebIcon, t: "vm.s3t", d: "vm.s3d" },
  { icon: ChatIcon, t: "vm.s4t", d: "vm.s4d" },
  { icon: KeyIcon, t: "vm.s5t", d: "vm.s5d" },
  { icon: TagIcon, t: "vm.s6t", d: "vm.s6d" },
  { icon: ListIcon, t: "vm.s7t", d: "vm.s7d" },
  { icon: ShieldIcon, t: "vm.s8t", d: "vm.s8d" },
] as const;

const BENEFITS = [
  { t: "vm.b1t", d: "vm.b1d" },
  { t: "vm.b2t", d: "vm.b2d" },
  { t: "vm.b3t", d: "vm.b3d" },
  { t: "vm.b4t", d: "vm.b4d" },
  { t: "vm.b5t", d: "vm.b5d" },
  { t: "vm.b6t", d: "vm.b6d" },
  { t: "vm.b7t", d: "vm.b7d" },
] as const;

const STEPS = [
  { t: "vm.st1t", d: "vm.st1d" },
  { t: "vm.st2t", d: "vm.st2d" },
  { t: "vm.st3t", d: "vm.st3d" },
  { t: "vm.st4t", d: "vm.st4d" },
] as const;

const WHY = ["vm.w1", "vm.w2", "vm.w3", "vm.w4"] as const;

const pad = (n: number) => String(n).padStart(2, "0");

export default function VillaManagementPage() {
  const showcase = getFeatured(3);

  return (
    <>
      {/* ============ HERO ============ */}
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
              <Link href="#join" className="btn btn-outline-dark">
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

      {/* ============ WHY CHOOSE US ============ */}
      <section className="bg-cream">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow mb-4 text-muted"><T k="vm.whyEyebrow" /></p>
              <h2 className="font-display text-4xl tracking-tight lg:text-5xl"><T k="vm.whyTitle" /></h2>
              <p className="mt-6 leading-relaxed text-muted"><T k="vm.whyIntro" /></p>
            </div>
          </Reveal>
          <ol className="border-t border-ink/10 lg:col-span-7">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.t} delay={i * 0.04}>
                <li className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ink/10 py-6 lg:py-7">
                  <span className="eyebrow pt-1.5 text-muted">{pad(i + 1)}</span>
                  <div>
                    <h3 className="font-display text-2xl"><T k={b.t} /></h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted"><T k={b.d} /></p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section className="border-t border-ink/10 bg-sand">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4 text-muted"><T k="vm.svcEyebrow" /></p>
            <h2 className="mb-12 max-w-2xl font-display text-4xl tracking-tight lg:text-5xl"><T k="vm.svcTitle" /></h2>
          </Reveal>
          <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.t} delay={(i % 4) * 0.06}>
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

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-cream">
        <div className="container-x py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4 text-muted"><T k="vm.stepsEyebrow" /></p>
            <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-5xl"><T k="vm.stepsTitle" /></h2>
          </Reveal>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08}>
                <li className="border-t border-ink pt-6">
                  <span className="font-display text-5xl text-ink/20">{pad(i + 1)}</span>
                  <h3 className="mt-4 font-display text-xl"><T k={s.t} /></h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted"><T k={s.d} /></p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ PACKAGES ============ */}
      <VmPackages />

      {/* ============ JOIN / OWNER FORM ============ */}
      <section id="join" className="scroll-mt-24 bg-ink text-cream">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-4xl tracking-tight lg:text-5xl"><T k="vm.formTitle" /></h2>
            <p className="mt-5 text-cream/70"><T k="vm.formSub" /></p>
            <ul className="mt-10 space-y-4">
              {WHY.map((k) => (
                <li key={k} className="flex items-start gap-3 border-b border-cream/10 pb-4">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-cream/70" />
                  <span className="text-sm text-cream/85"><T k={k} /></span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <VmOwnerForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
