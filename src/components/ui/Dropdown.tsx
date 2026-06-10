"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Desktop (lg+): anchored dropdown panel.
 * Mobile: centered modal popup with backdrop, so it never overflows the viewport.
 */
export function Dropdown({
  label,
  title,
  children,
  align = "right",
  className,
}: {
  label: React.ReactNode;
  title?: string;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-60"
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" className={cn("transition-transform", open && "rotate-180")}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-[170] bg-ink/50 lg:hidden"
            />

            {/* mobile: centered popup / desktop: anchored dropdown */}
            <div
              className={cn(
                "fixed inset-0 z-[180] flex items-center justify-center p-6",
                "pointer-events-none",
                "lg:absolute lg:inset-auto lg:top-full lg:z-50 lg:block lg:p-0",
                align === "right" ? "lg:right-0" : "lg:left-0"
              )}
            >
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "pointer-events-auto w-full max-w-xs overflow-hidden border border-ink/10 bg-cream text-ink shadow-2xl shadow-ink/20",
                  "lg:mt-3 lg:w-auto lg:min-w-[13rem] lg:max-w-none"
                )}
              >
                {title && (
                  <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 lg:hidden">
                    <span className="eyebrow text-muted">{title}</span>
                    <button onClick={close} aria-label="Close" className="text-lg leading-none">
                      &#10005;
                    </button>
                  </div>
                )}
                <div className="max-h-[60vh] overflow-y-auto p-1.5">{children(close)}</div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
