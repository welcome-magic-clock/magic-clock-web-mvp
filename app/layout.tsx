
import "./globals.css";
import LeftNav from "@/components/LeftNav";
export const metadata = { title: "Magic Clock", description: "PWA MVP" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex">
          <LeftNav />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
