// clé commune
export const STUDIO_FORWARD_KEY = "mc-magic-studio-last-v1";

export type StudioForwardMedia = {
  type: "photo" | "video";
  url: string;
};

export type StudioForwardPayload = {
  title: string;
  mode: "FREE" | "PPV" | "SUB";
  ppvPrice?: number;
  hashtags: string[];
  before?: StudioForwardMedia | null;
  after?: StudioForwardMedia | null;
};
