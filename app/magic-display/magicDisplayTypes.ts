// app/magic-display/magicDisplayTypes.ts

export type MediaType = "photo" | "video" | "file";
export type TemplateId = "BALAYAGE_4" | "COULEUR_3" | "BLOND_6";
export type PublishMode = "FREE" | "SUB" | "PPV";
export type FaceStatus = "empty" | "partial" | "full";

export type Segment = {
  id: number;
  label: string;
  description: string;
  angleDeg: number;
  hasMedia: boolean;
  mediaType?: MediaType;
  mediaUrl?: string | null;
  notes?: string;
};

export type FaceDetailsPayload = {
  faceId: number;
  faceLabel?: string;
  segmentCount: number;
  segments: {
    id: number;
    title: string;
    description?: string;
    notes?: string;
    media?: {
      type: MediaType;
      url: string;
      filename?: string;
    }[];
  }[];
  needles: {
    needle2Enabled: boolean;
  };
};

export type FaceUniversalProgress = Record<
  string,
  {
    coveredFromDetails?: boolean;
    universalContentCompleted?: boolean;
  }
>;
