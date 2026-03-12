// core/domain/magicMedia.ts
// ✅ v2 — Upload vers Cloudflare R2/CDN (cdn.magic-clock.com)
//         Remplace l'ancien upload Supabase Storage (double facturation supprimée)

export type MagicMediaFolder = "studio" | "display" | "segment";

// Mapping folder → target R2 (structure bucket mc-media-prod)
const FOLDER_TO_TARGET: Record<MagicMediaFolder, string> = {
  studio:  "studio",
  display: "display",
  segment: "display", // les segments vivent dans display/ côté R2
};

/**
 * Upload un fichier vers Cloudflare R2 via /api/r2/upload
 * Retourne l'URL publique CDN : https://cdn.magic-clock.com/...
 */
export async function uploadMagicMedia(
  file: File,
  folder: MagicMediaFolder = "studio",
  workId?: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target", FOLDER_TO_TARGET[folder]);
  if (workId) formData.append("workId", workId);

  const res = await fetch("/api/r2/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload R2 failed: ${res.status} – ${text}`);
  }

  const json = (await res.json()) as {
    url?: string;
    key?: string;
    error?: string;
  };

  if (!json.url) {
    throw new Error(json.error ?? "Upload R2 failed: no url returned");
  }

  return json.url; // https://cdn.magic-clock.com/display/...
}
