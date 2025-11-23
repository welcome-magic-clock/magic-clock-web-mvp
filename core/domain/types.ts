// core/domain/types.ts

// Types d'accès (FREE / Abonnement / PPV)
export type AccessKind = "FREE" | "ABO" | "PPV";
export type Access = AccessKind;

// Créateur utilisé pour Meet me
export type Creator = {
  id: number;           // identifiant numérique interne
  name: string;         // ex. "Aiko Tanaka"
  handle: string;       // ex. "@aiko_tanaka"
  city: string;         // ex. "Lausanne (CH)"
  langs: string[];      // ex. ["FR", "EN", "JP"]
  followers: number;    // ex. 12400
  avatar: string;       // chemin de l'image de profil
  access: AccessKind[]; // ex. ["FREE", "ABO", "PPV"]

  // <- nouveau champ, facultatif, pour ne pas casser le reste du code
  specialties?: string[]; // ex. ["Balayage", "Blond froid", "Soin"]
};

// Carte utilisée dans le flux Amazing
export type FeedCard = {
  id: number;
  title: string;
  user: string;      // handle ou identifiant du créateur
  views: number;
  image: string;     // chemin de la vignette
  access: AccessKind;
};
