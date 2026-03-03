// core/storage/r2.ts

// ── URL publique CDN ──────────────────────────────────────────
const CDN_BASE =
  process.env.NEXT_PUBLIC_R2_CDN_URL ?? "https://cdn.magic-clock.com";

/**
 * Retourne l'URL publique CDN d'un fichier R2.
 * Usage : getPublicUrl("uploads/user-id/mon-fichier.jpg")
 */
export function getPublicUrl(key: string): string {
  return `${CDN_BASE}/${key}`;
}

// ── Types ─────────────────────────────────────────────────────
export type InitUploadResponse = {
  uploadUrl: string;
  fileUrl: string | null;
  key: string;
  maxSize: number;
};

// ── Upload sécurisé ───────────────────────────────────────────

/**
 * Appelle /api/upload/init avec le JWT Supabase pour obtenir
 * une URL signée R2. Nécessite que l'utilisateur soit connecté.
 */
export async function initUploadOnServer(
  file: File,
  token: string
): Promise<InitUploadResponse> {
  const res = await fetch("/api/upload/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔐 JWT Supabase
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error ?? `Upload init failed: ${res.status}`);
  }

  return data as InitUploadResponse;
}

/**
 * Upload complet : obtient l'URL signée puis envoie le fichier sur R2.
 * @param file    Le fichier à uploader
 * @param token   Le JWT Supabase (depuis getSupabaseBrowser().auth.getSession())
 */
export async function uploadFileToR2(
  file: File,
  token: string
): Promise<{ key: string; url: string | null }> {
  // 1) URL signée
  const init = await initUploadOnServer(file, token);

  // 2) PUT direct depuis le navigateur vers R2
  const putRes = await fetch(init.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`R2 upload failed: ${putRes.status}`);
  }

  return {
    key: init.key,
    url: init.fileUrl ?? getPublicUrl(init.key),
  };
}
