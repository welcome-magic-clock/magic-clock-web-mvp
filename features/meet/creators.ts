// features/meet/creators.ts
// ✅ Zéro mock — tableau vide.
// La page /meet charge les créateurs depuis Supabase (profiles).
// Ce tableau n'est utilisé qu'en dernier recours (Supabase inaccessible).
// En production il doit rester vide pour ne jamais servir de fausses données.
import type { Creator } from "@/core/domain/types";

export const CREATORS: Creator[] = [];

export default CREATORS;
