import { BRAND } from "@/lib/constants";
export default function manifest() {
  return {
    name: BRAND.name,
    short_name: "MagicClock",
    description: BRAND.slogan,
    start_url: "/",
    display: "standalone",
    background_color: "#0f1115",
    theme_color: "#0f1115",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "maskable any" }
    ]
  };
}
