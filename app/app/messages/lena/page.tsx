import ChatThread, { ChatMeta, ChatMessage } from "../_ChatThread";

const meta: ChatMeta = {
  id: "lena",
  name: "Lena Martin",
  handle: "@lena_martin",
  avatarType: "photo",
  avatarUrl: "/creators/lena-martin.jpeg",
};

const initialMessages: ChatMessage[] = [
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
];

export default function LenaThreadPage() {
  return <ChatThread meta={meta} initialMessages={initialMessages} />;
}
