"use client";

import { Dropdown } from "./ui/Dropdown";
import { useCurrency } from "@/lib/currency-context";
import { useI18n } from "@/lib/i18n";

export function CurrencySwitcher() {
  const { currency, setCurrency, list } = useCurrency();
  const { t } = useI18n();

  return (
    <Dropdown
      title={t("nav.currency")}
      label={<span className="text-[11px] font-semibold uppercase tracking-[0.14em] tabular-nums">{currency}</span>}
    >
      {(close) => (
        <ul>
          {list.map((c) => (
            <li key={c}>
              <button
                onClick={() => {
                  setCurrency(c);
                  close();
                }}
                className={`w-full px-3.5 py-2.5 text-left text-sm font-medium uppercase tracking-[0.12em] transition-colors hover:bg-sand-100 ${
                  currency === c ? "text-ink" : "text-muted"
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
