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

// 🔹 Alias dédié pour le flux Amazing (même union que AccessKind)
export type FeedAccess = "FREE" | "ABO" | "PPV";

// Carte du flux Amazing / contenus Magic Clock
export type FeedCard = {
  id: string | number;
  title: string;
  image: string;              // image de couverture principale

  // AVANT / APRÈS (optionnels pour compat mocks)
  beforeUrl?: string | null;
  afterUrl?: string | null;

  user: string;               // handle (avec ou sans @, on nettoie dans MediaCard)
  access: FeedAccess;         // "FREE" | "ABO" | "PPV"
  views: number;

  // Champs optionnels (pas obligatoires pour les anciens mocks)
  likes?: number;
  creatorName?: string;
  creatorHandle?: string;
  creatorAvatar?: string;
  hashtags?: string[];
  isCertified?: boolean;          // ✅ pastille compte certifié

  // 👇 NOUVEAU : flags pour les contenus système
  isSystemFeatured?: boolean;       // ex. l’ours tout en haut du flux
  isSystemUnlockedForAll?: boolean; // ex. déjà présent dans My Magic Clock
};
