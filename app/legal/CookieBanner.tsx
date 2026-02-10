"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "mc-cookie-consent-v1";
type ConsentValue = "accepted" | "rejected";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value: ConsentValue) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-900">
              Préférences cookies
            </h2>
            <p className="text-xs text-slate-600">
              Magic Clock utilise des cookies pour faire fonctionner la
              plateforme, sécuriser ta session et mesurer son audience. Certains
              cookies sont strictement nécessaires et ne peuvent pas être
              désactivés.
            </p>
            <p className="text-[11px] text-slate-500">
              Tu peux en savoir plus dans la{" "}
              <Link
                href="/legal/cookies"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Politique de cookies
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => handleChoice("rejected")}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50"
            >
              Refuser les cookies non essentiels
            </button>

            <button
              type="button"
              onClick={() => handleChoice("accepted")}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Tout accepter
            </button>

            <Link
              href="/legal/cookies"
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline sm:ml-2"
            >
              Personnaliser
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
