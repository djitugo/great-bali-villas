import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/lib/types";
import { Price } from "./Price";
import { BedIcon, BathIcon, PinIcon } from "./icons";

export function PropertyCard({ p, priority = false }: { p: Property; priority?: boolean }) {
  return (
    <Link href={`/properties/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand-100">
        <Image
          src={p.images[0]}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-80" />
        <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
          {p.type}
        </span>
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-cream">
          <span className="flex items-center gap-1.5 text-sm">
            <PinIcon className="h-3.5 w-3.5" />
            {p.area}
          </span>
          <span className="flex items-center gap-3 text-sm">
            {p.bedrooms ? (
              <span className="flex items-center gap-1">
                <BedIcon className="h-4 w-4" /> {p.bedrooms}
              </span>
            ) : null}
            {p.bathrooms ? (
              <span className="flex items-center gap-1">
                <BathIcon className="h-4 w-4" /> {p.bathrooms}
              </span>
            ) : null}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-muted">
          {p.name}
        </h3>
      </div>
      <p className="mt-1 text-sm">
        <span className="text-muted">from </span>
        <Price idr={p.price} period={p.period} className="font-medium text-ink" suffixClassName="text-xs" />
      </p>
    </Link>
  );
}
