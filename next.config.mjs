// next.config.mjs — v4.0 SECURITY + PERFORMANCE MAGIC CLOCK
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.magic-clock.com" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 750, 1080, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: false,
  },

  async headers() {
    return [
      // ── Security headers — toutes les pages ──────────────────────────
      {
        source: "/(.*)",
        headers: [
          // Anti-clickjacking — empêche magic-clock.com d'être intégré dans une iframe
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Anti-sniffing — le navigateur respecte le Content-Type déclaré
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer — envoie uniquement l'origine, pas l'URL complète
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions — désactive les APIs sensibles non utilisées
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
          // XSS Protection — legacy mais utile pour vieux navigateurs
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // HSTS — force HTTPS pour 1 an
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      // ── Cache assets statiques — immutable 1 an ──────────────────────
      {
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // ── API uploads — jamais en cache ────────────────────────────────
      {
        source: "/api/r2/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      // ── API feed — cache court côté CDN ─────────────────────────────
      {
        source: "/api/feed/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=30, stale-while-revalidate=60" },
        ],
      },
    ]
  },
}

export default nextConfig
