"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, UserCircle, Scissors, Wallet, Scale, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Amazing", icon: Home },
  { href: "/meet", label: "Meet me", icon: Users },
  { href: "/p/creator", label: "Profil", icon: UserCircle },
  { href: "/studio", label: "Magic Studio", icon: Scissors },
  { href: "/monet", label: "Monétisation", icon: Wallet },
  { href: "/legal", label: "Légal", icon: Scale },
  { href: "/admin", label: "Back‑office", icon: Settings }, // placeholder
]

export default function LeftNav() {
  const pathname = usePathname()
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-gradient-to-b from-white to-indigo-50/30 p-3 lg:block">
      <div className="mb-3 px-2 text-lg font-extrabold bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">Magic Clock — Menu</div>
      <nav className="flex flex-col gap-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn("leftnav-link", pathname === href ? "leftnav-active" : "")}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}