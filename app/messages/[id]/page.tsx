// app/messages/[id]/page.tsx
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

type ChatMessage = {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
};

type Contact = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
};

// Petits profils cohérents avec Meet me
const contacts: Record<string, Contact> = {
  aiko: {
    id: "aiko",
    name: "Aiko Tanaka",
    handle: "@aiko_tanaka",
    avatarUrl: "/creators/aiko-tanaka.jpeg",
  },
  sofia: {
    id: "sofia",
    name: "Sofia Rivera",
    handle: "@sofia_rivera",
    avatarUrl: "/creators/sofia-rivera.jpeg",
  },
  lena: {
    id: "lena",
    name: "Lena Martin",
    handle: "@lena_martin",
    avatarUrl: "/creators/lena-martin.jpeg",
  },
  "magic-clock": {
    id: "magic-clock",
    name: "Magic Clock",
    handle: "@magic_clock_app",
  },
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "them",
    text: "Coucou 👋 J’ai publié la nouvelle transformation caramel, tu en penses quoi ?",
    time: "11:02",
  },
  {
    id: 2,
    from: "me",
    text: "J’adore ! La lumière sur les longueurs est parfaite ✨",
    time: "11:05",
  },
  {
    id: 3,
    from: "them",
    text: "Merci 🙏 Je vais la poster dans Magic Clock Studio en PPV.",
    time: "11:07",
  },
  {
    id: 4,
    from: "me",
    text: "Top, envoie-moi le lien quand c’est publié 😉",
    time: "11:09",
  },
];

export default function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const contact =
    contacts[params.id as keyof typeof contacts] ?? contacts["aiko"];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll en bas à chaque nouveau message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
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
    setInput("");
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] max-w-3xl flex-col px-4 pb-4 pt-4 sm:px-6 lg:px-8">
      <section className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Link
            href="/messages"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-sm text-slate-600 hover:bg-slate-100"
            aria-label="Retour aux messages"
          >
            ←
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-100">
              {contact.avatarUrl ? (
                <Image
                  src={contact.avatarUrl}
                  alt={contact.name}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 text-xs font-semibold text-white">
                  MC
                </div>
              )}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">
                {contact.name}
              </p>
              <p className="text-[11px] text-slate-500">{contact.handle}</p>
            </div>
          </div>

          <div className="ml-auto text-[18px] text-slate-400">⋯</div>
        </header>

        {/* Zone de messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 px-4 py-4"
        >
          {/* Séparateur de date */}
          <div className="mb-1 flex justify-center">
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] text-slate-400">
              Aujourd’hui
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.from === "me";
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={[
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    isMe
                      ? "rounded-br-sm bg-indigo-600 text-white"
                      : "rounded-bl-sm bg-white text-slate-900 border border-slate-100",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMe ? "text-indigo-100/80" : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Barre d’entrée message */}
        <form
          onSubmit={handleSend}
          className="border-t border-slate-100 bg-white/95 px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-500 hover:bg-slate-50 sm:flex"
              aria-label="Ajouter un média (bientôt)"
            >
              +
            </button>
            <div className="flex-1 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 focus-within:ring-2 focus-within:ring-indigo-500/60">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrire un message…"
                className="w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!input.trim()}
            >
              Envoyer
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
