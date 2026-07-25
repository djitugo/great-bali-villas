import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images are already compressed to WebP on our Supabase CDN, so we skip
    // Vercel's Image Optimization (avoids the optimizer quota / 402 errors).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "bhwpyermrhoprtwgybtz.supabase.co" },
      { protocol: "https", hostname: "greatbalivillas.com" },
      // Airbnb's own image CDN — villa photos are served straight from here.
      { protocol: "https", hostname: "a0.muscache.com" },
    ],
  },
};

export default nextConfig;
