"use client";

import { Reveal } from "@/components/Reveal";
import { CheckIcon, HomeHeartIcon, GlobeWebIcon, BellIcon, KeyIcon, WhatsappIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { VM_CONTENT } from "@/lib/vm-content";

const pad = (n: number) => String(n).padStart(2, "0");

function useVm() {
  const { lang } = useI18n();
  return VM_CONTENT[lang as keyof typeof VM_CONTENT] || VM_CONTENT.en;
}

/* ---------------- About + portfolio ---------------- */
export function VmAbout() {
  const c = useVm().about;
  return (
    <section className="bg-cream">
      <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-4 text-muted">{c.eyebrow}</p>
          <h2 className="font-display text-4xl tracking-tight lg:text-5xl">{c.title}</h2>
        </Reveal>
        <div className="space-y-6 leading-relaxed text-ink-soft lg:col-span-7">
          <Reveal>
            <p className="text-lg text-ink">{c.p1}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="eyebrow mb-4 text-muted">{c.portfolioLabel}</p>
            <ul className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
              {c.portfolio.map((x) => (
                <li key={x} className="flex items-start gap-3 bg-cream p-5 text-sm text-ink">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p>{c.p2}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p>{c.commit}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <p>{c.tailored}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Our expertise (4 pillars) ---------------- */
const EXPERTISE_ICONS = [HomeHeartIcon, GlobeWebIcon, BellIcon, KeyIcon];

export function VmExpertise() {
  const c = useVm().expertise;
  return (
    <section className="border-t border-ink/10 bg-sand">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow mb-4 text-muted">{c.eyebrow}</p>
          <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-5xl">{c.title}</h2>
        </Reveal>
        <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((it, i) => {
            const Icon = EXPERTISE_ICONS[i];
            return (
              <Reveal key={it.t} delay={i * 0.06}>
                <div className="h-full bg-cream p-8">
                  <Icon className="h-8 w-8 text-ink" />
                  <h3 className="mt-6 font-display text-2xl">{it.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{it.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why partner: radial chart around "your villa" ---------------- */
function WhyPoint({ n, t, d, side }: { n: number; t: string; d: string; side: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-4 ${side === "left" ? "lg:flex-row-reverse lg:text-right" : ""}`}>
      {/* connector toward the hub (desktop only) */}
      <span className="hidden h-px w-10 shrink-0 bg-cream/25 lg:block xl:w-16" />
      <div className="flex-1">
        <span className="font-display text-4xl text-cream/25">{pad(n)}</span>
        <h3 className="mt-1 font-display text-xl text-cream">{t}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream/65">{d}</p>
      </div>
    </div>
  );
}

export function VmWhy() {
  const c = useVm().why;
  const left = c.items.slice(0, 3);
  const right = c.items.slice(3);
  return (
    <section className="bg-ink text-cream">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow mb-4 text-cream/50">{c.eyebrow}</p>
          <h2 className="mb-14 max-w-3xl font-display text-4xl tracking-tight lg:mb-20 lg:text-5xl">{c.title}</h2>
        </Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
          <div className="order-2 space-y-10 lg:order-1 lg:space-y-14">
            {left.map((it, i) => (
              <Reveal key={it.t} delay={i * 0.08}>
                <WhyPoint n={i + 1} t={it.t} d={it.d} side="left" />
              </Reveal>
            ))}
          </div>

          {/* hub */}
          <Reveal className="order-1 mx-auto lg:order-2">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-cream/20 lg:h-72 lg:w-72">
              <div className="absolute inset-5 rounded-full border border-cream/10" />
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-cream text-center text-ink lg:h-44 lg:w-44">
                <HomeHeartIcon className="h-8 w-8" />
                <span className="mt-2 font-display text-xl leading-tight lg:text-2xl">{c.hub}</span>
              </div>
            </div>
          </Reveal>

          <div className="order-3 space-y-10 lg:space-y-14">
            {right.map((it, i) => (
              <Reveal key={it.t} delay={i * 0.08}>
                <WhyPoint n={i + 4} t={it.t} d={it.d} side="right" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Team: org chart ---------------- */
function DivisionCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="h-full bg-cream p-5">
      <h4 className="font-display text-lg leading-snug">{name}</h4>
      <p className="mt-1 text-sm text-muted">{role}</p>
    </div>
  );
}

export function VmTeam() {
  const c = useVm().team;
  return (
    <section className="border-t border-ink/10 bg-sand">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow mb-4 text-muted">{c.eyebrow}</p>
          <h2 className="font-display text-4xl tracking-tight lg:text-5xl">{c.title}</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">{c.intro}</p>
        </Reveal>

        {/* chart */}
        <div className="mt-14">
          <Reveal className="flex flex-col items-center">
            <div className="bg-ink px-8 py-4 font-display text-xl text-cream">{c.top}</div>
            <span className="h-10 w-px bg-ink/30" />
          </Reveal>

          <div className="relative grid gap-10 border-t border-ink/30 pt-0 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-8">
              <div className="flex flex-col items-center lg:items-start">
                <span className="h-8 w-px bg-ink/30 lg:ml-[25%]" />
              </div>
              <p className="eyebrow mb-4 text-muted">{c.office}</p>
              <div className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
                {c.officeDivisions.map((d) => (
                  <DivisionCard key={d.name} {...d} />
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-4">
              <div className="flex flex-col items-center">
                <span className="h-8 w-px bg-ink/30" />
              </div>
              <p className="eyebrow mb-4 text-muted">{c.site}</p>
              <div className="grid gap-px border border-ink/10 bg-ink/10">
                {c.siteDivisions.map((d) => (
                  <DivisionCard key={d.name} {...d} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Comprehensive solutions (3 services) ---------------- */
export function VmSolutions() {
  const c = useVm().solutions;
  return (
    <section className="bg-cream">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow mb-4 text-muted">{c.eyebrow}</p>
          <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-5xl">{c.title}</h2>
        </Reveal>
        <div className="border-t border-ink/10">
          {c.items.map((s, i) => (
            <Reveal key={s.title}>
              <article className="grid gap-8 border-b border-ink/10 py-12 lg:grid-cols-12 lg:py-16">
                <div className="lg:col-span-4">
                  <span className="eyebrow text-muted">{pad(i + 1)}</span>
                  <h3 className="mt-3 font-display text-3xl tracking-tight">{s.title}</h3>
                  {s.tagline && <p className="mt-3 font-display text-lg italic text-ink-soft">{s.tagline}</p>}
                </div>
                <div className="lg:col-span-8">
                  <p className="leading-relaxed text-ink-soft">{s.lead}</p>
                  <p className="eyebrow mb-4 mt-8 text-muted">{s.label}</p>
                  <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {s.items.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  {s.highlight && <p className="mt-8 border-l-2 border-ink pl-4 font-medium text-ink">{s.highlight}</p>}
                  {s.closing && <p className="mt-8 text-sm leading-relaxed text-muted">{s.closing}</p>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA band ---------------- */
export function VmCta() {
  const c = useVm().cta;
  const href = `${SITE.whatsappHref}?text=${encodeURIComponent("Hi Great Bali Villas! I'd like a free villa management consultation.")}`;
  return (
    <section className="border-y border-ink/10 bg-sand">
      <div className="container-x py-16 text-center lg:py-20">
        <Reveal>
          <h2 className="font-display text-4xl tracking-tight lg:text-5xl">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">{c.sub}</p>
          <a href={href} target="_blank" rel="noopener" className="btn btn-dark mt-8">
            <WhatsappIcon className="h-4 w-4" /> {c.button}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
