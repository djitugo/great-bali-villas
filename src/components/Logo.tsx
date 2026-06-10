import Image from "next/image";
import { cn } from "@/lib/cn";

/** Official Great Bali Villas logo (original site asset). */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Image
      src={tone === "light" ? "/brand/logo-light.png" : "/brand/logo-dark.png"}
      alt="Great Bali Villas"
      width={500}
      height={200}
      priority
      className={cn("h-12 w-auto lg:h-14", className)}
    />
  );
}
