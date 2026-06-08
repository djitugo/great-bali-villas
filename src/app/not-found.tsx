import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-sand pt-32">
      <div className="container-x text-center">
        <p className="font-display text-7xl text-ink lg:text-9xl">404</p>
        <h1 className="mt-4 font-display text-3xl tracking-tight">This page slipped away.</h1>
        <p className="mt-3 text-muted">The villa or page you&apos;re looking for isn&apos;t here.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-ink px-7 py-3.5 font-medium text-cream">
            Back home
          </Link>
          <Link href="/properties" className="rounded-full border border-sand-300 px-7 py-3.5 font-medium hover:bg-cream">
            Browse villas
          </Link>
        </div>
      </div>
    </section>
  );
}
