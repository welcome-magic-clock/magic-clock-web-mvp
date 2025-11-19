import "./globals.css";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/seo";
import LeftNav from "@/components/LeftNav";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="mx-auto flex max-w-6xl">
          <LeftNav />
          <main className="flex-1 p-4">{children}</main>
        </div>
        <CookieBanner />
      </body>
    </html>
  );
}
