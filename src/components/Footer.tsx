import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { getTypes, getAreas } from "@/lib/properties";
import { T } from "@/lib/i18n";

export function Footer() {
  const types = getTypes();
  const areas = getAreas().slice(0, 8);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/75">
      {/* CTA band */}
      <div className="container-x grid gap-10 border-b border-cream/10 py-16 lg:grid-cols-12 lg:items-end lg:py-24">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-5 text-cream/40"><T k="footer.eyebrow" /></p>
          <h2 className="font-display text-4xl leading-[1.05] text-cream lg:text-6xl">
            <T k="footer.t1" />
            <span className="italic"><T k="footer.t2" /></span>
            <T k="footer.t3" />
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/55">
            <T k="footer.sub" />
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
          <a href={SITE.whatsappHref} target="_blank" rel="noopener" className="btn btn-light">
            <T k="footer.wa" />
          </a>
          <Link href="/contact" className="btn btn-outline-light">
            <T k="footer.enquiry" />
          </Link>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-x grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-4 lg:grid-cols-12 lg:py-20">
        <div className="col-span-2 md:col-span-4 lg:col-span-4">
          <Image
            src="/brand/logo-light.png"
            alt="Great Bali Villas"
            width={500}
            height={200}
            className="h-14 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/50">
            <T k="footer.blurb" vars={{ legal: SITE.legalName, year: SITE.since }} />
          </p>
          <div className="mt-6 flex gap-2">
            {[
              ["IG", SITE.social.instagram, "Instagram"],
              ["FB", SITE.social.facebook, "Facebook"],
              ["TT", SITE.social.tiktok, "TikTok"],
              ["WA", SITE.social.whatsapp, "WhatsApp"],
            ].map(([label, href, name]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={name}
                className="flex h-10 w-10 items-center justify-center border border-cream/15 text-[10px] tracking-[0.1em] transition-colors hover:border-cream hover:text-cream"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="eyebrow mb-5 text-cream/40"><T k="footer.types" /></h3>
          <ul className="space-y-2.5 text-sm">
            {types.map((t) => (
              <li key={t.value}>
                <Link href={`/properties?type=${encodeURIComponent(t.value)}`} className="transition-colors hover:text-cream">
                  {t.value}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="eyebrow mb-5 text-cream/40"><T k="footer.dest" /></h3>
          <ul className="space-y-2.5 text-sm">
            {areas.map((a) => (
              <li key={a.value}>
                <Link href={`/properties?area=${encodeURIComponent(a.value)}`} className="transition-colors hover:text-cream">
                  {a.value}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="eyebrow mb-5 text-cream/40"><T k="footer.company" /></h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="transition-colors hover:text-cream"><T k="footer.about" /></Link></li>
            <li><Link href="/properties" className="transition-colors hover:text-cream"><T k="footer.all" /></Link></li>
            <li><Link href="/longterm-villa" className="transition-colors hover:text-cream"><T k="footer.longterm" /></Link></li>
            <li><Link href="/villa-management" className="transition-colors hover:text-cream"><T k="nav.management" /></Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-cream"><T k="footer.journal" /></Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-cream"><T k="footer.contact" /></Link></li>
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-2">
          <h3 className="eyebrow mb-5 text-cream/40"><T k="footer.touch" /></h3>
          <ul className="space-y-2.5 text-sm">
            <li><a href={`mailto:${SITE.email}`} className="transition-colors hover:text-cream">{SITE.email}</a></li>
            <li><a href={SITE.phoneOfficeHref} className="transition-colors hover:text-cream">{SITE.phoneOffice}</a></li>
            <li><a href={SITE.whatsappHref} target="_blank" rel="noopener" className="transition-colors hover:text-cream">WA {SITE.whatsapp}</a></li>
          </ul>
        </div>
      </div>

      {/* Partners marquee */}
      <div className="overflow-hidden border-y border-cream/10 py-5">
        <div className="gbv-marquee flex w-max items-center gap-14 whitespace-nowrap text-[11px] uppercase tracking-[0.28em] text-cream/35">
          {[...SITE.partners, ...SITE.partners, ...SITE.partners].map((p, i) => (
            <span key={i} className="flex items-center gap-14">
              {p} <span aria-hidden>&#10022;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-[11px] tracking-wide text-cream/35 sm:flex-row">
        <p>&copy; {year} {SITE.legalName}. <T k="footer.rights" /></p>
        <p>{SITE.address}</p>
      </div>
    </footer>
  );
}
