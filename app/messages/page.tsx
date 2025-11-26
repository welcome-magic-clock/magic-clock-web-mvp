"use client";

import { useEffect, useState } from "react";
import { Bell, MessageCircle, Search, X } from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  handle: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  avatarColor: string;
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Aiko Tanaka",
    handle: "@aiko_tanaka",
    lastMessage: "J’ai publié la nouvelle transformation caramel 🤎",
    time: "Il y a 2 h",
    unread: true,
    avatarColor: "bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400",
  },
  {
    id: "2",
    name: "Sofia Rivera",
    handle: "@sofia_rivera",
    lastMessage: "On teste Magic Clock avec l’équipe demain ✨",
    time: "Hier",
    avatarColor: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400",
  },
  {
    id: "3",
    name: "Lena Martin",
    handle: "@lena_martin",
    lastMessage: "Merci pour tes conseils sur les abonnements 🔁",
    time: "Mar.",
    avatarColor: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-400",
  },
];

const NOTIF_CHOICE_KEY = "mc-msg-notif-choice";

export default function MessagesPage() {
  const [selectedId] = useState<string | null>(null);
  const [showNotifPopup, setShowNotifPopup] = useState(false);

  useEffect(() => {
    // On regarde si l’utilisateur a déjà donné sa réponse
    if (typeof window === "undefined") return;
    const choice = window.localStorage.getItem(NOTIF_CHOICE_KEY);
    if (!choice) {
      setShowNotifPopup(true);
    }
  }, []);

  const handleNotifChoice = (choice: "accepted" | "dismissed") => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(NOTIF_CHOICE_KEY, choice);
    }
    setShowNotifPopup(false);
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-1 px-4 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-8">
      <section className="flex w-full gap-4">
        {/* Colonne conversations */}
        <aside className="hidden w-64 flex-shrink-0 flex-col rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:flex">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-base font-semibold text-slate-900">
              Messages
            </h1>
          </div>

          {/* Barre de recherche */}
          <div className="mb-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-1.5 text-sm text-slate-500">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation"
              className="h-7 w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
              disabled
            />
          </div>

          {/* Liste de conversations (mock) */}
          <div className="flex-1 space-y-1 overflow-y-auto pt-1">
            {MOCK_CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition ${
                  selectedId === conv.id
                    ? "bg-indigo-50"
                    : "hover:bg-slate-50 active:bg-slate-100"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${conv.avatarColor}`}
                >
                  <span className="text-xs font-semibold text-white">
                    {conv.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-900">
                    {conv.name}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {conv.lastMessage}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400">
                    {conv.time}
                  </span>
                  {conv.unread && (
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Panneau principal */}
        <section className="flex flex-1 flex-col rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-full max-w-md flex-1 flex-col items-center justify-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <MessageCircle className="h-7 w-7 text-indigo-500" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              Tes messages Magic Clock
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
              Échange avec d’autres créateurs, partage tes transformations,
              pose tes questions techniques… La messagerie Magic Clock est
              pensée pour la collaboration et le partage d’expérience.
            </p>

            <button
              type="button"
              disabled
              className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-xs font-medium text-white opacity-60"
            >
              Bientôt disponible
            </button>

            <p className="mt-3 text-[11px] text-slate-400">
              L’interface est déjà là, la messagerie arrive dans une prochaine
              version bêta de Magic Clock.
            </p>
          </div>
        </section>
      </section>

      {/* Pop-up d’activation des notifications de messages */}
      {showNotifPopup && (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:bottom-8">
          <div className="relative flex w-full max-w-md items-start gap-3 rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-xl">
            <button
              type="button"
              onClick={() => handleNotifChoice("dismissed")}
              className="absolute right-2 top-2 rounded-full p-1 text-slate-400 hover:text-slate-100"
              aria-label="Fermer"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 m-3">
              <Bell className="h-5 w-5" />
            </div>

            <div className="flex flex-1 flex-col gap-2 py-3 pr-3">
              <div>
                <p className="text-xs font-semibold">
                  Activer les notifications de messages ?
                </p>
                <p className="mt-1 text-[11px] text-slate-300">
                  Pour être averti dès qu’un créateur t’écrit ou répond à l’un
                  de tes contenus. Tu pourras modifier ce réglage plus tard.
                </p>
              </div>

              <div className="mt-1 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleNotifChoice("dismissed")}
                  className="rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-slate-700"
                >
                  Plus tard
                </button>
                <button
                  type="button"
                  onClick={() => handleNotifChoice("accepted")}
                  className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Activer les notifications
                </button>
              </div>

              <p className="mt-1 text-[10px] text-slate-400">
                En continuant, tu acceptes de recevoir des notifications liées à
                tes messages Magic Clock. Aucune pub, uniquement de
                l’activité utile. 💬
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
