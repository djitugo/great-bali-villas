"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Per-navigation transition, distinct from the first-load loader:
 * three ink columns wipe upward in a stagger to reveal the new page,
 * while the content rises in beneath them.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>
        <div className="pointer-events-none fixed inset-0 z-[150] flex">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-full flex-1 origin-top bg-ink"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{
                duration: 0.65,
                ease: [0.76, 0, 0.24, 1],
                delay: i * 0.09,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
