// core/domain/types.ts

// Types d'accès possibles à un contenu
export type AccessKind = "FREE" | "ABO" | "PPV";

// Alias pour rester compatible avec le reste du code
export type Access = AccessKind;

// Type de base pour un créateur (Meet me, profils, etc.)
export type Creator = {
  id: number;
  name: string;
  handle: string;
  city: string;
  langs: string[];
  followers: number;
  avatar: string;
  access: Access[];
  specialties?: string[]; // ex. ["Balayage", "Blond froid"]
};

// Carte du flux Amazing / contenus Magic Clock
export type FeedCard = {
  id: number;
  title: string;
  user: string;      // handle du créateur (ex. "@sofia_rivera")
  views: number;
  image: string;     // chemin image, ex. "/pictures/mp-1.png"
  access: Access;    // "FREE" | "ABO" | "PPV"
};
