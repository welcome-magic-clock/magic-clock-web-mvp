import ChatThread, { ChatMeta, ChatMessage } from "../_ChatThread";

const meta: ChatMeta = {
  id: "mc-ppv",
  name: "Magic Clock",
  handle: "@magic_clock_app",
  avatarType: "brand",
  avatarInitials: "MC",
  avatarGradient:
    "bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-orange-400",
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "them",
    text: "Achat PPV confirmé : « Balayage caramel studio » (4,90 CHF).",
    time: "Il y a 12 min",
  },
];

export default function McPpvThreadPage() {
  return <ChatThread meta={meta} initialMessages={initialMessages} />;
}
