"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NAV, SITE } from "@/lib/site";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/cn";

interface Facet {
  value: string;
  count: number;
}

export function Navbar({
  types,
  areas,
  total,
}: {
  types: Facet[];
  areas: Facet[];
  total: number;
}) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [propsOpen, setPropsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setPropsOpen(false);
  }, [pathname]);

  const onHome = pathname === "/";
  const solid = scrolled || !onHome || mobileOpen;
  const linkBase =
    "px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:opacity-60";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-all duration-500",
          solid
            ? "border-b border-ink/10 bg-sand/90 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between lg:h-[5.5rem]">
          <Link href="/" aria-label="Great Bali Villas home">
            <Logo tone={!solid && onHome ? "light" : "dark"} className="h-10 lg:h-12" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex">
            {NAV.map((item) =>
              item.dropdown ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setPropsOpen(true)}
                  onMouseLeave={() => setPropsOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      linkBase,
                      "flex items-center gap-1.5",
                      !solid && onHome ? "text-cream" : "text-ink"
                    )}
                  >
                    {t(`nav.${item.key}` as DictKey)}
                    <svg width="9" height="9" viewBox="0 0 10 10" className={cn("transition-transform", propsOpen && "rotate-180")}>
                      <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </Link>
                  <AnimatePresence>
                    {propsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-full w-[36rem] -translate-x-1/2 pt-5"
                      >
                        <div className="grid grid-cols-2 border border-ink/10 bg-cream shadow-2xl shadow-ink/10">
                          <div className="p-6">
                            <p className="eyebrow mb-4 text-muted">{t("nav.byType")}</p>
                            {types.map((t) => (
                              <Link
                                key={t.value}
                                href={`/properties?type=${encodeURIComponent(t.value)}`}
                                className="group flex items-baseline justify-between border-b border-ink/5 py-2.5 text-sm text-ink transition-colors last:border-0 hover:opacity-60"
                              >
                                <span className="font-display text-base">{t.value}</span>
                                <span className="text-xs text-muted">{t.count}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="bg-ink p-6 text-cream">
                            <p className="eyebrow mb-4 text-cream/50">{t("nav.byDest")}</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                              {areas.map((a) => (
                                <Link
                                  key={a.value}
                                  href={`/properties?area=${encodeURIComponent(a.value)}`}
                                  className="text-sm text-cream/75 transition-colors hover:text-cream"
                                >
                                  {a.value}
                                </Link>
                              ))}
                            </div>
                            <Link
                              href="/properties"
                              className="eyebrow mt-6 inline-block border-b border-cream/40 pb-1 text-cream transition-colors hover:border-cream"
                            >
                              {t("nav.allVillas", {n: total})}
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    linkBase,
                    pathname === item.href && "opacity-60",
                    !solid && onHome ? "text-cream" : "text-ink"
                  )}
                >
                  {t(`nav.${item.key}` as DictKey)}
                </Link>
              )
            )}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "hidden items-center gap-4 lg:flex",
                !solid && onHome ? "text-cream" : "text-ink"
              )}
            >
              <LanguageSwitcher />
              <span className="h-4 w-px bg-current opacity-20" />
              <CurrencySwitcher />
            </div>
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener"
              className={cn("btn hidden lg:inline-flex", !solid && onHome ? "btn-light" : "btn-dark")}
            >
              {t("nav.enquire")}
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className={cn(
                "flex h-11 w-11 items-center justify-center border transition-colors lg:hidden",
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

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} types={types} areas={areas} total={total} />
    </>
  );
}
