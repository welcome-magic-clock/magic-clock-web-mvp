// core/domain/magicStudioBridge.ts

// clé commune
export const STUDIO_FORWARD_KEY = "mc-studio-forward-v1";

export type StudioForwardMedia = {
  type: "photo" | "video";
  url: string;                // URL finale (R2 si dispo, sinon dataURL)
  coverTime?: number | null;  // seconde choisie pour la vidéo
  thumbnailUrl?: string | null; // image de couverture (dataURL ou R2)
};

export type PublishMode = "FREE" | "SUB" | "PPV";

export type StudioForwardPayload = {
  title: string;
  mode: PublishMode;
  ppvPrice?: number;
  hashtags: string[];
  before: StudioForwardMedia | null;
  after: StudioForwardMedia | null;
};
