'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  UserCircle,
  Camera,
  Sparkles,
  DollarSign,
  Mail,
  Bell,
  Shield,
} from 'lucide-react';

const items = [
  { href: '/', label: 'Amazing', icon: Home },
  { href: '/meet', label: 'Meet me', icon: Users },
  { href: '/mymagic', label: 'My Magic Clock', icon: UserCircle },
  { href: '/studio', label: 'Magic Studio', icon: Camera },
  { href: '/display', label: 'Magic Display', icon: Sparkles },
  { href: '/monet', label: 'Monétisation', icon: DollarSign },
  { href: '/messages', label: 'Messages', icon: Mail },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/legal', label: 'Légal', icon: Shield },
];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 shrink-0 p-4">
      <div className="sticky top-4 space-y-2">
        <div className="text-xl font-semibold mb-3">Magic Clock — Menu</div>
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${
                active
                  ? 'bg-indigo-50 border-brand-500 text-brand-600'
                  : 'hover:bg-slate-100'
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
