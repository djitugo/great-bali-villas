import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, formatDate } from "@/lib/blog";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Bali travel guides, local gems, beaches, beach clubs, cafés and where to stay — from the Great Bali Villas team.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;

  return (
    <section className="bg-sand pt-32 lg:pt-44">
      <div className="container-x pb-20 lg:pb-28">
        <Reveal>
          <p className="mb-4 text-sm uppercase tracking-[0.22em] text-muted">Journal</p>
          <h1 className="max-w-3xl font-display text-5xl tracking-tight lg:text-7xl">
            Bali, by the people who live here.
          </h1>
        </Reveal>

        {lead && (
          <Reveal delay={0.1}>
            <Link href={`/blog/${lead.slug}`} className="group mt-14 grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <Image src={lead.cover} alt={lead.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div>
                <p className="text-sm text-muted">{formatDate(lead.date)}</p>
                <h2 className="mt-3 font-display text-3xl tracking-tight transition-colors group-hover:text-muted lg:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-4 line-clamp-3 text-muted">{lead.excerpt}</p>
                <span className="mt-5 inline-block text-sm font-medium underline underline-offset-4">Read article</span>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.06}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={post.cover} alt={post.title} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-4 text-sm text-muted">{formatDate(post.date)}</p>
                <h3 className="mt-1.5 font-display text-xl leading-snug transition-colors group-hover:text-muted">{post.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
