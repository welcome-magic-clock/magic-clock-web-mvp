import ChatThread, { ChatMeta, ChatMessage } from "../_ChatThread";

const meta: ChatMeta = {
  id: "mc-likes",
  name: "Magic Clock",
  handle: "@magic_clock_app",
  avatarType: "brand",
  avatarInitials: "MC",
  avatarGradient:
    "bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-400",
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "them",
    text: "Boom ! 12 302 likes sur « Blond ambré ». Bravo 🪄",
    time: "Aujourd’hui",
  },
];

export default function McLikesThreadPage() {
  return <ChatThread meta={meta} initialMessages={initialMessages} />;
}
