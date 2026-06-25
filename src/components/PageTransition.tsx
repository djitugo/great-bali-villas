"use client";

import { useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Per-navigation transition, distinct from the first-load loader.
 *
 * Two-phase ink curtain (mode="wait"):
 *   1. CLOSE  - the leaving page stays fully rendered (frozen) while three ink
 *               columns drop down to cover it. No fade, nothing swaps yet.
 *   2. SWAP   - once fully covered, the old page unmounts and the new one mounts
 *               underneath the closed curtain (a short hold keeps it hidden).
 *   3. REVEAL - the columns lift to uncover the already-finished new page.
 *
 * The FrozenRouter is essential: the App Router replaces `children` the instant
 * you navigate, so without freezing the router context the new page would show
 * up *before* the curtain closes. Freezing keeps the outgoing page on screen
 * until AnimatePresence unmounts it.
 *
 * Also resets scroll to the top on every route change (all viewports).
 */
const EASE = [0.76, 0, 0.24, 1] as const;
const COLS = [0, 1, 2];

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

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
              initial={{ scaleY: 1 }}
              // enter: hold a beat fully covered, then lift up to reveal (0)
              animate={{ scaleY: 0, transition: { duration: 0.5, ease: EASE, delay: 0.12 + i * 0.07 } }}
              // exit: drop straight down to close (1) over the still-solid old page
              exit={{ scaleY: 1, transition: { duration: 0.5, ease: EASE, delay: i * 0.07 } }}
            />
          ))}
        </div>

        <FrozenRouter>{children}</FrozenRouter>
      </div>
    </AnimatePresence>
  );
}
