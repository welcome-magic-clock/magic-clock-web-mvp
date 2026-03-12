// components/legal/CookieBanner.tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mc-cookie-consent-v1";

type CookieConsentValue = "accept" | "reject";

type CookieConsentRecord = {
  value: CookieConsentValue;
  updatedAt: string;
};

function readConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CookieConsentRecord;

    if (
      parsed &&
      (parsed.value === "accept" || parsed.value === "reject") &&
      typeof parsed.updatedAt === "string"
    ) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

function writeConsent(value: CookieConsentValue) {
  if (typeof window === "undefined") return;

  const payload: CookieConsentRecord = {
    value,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

  // Permet à d'autres composants/pages d'écouter le changement immédiatement
  window.dispatchEvent(
    new CustomEvent("mc-cookie-consent-updated", { detail: payload })
  );
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncVisibility = () => {
      const stored = readConsent();
      setVisible(!stored);
    };

    syncVisibility();

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        syncVisibility();
      }
    };

    const onCustomUpdate = () => {
      syncVisibility();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("mc-cookie-consent-updated", onCustomUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("mc-cookie-consent-updated", onCustomUpdate);
    };
  }, []);

  const handleChoice = (value: CookieConsentValue) => {
    writeConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur"
      role="dialog"
      aria-live="polite"
      aria-label="Préférences de cookies"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start">
        <p className="flex-1 text-xs leading-relaxed text-slate-700 sm:text-sm">
          Nous utilisons des cookies strictement nécessaires au fonctionnement de
          Magic Clock et, avec votre accord, des cookies de mesure d’audience
          pour améliorer l’expérience. Vous pouvez consulter notre{" "}
          <a
            href="/legal/cookies"
            className="font-medium text-violet-700 underline underline-offset-2 hover:text-violet-800"
          >
            Politique de cookies
          </a>{" "}
          pour en savoir plus.
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
