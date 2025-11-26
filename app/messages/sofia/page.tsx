import ChatThread, { ChatMeta, ChatMessage } from "../_ChatThread";

const meta: ChatMeta = {
  id: "sofia",
  name: "Sofia Rivera",
  handle: "@sofia_rivera",
  avatarType: "photo",
  avatarUrl: "/creators/sofia-rivera.jpeg",
};

const initialMessages: ChatMessage[] = [
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
];

export default function SofiaThreadPage() {
  return <ChatThread meta={meta} initialMessages={initialMessages} />;
}
