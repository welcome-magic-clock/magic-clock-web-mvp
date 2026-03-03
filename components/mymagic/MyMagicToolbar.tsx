// components/mymagic/MyMagicToolbar.tsx
"use client";

import {
  MessageCircle, Bell, UserRound, BarChart3,
  Sparkles, Unlock, Scale, LogOut, Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

type MyMagicTabId =
  | "messages" | "notifications" | "profile" | "cockpit"
  | "created" | "unlocked" | "legal" | "logout" | "delete";

type MyMagicTab = {
  id: MyMagicTabId;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className: string;
};

const MY_MAGIC_TABS: MyMagicTab[] = [
  { id: "messages", icon: MessageCircle, className: "from-sky-400 via-indigo-500 to-violet-500" },
  { id: "notifications", icon: Bell, className: "from-amber-400 via-orange-500 to-pink-500" },
  { id: "profile", icon: UserRound, className: "from-emerald-400 via-teal-400 to-sky-400" },
  { id: "cockpit", icon: BarChart3, className: "from-violet-500 via-purple-500 to-sky-500" },
  { id: "created", icon: Sparkles, className: "from-sky-400 via-cyan-400 to-emerald-400" },
  { id: "unlocked", icon: Unlock, className: "from-lime-400 via-emerald-400 to-teal-500" },
  { id: "legal", icon: Scale, className: "from-slate-800 via-slate-900 to-slate-950" },
  { id: "logout", icon: LogOut, className: "from-red-400 via-red-500 to-rose-600" },
  { id: "delete", icon: Trash2, className: "from-slate-600 via-slate-700 to-slate-900" },
];

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MyMagicToolbar() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      const current = window.scrollY ?? 0;
      const diff = current - lastScrollYRef.current;
      if (diff > 6 && current > 40) setVisible(false);
      if (diff < -6) setVisible(true);
      lastScrollYRef.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = async (id: MyMagicTabId) => {
    switch (id) {
      case "messages": router.push("/messages"); break;
      case "notifications": router.push("/notifications"); break;
      case "profile": scrollToSection("mymagic-profile"); break;
      case "cockpit": scrollToSection("mymagic-cockpit"); break;
      case "created": scrollToSection("mymagic-created"); break;
      case "unlocked": scrollToSection("mymagic-unlocked"); break;
      case "legal": router.push("/legal/cgu"); break;
      case "logout":
        await getSupabaseBrowser().auth.signOut();
        router.push("/");
        router.refresh();
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "SUPPRIMER") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur serveur");
      await getSupabaseBrowser().auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      setDeleteError("Une erreur est survenue. Réessaie.");
      setDeleting(false);
    }
  };

  return (
    <>
      <div className={`sticky top-0 z-40 mb-4 bg-slate-50/80 pb-3 pt-3 backdrop-blur
        transition-transform duration-300 px-4 sm:mx-0 sm:px-0 sm:bg-transparent
        ${visible ? "translate-y-0" : "-translate-y-full"}`}>
        <nav className="flex items-center gap-2 overflow-x-auto">
          {MY_MAGIC_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} type="button"
                onClick={() => handleClick(tab.id)}
                title={
                  tab.id === "logout" ? "Se déconnecter" :
                  tab.id === "delete" ? "Supprimer mon compte" : undefined
                }
                className="group flex items-center">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full
                  bg-gradient-to-br ${tab.className} shadow-sm`}>
                  <Icon className="h-4 w-4 text-white" />
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ✅ Modale confirmation suppression compte */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowDeleteModal(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h2 className="text-lg font-semibold text-slate-900">
                Supprimer mon compte
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Cette action est <strong>irréversible</strong>. Toutes tes données seront supprimées définitivement.
              </p>
            </div>

            <p className="text-xs text-slate-600 mb-2">
              Tape <strong>SUPPRIMER</strong> pour confirmer :
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />

            {deleteError && (
              <p className="mt-2 text-xs text-red-500">{deleteError}</p>
            )}

            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "SUPPRIMER" || deleting}
              className="mt-3 w-full rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white disabled:opacity-30"
            >
              {deleting ? "Suppression..." : "Supprimer définitivement"}
            </button>

            <button
              onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
              className="mt-2 w-full rounded-2xl bg-slate-100 py-3 text-sm font-medium text-slate-700"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
}
