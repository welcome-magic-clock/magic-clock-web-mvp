// features/display/progress.ts

export interface FaceProgressInput {
  id: number;
  /** Au moins un contenu sur la face (photo / vidéo / fichier) */
  covered: boolean;
  /** Contenu “universel” (MVP : on considère pareil que covered) */
  universalContent: boolean;
}

export function computeMagicClockPublishProgress(params: {
  studioCompleted: boolean;
  faces: FaceProgressInput[];
}) {
  const { studioCompleted, faces } = params;

  let progress = 0;
  let completedFaces = 0;
  let partialFaces = 0;

  const studioPart = studioCompleted ? 40 : 0;
  progress += studioPart;

  for (const face of faces) {
    if (face.universalContent) {
      // 5 % couverture + 5 % contenu universel
      progress += 10;
      completedFaces += 1;
    } else if (face.covered) {
      // MVP : cas où il n’y aurait que “couverture”
      progress += 5;
      partialFaces += 1;
    }
  }

  const clamped = Math.min(100, Math.max(0, progress));
  const displayPart = clamped - studioPart;

  return {
    percent: clamped,
    studioPart,
    displayPart,
    completedFaces,
    partialFaces,
  };
}
