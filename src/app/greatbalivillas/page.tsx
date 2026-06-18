import Image from "next/image";
import type { Metadata } from "next";
import { SITE, HERO_IMAGES } from "@/lib/site";
import {
  WhatsappIcon,
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
  LinkedinIcon,
  GlobeWebIcon,
  ArrowUpRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Links",
  description: "Connect with Great Bali Villas — WhatsApp, Instagram, Facebook, TikTok, LinkedIn and our website.",
};

const LINKS = [
  { label: "WhatsApp", sub: SITE.whatsapp, href: SITE.whatsappHref, Icon: WhatsappIcon },
  { label: "Instagram", sub: "@greatbalivillas.official", href: SITE.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", sub: "Great Bali Villas", href: SITE.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", sub: "@greatbalivillas", href: SITE.social.tiktok, Icon: TiktokIcon },
  { label: "LinkedIn", sub: SITE.legalName, href: SITE.social.linkedin, Icon: LinkedinIcon },
  { label: "Website", sub: "greatbalivillas.com", href: SITE.website, Icon: GlobeWebIcon },
];

export default function LinkHubPage() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink px-5 py-14">
      {/* ambient background */}
      <Image
        src={HERO_IMAGES[2]}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-30 blur-[2px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/75 to-ink/90" />

      <div className="relative z-10 w-full max-w-md">
        {/* brand */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Image src="/brand/logo-light.png" alt="Great Bali Villas" width={500} height={200} priority className="h-16 w-auto" />
          <p className="eyebrow mt-6 text-cream/60">Private villa rental &amp; management &middot; Bali</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/75">
            {SITE.stats.villas} handpicked villas across the island. Reach us anywhere below.
          </p>
        </div>

        {/* links */}
        <ul className="space-y-3">
          {LINKS.map(({ label, sub, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border border-cream/15 bg-cream/95 px-5 py-4 text-ink transition-all hover:-translate-y-0.5 hover:bg-cream"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold uppercase tracking-[0.16em]">{label}</span>
                  <span className="block truncate text-xs text-muted">{sub}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-[11px] tracking-wide text-cream/40">
          &copy; {new Date().getFullYear()} {SITE.legalName}
        </p>
      </div>
    </main>
  );
}
