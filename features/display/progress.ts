// features/display/progress.ts

export interface FaceProgressInput {
  id: number;
  /**
   * Au moins un contenu sur la face (photo / vidéo / fichier).
   * → “la face existe vraiment”
   */
  covered: boolean;
  /**
   * Contenu “universel” terminé sur la face
   * (MVP : face pédagogique remplie dans l’éditeur universel).
   */
  universalContent: boolean;
}

const STUDIO_MAX = 40;   // % max réservé au Magic Studio
const DISPLAY_MAX = 60;  // % max réservé au Display (cube)

/**
 * Calcule la progression globale de publication d’un Magic Clock.
 *
 * - Studio = 0 ou 40 % (booléen studioCompleted)
 * - Display = 0 → 60 % répartis sur les faces
 *   • une face “complète” (universalContent=true) = part entière
 *   • une face seulement “couverte” (covered=true) = demi-part
 */
export function computeMagicClockPublishProgress(params: {
  studioCompleted: boolean;
  faces: FaceProgressInput[];
}) {
  const { studioCompleted, faces } = params;

  // 🔹 Part Studio (0 ou 40 %) — conservée pour compatibilité
  const studioPart = studioCompleted ? STUDIO_MAX : 0;

  let displayProgressRaw = 0;
  let completedFaces = 0;
  let partialFaces = 0;

  // On répartit les 60 % max sur le nombre de faces
  const faceCount = Math.max(1, faces.length);
  const perFaceFull = DISPLAY_MAX / faceCount;    // face complète
  const perFacePartial = perFaceFull / 2;         // face partielle

  for (const face of faces) {
    if (face.universalContent) {
      // Face “complète” : média + contenu universel
      displayProgressRaw += perFaceFull;
      completedFaces += 1;
    } else if (face.covered) {
      // Face partielle : seulement média (ou début de contenu)
      displayProgressRaw += perFacePartial;
      partialFaces += 1;
    }
  }

  // 🔒 On borne proprement la partie Display (0 → 60)
  const displayPart = Math.min(
    DISPLAY_MAX,
    Math.max(0, Math.round(displayProgressRaw)),
  );

  // Pour compatibilité : pourcentage global (Studio + Display)
  const percent = Math.min(100, studioPart + displayPart);

  return {
    percent,       // 0 → 100 (Studio + Display)
    studioPart,    // 0 ou 40
    displayPart,   // 0 → 60
    completedFaces,
    partialFaces,
  };
}
