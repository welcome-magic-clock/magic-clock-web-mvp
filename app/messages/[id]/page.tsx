// app/messages/[id]/page.tsx
"use client";

import Link from "next/link";

type ChatMeta = {
  name: string;
  handle: string;
};

type ChatMessage = {
  id: number;
  from: "me" | "them";
  text: string;
};

const chatMetas: Record<string, ChatMeta> = {
  aiko: {
    name: "Aiko Tanaka",
    handle: "@aiko_tanaka",
  },
  sofia: {
    name: "Sofia Rivera",
    handle: "@sofia_rivera",
  },
  lena: {
    name: "Lena Martin",
    handle: "@lena_martin",
  },
  "mc-sub": {
    name: "Magic Clock",
    handle: "@magic_clock_app",
  },
  "mc-ppv": {
    name: "Magic Clock",
    handle: "@magic_clock_app",
  },
  "mc-likes": {
    name: "Magic Clock",
    handle: "@magic_clock_app",
  },
};

const baseMessagesById: Record<string, ChatMessage[]> = {
  aiko: [
    { id: 1, from: "them", text: "Coucou 👋 J’ai publié la nouvelle transformation caramel ✨" },
    { id: 2, from: "me", text: "Je viens de la voir, elle est magnifique 😍" },
  ],
  sofia: [
    { id: 1, from: "them", text: "On teste Magic Clock avec l’équipe du salon, c’est top !" },
    { id: 2, from: "me", text: "Merci 🙏 N’hésite pas à m’envoyer tes retours." },
  ],
  lena: [
    { id: 1, from: "them", text: "Merci pour tes conseils sur le blond froid 💬" },
    { id: 2, from: "me", text: "Avec plaisir, tu peux enregistrer la formule dans Magic Clock." },
  ],
  "mc-sub": [
    { id: 1, from: "them", text: "Nouveau abonné : @hairby_jules vient de s’abonner à ton contenu." },
  ],
  "mc-ppv": [
    { id: 1, from: "them", text: "Achat PPV confirmé : « Balayage caramel studio » (4,90 CHF)." },
  ],
  "mc-likes": [
    { id: 1, from: "them", text: "Boom ! 12 302 likes sur « Blond ambré ». Bravo 🪄" },
  ],
};

export default function MessageThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const meta = chatMetas[id] ?? { name: "Conversation", handle: "" };
  const messages = baseMessagesById[id] ?? [
    { id: 1, from: "them", text: "Bienvenue dans ta messagerie Magic Clock ✨" },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      {/* Header très simple */}
      <header className="mb-4 flex items-center gap-3">
        <Link
          href="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          aria-label="Retour aux messages"
        >
          ←
        </Link>
        <div>
          <p className="text-sm font-semibold text-slate-900">{meta.name}</p>
          {meta.handle && (
            <p className="text-[11px] text-slate-500">{meta.handle}</p>
          )}
        </div>
      </header>

      {/* Zone messages (juste des bulles, sans input pour l’instant) */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-3 sm:p-4">
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
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
