// app/support/page.tsx
// ✅ v1.0 — Formulaire support → support@magic-clock.com
"use client";

import { useState }  from "react";
import Link          from "next/link";
import { ChevronLeft, Send, CheckCircle, AlertCircle } from "lucide-react";

const GRAD = {
  background: "linear-gradient(135deg,#4B7BF5 0%,#7B4BF5 40%,#F54B8F 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as React.CSSProperties;
const PRIMARY_GRADIENT = "linear-gradient(135deg,#7B4BF5,#C44BDA,#F54B8F)";

const SUBJECTS = [
  "Problème de versement",
  "Question sur ma commission",
  "Problème technique",
  "Magic Clock non visible",
  "Compte & vérification KYC",
  "Autre",
];

export default function SupportPage() {
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");
  const [email,    setEmail]    = useState("");
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit() {
    if (!subject || !message || !email) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    setSending(true);
    setError("");
    try {
      // Envoi via mailto (MVP) — à remplacer par route API /api/support en production
      const body = encodeURIComponent(
        `Sujet : ${subject}\n\nMessage :\n${message}\n\nEmail de contact : ${email}`
      );
      const mailtoLink = `mailto:support@magic-clock.com?subject=${encodeURIComponent(`[Support] ${subject}`)}&body=${body}`;
      window.location.href = mailtoLink;
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Réessaie ou écris directement à support@magic-clock.com");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/monet"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <ChevronLeft size={18} color="#64748b" />
          </Link>
          <p className="text-[15px] font-black text-slate-800">Support Magic Clock</p>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-6">

        {/* Intro */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[13px] font-bold text-slate-800">Comment pouvons-nous t'aider ?</p>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
            Notre équipe répond sous 24h en jours ouvrés. Pour les urgences liées aux versements,
            nous traitons en priorité.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <CheckCircle size={36} color="#10b981" />
            <p className="text-[14px] font-black text-slate-800">Message envoyé !</p>
            <p className="text-[12px] text-slate-500">
              Ton client mail vient de s'ouvrir avec ton message pré-rempli.
              Si ce n'est pas le cas, écris-nous directement à{" "}
              <strong>support@magic-clock.com</strong>.
            </p>
            <Link href="/monet"
              className="mt-1 rounded-xl px-4 py-2 text-[12px] font-bold text-white"
              style={{ background: PRIMARY_GRADIENT }}>
              Retour au cockpit
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            {/* Email */}
            <div className="mb-3">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Ton email de contact
              </label>
              <input
                type="email"
                placeholder="toi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] text-slate-700 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Sujet */}
            <div className="mb-3">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Sujet
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                      subject === s
                        ? "text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                    style={subject === s ? { background: PRIMARY_GRADIENT } : {}}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Décris ton problème en détail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] text-slate-700 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Erreur */}
            {error && (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
                <AlertCircle size={14} color="#ef4444" />
                <p className="text-[11px] text-red-600">{error}</p>
              </div>
            )}

            {/* Bouton envoyer */}
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold text-white disabled:opacity-60"
              style={{ background: PRIMARY_GRADIENT }}
            >
              <Send size={15} />
              {sending ? "Ouverture du client mail…" : "Envoyer le message"}
            </button>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              Ou écris directement à{" "}
              <a href="mailto:support@magic-clock.com"
                className="font-semibold" style={{ color: "#7B4BF5" }}>
                support@magic-clock.com
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
