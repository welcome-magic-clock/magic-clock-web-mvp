// core/domain/types.ts

export type AccessKind = "FREE" | "ABO" | "PPV";

// Alias pour compatibilité avec le reste du code (access.ts, routes…)
export type Access = AccessKind;

export type Creator = {
  id: number;            // identifiant numérique interne
  name: string;          // ex. "Aiko Tanaka"
  handle: string;        // ex. "@aiko_tanaka"
  city: string;          // ex. "Lausanne (CH)"
  langs: string[];       // ex. ["FR", "EN", "JP"]
  followers: number;     // ex. 12400
  avatar: string;        // chemin de l'image de profil
  access: AccessKind[];  // ex. ["FREE", "ABO", "PPV"]
};

export type FeedCard = {
  id: number;
  title: string;
  user: string;       // handle ou identifiant du créateur
  views: number;
  image: string;      // chemin de la vignette
  access: AccessKind;
};
