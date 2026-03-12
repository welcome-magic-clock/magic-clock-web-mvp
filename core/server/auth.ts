export type CurrentUser = {
  id: string;
  email?: string | null;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  // TODO:
  // Brancher ici Supabase Auth / NextAuth / autre source de session réelle
  return null;
}
