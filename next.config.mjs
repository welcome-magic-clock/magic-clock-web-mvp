// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.magic-clock.com", // R2 CDN public
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com", // fallback R2 direct
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // avatars Supabase Auth
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 750, 1080, 1920],
    minimumCacheTTL: 31536000, // 1 an
  },
};

export default nextConfig;
