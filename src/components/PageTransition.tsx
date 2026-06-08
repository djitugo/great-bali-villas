"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Distinct per-navigation transition: a gold-edged sand panel wipes up to reveal
 * the new page, while content rises in. Keyed by pathname so it fires on every route change.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>
        {/* reveal panel */}
        <motion.div
          className="pointer-events-none fixed inset-0 z-[150] origin-bottom bg-sand"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="absolute bottom-0 left-0 h-[3px] w-full bg-gold"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
