"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NAV, SITE } from "@/lib/site";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const onHome = pathname === "/";
  const solid = scrolled || !onHome || mobileOpen;
  const label = (item: (typeof NAV)[number]) => (item.key ? t(`nav.${item.key}` as DictKey) : item.label || "");

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-all duration-500",
          solid ? "border-b border-ink/10 bg-sand/90 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5.25rem]">
          <Link href="/" aria-label="Great Bali Villas home" className="shrink-0">
            <Logo tone={!solid && onHome ? "light" : "dark"} className="h-9 lg:h-11" />
          </Link>

          {/* Desktop nav */}
          <nav className={cn("hidden items-center xl:flex", !solid && onHome ? "text-cream" : "text-ink")}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-60",
                  pathname === item.href && "opacity-60"
                )}
              >
                {label(item)}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <div className={cn("hidden items-center gap-3 xl:flex", !solid && onHome ? "text-cream" : "text-ink")}>
              <LanguageSwitcher />
              <span className="h-4 w-px bg-current opacity-10" />
              <CurrencySwitcher />
            </div>
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener"
              className={cn("btn hidden xl:inline-flex", !solid && onHome ? "btn-light" : "btn-dark")}
            >
              {t("nav.enquire")}
            </a>

            {/* Hamburger (everything below xl) */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className={cn(
                "flex h-11 w-11 items-center justify-center border transition-colors xl:hidden",
                solid ? "border-ink/20 text-ink" : "border-cream/30 text-cream"
              )}
            >
              <div className="flex flex-col items-center justify-center gap-[5px]">
                <span className={cn("h-[1.5px] w-5 bg-current transition-all duration-300", mobileOpen && "translate-y-[6.5px] rotate-45")} />
                <span className={cn("h-[1.5px] w-5 bg-current transition-all duration-300", mobileOpen && "opacity-0")} />
                <span className={cn("h-[1.5px] w-5 bg-current transition-all duration-300", mobileOpen && "-translate-y-[6.5px] -rotate-45")} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
