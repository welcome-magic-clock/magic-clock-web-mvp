// app/messages/[id]/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

type ChatMeta = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  avatarType?: "photo" | "brand";
  avatarInitials?: string;
  avatarGradient?: string;
};

type ChatMessage = {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
};

const chatMetas: Record<string, ChatMeta> = {
  aiko: {
    id: "aiko",
    name: "Aiko Tanaka",
    handle: "@aiko_tanaka",
    avatarType: "photo",
    avatarUrl: "/creators/aiko-tanaka.jpeg",
  },
  sofia: {
    id: "sofia",
    name: "Sofia Rivera",
    handle: "@sofia_rivera",
    avatarType: "photo",
    avatarUrl: "/creators/sofia-rivera.jpeg",
  },
  lena: {
    id: "lena",
    name: "Lena Martin",
    handle: "@lena_martin",
    avatarType: "photo",
    avatarUrl: "/creators/lena-martin.jpeg",
  },
  "mc-sub": {
    id: "mc-sub",
    name: "Magic Clock",
    handle: "@magic_clock_app",
    avatarType: "brand",
    avatarInitials: "MC",
    avatarGradient:
      "bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500",
  },
  "mc-ppv": {
    id: "mc-ppv",
    name: "Magic Clock",
    handle: "@magic_clock_app",
    avatarType: "brand",
    avatarInitials: "MC",
    avatarGradient:
      "bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-orange-400",
  },
  "mc-likes": {
    id: "mc-likes",
    name: "Magic Clock",
    handle: "@magic_clock_app",
    avatarType: "brand",
    avatarInitials: "MC",
    avatarGradient:
      "bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-400",
  },
};

const baseMessagesById: Record<string, ChatMessage[]> = {
  aiko: [
    {
      id: 1,
      from: "them",
      text: "Coucou 👋 J’ai publié la nouvelle transformation caramel ✨",
      time: "14:02",
    },
    {
      id: 2,
      from: "me",
      text: "Je viens de la voir, elle est magnifique 😍",
      time: "14:05",
    },
  ],
  sofia: [
    {
      id: 1,
      from: "them",
      text: "On teste Magic Clock avec l’équipe du salon, c’est top !",
      time: "Hier",
    },
    {
      id: 2,
      from: "me",
      text: "Merci 🙏 N’hésite pas à m’envoyer tes retours.",
      time: "Hier",
    },
  ],
  lena: [
    {
      id: 1,
      from: "them",
      text: "Merci pour tes conseils sur le blond froid 💬",
      time: "Mar.",
    },
    {
      id: 2,
      from: "me",
      text: "Avec plaisir, tu peux enregistrer la formule dans Magic Clock.",
      time: "Mar.",
    },
  ],
  "mc-sub": [
    {
      id: 1,
      from: "them",
      text: "Nouveau abonné : @hairby_jules vient de s’abonner à ton contenu.",
      time: "Il y a 5 min",
    },
  ],
  "mc-ppv": [
    {
      id: 1,
      from: "them",
      text: "Achat PPV confirmé : « Balayage caramel studio » (4,90 CHF).",
      time: "Il y a 12 min",
    },
  ],
  "mc-likes": [
    {
      id: 1,
      from: "them",
      text: "Boom ! 12 302 likes sur « Blond ambré ». Bravo 🪄",
      time: "Aujourd’hui",
    },
  ],
};

export default function MessageThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const meta: ChatMeta =
    chatMetas[params.id] ??
    ({
      id: params.id,
      name: "Conversation",
      handle: "",
    } as ChatMeta);

  const [messages, setMessages] = useState<ChatMessage[]>(
    baseMessagesById[params.id] ?? [
      {
        id: 1,
        from: "them",
        text: "Bienvenue dans ta messagerie Magic Clock ✨",
        time: "Maintenant",
      },
    ]
  );
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: "me",
        text: trimmed,
        time: "Maintenant",
      },
    ]);
    setDraft("");
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] max-w-3xl flex-col px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      {/* Header chat */}
      <header className="mb-3 flex items-center gap-3">
        <Link
          href="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label="Retour aux messages"
        >
          ←
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-100">
            {meta.avatarType === "photo" && meta.avatarUrl ? (
              <img
                src={meta.avatarUrl}
                alt={meta.name}
                className="h-full w-full object-cover"
              />
            ) : meta.avatarType === "brand" ? (
              <div
                className={`flex h-full w-full items-center justify-center rounded-full text-xs font-semibold text-white ${
                  meta.avatarGradient ?? "bg-slate-400"
                }`}
              >
                {meta.avatarInitials ?? "MC"}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                {meta.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {meta.name}
            </p>
            {meta.handle && (
              <p className="text-[11px] text-slate-500">{meta.handle}</p>
            )}
          </div>
        </div>
      </header>

      {/* Zone messages */}
      <section className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white/80 p-3 sm:p-4">
        <div className="flex flex-col gap-2 text-sm">
          {messages.map((msg) => {
            const isMe = msg.from === "me";
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    isMe
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMe
                        ? "text-violet-100/80"
                        : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Barre d’entrée message */}
      <section className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Écrire un message…"
          className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex items-center justify-center rounded-full bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
        >
          Envoyer
        </button>
      </section>
    </main>
  );
}
