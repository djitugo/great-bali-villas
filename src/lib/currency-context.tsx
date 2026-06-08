"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CURRENCIES, formatPrice, type CurrencyCode } from "./format";

interface Ctx {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  format: (idr: number | null) => string;
  list: CurrencyCode[];
}

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("IDR");

  useEffect(() => {
    const saved = localStorage.getItem("gbv-currency") as CurrencyCode | null;
    if (saved && saved in CURRENCIES) setCurrencyState(saved);
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem("gbv-currency", c);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format: (idr) => formatPrice(idr, currency),
        list: Object.keys(CURRENCIES) as CurrencyCode[],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
