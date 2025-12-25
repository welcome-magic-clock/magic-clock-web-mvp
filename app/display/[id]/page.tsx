import DisplayClient from "./DisplayClient";

// ⚠️ Mets ici une liste "build-safe" d'IDs (qui ne dépend pas de window)
const STATIC_DISPLAY_IDS = [
  "mcw-onboarding-bear-001",
  // ajoute ici quelques ids réels de ton listFeed (ex: "1", "2", "sofia-001", etc.)
];

export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_DISPLAY_IDS.map((id) => ({ id }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <DisplayClient id={params.id} />;
}
