// clé commune
// core/domain/magicStudioBridge.ts

export const STUDIO_FORWARD_KEY = "mc-studio-forward-v1";

export type StudioForwardMedia = {
  type: "photo" | "video";
  url: string;               // URL finale (R2 si dispo, sinon dataURL)
  coverTime?: number | null; // pour les vidéos uniquement (seconde choisie)
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
