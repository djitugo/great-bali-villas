"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { CheckIcon } from "@/components/icons";

export interface Option {
  value: string;
  label: string;
}

/**
 * Fully styled replacement for a native <select>.
 * Desktop (lg+): anchored panel under the trigger.
 * Mobile: centered modal popup with backdrop (never overflows).
 */
export function Select({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

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
    <div ref={ref} className={cn("relative flex flex-col", className)}>
      <span className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-3 border bg-cream px-4 py-2.5 text-left text-sm text-ink outline-none transition-colors",
          open ? "border-ink" : "border-ink/10 hover:border-ink/30"
        )}
      >
        <span className="truncate">{current?.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")}
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[170] bg-ink/50 lg:hidden"
            />
            <div className="pointer-events-none fixed inset-0 z-[180] flex items-center justify-center p-6 lg:absolute lg:inset-auto lg:left-0 lg:right-0 lg:top-full lg:z-50 lg:block lg:p-0">
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto w-full max-w-xs overflow-hidden border border-ink/10 bg-cream shadow-2xl shadow-ink/20 lg:mt-2 lg:w-full lg:min-w-full lg:max-w-none"
              >
                <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 lg:hidden">
                  <span className="eyebrow text-muted">{label}</span>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="text-lg leading-none">
                    &#10005;
                  </button>
                </div>
                <ul className="max-h-[55vh] overflow-y-auto p-1.5 lg:max-h-72">
                  {options.map((o) => (
                    <li key={o.value}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(o.value);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-4 px-3 py-2.5 text-left text-sm transition-colors hover:bg-sand-100",
                          o.value === value && "font-semibold"
                        )}
                      >
                        <span className="truncate">{o.label}</span>
                        {o.value === value && <CheckIcon className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
