// app/magic-display/magicDisplayConstants.ts

import type { Segment, TemplateId, FaceStatus } from "./magicDisplayTypes";

export const STORAGE_KEY = "mc-display-draft-v1";
export const FACE_PROGRESS_KEY = "mc-display-face-progress-v1";
export const FALLBACK_BEFORE = "/images/magic-clock-bear/before.jpg";
export const FALLBACK_AFTER = "/images/magic-clock-bear/after.jpg";

export const INITIAL_SEGMENTS: Segment[] = [
  { id: 1, label: "Face 1", description: "Diagnostic / point de départ",    angleDeg: -90,  hasMedia: false },
  { id: 2, label: "Face 2", description: "Préparation / sectionnement",      angleDeg: -30,  hasMedia: false },
  { id: 3, label: "Face 3", description: "Application principale",           angleDeg:  30,  hasMedia: false },
  { id: 4, label: "Face 4", description: "Patine / correction",              angleDeg:  90,  hasMedia: false },
  { id: 5, label: "Face 5", description: "Finition / coiffage",              angleDeg:  150, hasMedia: false },
  { id: 6, label: "Face 6", description: "Résultat / conseils maison",       angleDeg:  210, hasMedia: false },
];

export const MOCK_CUBES: { id: TemplateId; title: string; subtitle: string; meta: string }[] = [
  { id: "BALAYAGE_4", title: "MC — Balayage caramel (4 étapes)",  subtitle: "Diagnostic, préparation, application, patine / finition.", meta: "4/6 faces structurées" },
  { id: "COULEUR_3",  title: "MC — Couleur complète",             subtitle: "Racines, longueurs / pointes, gloss & conseils maison.",   meta: "3 étapes clés" },
  { id: "BLOND_6",    title: "MC — Blond signature",              subtitle: "Diagnostic, éclaircissement, patine, résultat & entretien.", meta: "6/6 faces structurées" },
];

export function buildTemplateSegments(template: TemplateId): Segment[] {
  const templates: Record<TemplateId, Omit<Segment, "hasMedia">[]> = {
    BALAYAGE_4: [
      { id: 1, label: "Face 1", description: "Diagnostic",                  angleDeg: -90  },
      { id: 2, label: "Face 2", description: "Préparation / sectionnement", angleDeg: -30  },
      { id: 3, label: "Face 3", description: "Application",                 angleDeg:  30  },
      { id: 4, label: "Face 4", description: "Patine / finition",           angleDeg:  90  },
      { id: 5, label: "Face 5", description: "—",                           angleDeg:  150 },
      { id: 6, label: "Face 6", description: "Conseils maison",             angleDeg:  210 },
    ],
    COULEUR_3: [
      { id: 1, label: "Face 1", description: "Diagnostic & choix de la teinte", angleDeg: -90  },
      { id: 2, label: "Face 2", description: "Application racines",             angleDeg: -30  },
      { id: 3, label: "Face 3", description: "Longueurs / pointes",             angleDeg:  30  },
      { id: 4, label: "Face 4", description: "Finition & gloss",                angleDeg:  90  },
      { id: 5, label: "Face 5", description: "Photo finale",                    angleDeg:  150 },
      { id: 6, label: "Face 6", description: "Conseils maison",                 angleDeg:  210 },
    ],
    BLOND_6: [
      { id: 1, label: "Face 1", description: "Diagnostic & historique",              angleDeg: -90  },
      { id: 2, label: "Face 2", description: "Pré-lightening / éclaircissement",     angleDeg: -30  },
      { id: 3, label: "Face 3", description: "Neutralisation / patine",              angleDeg:  30  },
      { id: 4, label: "Face 4", description: "Finition coiffage",                    angleDeg:  90  },
      { id: 5, label: "Face 5", description: "Résultat final",                       angleDeg:  150 },
      { id: 6, label: "Face 6", description: "Routine maison & entretien",           angleDeg:  210 },
    ],
  };
  return templates[template].map((s) => ({ ...s, hasMedia: false }));
}

// ── Helpers UI ──────────────────────────────────────────────────────────────

export function statusDotClass(status: FaceStatus): string {
  if (status === "full")    return "bg-emerald-500";
  if (status === "partial") return "bg-amber-400";
  return "bg-slate-300";
}

export function mediaTypeLabel(type?: string): string {
  if (type === "photo") return "Photo";
  if (type === "video") return "Vidéo";
  if (type === "file")  return "Fichier";
  return "";
}

export function sanitizeMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("data:") || url.startsWith("blob:")) return null;
  return url;
}
