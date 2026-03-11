"use client";
// app/notifications/page.tsx
// ✅ v2 — Notifications réelles depuis Supabase · lecture automatique

import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/core/supabase/browser";
import BackButton from "@/components/navigation/BackButton";
import {
  Bell, Package, UserPlus, Star,
  Zap, Loader2, BellOff, CheckCheck,
} from "lucide-react";

const GRAD: React.CSSProperties = {
  background: "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
const GRAD_BG = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";

type NotifType = "acquisition" | "follow" | "subscription" | "system" | "earnings";

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  from_handle: string | null;
  magic_clock_id: string | null;
  read: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1)   return "À l'instant";
  if (min < 60)  return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)    return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1)   return "Hier";
  if (d < 7)     return `Il y a ${d} jours`;
  return new Date(iso).toLocaleDateString("fr-CH", { day: "numeric", month: "short" });
}

function NotifIcon({ type }: { type: NotifType }) {
  const cfg: Record<NotifType, { Icon: any; bg: string; color: string }> = {
    acquisition: { Icon: Package,  bg: "#f0fdf4", color: "#10b981" },
    follow:      { Icon: UserPlus, bg: "#f5f3ff", color: "#7B4BF5" },
    subscription:{ Icon: Star,     bg: "#fef3c7", color: "#f59e0b" },
    earnings:    { Icon: Zap,      bg: "#fff7ed", color: "#f97316" },
    system:      { Icon: Bell,     bg: "#f8fafc", color: "#64748b" },
  };
  const { Icon, bg, color } = cfg[type] ?? cfg.system;
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
      style={{ background: bg }}>
      <Icon className="h-4.5 w-4.5" style={{ color }} size={18} />
    </div>
  );
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    async function load() {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data } = await sb
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setNotifs((data ?? []) as Notif[]);

      // Marquer tout comme lu après 1.5s
      setTimeout(async () => {
        const unreadIds = (data ?? []).filter(n => !n.read).map(n => n.id);
        if (unreadIds.length > 0) {
          await sb.from("notifications").update({ read: true }).in("id", unreadIds);
          setNotifs(prev => prev.map(n => ({ ...n, read: true })));
        }
      }, 1500);

      setLoading(false);
    }
    load();
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;

  // Grouper par date
  const today = new Date(); today.setHours(0,0,0,0);
  const thisWeek = new Date(today); thisWeek.setDate(today.getDate() - 7);

  const todayNotifs   = notifs.filter(n => new Date(n.created_at) >= today);
  const weekNotifs    = notifs.filter(n => new Date(n.created_at) >= thisWeek && new Date(n.created_at) < today);
  const olderNotifs   = notifs.filter(n => new Date(n.created_at) < thisWeek);

  function NotifItem({ n }: { n: Notif }) {
    return (
      <div className="flex items-start gap-3 rounded-2xl p-3 transition-colors"
        style={{
          background: n.read ? "white" : "rgba(123,75,245,.04)",
          border: n.read ? "1px solid rgba(226,232,240,.6)" : "1px solid rgba(123,75,245,.12)",
          boxShadow: n.read ? "none" : "0 1px 8px rgba(123,75,245,.06)",
        }}>
        <NotifIcon type={n.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[12px] font-bold text-slate-800 leading-snug">{n.title}</p>
            {!n.read && (
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
                style={{ background: GRAD_BG }} />
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">{n.message}</p>
          <p className="mt-1 text-[10px] text-slate-300">{timeAgo(n.created_at)}</p>
        </div>
      </div>
    );
  }

  function Section({ label, items }: { label: string; items: Notif[] }) {
    if (items.length === 0) return null;
    return (
      <div className="mb-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="space-y-2">
          {items.map(n => <NotifItem key={n.id} n={n} />)}
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-lg pb-24 pt-0">

      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{ background: "rgba(248,250,252,0.95)", backdropFilter: "blur(12px)" }}>
        <BackButton />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-[15px] font-bold text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ background: GRAD_BG }}>{unreadCount}</span>
          )}
        </div>
        {notifs.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <CheckCheck className="h-3 w-3" />Lu
          </span>
        )}
      </div>

      <div className="px-4 pt-2">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : !userId ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <BellOff className="h-10 w-10 text-slate-200" />
            <p className="text-[13px] text-slate-400">Connecte-toi pour voir tes notifications</p>
          </div>
        ) : notifs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
              <Bell className="h-7 w-7 text-slate-200" />
            </div>
            <p className="text-[13px] font-semibold text-slate-400">Aucune notification pour l&apos;instant</p>
            <p className="text-[11px] text-slate-300">Elles apparaîtront ici dès qu&apos;un créateur interagit avec toi</p>
          </div>
        ) : (
          <>
            <Section label="Aujourd'hui"    items={todayNotifs} />
            <Section label="Cette semaine"  items={weekNotifs} />
            <Section label="Plus ancien"    items={olderNotifs} />
          </>
        )}
      </div>
    </main>
  );
}
