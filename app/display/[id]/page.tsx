// app/display/[id]/page.tsx
import type { Metadata } from "next";
import MagicDisplayPreviewShell, {
  type PreviewDisplay,
} from "@/features/display/MagicDisplayPreviewShell";
import { DISPLAY_PRESETS } from "@/features/display/displayPresets";
import DisplayClient from "./DisplayClient";

// ⚠️ Liste des IDs statiques pour le build
const STATIC_DISPLAY_IDS = [
  "mcw-onboarding-bear-001",
  // tu peux en ajouter d'autres plus tard : "1", "sofia-001", etc.
];

export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_DISPLAY_IDS.map((id) => ({ id }));
}

export const metadata: Metadata = {
  title: "Magic Display",
};

function getDisplayForId(id: string): PreviewDisplay | null {
  // 1) Presets officiels (Bear, etc.)
  const preset = DISPLAY_PRESETS[id];
  if (preset) return preset;

  // 2) Plus tard : fetch Supabase / API ici si besoin

  return null;
}

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const display = getDisplayForId(id);

  // 👉 Cas Bear & futurs presets : vue 3D complète
  if (display) {
    return <MagicDisplayPreviewShell display={display} />;
  }

  // 👉 Cas MVP : on garde l’ancien comportement
  return <DisplayClient id={id} />;
}
