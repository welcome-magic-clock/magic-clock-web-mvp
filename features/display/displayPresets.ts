// features/display/displayPresets.ts
import type {
  PreviewDisplay,
  PreviewFace,
  PreviewSegment,
  PreviewMedia,
} from "./MagicDisplayPreviewShell";

/**
 * Medias principaux pour texturer chaque face du cube Bear.
 * Les fichiers sont déjà présents dans :
 * public/images/magic-clock-bear/
 */

const bearFace1Photo: PreviewMedia = {
  type: "photo",
  url: "/images/magic-clock-bear/face-1.jpg",
  filename: "Face 1 – Résultat & vue globale",
};

const bearFace2Photo: PreviewMedia = {
  type: "photo",
  url: "/images/magic-clock-bear/face-2.jpg",
  filename: "Face 2 – Technique & processus",
};

const bearFace3Photo: PreviewMedia = {
  type: "photo",
  url: "/images/magic-clock-bear/face-3.jpg",
  filename: "Face 3 – Détails de l’application",
};

const bearFace4Photo: PreviewMedia = {
  type: "photo",
  url: "/images/magic-clock-bear/face-4.jpg",
  filename: "Face 4 – Avant / diagnostic",
};

const bearFace5Photo: PreviewMedia = {
  type: "photo",
  url: "/images/magic-clock-bear/face-5.jpg",
  filename: "Face 5 – Processus en cours",
};

const bearFace6Photo: PreviewMedia = {
  type: "photo",
  url: "/images/magic-clock-bear/face-6.jpg",
  filename: "Face 6 – Résultat alternatif",
};

/**
 * Face 1 – Résultat & vue globale
 */
const bearFace1: PreviewFace = {
  title: "Face 1 – Résultat & vue globale",
  description:
    "Face principale utilisée pour texturer le cube et donner envie d’ouvrir le Display.",
  notes:
    "Vue finale du balayage caramel, avec le Bear en arrière-plan : c’est la promesse visuelle.",
  segments: [
    {
      id: 1,
      title: "Résultat final",
      description: "Vue globale de la transformation terminée.",
      notes:
        "Montre le rendu final avant d’entrer dans le détail technique.",
      media: [bearFace1Photo],
    },
  ],
};

/**
 * Face 2 – Technique & processus
 */
const bearFace2: PreviewFace = {
  title: "Face 2 – Technique & processus",
  description:
    "Permet de comprendre la logique complète de la transformation.",
  notes:
    "Vue synthétique du chemin technique : diagnostic, sectionnement, application, patine.",
  segments: [
    {
      id: 1,
      title: "Technique & processus",
      description:
        "Résumé des grandes étapes : sectionnement, application, patine.",
      notes:
        "Face pédagogique pour expliquer la méthode aux coiffeurs.",
      media: [bearFace2Photo],
    },
  ],
};

/**
 * Face 3 – Détails de l’application
 */
const bearFace3: PreviewFace = {
  title: "Face 3 – Détails de l’application",
  description:
    "Zoom sur les placements de lumière et les transitions.",
  notes:
    "Montre la précision des placements de mèches et la douceur des transitions.",
  segments: [
    {
      id: 1,
      title: "Détails de l’application",
      description:
        "Vue rapprochée sur les placements du balayage et la répartition des lumières.",
      notes: "",
      media: [bearFace3Photo],
    },
  ],
};

/**
 * Face 4 – Avant / diagnostic
 */
const bearFace4: PreviewFace = {
  title: "Face 4 – Avant & diagnostic",
  description:
    "Met en avant l’état initial de la chevelure avant la transformation.",
  notes:
    "Permet de comparer l’avant / après et de valoriser le travail effectué.",
  segments: [
    {
      id: 1,
      title: "Avant",
      description: "État de départ de la cliente avant le balayage.",
      notes: "",
      media: [bearFace4Photo],
    },
  ],
};

/**
 * Face 5 – Processus en cours
 */
const bearFace5: PreviewFace = {
  title: "Face 5 – Processus en cours",
  description:
    "Instantanés pendant la réalisation pour montrer le geste et la technique.",
  notes:
    "Permet de rassurer et d’éduquer : le travail se fait étape par étape.",
  segments: [
    {
      id: 1,
      title: "Processus en cours",
      description: "Moments clés du travail en salon.",
      notes: "",
      media: [bearFace5Photo],
    },
  ],
};

/**
 * Face 6 – Résultat alternatif / mood
 */
const bearFace6: PreviewFace = {
  title: "Face 6 – Ambiance & mood",
  description:
    "Met l’accent sur l’ambiance, le sourire et la complicité avec le Bear.",
  notes:
    "Face plus émotionnelle, pour renforcer la dimension storytelling.",
  segments: [
    {
      id: 1,
      title: "Ambiance",
      description: "Focus sur l’émotion et l’expérience cliente.",
      notes: "",
      media: [bearFace6Photo],
    },
  ],
};

/**
 * Display complet pour mcw-onboarding-bear-001
 */
export const BEAR_ONBOARDING_DISPLAY: PreviewDisplay = {
  faces: [bearFace1, bearFace2, bearFace3, bearFace4, bearFace5, bearFace6],

  // 🐻 Métadonnées créateur pour le cercle Aiko
  creatorName: "Magic Bear",
  creatorInitials: "MB",
  creatorAvatarUrl: "/images/magic-clock-bear/avatar.png",
};

/**
 * Registre de presets, par slug.
 * (Plus tard Supabase/API viendront alimenter ceci dynamiquement.)
 */
export const DISPLAY_PRESETS: Record<string, PreviewDisplay> = {
  "mcw-onboarding-bear-001": BEAR_ONBOARDING_DISPLAY,
};
