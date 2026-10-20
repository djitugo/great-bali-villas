import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPropertyBySlug } from "@/lib/properties";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";
import { CheckIcon } from "@/components/icons";
import { VmAbout, VmExpertise, VmWhy, VmTeam, VmSolutions, VmCta } from "@/components/VmSections";
import { VmPackages } from "@/components/VmPackages";
import { VmOwnerForm } from "@/components/VmOwnerForm";

export const metadata: Metadata = {
  title: "Villa Management",
  description:
    "Full-service villa management and marketing in Bali since 2014: operations, OTA marketing, guest care, property care and transparent owner reporting.",
};

const STEPS = [
  { t: "vm.st1t", d: "vm.st1d" },
  { t: "vm.st2t", d: "vm.st2d" },
  { t: "vm.st3t", d: "vm.st3d" },
  { t: "vm.st4t", d: "vm.st4d" },
] as const;

const WHY = ["vm.w1", "vm.w2", "vm.w3", "vm.w4"] as const;

const pad = (n: number) => String(n).padStart(2, "0");

// Hand-picked strongest shots in the catalogue (ocean cliff, jungle infinity pool,
// dusk architecture). To be replaced by GBV's own photo set once shared.
const SHOWCASE = [
  "home-in-south-kuta-7-bedrooms-9-beds-10-private-baths-206445",
  "home-in-kecamatan-ubud-3-bedrooms-3-beds-3-shared-baths-777157",
  "home-in-blahbatuh-5-bedrooms-5-beds-5-shared-baths-355082",
];

export default function VillaManagementPage() {
  const showcase = SHOWCASE.map((slug) => getPropertyBySlug(slug)).filter((p) => p !== undefined);

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
              <Link href="#join" className="btn btn-dark">
                <T k="vm.cta" />
              </Link>
              <a
                href={`${SITE.whatsappHref}?text=${encodeURIComponent("Hi Great Bali Villas! I own a villa and would like a free management consultation.")}`}
                target="_blank"
                rel="noopener"
                className="btn btn-outline-dark"
              >
                <T k="vm.cta2" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ABOUT + PORTFOLIO ============ */}
      <VmAbout />

      {/* ============ PHOTOS ============ */}
      <section className="bg-cream">
        <div className="container-x grid gap-3 pb-20 sm:grid-cols-3 lg:pb-28">
          {showcase.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link href={`/properties/${p.slug}`} className="group relative block aspect-[4/3] overflow-hidden">
                <Image
                  src={p.cover || p.images[0]}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  quality={85}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <VmExpertise />
      <VmWhy />
      <VmTeam />
      <VmSolutions />
      <VmCta />
      <VmPackages />

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
