// core/domain/magicClockWorkStore.ts

export const CREATED_WORKS_KEY = "mc-created-works-v1";

export type PublishMode = "FREE" | "SUB" | "PPV";

/**
 * Version stockée en localStorage d'un Magic Clock publié
 * (Studio + Display) — type volontairement simple pour le MVP.
 */
export type StoredMagicClockWork = {
  id: string;
  title: string;
  creator: {
    name: string;
    handle: string;
    avatarUrl: string | null;
  };
  access: {
    mode: PublishMode;
    ppvPrice: number | null;
  };
  /**
   * Raccourci (duplication) de access.mode pour simplifier l'UI.
   * Peut être absent sur les anciens enregistrements.
   */
  mode?: PublishMode;
  hashtags: string[];
  studio: {
    beforeUrl: string;
    afterUrl: string;
  };
  // Pour le MVP on accepte n'importe quelle forme pour le Display
  display: any;
  createdAt: number;
};

function safeParse(raw: string | null): StoredMagicClockWork[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredMagicClockWork[];
  } catch {
    return [];
  }
}

/**
 * Récupère tous les Magic Clock créés (onglet "Mes créations").
 */
export function getCreatedWorks(): StoredMagicClockWork[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CREATED_WORKS_KEY);
    return safeParse(raw);
  } catch {
    console.error("Failed to read created works from storage");
    return [];
  }
}

/**
 * Ajoute un nouveau Magic Clock créé dans le localStorage.
 * Utilisé par MagicDisplayClient → handleFinalPublish.
 */
export function addCreatedWork(work: any): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getCreatedWorks();

    const normalized: StoredMagicClockWork = {
      id: String(work.id),
      title: work.title ?? "Magic Clock",
      creator: {
        name: work.creator?.name ?? "User",
        handle: work.creator?.handle ?? "@user",
        avatarUrl: work.creator?.avatarUrl ?? null,
      },
      access: {
        mode:
          (work.access?.mode as PublishMode | undefined) ??
          (work.mode as PublishMode | undefined) ??
          "FREE",
        ppvPrice:
          typeof work.access?.ppvPrice === "number"
            ? work.access.ppvPrice
            : typeof work.ppvPrice === "number"
            ? work.ppvPrice
            : null,
      },
      // 👉 on duplique le mode en racine pour l'UI
      mode:
        (work.access?.mode as PublishMode | undefined) ??
        (work.mode as PublishMode | undefined) ??
        "FREE",
      hashtags: Array.isArray(work.hashtags) ? work.hashtags : [],
      studio: {
        beforeUrl: work.studio?.beforeUrl ?? "",
        afterUrl: work.studio?.afterUrl ?? "",
      },
      display: work.display ?? null,
      createdAt:
        typeof work.createdAt === "number" ? work.createdAt : Date.now(),
    };

    const next = [...existing, normalized];
    window.localStorage.setItem(CREATED_WORKS_KEY, JSON.stringify(next));
  } catch (error) {
    console.error("Failed to add created work", error);
  }
}
