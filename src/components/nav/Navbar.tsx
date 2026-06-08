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
import { typeToSlug } from "@/lib/format";
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

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-all duration-500",
          solid
            ? "border-b border-sand-200 bg-sand/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-x flex h-[var(--h)] items-center justify-between [--h:4.5rem] lg:[--h:5.25rem]">
          <Link href="/" aria-label="Great Bali Villas home" className={cn(!solid && onHome && "text-cream")}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
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
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors hover:text-gold",
                      !solid && onHome ? "text-cream" : "text-ink"
                    )}
                  >
                    {item.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" className={cn("transition-transform", propsOpen && "rotate-180")}>
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
                        className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-4"
                      >
                        <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-2xl border border-sand-200 bg-cream p-3 shadow-2xl shadow-ink/10">
                          <div className="p-3">
                            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                              By type
                            </p>
                            {types.map((t) => (
                              <Link
                                key={t.value}
                                href={`/properties?type=${encodeURIComponent(t.value)}`}
                                className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-ink transition-colors hover:bg-sand-100"
                              >
                                <span className="group-hover:text-gold">{t.value}</span>
                                <span className="text-xs text-muted">{t.count}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="rounded-xl bg-jungle p-5 text-cream">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
                              By destination
                            </p>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                              {areas.map((a) => (
                                <Link
                                  key={a.value}
                                  href={`/properties?area=${encodeURIComponent(a.value)}`}
                                  className="text-sm text-cream/80 transition-colors hover:text-gold-light"
                                >
                                  {a.value}
                                </Link>
                              ))}
                            </div>
                            <Link
                              href="/properties"
                              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-light hover:gap-2.5 transition-all"
                            >
                              View all {total} villas →
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
                    "px-4 py-2 text-sm font-medium transition-colors hover:text-gold",
                    pathname === item.href && "text-gold",
                    !solid && onHome ? "text-cream" : "text-ink"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
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
              className="hidden rounded-full bg-jungle px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-jungle-600 lg:inline-flex"
            >
              Enquire
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden",
                solid ? "border-sand-200 text-ink" : "border-cream/30 text-cream"
              )}
            >
              <div className="flex flex-col items-center justify-center gap-[5px]">
                <span className={cn("h-[1.5px] w-5 bg-current transition-all", mobileOpen && "translate-y-[6.5px] rotate-45")} />
                <span className={cn("h-[1.5px] w-5 bg-current transition-all", mobileOpen && "opacity-0")} />
                <span className={cn("h-[1.5px] w-5 bg-current transition-all", mobileOpen && "-translate-y-[6.5px] -rotate-45")} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} types={types} areas={areas} total={total} />
    </>
  );
}
