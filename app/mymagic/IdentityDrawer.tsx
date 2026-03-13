"use client";
// app/mymagic/IdentityDrawer.tsx
// ✅ v1.0 — Bottom sheet animé, contient ProfileSection complète
// ✅ Fermeture : Escape · clic backdrop · bouton X
// ✅ Scroll body bloqué à l'ouverture
// ✅ Fermeture auto 1.2s après sauvegarde réussie

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ProfileSection from "@/components/mymagic/ProfileSection";

type IdentityDrawerProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  mcFollowers: number | null;
  initialProfile: {
    handle: string;
    display_name: string;
    avatar_url: string | null;
  };
  onProfileUpdated: (u: {
    handle: string;
    display_name: string;
    avatar_url: string | null;
    totalFollowers?: number;
  }) => void;
};

export default function IdentityDrawer({
  open,
  onClose,
  userId,
  userEmail,
  mcFollowers,
  initialProfile,
  onProfileUpdated,
}: IdentityDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // ── Blocage scroll body ──────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── Fermeture Escape ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Fermeture auto après sauvegarde réussie ───────────────────────────────
  const handleProfileUpdated = (u: { handle: string; display_name: string; avatar_url: string | null; totalFollowers?: number }) => {
    onProfileUpdated(u);
    setTimeout(() => onClose(), 1200);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Modifier mon identité"
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg"
        style={{
          animation: "identityDrawerSlideUp 0.28s cubic-bezier(0.32,0.72,0,1) both",
          maxHeight: "92dvh",
          borderRadius: "24px 24px 0 0",
          background: "#fff",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Handle + Header ── sticky */}
        <div className="flex-shrink-0 pt-3 pb-2 px-5 border-b border-slate-100">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-slate-900">Mon identité</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
          <ProfileSection
            userId={userId}
            userEmail={userEmail}
            mcFollowers={mcFollowers}
            initialProfile={initialProfile}
            onProfileUpdated={handleProfileUpdated}
          />
          {/* Espace bas pour iOS home indicator */}
          <div className="h-8" />
        </div>
      </div>

      {/* Animation keyframe injectée inline */}
      <style>{`
        @keyframes identityDrawerSlideUp {
          from { transform: translateY(100%); opacity: 0.6; }
          to   { transform: translateY(0);    opacity: 1;   }
        }
      `}</style>
    </>
  );
}
