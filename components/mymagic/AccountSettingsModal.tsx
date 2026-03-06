// components/mymagic/AccountSettingsModal.tsx
// ✅ Paramètres compte : Déconnexion + Suppression avec double confirmation
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X, LogOut, Trash2, AlertTriangle, ChevronRight,
  Shield, FileText, ScrollText, Lock,
} from "lucide-react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

type Tab = "compte" | "legal";

type Props = {
  onClose: () => void;
  userEmail?: string;
};

export default function AccountSettingsModal({ onClose, userEmail }: Props) {
  const router = useRouter();
  const sb     = getSupabaseBrowser();

  const [activeTab, setActiveTab] = useState<Tab>("compte");

  // États déconnexion
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut,    setLoggingOut]    = useState(false);

  // États suppression
  const [deleteStep,   setDeleteStep]   = useState<0 | 1 | 2>(0);
  const [deleteInput,  setDeleteInput]  = useState("");
  const [deleting,     setDeleting]     = useState(false);
  const [deleteError,  setDeleteError]  = useState<string | null>(null);

  // ── Déconnexion ──
  async function handleLogout() {
    if (!confirmLogout) { setConfirmLogout(true); return; }
    setLoggingOut(true);
    await sb.auth.signOut();
    router.push("/");
    onClose();
  }

  // ── Suppression ──
  async function handleDelete() {
    if (deleteInput.trim().toLowerCase() !== "supprimer") {
      setDeleteError("Tape exactement « supprimer » pour confirmer.");
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      // Appel API route pour supprimer le compte (nécessite un service role)
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression.");
      await sb.auth.signOut();
      router.push("/");
      onClose();
    } catch (err: any) {
      setDeleteError(err.message ?? "Une erreur est survenue.");
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="px-6 pt-5 pb-0">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-slate-900">Paramètres</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {userEmail && (
            <p className="text-[11px] text-slate-400 mb-4">{userEmail}</p>
          )}

          {/* Onglets */}
          <div className="flex border-b border-slate-100 -mx-6 px-6">
            {(["compte", "legal"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "compte" ? (
                  <Shield className="h-3 w-3" />
                ) : (
                  <ScrollText className="h-3 w-3" />
                )}
                {tab === "compte" ? "Mon Compte" : "Légal"}
                {activeTab === tab && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-t mc-bg-gradient" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Onglet COMPTE ── */}
        {activeTab === "compte" && (
          <div className="px-6 py-5 space-y-3">

            {/* Déconnexion */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Session</p>
              </div>
              <div className="p-4 space-y-3">
                {!confirmLogout ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-slate-500 flex-shrink-0" strokeWidth={1.8} />
                    <span className="flex-1">Se déconnecter</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </button>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm font-semibold">Confirmer la déconnexion ?</p>
                    </div>
                    <p className="text-[12px] text-amber-600">
                      Tu seras redirigé vers la page d'accueil.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmLogout(false)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
                      >
                        {loggingOut ? "Déconnexion…" : "Confirmer"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Suppression */}
            <div className="rounded-2xl border border-red-100 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-red-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">Zone dangereuse</p>
              </div>
              <div className="p-4 space-y-3">

                {deleteStep === 0 && (
                  <button
                    onClick={() => setDeleteStep(1)}
                    className="flex w-full items-center gap-3 rounded-xl border border-red-100 px-4 py-3 text-left text-sm font-semibold text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 flex-shrink-0" strokeWidth={1.8} />
                    <span className="flex-1">Supprimer mon compte</span>
                    <ChevronRight className="h-4 w-4 text-red-300" />
                  </button>
                )}

                {deleteStep === 1 && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm font-bold">Es-tu sûr(e) ?</p>
                    </div>
                    <p className="text-[12px] text-red-600 leading-relaxed">
                      Cette action est <span className="font-bold">irréversible</span>.
                      Tous tes Magic Clocks, profil et données seront définitivement supprimés.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteStep(0)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => setDeleteStep(2)}
                        className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600"
                      >
                        Je comprends
                      </button>
                    </div>
                  </div>
                )}

                {deleteStep === 2 && (
                  <div className="rounded-xl border border-red-300 bg-red-50 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <Lock className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm font-bold">Confirmation finale</p>
                    </div>
                    <p className="text-[12px] text-red-600">
                      Tape <span className="font-bold font-mono bg-red-100 px-1 rounded">supprimer</span> pour confirmer.
                    </p>
                    <input
                      type="text"
                      value={deleteInput}
                      onChange={(e) => { setDeleteInput(e.target.value); setDeleteError(null); }}
                      placeholder="supprimer"
                      className="w-full rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 placeholder:text-red-200"
                    />
                    {deleteError && (
                      <p className="text-[11px] text-red-600 font-semibold">{deleteError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setDeleteStep(0); setDeleteInput(""); setDeleteError(null); }}
                        className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting || deleteInput.trim().toLowerCase() !== "supprimer"}
                        className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {deleting ? "Suppression…" : "Supprimer définitivement"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Onglet LÉGAL ── */}
        {activeTab === "legal" && (
          <div className="px-6 py-5 space-y-2">
            {[
              { label: "CGV – Conditions générales de vente", href: "/legal/cgv", icon: FileText },
              { label: "CGU – Conditions générales d'utilisation", href: "/legal/cgu", icon: ScrollText },
              { label: "Politique de confidentialité", href: "/legal/privacy", icon: Shield },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <item.icon className="h-4 w-4 text-slate-400 flex-shrink-0" strokeWidth={1.8} />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </a>
            ))}
          </div>
        )}

        <div className="pb-8" />
      </div>
    </div>
  );
}
