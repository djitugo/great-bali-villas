"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export function HeroSlideshow({ images, interval = 5500 }: { images: string[]; interval?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((p) => (p + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <AnimatePresence>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4, ease: "easeInOut" } }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.02 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: interval / 1000 + 1.4, ease: "linear" }}
          >
            <Image
              src={images[i]}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              quality={85}
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* slide indicators */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 lg:bottom-7">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === i ? "w-8 bg-cream" : "w-3 bg-cream/40 hover:bg-cream/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
