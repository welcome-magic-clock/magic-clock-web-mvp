// features/display/displayPresets.ts
import type {
  PreviewDisplay,
  PreviewFace,
  PreviewSegment,
  PreviewMedia,
} from "./MagicDisplayPreviewShell";

/**
 * Médias principaux pour texturer chaque face du cube Bear.
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
  filename: "Face 6 – Ambiance & mood",
};

/**
 * Face 1 – Résultat & vue globale
 * → Objectif : vendre le rêve, montrer le "pourquoi" avant le "comment".
 */
const bearFace1: PreviewFace = {
  title: "Face 1 – Résultat & vue globale",
  description:
    "Face principale utilisée pour texturer le cube et donner envie d’ouvrir le Display.",
  notes:
    "Vue finale du balayage caramel, avec le Bear en arrière-plan : c’est la promesse visuelle que verra le client sur Amazing.",
  segments: [
    {
      id: 1,
      title: "Résultat final – vue de face",
      description: "Vue globale de la transformation terminée, face caméra.",
      notes:
        "Tu montres ici le résultat que tu veux que le client associe à ton travail : brillance, douceur, mouvement.",
      media: [bearFace1Photo],
    },
    {
      id: 2,
      title: "Résultat final – perception cliente",
      description:
        "Comment la cliente se voit et se sent avec ce nouveau balayage.",
      notes:
        "Ce segment est pensé pour le discours émotionnel : confiance retrouvée, mise en valeur du teint, effet 'wow'.",
      media: [bearFace1Photo],
    },
  ],
};

/**
 * Face 2 – Technique & processus global
 * → Objectif : donner la carte d’ensemble du parcours technique.
 */
const bearFace2: PreviewFace = {
  title: "Face 2 – Technique & processus",
  description:
    "Vue synthétique du chemin technique : diagnostic, sectionnement, application, patine.",
  notes:
    "Face de survol pour un coiffeur : il comprend d’un coup d’œil la logique d’ensemble avant d’entrer dans le détail.",
  segments: [
    {
      id: 1,
      title: "Diagnostic rapide",
      description:
        "Analyse de la base, des anciennes mèches et de la porosité.",
      notes:
        "Cheveux sensibilisés, anciennes colorations, besoin d’un résultat lumineux mais contrôlé. On décide de rester dans des tons caramel/beige.",
      media: [bearFace2Photo],
    },
    {
      id: 2,
      title: "Sectionnement global",
      description: "Organisation de la tête en zones de travail.",
      notes:
        "Découpage en 4 zones principales pour garder le contrôle sur la répartition des lumières : nuque, côtés, sommet, contour du visage.",
      media: [bearFace2Photo],
    },
    {
      id: 3,
      title: "Choix des produits",
      description: "Décolorant, oxydant, protection fibre.",
      notes:
        "Décolorant à faible volume + additif protecteur pour limiter la casse et garder un maximum de douceur.",
      media: [bearFace2Photo],
    },
    {
      id: 4,
      title: "Application & patine",
      description: "Vue d’ensemble des temps de pose et de la patine.",
      notes:
        "Temps de pose contrôlé par zones + patine beige caramel pour garder de la chaleur maîtrisée sans virer cuivré.",
      media: [bearFace2Photo],
    },
  ],
};

/**
 * Face 3 – Détails de l’application
 * → Objectif : zoomer sur les placements de lumière.
 */
const bearFace3: PreviewFace = {
  title: "Face 3 – Détails de l’application",
  description:
    "Zoom sur les placements de lumière et la douceur des transitions.",
  notes:
    "Face idéale pour un coiffeur qui veut reproduire le geste et comprendre la répartition exacte des mèches.",
  segments: [
    {
      id: 1,
      title: "Placement contour du visage",
      description:
        "Lumières plus marquées autour du visage pour créer l’effet halo.",
      notes:
        "On intensifie légèrement le balayage autour du visage pour éclairer le regard sans créer de barre trop marquée.",
      media: [bearFace3Photo],
    },
    {
      id: 2,
      title: "Sections du sommet",
      description:
        "Gestion du sommet pour éviter l’effet “casque” ou zébrures.",
      notes:
        "Placements alternés (mèches prises / laissées) pour conserver de la profondeur à la racine et du relief sur les longueurs.",
      media: [bearFace3Photo],
    },
    {
      id: 3,
      title: "Transitions longueurs / pointes",
      description:
        "Comment adoucir la jonction entre la base et les pointes éclaircies.",
      notes:
        "On fond la transition en brossant légèrement le produit vers la racine et en saturant davantage les pointes.",
      media: [bearFace3Photo],
    },
  ],
};

