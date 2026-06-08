"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WORD = "great balivillas";

export function Loader() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem("gbv-loaded");
    if (seen) return;
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem("gbv-loaded", "1");
      setShow(false);
      document.documentElement.style.overflow = "";
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-jungle text-cream"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center gap-7 px-8">
            <motion.svg
              viewBox="0 0 64 64"
              className="h-16 w-16 text-gold-light"
              initial="hidden"
              animate="visible"
            >
              <motion.path
                d="M32 55C32 55 7 40.5 7 23.5C7 14.9 13.6 9 21 9c5.1 0 9.2 2.9 11 7 1.8-4.1 5.9-7 11-7 7.4 0 14 5.9 14 14.5C57 40.5 32 55 32 55Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
                variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
              <motion.path
                d="M22 33.5 32 24l10 9.5 M26 36.5l4.5 4.5L41 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
              />
            </motion.svg>

            <div className="overflow-hidden">
              <motion.div
                className="font-display text-2xl tracking-wide"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              >
                {WORD.split("").map((c, i) => (
                  <span key={i}>{c === " " ? " " : c}</span>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="h-px w-40 origin-left bg-gold-light/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
