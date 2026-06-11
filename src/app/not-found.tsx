import Link from "next/link";
import { T } from "@/lib/i18n";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-sand pt-32">
      <div className="container-x text-center">
        <p className="font-display text-7xl text-ink lg:text-9xl">404</p>
        <h1 className="mt-4 font-display text-3xl tracking-tight"><T k="nf.title" /></h1>
        <p className="mt-3 text-muted"><T k="nf.sub" /></p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-dark"><T k="nf.home" /></Link>
          <Link href="/properties" className="btn btn-outline-dark"><T k="nf.browse" /></Link>
        </div>
      </div>
    </section>
  );
}
