// core/domain/magicClockWorkStore.ts
export const CREATED_WORKS_KEY = "mc-created-works-v1";

export type StoredMagicClockWork = MagicClockWork & {
  createdAt: number;
};

export function loadCreatedWorks(): StoredMagicClockWork[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CREATED_WORKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredMagicClockWork[];
  } catch {
    return [];
  }
}

export function saveCreatedWorks(works: StoredMagicClockWork[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CREATED_WORKS_KEY, JSON.stringify(works));
  } catch {
    // ignore
  }
}

export function addCreatedWork(work: MagicClockWork) {
  const current = loadCreatedWorks();
  const withMeta: StoredMagicClockWork = {
    ...work,
    createdAt: Date.now(),
  };
  current.unshift(withMeta); // on met le dernier en premier
  saveCreatedWorks(current);
}
