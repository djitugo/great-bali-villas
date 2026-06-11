import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPostSlugs, getAllPosts, formatDate } from "@/lib/blog";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { T } from "@/lib/i18n";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: post.cover ? [post.cover] : [] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const more = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article>
      <div className="container-x pt-28 lg:pt-36">
        <Reveal>
          <Link href="/blog" className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            &larr; <T k="blog.back" />
          </Link>
          <p className="mt-6 text-sm text-muted">{formatDate(post.date)}</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl leading-tight tracking-tight lg:text-6xl">
            {post.title}
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-none">
            <Image src={post.cover} alt={post.title} fill priority sizes="100vw" className="object-cover" />
          </div>
        </Reveal>
      </div>

      <div className="container-x py-14 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-none bg-jungle p-8 text-center text-cream">
          <p className="font-display text-2xl"><T k="blog.ready" /></p>
          <p className="mt-2 text-cream/70"><T k="blog.readyBody" vars={{n: SITE.stats.villas}} /></p>
          <Link href="/properties" className="btn btn-light mt-5"><T k="blog.explore" /></Link>
        </div>
      </div>

      <section className="bg-cream">
        <div className="container-x py-16">
          <h2 className="mb-8 font-display text-3xl"><T k="blog.more" /></h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-none">
                  <Image src={p.cover} alt={p.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="mt-3 font-display text-lg leading-snug transition-colors group-hover:text-muted">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
