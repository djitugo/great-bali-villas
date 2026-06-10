import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "bhwpyermrhoprtwgybtz.supabase.co" },
      { protocol: "https", hostname: "greatbalivillas.com" },
    ],
    formats: ["image/webp"],
    qualities: [75, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
  },
};

export default nextConfig;
