"use client";
import { useEffect, useState } from "react";

const KEY = "mc-consent-v1";
export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (!v) setOpen(true);
    } catch {}
  }, []);
  const accept = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ all: true, at: Date.now() })); } catch {}
    setOpen(false);
  };
  if (!open) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur p-4">
      <div className="mx-auto max-w-4xl flex items-start gap-4 text-sm">
        <p className="flex-1">
          Nous utilisons des cookies pour la mesure d’audience et l’expérience. 
          En continuant, tu acceptes notre{" "}
          <a href="/legal/cookies" className="underline">politique cookies</a>.
        </p>
        <button onClick={accept} className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20 transition">OK</button>
      </div>
    </div>
  );
}
