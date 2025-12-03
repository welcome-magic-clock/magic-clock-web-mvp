// components/navigation/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  /** Où on retourne si l'historique navigateur est vide (ex: accès direct) */
  fallbackHref?: string;
  /** Petit texte à côté de la flèche (optionnel) */
  label?: string;
  /** Pour ajuster la marge selon la page */
  className?: string;
};

export default function BackButton({
  fallbackHref = "/",
  label = "Retour",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Si l'utilisateur a un historique, on fait un "vrai" retour
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // Sinon on l’emmène sur une page sûre (ex: / ou /mymagic)
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/80 shadow-sm">
        <ArrowLeft className="h-4 w-4" />
      </span>
      {/* Le texte “Retour” est caché sur mobile, visible sur desktop */}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
