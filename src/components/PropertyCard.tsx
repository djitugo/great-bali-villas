import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/lib/types";
import { Price } from "./Price";
import { T } from "@/lib/i18n";

export function PropertyCard({
  p,
  priority = false,
  index,
}: {
  p: Property;
  priority?: boolean;
  index?: number;
}) {
  const meta = [
    p.area,
    p.bedrooms ? `${p.bedrooms} bd` : null,
    p.bathrooms ? `${p.bathrooms} ba` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link href={`/properties/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand-100">
        <Image
          src={p.cover || p.images[0]}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={85}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-0 top-0 bg-cream px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
          {p.type}
        </span>
        {typeof index === "number" && (
          <span className="absolute bottom-0 right-0 bg-ink/80 px-3 py-2 font-display text-sm text-cream backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4 border-t border-ink/10 pt-3.5">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg leading-snug text-ink transition-opacity group-hover:opacity-60">
            {p.name}
          </h3>
          <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
            {meta}
          </p>
        </div>
        <div className="shrink-0 text-right text-sm"><span className="text-[10px] uppercase tracking-[0.14em] text-muted"><T k="common.from" /> </span><Price idr={p.price} period={p.period} className="font-medium text-ink" suffixClassName="text-[10px]" /></div>
      </div>
    </Link>
  );
}
