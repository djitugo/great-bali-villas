"use client";

import { usePathname } from "next/navigation";

/** Hides global site chrome (header/footer) on standalone pages like the link hub. */
const BARE_PATHS = ["/greatbalivillas"];

export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE_PATHS.includes(pathname)) return null;
  return <>{children}</>;
}
