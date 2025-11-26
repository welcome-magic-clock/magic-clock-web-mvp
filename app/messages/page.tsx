"use client";

import { useEffect, useState } from "react";
import { Search, Bell, X } from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  initials: string;
  preview: string;
  time: string;
  unread?: boolean;
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "aiko",
    name: "Aiko Tanaka",
    initials: "AT",
    preview: "J’ai publié la nouvelle transformation caramel ✨",
    time: "Il y a 2 h",
    unread: true,
  },
  {
    id: "sofia",
    name: "Sofia Rivera",
    initials: "SR",
    preview: "On teste Magic Clock avec l’équipe du salon 😍",
    time: "Hier",
  },
  {
    id: "lena",
    name: "Lena Martin",
    initials: "LM",
    preview: "Merci pour tes conseils sur le blond froid 💬",
    time: "Mar.",
  },
];

const STORAGE_KEY = "mc-messages-notifs-dismissed";

export default function MessagesPage() {
  const [showNotifBanner, setShowNotifBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyDismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!alreadyDismissed) {
      setShowNotifBanner(true);
    }
  }, []);

  const handleCloseBanner = () => {
    setShowNotifBanner(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  const handleEnableNotifications = () => {
    // Ici plus tard : vraie demande de permission navigateur / push
    setShowNotifBanner(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col px-4 pb-24 pt-4 sm:px-6 sm:pt-8 sm:pb-28">
      {/* Header simple */}
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Messages
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Échange avec d’autres créateurs, partage tes transformations et pose
          tes questions techniques. La messagerie Magic Clock est pensée pour le
          partage d’expérience.
        </p>
      </header>

      {/* Carte principale Messages : elle remplit tout l’espace sur mobile */}
      <section className="flex justify-center">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {/* Titre + petite description desktop only */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Messages
              </h2>
              <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                Tes dernières conversations apparaîtront ici dès que tu envoies
                ou reçois un message.
              </p>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mb-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation"
              className="h-7 w-full bg-transparent text-xs outline-none placeholder:text-slate-400 sm:text-sm"
              disabled
            />
          </div>

          {/* Liste de conversations mockée */}
          <ul className="divide-y divide-slate-100">
            {MOCK_CONVERSATIONS.map((conv) => (
              <li
                key={conv.id}
                className="flex cursor-default items-center gap-3 py-3"
              >
                {/* Avatar initiales */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {conv.initials}
                </div>

                {/* Texte */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {conv.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {conv.preview}
                  </p>
                </div>

                {/* Heure + point non-lu */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-slate-400">
                    {conv.time}
                  </span>
                  {conv.unread && (
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bandeau d’activation des notifications – version claire / douce */}
      {showNotifBanner && (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-30 sm:bottom-6 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-xl sm:-translate-x-1/2">
          <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-xs shadow-lg backdrop-blur-sm sm:text-sm">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
              <Bell className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-900 sm:text-sm">
                Activer les notifications de messages ?
              </p>
              <p className="mt-1 text-[11px] leading-snug text-slate-500 sm:text-xs">
                Sois averti dès qu’un créateur t’écrit ou répond à l’un de tes
                contenus. Tu pourras modifier ce réglage plus tard.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCloseBanner}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 sm:text-xs"
                >
                  Plus tard
                </button>
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800 sm:text-xs"
                >
                  Activer les notifications
                </button>
              </div>

              <p className="mt-2 text-[10px] leading-snug text-slate-400">
                En continuant, tu acceptes de recevoir des notifications liées à
                tes messages Magic Clock. Aucune pub, uniquement de l’activité
                utile.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseBanner}
              className="ml-2 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Fermer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
