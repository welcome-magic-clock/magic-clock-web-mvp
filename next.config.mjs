// next.config.mjs — MISE À JOUR PERFORMANCE MAGIC CLOCK
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.magic-clock.com",      // ✅ R2 Custom Domain (PRIORITÉ)
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com", // Fallback R2 direct (avant custom domain)
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",             // Avatars Supabase Auth
      },
    ],
    formats: ["image/avif", "image/webp"],    // AVIF en premier (30% plus léger que WebP)
    deviceSizes: [390, 750, 1080, 1920],      // iPhone → Desktop
    imageSizes: [16, 32, 64, 96, 128, 256],   // Thumbnails cube
    minimumCacheTTL: 31536000,                // 1 an — immutable côté CDN
    dangerouslyAllowSVG: false,
  },

  // ── Headers de cache pour les assets statiques ──────────────────────────
  async headers() {
    return [
      {
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/api/r2/:path*",
        headers: [
          // Pas de cache sur l'API d'upload
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
