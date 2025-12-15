// clé commune
export const STUDIO_FORWARD_KEY = "mc-magic-studio-last-v1";

export type StudioForwardMedia = {
  type: "photo" | "video";
  url: string;                 // URL pour lecture (R2 si dispo, sinon dataURL)
  coverTime?: number | null;   // pour les vidéos seulement
};

export type StudioForwardPayload = {
  title: string;
  mode: "FREE" | "SUB" | "PPV";
  ppvPrice?: number;
  hashtags: string[];
  before: StudioForwardMedia | null;
  after: StudioForwardMedia | null;
};

export const STUDIO_FORWARD_KEY = "mc-studio-forward-v1";

export type StudioForwardPayload = {
  title: string;
  mode: "FREE" | "PPV" | "SUB";
  ppvPrice?: number;
  hashtags: string[];
  before?: StudioForwardMedia | null;
  after?: StudioForwardMedia | null;
};
