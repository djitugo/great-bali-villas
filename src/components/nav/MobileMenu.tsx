"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NAV, SITE } from "@/lib/site";

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
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    className="border-b border-sand-200"
                  >
                    <button
                      onClick={() => setExpanded((v) => !v)}
                      className="flex w-full items-center justify-between py-4 text-left font-display text-3xl"
                    >
                      {item.label}
                      <svg width="18" height="18" viewBox="0 0 10 10" className={`transition-transform ${expanded ? "rotate-45" : ""}`}>
                        <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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
                          <div className="grid grid-cols-2 gap-2 pb-5">
                            {types.map((t) => (
                              <Link
                                key={t.value}
                                href={`/properties?type=${encodeURIComponent(t.value)}`}
                                onClick={onClose}
                                className="flex items-center justify-between rounded-lg bg-cream px-3 py-2.5 text-sm"
                              >
                                {t.value}
                                <span className="text-xs text-muted">{t.count}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2 pb-5">
                            {areas.map((a) => (
                              <Link
                                key={a.value}
                                href={`/properties?area=${encodeURIComponent(a.value)}`}
                                onClick={onClose}
                                className="rounded-full border border-sand-300 px-3 py-1.5 text-xs"
                              >
                                {a.value}
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/properties"
                            onClick={onClose}
                            className="mb-5 inline-block text-sm font-medium text-gold"
                          >
                            View all {total} villas →
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block border-b border-sand-200 py-4 font-display text-3xl"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              )}
            </nav>

            <div className="mt-8 flex items-center justify-between rounded-2xl bg-cream p-4">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </div>

          <div className="border-t border-sand-200 bg-cream px-6 py-5">
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener"
              className="flex w-full items-center justify-center rounded-full bg-jungle py-4 font-medium text-cream"
            >
              Enquire on WhatsApp
            </a>
            <p className="mt-3 text-center text-sm text-muted">{SITE.phoneOffice}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
