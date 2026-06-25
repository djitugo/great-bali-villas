"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Per-navigation transition, distinct from the first-load loader.
 * Two-phase ink curtain (mode="wait"): on the way OUT the three columns
 * drop down to close over the leaving page, then on the way IN they lift
 * up to reveal the new page — so there is no sudden full-screen blackout.
 * Also resets scroll to the top on every route change (all viewports).
 */
const EASE = [0.76, 0, 0.24, 1] as const;
const COLS = [0, 1, 2];

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <div key={pathname}>
        <div className="pointer-events-none fixed inset-0 z-[150] flex">
          {COLS.map((i) => (
            <motion.div
              key={i}
              className="h-full flex-1 origin-top bg-ink"
              // closed (1) -> reveal up (0) on enter; drop down to close (1) on exit
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              exit={{ scaleY: 1 }}
              transition={{
                duration: 0.5,
                ease: EASE,
                // reveal staggers L->R, close staggers R->L for a sweeping feel
                delay: i * 0.07,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
