import ChatThread, { ChatMeta, ChatMessage } from "../_ChatThread";

const meta: ChatMeta = {
  id: "mc-sub",
  name: "Magic Clock",
  handle: "@magic_clock_app",
  avatarType: "brand",
  avatarInitials: "MC",
  avatarGradient:
    "bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-500",
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "them",
    text: "Nouveau abonné : @hairby_jules vient de s’abonner à ton contenu.",
    time: "Il y a 5 min",
  },
];

export default function McSubThreadPage() {
  return <ChatThread meta={meta} initialMessages={initialMessages} />;
}
