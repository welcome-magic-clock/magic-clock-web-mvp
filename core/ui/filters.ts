// core/ui/filters.ts
// ✅ v1.0 — Source unique vérité des bulles Magic Clock
// Importé par AmazingHeader ET MeetPage → jamais de divergence

import { Users, Unlock, Heart, Palette, Crown, Radio } from "lucide-react";
import type React from "react";

export type FilterId = "all" | "free" | "abo" | "ppv" | "legendary" | "live";

export interface McFilter {
  id: FilterId;
  label: string;
  Icon: React.FC<{ className?: string }>;
}

export const MC_FILTERS: McFilter[] = [
  { id: "all",       label: "Tous",       Icon: Users   },
  { id: "free",      label: "FREE",       Icon: Unlock  },
  { id: "abo",       label: "Abonnement", Icon: Heart   },
  { id: "ppv",       label: "PPV",        Icon: Palette },
  { id: "legendary", label: "Legendary",  Icon: Crown   },
  { id: "live",      label: "En direct",  Icon: Radio   },
];

export const MC_FILTER_GRAD = "linear-gradient(135deg,#4B7BF5,#7B4BF5,#C44BDA,#F54B8F,#F5834B)";

export const MC_PILL_ACTIVE: React.CSSProperties = {
  background: MC_FILTER_GRAD,
  color: "white",
  border: "1px solid transparent",
  fontWeight: 700,
};

export const MC_PILL_IDLE: React.CSSProperties = {
  background: "#f8fafc",
  color: "#64748b",
  border: "1px solid #e2e8f0",
  fontWeight: 600,
};
