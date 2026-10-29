import Link from "next/link";
import Image from "next/image";
import type { Property, RateKind } from "@/lib/types";
import { rateOf } from "@/lib/rates";
import { Price } from "./Price";
import { T } from "@/lib/i18n";
import { PinIcon, BedIcon, BathIcon } from "./icons";

export function PropertyCard({
  p,
  priority = false,
  rate,
}: {
  p: Property;
  priority?: boolean;
  /** stay length picked in the collection filter; defaults to the shortest the villa offers */
  rate?: RateKind;
}) {
  const r = rateOf(p, rate);
  return (
    <Link href={`/properties/${p.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden bg-sand-100">
        <Image
          src={p.cover || p.images[0]}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={80}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-0 top-0 flex items-center gap-1.5 bg-cream px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
          <PinIcon className="h-3 w-3" />
          {p.area}
        </span>
      </div>

      <div className="mt-4 border-t border-ink/10 pt-3.5">
        {/* name */}
        <h3 className="font-display text-lg leading-snug text-ink transition-opacity group-hover:opacity-60">
          {p.name}
        </h3>

        {/* price */}
        <p className="mt-1.5 text-sm">
          {r && <span className="text-[10px] uppercase tracking-[0.14em] text-muted"><T k="common.from" /> </span>}
          <Price idr={r?.amount ?? null} period={r?.kind} className="font-medium text-ink" suffixClassName="text-[10px]" />
        </p>

        {/* beds + baths (location sits on the photo tag) */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          {p.bedrooms ? (
            <span className="flex items-center gap-1.5">
              <BedIcon className="h-3.5 w-3.5" />
              {p.bedrooms} <T k={p.bedrooms > 1 ? "card.beds" : "card.bed"} />
            </span>
          ) : null}
          {p.bathrooms ? (
            <span className="flex items-center gap-1.5">
              <BathIcon className="h-3.5 w-3.5" />
              {p.bathrooms} <T k={p.bathrooms > 1 ? "card.baths" : "card.bath"} />
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
