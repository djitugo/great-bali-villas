import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "bhwpyermrhoprtwgybtz.supabase.co" },
      { protocol: "https", hostname: "greatbalivillas.com" },
    ],
    formats: ["image/webp"],
  },
};

export default nextConfig;
