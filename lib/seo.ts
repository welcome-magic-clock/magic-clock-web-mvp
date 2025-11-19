import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: { default: BRAND.name, template: `%s · ${BRAND.name}` },
  description: `${BRAND.name} — ${BRAND.slogan}`,
  applicationName: BRAND.name,
  openGraph: {
    type: "website",
    url: "/",
    title: BRAND.name,
    description: `${BRAND.name} — ${BRAND.slogan}`,
    siteName: BRAND.name,
    images: [{ url: "/og-1200x630.png", width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};
