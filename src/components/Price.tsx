"use client";

import { useCurrency } from "@/lib/currency-context";
import { useI18n } from "@/lib/i18n";
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
  const { t } = useI18n();
  if (!idr) return <span className={className}>{t("price.onRequest")}</span>;
  // accepts both stay-length names (daily/monthly/yearly) and legacy ones (night/month)
  const per =
    period === "month" || period === "monthly"
      ? t("price.month")
      : period === "year" || period === "yearly"
        ? t("price.year")
        : t("price.night");
  return (
    <span className={className}>
      {format(idr)}
      <span className={cn("text-muted", suffixClassName)}> / {per}</span>
    </span>
  );
}
