import posts from "@/data/blog.json";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  body: string[];
}

const ALL = (posts as BlogPost[]).slice().sort((a, b) => b.date.localeCompare(a.date));

export const getAllPosts = () => ALL;
export const getPostBySlug = (slug: string) => ALL.find((p) => p.slug === slug);
export const getPostSlugs = () => ALL.map((p) => p.slug);

export function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return d;
  }
}
