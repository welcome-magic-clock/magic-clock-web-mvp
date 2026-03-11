// core/domain/types.ts
// ✅ v2 — stars ajouté à FeedCard pour connexion rating_avg Supabase

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
  specialties?: string[];
};

// 🔹 Alias dédié pour le flux Amazing
export type FeedAccess = "FREE" | "ABO" | "PPV";

// Carte du flux Amazing / contenus Magic Clock
export type FeedCard = {
  id: string | number;
  title: string;
  image: string;

  // AVANT / APRÈS
  beforeUrl?: string | null;
  afterUrl?: string | null;

  user: string;
  access: FeedAccess;
  views: number;

  // Champs optionnels
  likes?: number;
  stars?: number;           // ← NOUVEAU : rating_avg depuis Supabase
  creatorName?: string;
  creatorHandle?: string;
  creatorAvatar?: string;   // ← avatar_url depuis profiles
  hashtags?: string[];
  isCertified?: boolean;

  // Flags système
  isSystemFeatured?: boolean;
  isSystemUnlockedForAll?: boolean;
};
