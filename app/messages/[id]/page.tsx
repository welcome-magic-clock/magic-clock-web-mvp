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

// Métadonnées simples pour nos fils existants
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

const baseMessages: ChatMessage[] = [
  {
    id: 1,
    from: "them",
    text: "Salut ! Merci encore pour tes conseils couleur, c’était top 🙏",
    time: "Il y a 2 h",
  },
  {
    id: 2,
    from: "me",
    text: "Avec plaisir ! N’hésite pas à poster l’avant/après dans Magic Studio ✨",
    time: "Il y a 1 h",
  },
  {
    id: 3,
    from: "them",
    text: "Je le fais demain, j’aimerais viser le hashtag #BalayageCaramel 😍",
    time: "Il y a 30 min",
  },
];

export default function ChatThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const meta =
    chatMetas[params.id] ??
    ({
      id: params.id,
      name: "Magic Clock",
      handle: "@magic_clock_app",
      avatarType: "brand",
      avatarInitials: "MC",
      avatarGradient:
        "bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500",
    } as ChatMeta);

  const [messages, setMessages] = useState<ChatMessage[]>(baseMessages);
  const [draft, setDraft] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: "me",
        text: draft.trim(),
        time: "Maintenant",
      },
    ]);
    setDraft("");
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-80px)] max-w-3xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-3 flex items-center gap-3">
        <Link
          href="/messages"
          className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                className={`flex h-full w-full items-center justify-center text-xs font-semibold text-white ${
                  meta.avatarGradient ?? "bg-slate-400"
                }`}
              >
                {meta.avatarInitials ?? "MC"}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-600">
                {meta.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {meta.name}
            </p>
            <p className="truncate text-xs text-slate-500">{meta.handle}</p>
          </div>
        </div>
      </header>

      {/* Zone de conversation */}
      <section className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="mb-4 flex justify-center">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500">
            Aujourd’hui
          </span>
        </div>

        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  msg.from === "me"
                    ? "rounded-br-sm bg-violet-600 text-white"
                    : "rounded-bl-sm border border-slate-100 bg-white text-slate-900"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    msg.from === "me" ? "text-violet-200" : "text-slate-400"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zone de saisie */}
      <form
        onSubmit={handleSend}
        className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm"
      >
        <input
          type="text"
          placeholder="Écrire un message…"
          className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-violet-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
        >
          Envoyer
        </button>
      </form>
    </main>
  );
}
