"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NAV, SITE } from "@/lib/site";
import { useI18n, type DictKey } from "@/lib/i18n";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const label = (item: (typeof NAV)[number]) => (item.key ? t(`nav.${item.key}` as DictKey) : item.label || "");

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
          className="fixed inset-0 z-[110] flex flex-col bg-sand pt-[4.5rem] xl:hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="flex flex-col">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-baseline gap-4 border-b border-ink/10 py-4"
                  >
                    <span className="eyebrow w-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-2xl lg:text-3xl">{label(item)}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-7 flex items-center justify-between border border-ink/10 bg-cream p-4">
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
