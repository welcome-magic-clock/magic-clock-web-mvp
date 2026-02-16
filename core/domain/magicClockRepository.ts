// core/domain/magicClockRepository.ts

const CREATED_CLOCKS_KEY = "magic-clock:created-clocks:v1";

export type CreatedMagicClock = {
  id: string;
  createdAt: string;

  // Studio
  studio: TransformedStudioCard;

  // Display (état brut actuel du wizard)
  displayDraft: unknown; // on pourra typer plus tard
};

export function listCreatedMagicClocks(): CreatedMagicClock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CREATED_CLOCKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CreatedMagicClock[];
  } catch {
    return [];
  }
}

export function saveCreatedMagicClock(clock: CreatedMagicClock) {
  if (typeof window === "undefined") return;
  const existing = listCreatedMagicClocks();
  const updated = [...existing, clock];
  localStorage.setItem(CREATED_CLOCKS_KEY, JSON.stringify(updated));
}
