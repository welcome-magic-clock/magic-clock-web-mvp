import "./globals.css";
import type { Metadata } from "next";
import LeftNav from "@/components/LeftNav";
import MobileTabs from "@/components/MobileTabs";

export const metadata: Metadata = {
  title: "Magic Clock",
  description: "PWA MVP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen flex">
          {/* Sidebar desktop */}
          <LeftNav />

          {/* Contenu principal */}
          <main className="flex-1 p-4 pb-16 md:pb-4">
            {children}
          </main>
        </div>

        {/* Onglets mobile (en bas) */}
        <MobileTabs />
      </body>
    </html>
  );
}