/**
 * Face 4 – Avant & diagnostic
 * → Objectif : montrer le point de départ et la réflexion technique.
 */
const bearFace4: PreviewFace = {
  title: "Face 4 – Avant & diagnostic",
  description:
    "Met en avant l’état initial de la chevelure avant la transformation.",
  notes:
    "Face de référence pour que le client et le coiffeur visualisent le “avant / après” et la difficulté technique.",
  segments: [
    {
      id: 1,
      title: "Avant – vue globale",
      description: "État de départ de la cliente avant le balayage.",
      notes:
        "Cheveux éventuellement ternes, manque de relief, anciennes mèches ou couleur qui ont perdu en fraîcheur.",
      media: [bearFace4Photo],
    },
    {
      id: 2,
      title: "Historique technique",
      description: "Ce qui a été fait sur les cheveux dans le passé.",
      notes:
        "Anciennes colorations, balayages, lissages, etc. Ces informations orientent les choix de produits et d’oxydant.",
      media: [bearFace4Photo],
    },
    {
      id: 3,
      title: "Objectifs de la cliente",
      description: "Résultat souhaité vs limites techniques possibles.",
      notes:
        "Souhait de luminosité sans tomber dans un blond froid ; garder une identité chaleureuse et douce, adaptée à son teint.",
      media: [bearFace4Photo],
    },
  ],
};

/**
 * Face 5 – Processus en cours
 * → Objectif : rassurer et expliquer ce qui se passe “pendant”.
 */
const bearFace5: PreviewFace = {
  title: "Face 5 – Processus en cours",
  description:
    "Instantanés pendant la réalisation pour montrer le geste et la technique.",
  notes:
    "Face qui montre que le résultat n’est pas magique : il y a une vraie méthodologie derrière chaque balayage réussi.",
  segments: [
    {
      id: 1,
      title: "Application des mèches",
      description: "Moments clés du travail en salon.",
      notes:
        "Placement régulier, contrôle de la tension des mèches, travail en surface pour un effet fondu.",
      media: [bearFace5Photo],
    },
    {
      id: 2,
      title: "Contrôle des temps de pose",
      description: "Surveillance visuelle des éclaircissements.",
      notes:
        "On vérifie régulièrement l’éclaircissement des mèches pour éviter la sur-décoloration, surtout sur zones sensibilisées.",
      media: [bearFace5Photo],
    },
    {
      id: 3,
      title: "Rinçage & soin",
      description:
        "Étapes avant la patine pour préserver au mieux la fibre.",
      notes:
        "Rinçage soigneux, essorage délicat, application d’un soin profond avant la patine pour préparer la fibre.",
      media: [bearFace5Photo],
    },
  ],
};

/**
 * Face 6 – Ambiance & mood
 * → Objectif : story / émotion / communication client.
 */
const bearFace6: PreviewFace = {
  title: "Face 6 – Ambiance & mood",
  description:
    "Met l’accent sur l’ambiance, le sourire et la complicité avec le Bear.",
  notes:
    "Face plus émotionnelle, parfaite pour la communication : réseaux sociaux, storytelling, expérience cliente.",
  segments: [
    {
      id: 1,
      title: "Sourire & confiance",
      description: "Focus sur la satisfaction de la cliente.",
      notes:
        "On montre que le résultat ne se limite pas aux cheveux : c’est une transformation de l’humeur et de la confiance.",
      media: [bearFace6Photo],
    },
    {
      id: 2,
      title: "Complicité avec le Bear",
      description: "L’univers Magic Clock & Bear dans le salon.",
      notes:
        "On ancre la scène dans l’univers Magic Clock : le Bear horloger comme compagnon du moment beauté.",
      media: [bearFace6Photo],
    },
    {
      id: 3,
      title: "Communication & réseaux",
      description: "Contenus que le salon peut partager ensuite.",
      notes:
        "Idéal pour une story ou un post : coucher de soleil, sourire, cheveux en mouvement, Bear dans le cadre.",
      media: [bearFace6Photo],
    },
  ],
};

/**
 * Display complet pour mcw-onboarding-bear-001
 */
export const BEAR_ONBOARDING_DISPLAY: PreviewDisplay = {
  faces: [bearFace1, bearFace2, bearFace3, bearFace4, bearFace5, bearFace6],

  // 🐻 Métadonnées créateur pour le cercle (face arrière)
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
