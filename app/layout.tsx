import "./globals.css"
import LeftNav from "@/components/LeftNav"

export const metadata = {
  title: "Magic Clock",
  description: "MVP — Amazing / Meet me / Studio / Monétisation",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
          <LeftNav />
          <div className="min-h-screen">{children}</div>
        </div>
      </body>
    </html>
  )
}