// components/legal/ResultDisclaimerGate.tsx
"use client";

import { useState } from "react";
import { ResultDisclaimer } from "./ResultDisclaimer";

type AccessMode = "FREE" | "ABO" | "PPV";

type ResultDisclaimerGateProps = {
  mode: AccessMode;
  triggerLabel?: string;
  onUnlock: () => void;
};

export function ResultDisclaimerGate({
  mode,
  triggerLabel,
  onUnlock,
}: ResultDisclaimerGateProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const label =
    triggerLabel ??
    (mode === "FREE"
      ? "Voir le Magic Display"
      : mode === "ABO"
      ? "Débloquer le Magic Display (abonné)"
      : "Débloquer le Magic Display (PPV)");

  // 1) Bouton simple tant que la gate n'est pas ouverte
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
      >
        {label}
      </button>
    );
  }

  // 2) Modale avec disclaimer + checkbox + Continue
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Avant de débloquer le Display
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          Méthode pédagogique · pas de garantie de résultat
        </p>

        {/* Texte légal réutilisé */}
        <ResultDisclaimer showCheckbox={false} />

        {/* Checkbox contrôlée */}
        <label className="mt-3 flex items-start gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>
            Je comprends que ce Display décrit une méthode et une expérience
            propre au créateur, <strong>sans garantie de résultat</strong>, et
            que je reste seul responsable de la manière dont je l&apos;applique.
          </span>
        </label>

        <div className="mt-4 flex justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setChecked(false);
              setOpen(false);
            }}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={!checked}
            onClick={() => {
              setOpen(false);
              onUnlock();
            }}
            className="rounded-full bg-slate-900 px-4 py-1.5 font-semibold text-white shadow-sm hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
