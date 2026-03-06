import "./globals.css";
import type { Metadata } from "next";
import LeftNav from "@/components/LeftNav";
import MobileTabs from "@/components/MobileTabs";
import { CookieBanner } from "@/components/legal/CookieBanner";

export const metadata: Metadata = {
  title: "Magic Clock® – It’s time to smile!",
  description:
    "Magic Clock®, la plateforme pour partager tes techniques et faire grandir tes projets.",
  icons: {
    icon: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen flex">
          <LeftNav />

          <main className="flex-1 p-4 pb-16 md:pb-4">
            {children}
          </main>
        </div>

        <MobileTabs />
        <CookieBanner />
      </body>
    </html>
  );
}
