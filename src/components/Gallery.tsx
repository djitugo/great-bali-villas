"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const main = images[0];
  const rest = images.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl lg:gap-3" style={{ aspectRatio: "16/9" }}>
        <button
          onClick={() => openAt(0)}
          className="group relative col-span-4 row-span-2 lg:col-span-2"
        >
          <Image src={main} alt={name} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </button>
        {rest.map((img, i) => (
          <button
            key={img}
            onClick={() => openAt(i + 1)}
            className="group relative hidden lg:block"
          >
            <Image src={img} alt={`${name} ${i + 2}`} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            {i === rest.length - 1 && images.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-sm font-medium text-cream">
                +{images.length - 5} photos
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => openAt(0)}
        className="mt-3 text-sm font-medium underline underline-offset-4 lg:hidden"
      >
        View all {images.length} photos
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col bg-ink/95 backdrop-blur"
          >
            <div className="flex items-center justify-between px-5 py-4 text-cream">
              <span className="text-sm tabular-nums">
                {index + 1} / {images.length}
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-2xl leading-none">
                ✕
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
              <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
              >
                ‹
              </button>
              <div className="relative h-full w-full max-w-5xl">
                <Image src={images[index]} alt={`${name} ${index + 1}`} fill sizes="100vw" className="object-contain" />
              </div>
              <button
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20"
              >
                ›
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
