// core/domain/magicStudioBridge.ts

export const STUDIO_FORWARD_KEY = "mc-studio-forward-v1";

export type StudioForwardMedia = {
  type: "photo" | "video";
  url: string;               // URL finale (dataURL ou R2 plus tard)
  coverTime?: number | null; // seconde choisie dans la vidéo
  thumbnailUrl?: string | null; // ✅ image de couverture (dataURL)
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
