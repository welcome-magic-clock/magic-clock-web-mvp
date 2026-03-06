// components/mymagic/MyMagicToolbar.tsx
// ✅ REDESIGN v2 — toolbar simplifiée, actions utiles uniquement
// La navigation principale (Amazing/Meet/Créer/Monet/MyMagic) est gérée par le layout global
"use client";

import { LogOut, Trash2, AlertTriangle, CheckCircle2, MessageCircle, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowser } from "@/core/supabase/browser";

export default function MyMagicToolbar() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleLogout() {
    await getSupabaseBrowser().auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "SUPPRIMER") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur serveur");
      await getSupabaseBrowser().auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      setDeleteError("Une erreur est survenue. Réessaie.");
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Modale suppression compte — inchangée fonctionnellement */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-5">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <AlertTriangle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Supprimer mon compte</h2>
              <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                Cette action est <strong>irréversible</strong>. Toutes tes données seront supprimées définitivement.
              </p>
            </div>

            <p className="text-xs font-medium text-slate-600 mb-2">
              Tape <strong className="text-red-500">SUPPRIMER</strong> pour confirmer :
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50"
            />
            {deleteError && <p className="mt-2 text-xs text-red-500">{deleteError}</p>}

            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "SUPPRIMER" || deleting}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white disabled:opacity-30 hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              {deleting ? "Suppression..." : "Supprimer définitivement"}
            </button>

            <button
              onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
}
