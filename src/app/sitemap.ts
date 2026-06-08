import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/properties";
import { getPostSlugs } from "@/lib/blog";

const BASE = "https://greatbalivillas.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/properties", "/about", "/blog", "/contact"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const villas = getAllSlugs().map((slug) => ({
    url: `${BASE}/properties/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const posts = getPostSlugs().map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...villas, ...posts];
}
