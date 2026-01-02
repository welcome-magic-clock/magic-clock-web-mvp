// app/display/[id]/page.tsx
import DisplayClient from "./DisplayClient";

// ⚠️ Ids utilisés pour la génération statique
const STATIC_DISPLAY_IDS = [
  "mcw-onboarding-bear-001",
  // tu pourras en ajouter d'autres ici plus tard
];

export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_DISPLAY_IDS.map((id) => ({ id }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <DisplayClient id={params.id} />;
}
