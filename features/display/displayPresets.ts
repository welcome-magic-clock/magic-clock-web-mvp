// features/display/displayPresets.ts
import type {
  PreviewDisplay,
  PreviewFace,
  PreviewSegment,
  PreviewMedia,
} from "./MagicDisplayPreviewShell";

/**
 * Médias Bear depuis /public/images/magic-clock-bear/
 */
const BEAR_MEDIA = {
  before: {
    type: "photo",
    url: "/images/magic-clock-bear/before.jpg",
    filename: "Avant – Bear",
  } satisfies PreviewMedia,
  beforeThumb: {
    type: "photo",
    url: "/images/magic-clock-bear/before-thumb.jpg",
    filename: "Avant – Bear (miniature)",
  } satisfies PreviewMedia,
  after: {
    type: "photo",
    url: "/images/magic-clock-bear/after.jpg",
    filename: "Après – Bear",
  } satisfies PreviewMedia,
  afterThumb: {
    type: "photo",
    url: "/images/magic-clock-bear/after-thumb.jpg",
    filename: "Après – Bear (miniature)",
  } satisfies PreviewMedia,
  faces: [
    "/images/magic-clock-bear/face-1.jpg",
    "/images/magic-clock-bear/face-2.jpg",
    "/images/magic-clock-bear/face-3.jpg",
    "/images/magic-clock-bear/face-4.jpg",
    "/images/magic-clock-bear/face-5.jpg",
    "/images/magic-clock-bear/face-6.jpg",
  ] as const,
};

const bearFace1Segments: PreviewSegment[] = [
  {
    id: 1,
    title: "Résultat final",
    description: "Vue globale du balayage caramel réalisé sur la cliente.",
    notes:
      "Image principale utilisée pour donner envie d’ouvrir le Display Bear.",
    media: [BEAR_MEDIA.after],
  },
  {
    id: 2,
    title: "Avant la transformation",
    description: "État initial des cheveux avant le travail du Bear horloger.",
    notes:
      "Cheveux sensibilisés, reflets chauds non contrôlés, besoin de douceur.",
    media: [BEAR_MEDIA.before],
  },
  {
    id: 3,
    title: "Avant / Après (thumb)",
    description: "Miniatures avant/après pour les vignettes et aperçus.",
    notes: "Utilisé pour certaines cartes ou résumés.",
    media: [BEAR_MEDIA.beforeThumb, BEAR_MEDIA.afterThumb],
  },
  {
    id: 4,
    title: "Face 1 – texture cube",
    description: "Texture spécifique utilisée pour la face 1 du cube.",
    notes:
      "Permet de garder un lien direct entre la face 1 et le visuel 3D correspondant.",
    media: [
      {
        type: "photo",
        url: BEAR_MEDIA.faces[0],
        filename: "Bear – Face 1",
      },
    ],
  },
];

const bearFace2Segments: PreviewSegment[] = [
  {
    id: 1,
    title: "Diagnostic – point de départ",
    description: "Analyse de la base, historique, porosité, zones sensibles.",
    notes:
      "Identifier les risques de sur-sensibilisation avant d’appliquer le balayage.",
    media: [],
  },
  {
    id: 2,
    title: "Sectionnement",
    description: "Organisation de la tête en zones de travail.",
    notes:
      "Découpage en 4 zones principales pour bien contrôler la répartition des lumières.",
    media: [],
  },
  {
    id: 3,
    title: "Formule / Mélange",
    description: "Choix des produits, oxydant, proportions.",
    notes:
      "Décolorant à faible volume + protection fibre pour limiter la casse.",
    media: [],
  },
  {
    id: 4,
    title: "Application",
    description: "Technique, placement, temps de pose.",
    notes:
      "Balayage en V, très aéré, en évitant les longueurs déjà sensibilisées.",
    media: [],
  },
];

const bearFace1: PreviewFace = {
  title: "Face 1 – Résultat & vue globale",
  description:
    "Vue d'ensemble du balayage caramel réalisé sur la cliente, après la transformation du Bear horloger.",
  notes:
    "Face principale utilisée pour texturer le cube et donner envie d’ouvrir le Display.",
  segments: bearFace1Segments,
};

const bearFace2: PreviewFace = {
  title: "Face 2 – Technique & processus",
  description:
    "Détail du chemin technique : diagnostic, sectionnement, formules et application.",
  notes: "Permet de comprendre la logique complète de la transformation.",
  segments: bearFace2Segments,
};

// Faces 3 → 6 encore vides (tu pourras les remplir plus tard)
const emptyFace = (index: number): PreviewFace => ({
  title: `Face ${index} – (à venir)`,
  description: "Face encore vide dans ce preset.",
  notes: "",
  segments: [],
});

/**
 * Display complet pour mcw-onboarding-bear-001
 */
export const BEAR_ONBOARDING_DISPLAY: PreviewDisplay = {
  faces: [
    bearFace1,
    bearFace2,
    emptyFace(3),
    emptyFace(4),
    emptyFace(5),
    emptyFace(6),
  ],
};

/**
 * Registre de presets, par slug.
 * Plus tard : on fera un fetch DB et on gardera ceci en fallback.
 */
export const DISPLAY_PRESETS: Record<string, PreviewDisplay> = {
  "mcw-onboarding-bear-001": BEAR_ONBOARDING_DISPLAY,
};
