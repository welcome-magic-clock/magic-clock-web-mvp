import Link from "next/link";
export default function LeftNav() {
  const items = [
    { href: "/", label: "Amazing" },
    { href: "/meet", label: "Meet me" },
    { href: "/studio", label: "Studio" },
    { href: "/display", label: "Display" },
    { href: "/monet", label: "Monétisation" },
    { href: "/messages", label: "Messages" },
    { href: "/legal/cgu", label: "CGU" },
  ];
  return (
    <aside className="sticky top-0 h-screen w-48 border-r border-white/10 p-4 hidden md:block">
      <div className="font-semibold mb-3">Magic Clock</div>
      <nav className="space-y-2">
        {items.map(i => (
          <Link key={i.href} href={i.href} className="block rounded px-2 py-1 hover:bg-white/10">
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
