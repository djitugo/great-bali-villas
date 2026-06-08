"use client";

import { useCurrency } from "@/lib/currency-context";
import { cn } from "@/lib/cn";

export function Price({
  idr,
  period,
  className,
  suffixClassName,
}: {
  idr: number | null;
  period?: string | null;
  className?: string;
  suffixClassName?: string;
}) {
  const { format } = useCurrency();
  if (!idr) return <span className={className}>On request</span>;
  return (
    <span className={cn("notranslate", className)}>
      {format(idr)}
      <span className={cn("text-muted", suffixClassName)}> / {period || "night"}</span>
    </span>
  );
}
