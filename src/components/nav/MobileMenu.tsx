"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NAV, SITE } from "@/lib/site";
import { useI18n, type DictKey } from "@/lib/i18n";

interface Facet {
  value: string;
  count: number;
}

export function MobileMenu({
  open,
  onClose,
  types,
  areas,
  total,
}: {
  open: boolean;
  onClose: () => void;
  types: Facet[];
  areas: Facet[];
  total: number;
}) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[110] flex flex-col bg-sand pt-[4.5rem] lg:hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <nav className="flex flex-col">
              {NAV.map((item, i) =>
                item.dropdown ? (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    className="border-b border-ink/10"
                  >
                    <button
                      onClick={() => setExpanded((v) => !v)}
                      className="flex w-full items-baseline justify-between py-5 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="eyebrow text-muted">0{i + 1}</span>
                        <span className="font-display text-3xl">{t(`nav.${item.key}` as DictKey)}</span>
                      </span>
                      <svg width="16" height="16" viewBox="0 0 10 10" className={`transition-transform duration-300 ${expanded ? "rotate-45" : ""}`}>
                        <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-px border border-ink/10 bg-ink/10">
                            {types.map((t) => (
                              <Link
                                key={t.value}
                                href={`/properties?type=${encodeURIComponent(t.value)}`}
                                onClick={onClose}
                                className="flex items-baseline justify-between bg-cream px-3.5 py-3 text-sm"
                              >
                                {t.value}
                                <span className="text-xs text-muted">{t.count}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2 py-5">
                            {areas.map((a) => (
                              <Link
                                key={a.value}
                                href={`/properties?area=${encodeURIComponent(a.value)}`}
                                onClick={onClose}
                                className="border border-ink/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]"
                              >
                                {a.value}
                              </Link>
                            ))}
                          </div>
                          <div className="mb-4 flex flex-col gap-2.5 border-t border-ink/10 pt-4">
                            <Link href="/properties" onClick={onClose} className="text-sm">
                              {t("nav.holiday")}
                            </Link>
                            <Link href="/longterm-villa" onClick={onClose} className="text-sm">
                              {t("nav.longterm")}
                            </Link>
                            <Link href="/villa-management" onClick={onClose} className="text-sm">
                              {t("nav.management")}
                            </Link>
                          </div>
                          <Link
                            href="/properties"
                            onClick={onClose}
                            className="eyebrow mb-6 inline-block border-b border-ink pb-1"
                          >
                            {t("nav.allVillas", {n: total})}
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-baseline gap-4 border-b border-ink/10 py-5"
                    >
                      <span className="eyebrow text-muted">0{i + 1}</span>
                      <span className="font-display text-3xl">{t(`nav.${item.key}` as DictKey)}</span>
                    </Link>
                  </motion.div>
                )
              )}
            </nav>

            <div className="mt-8 flex items-center justify-between border border-ink/10 bg-cream p-4">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </div>

          <div className="border-t border-ink/10 bg-ink px-6 py-5">
            <a href={SITE.whatsappHref} target="_blank" rel="noopener" className="btn btn-light w-full">
              {t("nav.enquireWa")}
            </a>
            <p className="mt-3 text-center text-xs tracking-wide text-cream/50">{SITE.phoneOffice}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
