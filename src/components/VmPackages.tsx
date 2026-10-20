"use client";

import { Reveal } from "@/components/Reveal";
import { CheckIcon } from "@/components/icons";
import { Price } from "@/components/Price";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { VM_CONTENT } from "@/lib/vm-content";

export function VmPackages() {
  const { lang } = useI18n();
  const c = (VM_CONTENT[lang as keyof typeof VM_CONTENT] || VM_CONTENT.en).pricing;

  return (
    <section className="border-t border-ink/10 bg-sand">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow mb-4 text-muted">{c.eyebrow}</p>
          <h2 className="mb-12 font-display text-4xl tracking-tight lg:text-5xl">{c.title}</h2>
        </Reveal>

        {/* package cards */}
        <div className="grid gap-px border border-ink/10 bg-ink/10 lg:grid-cols-3">
          {c.packages.map((pkg) => {
            const dark = pkg.featured;
            return (
              <Reveal key={pkg.name}>
                <div className={`flex h-full flex-col p-8 lg:p-10 ${dark ? "bg-ink text-cream" : "bg-cream"}`}>
                  <h3 className="font-display text-2xl">{pkg.name}</h3>
                  <p className={`eyebrow mt-3 ${dark ? "text-cream/60" : "text-muted"}`}>{pkg.period}</p>
                  <div className="mt-6">
                    {pkg.fee ? (
                      <span className="font-display text-5xl">{pkg.fee}</span>
                    ) : (
                      <>
                        <span className={`block text-xs uppercase tracking-[0.14em] ${dark ? "text-cream/60" : "text-muted"}`}>{c.from}</span>
                        <Price idr={pkg.feeIdr ?? null} period="month" className="whitespace-nowrap font-display text-3xl lg:text-[2rem]" suffixClassName="text-sm" />
                      </>
                    )}
                    <p className={`mt-2 text-xs ${dark ? "text-cream/60" : "text-muted"}`}>{pkg.feeNote}</p>
                  </div>
                  <p className={`mt-6 flex-1 text-sm leading-relaxed ${dark ? "text-cream/75" : "text-muted"}`}>{pkg.best}</p>
                  <a
                    href={`${SITE.whatsappHref}?text=${encodeURIComponent(`Hi Great Bali Villas! I'm interested in the ${pkg.name} package for my villa.`)}`}
                    target="_blank"
                    rel="noopener"
                    className={`mt-8 ${dark ? "btn btn-light" : "btn btn-dark"}`}
                  >
                    {c.enquire}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* inclusions matrix */}
        <Reveal>
          <h3 className="mb-6 mt-16 font-display text-3xl tracking-tight">{c.tableTitle}</h3>
          <div className="overflow-x-auto border border-ink/10 bg-cream">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left">
                  <th className="eyebrow px-5 py-4 font-medium text-muted">{c.tableHead}</th>
                  {c.packages.map((p) => (
                    <th
                      key={p.name}
                      className={`w-[18%] px-3 py-4 text-center font-display text-base font-normal ${p.featured ? "bg-ink text-cream" : ""}`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr key={r.label} className="border-b border-ink/10 last:border-b-0">
                    <td className="px-5 py-3.5">{r.label}</td>
                    {r.on.map((on, i) => (
                      <td key={i} className={`px-3 py-3.5 text-center ${c.packages[i].featured ? "bg-ink/[0.04]" : ""}`}>
                        {on ? (
                          <>
                            <CheckIcon className="mx-auto h-4 w-4 text-ink" />
                            <span className="sr-only">yes</span>
                          </>
                        ) : (
                          <>
                            <span className="mx-auto block h-px w-3 bg-ink/25" />
                            <span className="sr-only">no</span>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">{c.exclusion}</p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">{c.requirements}</p>
        </Reveal>
      </div>
    </section>
  );
}
