// components/legal/ResultDisclaimerGate.tsx
"use client";

import { useEffect, useState } from "react";

type ResultDisclaimerGateProps = {
  /** Mode d’accès au Display : FREE / ABONNEMENT / PPV */
  mode: "FREE" | "SUB" | "PPV";
  /** Callback déclenché une fois le consentement donné ET l’accès autorisé */
  onUnlock: () => void;
  /** Optionnel : contenu du bouton qui lance le déblocage (par ex. "Débloquer le Display") */
  triggerLabel?: string;
};

const STORAGE_KEY = "mc-result-disclaimer-accepted-v1";

export function ResultDisclaimerGate({
  mode,
  onUnlock,
  triggerLabel = "Accéder au Display",
}: ResultDisclaimerGateProps) {
  const [isAccepted, setIsAccepted] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // 1️⃣ Lecture du flag en localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setIsAccepted(raw === "true");
    } catch {
      setIsAccepted(false);
    }
  }, []);

  // 🔄 Pendant la lecture, petit état neutre
  if (isAccepted === null) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-400"
      >
        Chargement…
      </button>
    );
  }

  // 2️⃣ Si déjà accepté → on déclenche directement onUnlock
  function handleClick() {
    if (isAccepted) {
      onUnlock();
      return;
    }
    // Sinon on ouvre la modale d’avertissement
    setIsOpen(true);
  }

  function handleConfirm() {
    if (!isChecked) return;

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, "true");
      }
    } catch {
      // même si ça ne s’enregistre pas, on laisse continuer l’utilisateur
    }

    setIsAccepted(true);
    setIsOpen(false);
    onUnlock();
  }

  return (
    <>
      {/* Bouton de déclenchement principal */}
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-50 shadow-sm hover:bg-black active:scale-[0.99]"
      >
        {triggerLabel}
      </button>

      {/* Modale de consentement */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-900">
              Avertissement important avant d’accéder à la méthodologie
            </h2>

            <div className="mt-2 space-y-2 text-xs text-slate-700">
              <p>
                Le contenu de ce Display décrit la méthodologie, le parcours et
                les choix du créateur pour passer d’un <strong>Avant</strong> à
                un <strong>Après</strong>. Il s’agit d’un partage
                d’expérience, pas d’une promesse de résultat.
              </p>
              <p>
                <strong>Aucun résultat n’est garanti.</strong> De nombreux
                facteurs peuvent influencer le rendu final (contexte,
                compétences, matériel utilisé, historique, environnement, etc.).
              </p>
              <p>
                En accédant à cette méthodologie, tu restes seul responsable de
                la manière dont tu l’appliques. La plateforme Magic Clock et le
                créateur du contenu déclinent toute responsabilité en cas de
                dommage physique, moral, matériel ou financier résultant de
                l’utilisation de ces informations.
              </p>
              <p className="text-[11px] text-slate-500">
                Cet avertissement s’applique à tous les contenus de type
                méthodologie, quel que soit le mode d’accès :{" "}
                <strong>FREE</strong>, <strong>Abonnement</strong> ou{" "}
                <strong>PayPerView</strong>.
              </p>
            </div>

            <label className="mt-3 flex items-start gap-2 text-[11px] text-slate-700">
              <input
                type="checkbox"
                className="mt-[2px] h-3 w-3 rounded border-slate-300"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <span>
                J’ai lu et compris cet avertissement. Je comprends que le
                résultat n’est pas garanti et j’accepte d’assumer pleinement la
                responsabilité de l’utilisation de cette méthodologie.
              </span>
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsChecked(false);
                }}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!isChecked}
                onClick={handleConfirm}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-semibold text-slate-50 shadow-sm hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continuer vers le Display
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
