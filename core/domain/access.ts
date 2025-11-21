import type { Access, FeedCard } from "./types";

export type AccessDecision =
  | "ALLOWED"
  | "LOCKED_LOGIN"
  | "LOCKED_ABO"
  | "LOCKED_PPV";

export type ViewerAccessContext = {
  // Utilisateur connecté ou non
  isAuthenticated: boolean;
  // Rôles spéciaux (créateur qui consulte ses propres contenus, admin, etc.)
  isCreator?: boolean;
  isAdmin?: boolean;
  // Handles des créateurs auxquels l'utilisateur est abonné
  subscriptions?: string[]; // ex: ["aiko", "sofia"]
  // IDs de contenus PPV déjà débloqués
  unlockedPpvContentIds?: string[]; // ex: ["1", "7"]
};

type MinimalContent = {
  id: string;
  access: Access;
  user?: string; // handle créateur, si disponible
};

/**
 * Fonction centrale pour décider si un utilisateur peut voir un contenu.
 *
 * Règles MVP :
 * - FREE : tout le monde voit.
 * - ABO :
 *   - si pas connecté → LOCKED_LOGIN
 *   - si connecté mais pas abonné au créateur → LOCKED_ABO
 *   - si abonné → ALLOWED
 * - PPV :
 *   - si pas connecté → LOCKED_LOGIN
 *   - si connecté mais pas débloqué → LOCKED_PPV
 *   - si débloqué → ALLOWED
 * - Admin / créateur lui-même : ALLOWED.
 */
export function canViewContent(
  content: MinimalContent | FeedCard,
  viewer: ViewerAccessContext
): AccessDecision {
  const { isAuthenticated, isCreator, isAdmin } = viewer;
  const subs = new Set(viewer.subscriptions ?? []);
  const unlocked = new Set(viewer.unlockedPpvContentIds ?? []);

  const access: Access = (content as any).access;
  const creatorHandle: string | undefined = (content as any).user;

  // Cas simple : contenu gratuit
  if (access === "FREE") {
    return "ALLOWED";
  }

  // Si pas connecté et contenu non-gratuit → login d'abord
  if (!isAuthenticated) {
    return "LOCKED_LOGIN";
  }

  // Admins et créateurs (sur leurs propres contenus) voient toujours tout
  if (isAdmin || isCreator) {
    return "ALLOWED";
  }

  if (access === "ABO") {
    if (creatorHandle && subs.has(creatorHandle)) {
      return "ALLOWED";
    }
    return "LOCKED_ABO";
  }

  if (access === "PPV") {
    if (unlocked.has((content as any).id)) {
      return "ALLOWED";
    }
    return "LOCKED_PPV";
  }

  // Sécurité : par défaut, on refuse
  return "LOCKED_LOGIN";
}

/**
 * Petit helper pour l'UI : traduit une décision en message court.
 */
export function explainAccessDecision(decision: AccessDecision): string {
  switch (decision) {
    case "ALLOWED":
      return "Accès autorisé";
    case "LOCKED_LOGIN":
      return "Connecte-toi pour voir ce contenu.";
    case "LOCKED_ABO":
      return "Abonne-toi au créateur pour débloquer ce contenu.";
    case "LOCKED_PPV":
      return "Achète ce contenu (PPV) pour le débloquer.";
    default:
      return "Accès restreint.";
  }
}
