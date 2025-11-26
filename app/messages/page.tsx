// app/messages/page.tsx
"use client";

import { useState } from "react";

type Conversation = {
  id: string;
  name: string;
  handle: string;
  preview: string;
  time: string;
  unread?: boolean;
  isSystem?: boolean;
  avatarUrl?: string;            // pour les photos locales (Aiko, Sofia, Lena)
  avatarType?: "photo" | "brand";
  avatarInitials?: string;       // pour les bulles "MC"
  avatarGradient?: string;       // pour les dégradés Magic Clock
};

const conversations: Conversation[] = [
  {
    id: "aiko",
    name: "Aiko Tanaka",
    handle: "@aiko_tanaka",
    preview: "J’ai publié la nouvelle transformation caramel ✨",
    time: "Il y a 2 h",
    unread: true,
    avatarType: "photo",
    // dossier public/creators
    avatarUrl: "/creators/aiko-tanaka.jpeg",
  },
  {
    id: "sofia",
    name: "Sofia Rivera",
    handle: "@sofia_rivera",
    preview: "On teste Magic Clock avec l’équipe du salon 😍",
    time: "Hier",
    avatarType: "photo",
    avatarUrl: "/creators/sofia-rivera.jpeg",
  },
  {
    id: "lena",
    name: "Lena Martin",
    handle: "@lena_martin",
    preview: "Merci pour tes conseils sur le blond froid 💬",
    time: "Mar.",
    avatarType: "photo",
    avatarUrl: "/creators/lena-martin.jpeg",
  },
  // Messages système Magic Clock
  {
    id: "mc-sub",
    name: "Magic Clock",
    handle: "@magic_clock_app",
    preview:
      "Nouveau abonné : @hairby_jules vient de s’abonner à ton contenu.",
    time: "Il y a 5 min",
    unread: true,
    isSystem: true,
    avatarType: "brand",
    avatarInitials: "MC",
    avatarGradient:
      "bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500",
  },
  {
    id: "mc-ppv",
    name: "Magic Clock",
    handle: "@magic_clock_app",
    preview:
      "Achat PPV confirmé : « Balayage caramel studio » (4,90 CHF).",
    time: "Il y a 12 min",
    isSystem: true,
    avatarType: "brand",
    avatarInitials: "MC",
    avatarGradient:
      "bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-orange-400",
  },
  {
    id: "mc-likes",
    name: "Magic Clock",
    handle: "@magic_clock_app",
    preview: "Boom ! 12 302 likes sur « Blond ambré ». Bravo 🪄",
    time: "Aujourd’hui",
    isSystem: true,
    avatarType: "brand",
    avatarInitials: "MC",
    avatarGradient:
      "bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-400",
  },
];

export default function MessagesPage() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8">
      {/* Carte principale Messages (plein écran mobile) */}
      <section className="mt-2 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5 lg:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
            Messages
          </h1>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {conversations.length} fils
          </span>
        </div>

        {/* Barre de recherche */}
        <div className="mb-3 rounded-full border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-[13px]">🔍</span>
            <span className="truncate text-xs sm:text-sm">
              Rechercher une conversation
            </span>
          </div>
        </div>

        {/* Liste de conversations */}
        <ul className="divide-y divide-slate-100">
          {conversations.map((conv) => (
            <li key={conv.id} className="py-3 first:pt-1 last:pb-0">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-slate-50"
              >
                {/* Avatar */}
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
                  {conv.avatarType === "photo" && conv.avatarUrl ? (
                    <img
                      src={conv.avatarUrl}
                      alt={conv.name}
                      className="h-full w-full object-cover"
                    />
                  ) : conv.avatarType === "brand" ? (
                    <div
                      className={`flex h-full w-full items-center justify-center rounded-full text-xs font-semibold text-white ${
                        conv.avatarGradient ?? "bg-slate-400"
                      }`}
                    >
                      {conv.avatarInitials ?? "MC"}
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                      {conv.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Texte */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {conv.name}
                    </p>
                    <p className="flex-shrink-0 text-[11px] text-slate-400">
                      {conv.time}
                    </p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    {conv.preview}
                  </p>
                </div>

                {/* Indicateur non lu */}
                {conv.unread && (
                  <span className="ml-1 h-2 w-2 flex-shrink-0 rounded-full bg-violet-500" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Bandeau d’activation des notifications (gris clair) */}
      {showBanner && (
        <section className="fixed inset-x-0 bottom-[72px] z-20 px-4 pb-4 sm:bottom-6 sm:flex sm:justify-center sm:px-0">
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-slate-50/95 p-4 shadow-lg backdrop-blur">
            <div className="flex items-start gap-3">
              {/* Icône moderne Magic Clock notifications */}
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500 text-white shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    d="M12 3a5 5 0 00-5 5v2.586c0 .265-.105.52-.293.707L5 14h14l-1.707-2.707A1 1 0 0117 10.586V8a5 5 0 00-5-5z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 18a2 2 0 004 0h-4z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Activer les notifications de messages ?
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Sois averti dès qu’un créateur t’écrit ou répond à l’un de tes
                  contenus. Tu pourras modifier ce réglage plus tard.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    onClick={() => setShowBanner(false)}
                  >
                    Plus tard
                  </button>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Activer les notifications
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  En continuant, tu acceptes de recevoir des notifications liées
                  à tes messages Magic Clock. Aucune pub, uniquement de
                  l’activité utile.
                </p>
              </div>

              <button
                type="button"
                className="ml-2 mt-1 text-slate-400 hover:text-slate-600"
                onClick={() => setShowBanner(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
