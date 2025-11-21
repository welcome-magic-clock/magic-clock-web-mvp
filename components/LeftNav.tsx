'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Camera, Sparkles, DollarSign, Mail, Bell, Shield } from 'lucide-react';

const items = [
  { href: '/', label: 'Amazing', icon: Home },
  { href: '/meet', label: 'Meet me', icon: Users },
  { href: '/mymagic', label: 'My Magic Clock', icon: Sparkles },
  { href: '/create', label: 'Créer', icon: Camera },
  { href: '/monet', label: 'Monétisation', icon: DollarSign },
  { href: '/messages', label: 'Messages', icon: Mail },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/legal', label: 'Légal', icon: Shield },
];

export default function LeftNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:block w-64 border-r border-slate-200 bg-white/70 backdrop-blur">
      <div className="p-4 space-y-2">
        <div className="text-xl font-semibold mb-3">Magic Clock — Menu</div>
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm border transition ${
                active
                  ? 'bg-indigo-50 border-brand-500 text-brand-600'
                  : 'border-transparent hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
