import Link from "next/link";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";
import { getTypes, getAreas } from "@/lib/properties";

export function Footer() {
  const types = getTypes();
  const areas = getAreas().slice(0, 8);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-jungle text-cream/80">
      {/* CTA band */}
      <div className="container-x border-b border-cream/10 py-16 lg:py-20">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl text-cream lg:text-5xl">
              Let&apos;s find your villa.
            </h2>
            <p className="mt-4 text-cream/70">
              Tell us your dates, your group, and the vibe you&apos;re after — our Bali team replies
              within hours with handpicked options.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-cream px-7 py-3.5 font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-cream/25 px-7 py-3.5 font-medium text-cream transition-colors hover:bg-cream/10"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-x grid grid-cols-2 gap-10 py-16 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <div className="text-cream">
            <Logo />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
            {SITE.legalName} — boutique villa rental &amp; management across Bali since {SITE.since}.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
            Villa types
          </h3>
          <ul className="space-y-2.5 text-sm">
            {types.map((t) => (
              <li key={t.value}>
                <Link href={`/properties?type=${encodeURIComponent(t.value)}`} className="hover:text-gold-light">
                  {t.value}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
            Destinations
          </h3>
          <ul className="space-y-2.5 text-sm">
            {areas.map((a) => (
              <li key={a.value}>
                <Link href={`/properties?area=${encodeURIComponent(a.value)}`} className="hover:text-gold-light">
                  {a.value}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
            Company
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-gold-light">About us</Link></li>
            <li><Link href="/properties" className="hover:text-gold-light">All villas</Link></li>
            <li><Link href="/blog" className="hover:text-gold-light">Journal</Link></li>
            <li><Link href="/contact" className="hover:text-gold-light">Contact</Link></li>
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
            Get in touch
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><a href={`mailto:${SITE.email}`} className="hover:text-gold-light">{SITE.email}</a></li>
            <li><a href={SITE.phoneOfficeHref} className="hover:text-gold-light">{SITE.phoneOffice}</a></li>
            <li><a href={SITE.whatsappHref} target="_blank" rel="noopener" className="hover:text-gold-light">WhatsApp: {SITE.whatsapp}</a></li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[
              ["Instagram", SITE.social.instagram],
              ["Facebook", SITE.social.facebook],
              ["TikTok", SITE.social.tiktok],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-xs transition-colors hover:border-gold-light hover:text-gold-light"
              >
                {(label as string).slice(0, 2)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Partners marquee */}
      <div className="overflow-hidden border-y border-cream/10 py-5">
        <div className="gbv-marquee flex w-max items-center gap-12 whitespace-nowrap text-sm uppercase tracking-[0.2em] text-cream/40">
          {[...SITE.partners, ...SITE.partners, ...SITE.partners].map((p, i) => (
            <span key={i} className="flex items-center gap-12">
              {p} <span className="text-gold-light">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream/40 sm:flex-row">
        <p>© {year} {SITE.legalName}. All rights reserved.</p>
        <p>{SITE.address}</p>
      </div>
    </footer>
  );
}
