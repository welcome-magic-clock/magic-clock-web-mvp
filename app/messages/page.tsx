"use client";
// app/messages/page.tsx
// ✅ v2.0 — Données réelles Supabase, zéro mock
// ✅ Architecture hybride : conversations stockées en Supabase, badges via Realtime
// ✅ Filtre recherche local, badge non-lus par conversation
// ✅ États : loading · non-connecté · vide · liste
// NOTE: Prêt pour migration Cloudflare D1 — remplacer la query Supabase
//       par un fetch('/api/conversations') pointant sur un D1 Worker

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, MessageCircle, X } from "lucide-react";
import { useAuth } from "@/core/supabase/useAuth";
import { getSupabaseBrowser } from "@/core/supabase/browser";

// ── Types ──────────────────────────────────────────────────────────────────
type Conversation = {
  id: string;
  other_user_id: string;
  other_handle: string | null;
  other_name: string | null;
  other_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
};

// ── Helpers ────────────────────────────────────────────────────────────────
const GRAD_MC = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)    return "maintenant";
  const m = Math.floor(s / 60);
  if (m < 60)    return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24)    return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7)     return `${d}j`;
  const w = Math.floor(d / 7);
  if (w < 5)     return `${w}sem`;
  return new Date(iso).toLocaleDateString("fr-CH", { day: "numeric", month: "short" });
}

function ConvAvatar({ name, avatar, size = 48 }: { name: string | null; avatar: string | null; size?: number }) {
  const initials = (name ?? "?")[0].toUpperCase();
  if (avatar) {
    return (
      <img
        src={avatar} alt={name ?? "avatar"}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div className="rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, background: GRAD_MC, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { user }  = useAuth();
  const router    = useRouter();
  const sb        = getSupabaseBrowser();
  const userId    = user?.id ?? "";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");

  // ── Chargement conversations ─────────────────────────────────────────────
  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const fetchConversations = async () => {
      // Récupère toutes les conversations où l'user est participant
      const { data: convs, error } = await sb
        .from("conversations")
        .select(`
          id,
          participant_a,
          participant_b,
          last_message,
          last_message_at,
          unread_count_a,
          unread_count_b
        `)
        .or(`participant_a.eq.${userId},participant_b.eq.${userId}`)
        .order("last_message_at", { ascending: false });

      if (error || !convs) { setLoading(false); return; }

      // Récupère les profils des interlocuteurs
      const otherIds = convs.map(c => c.participant_a === userId ? c.participant_b : c.participant_a);
      const { data: profiles } = await sb
        .from("profiles")
        .select("id,handle,display_name,avatar_url")
        .in("id", otherIds);

      const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));

      const result: Conversation[] = convs.map(c => {
        const isA       = c.participant_a === userId;
        const otherId   = isA ? c.participant_b : c.participant_a;
        const unread    = isA ? (c.unread_count_a ?? 0) : (c.unread_count_b ?? 0);
        const profile   = profileMap[otherId] ?? {};
        return {
          id:              c.id,
          other_user_id:   otherId,
          other_handle:    profile.handle   ?? null,
          other_name:      profile.display_name ?? null,
          other_avatar:    profile.avatar_url   ?? null,
          last_message:    c.last_message    ?? null,
          last_message_at: c.last_message_at ?? null,
          unread_count:    unread,
        };
      });

      setConversations(result);
      setLoading(false);
    };

    fetchConversations();

    // Realtime sur conversations (architecture hybride — messages uniquement)
    const channel = sb
      .channel("messages-page-convs")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "conversations",
        filter: `participant_a=eq.${userId}`,
      }, fetchConversations)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "conversations",
        filter: `participant_b=eq.${userId}`,
      }, fetchConversations)
      .subscribe();

    return () => { sb.removeChannel(channel); };
  }, [userId]);

  // ── Filtrage local ───────────────────────────────────────────────────────
  const filtered = conversations.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (c.other_name ?? "").toLowerCase().includes(q) ||
           (c.other_handle ?? "").toLowerCase().includes(q);
  });

  // ── États ──────────────────────────────────────────────────────────────
  if (!user && !loading) {
    return (
      <main className="mx-auto max-w-lg px-4 pt-16 text-center">
        <MessageCircle className="h-12 w-12 text-slate-200 mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-[15px] font-semibold text-slate-500 mb-2">Connecte-toi pour voir tes messages</p>
        <Link href="/login" className="inline-flex items-center gap-1 text-sm font-semibold mc-text-gradient hover:opacity-80">
          Se connecter →
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg pb-24">

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button type="button" onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors -ml-1">
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <h1 className="text-[20px] font-bold text-slate-900 flex-1">Messages</h1>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" strokeWidth={1.8} />
          <input
            type="search"
            placeholder="Rechercher une conversation…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-9 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-violet-300 focus:bg-white transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Contenu ── */}
      {loading ? (
        // Skeleton
        <div className="px-4 pt-4 space-y-1">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-3 px-2 py-3 rounded-2xl animate-pulse">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        // État vide
        <div className="flex flex-col items-center gap-3 py-20 px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
            <MessageCircle className="h-8 w-8 text-slate-200" strokeWidth={1.5} />
          </div>
          {search ? (
            <>
              <p className="text-[14px] font-semibold text-slate-500">Aucun résultat pour « {search} »</p>
              <button onClick={() => setSearch("")} className="text-xs font-semibold mc-text-gradient hover:opacity-80">Effacer la recherche</button>
            </>
          ) : (
            <>
              <p className="text-[14px] font-semibold text-slate-500">Aucun message pour l&apos;instant</p>
              <p className="text-[12px] text-slate-400">Visite le profil d&apos;un créateur pour lui envoyer un message</p>
              <Link href="/amazing" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold mc-text-gradient hover:opacity-80">
                Explorer Amazing →
              </Link>
            </>
          )}
        </div>
      ) : (
        // Liste conversations
        <ul className="px-4 pt-2 space-y-0.5">
          {filtered.map(conv => {
            const displayName   = conv.other_name ?? conv.other_handle ?? "Utilisateur";
            const displayHandle = conv.other_handle ? `@${conv.other_handle.replace(/^@/, "")}` : "";
            const href = `/messages/${conv.id}`;
            return (
              <li key={conv.id}>
                <Link href={href} className="flex items-center gap-3 px-2 py-3 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors group">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <ConvAvatar name={displayName} avatar={conv.other_avatar} size={48} />
                    {/* Point en ligne — à brancher sur un système de présence plus tard */}
                  </div>

                  {/* Texte */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-[14px] truncate ${conv.unread_count > 0 ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
                        {displayName}
                      </span>
                      <span className={`text-[11px] flex-shrink-0 ${conv.unread_count > 0 ? "font-bold" : "text-slate-400"}`}
                        style={conv.unread_count > 0 ? { color: "#7B4BF5" } : {}}>
                        {timeAgo(conv.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-[12px] truncate ${conv.unread_count > 0 ? "font-medium text-slate-700" : "text-slate-400"}`}>
                        {conv.last_message ?? "Nouvelle conversation"}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="flex-shrink-0 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
                          style={{ background: GRAD_MC }}>
                          {conv.unread_count > 99 ? "99+" : conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
