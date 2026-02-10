// components/legal/CookieBanner.tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mc-cookie-consent-v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);

    // Si rien en storage → on affiche la bannière
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value: "accept" | "reject") => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          value,
          updatedAt: new Date().toISOString(),
        })
      );
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-start gap-3 px-4 py-3 text-xs sm:text-sm">
        <p className="flex-1 text-slate-700">
          Nous utilisons des cookies nécessaires au fonctionnement de Magic
          Clock et, avec ton accord, des cookies de mesure d’audience pour
          améliorer l’expérience. Tu peux modifier ton choix plus tard dans les
          paramètres.
        </p>

        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => handleChoice("reject")}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accept")}
            className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
