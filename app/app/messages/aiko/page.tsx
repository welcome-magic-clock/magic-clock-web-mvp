// app/messages/aiko/page.tsx
import ChatThread, { ChatMeta, ChatMessage } from "../_ChatThread";

const meta: ChatMeta = {
  id: "aiko",
  name: "Aiko Tanaka",
  handle: "@aiko_tanaka",
  avatarType: "photo",
  avatarUrl: "/creators/aiko-tanaka.jpeg",
};

const initialMessages: ChatMessage[] = [
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
];

export default function AikoThreadPage() {
  return <ChatThread meta={meta} initialMessages={initialMessages} />;
}
