"use client";

import { useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Per-navigation transition, distinct from the first-load loader.
 *
 * Sequence (mode="wait"):
 *   1. CLOSE   - the leaving page stays fully rendered (frozen) while three ink
 *                columns drop down to cover it. No fade, nothing swaps yet.
 *   2. SWAP    - once covered, the old page unmounts and the new one mounts
 *                underneath the closed curtain.
 *   3. SCROLL  - the new page resets to the top instantly while still hidden.
 *   4. REVEAL  - the columns lift to uncover the already-finished new page.
 *
 * FrozenRouter keeps the outgoing page on screen during CLOSE: the App Router
 * swaps `children` the instant you navigate, so without freezing the new page
 * would appear before the curtain closes. The freeze is only applied while the
 * subtree is *exiting* (useIsPresent === false); while present we keep the
 * router context live so same-page updates like the villa filter (searchParams)
 * still work.
 */
const EASE = [0.76, 0, 0.24, 1] as const;
const COLS = [0, 1, 2];

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const isPresent = useIsPresent();
  const frozen = useRef(context);
  // While the page is on screen, keep the router context live (filters, search
  // params, etc.). Only stop updating it once the page starts exiting, so the
  // outgoing content stays put behind the closing curtain.
  if (isPresent) frozen.current = context;
  return (
    <LayoutRouterContext.Provider value={frozen.current}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

// Mounts only once the new page is in place (after the curtain has closed),
// so the jump-to-top happens while fully hidden, never on the visible old page.
function ScrollReset() {
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, []);
  return null;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
              animate={{ scaleY: 0, transition: { duration: 0.5, ease: EASE, delay: 0.18 + i * 0.07 } }}
              // exit: drop straight down to close (1) over the still-solid old page
              exit={{ scaleY: 1, transition: { duration: 0.5, ease: EASE, delay: i * 0.07 } }}
            />
          ))}

          {/* White wordmark centred on the black screen: fades in as the curtain
              closes, holds across the swap, fades out as the curtain reveals. */}
          <motion.img
            src="/brand/logo-light.png"
            alt=""
            aria-hidden
            className="absolute left-1/2 top-1/2 h-12 w-auto -translate-x-1/2 -translate-y-1/2 lg:h-16"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -10, transition: { duration: 0.45, ease: EASE, delay: 0.12 } }}
            exit={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.22 } }}
          />
        </div>

        <ScrollReset />
        <FrozenRouter>{children}</FrozenRouter>
      </div>
    </AnimatePresence>
  );
}
