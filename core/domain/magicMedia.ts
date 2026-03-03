// core/domain/magicMedia.ts

export type MagicMediaFolder = "studio" | "display" | "segment";

export async function uploadMagicMedia(
  file: File,
  folder: MagicMediaFolder = "studio",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/magic-media/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} – ${text}`);
  }

  const json = (await res.json()) as {
    ok: boolean;
    publicUrl?: string;
    path?: string;
    error?: string;
  };

  if (!json.ok || !json.publicUrl) {
    throw new Error(json.error || "Upload failed");
  }

  // On renvoie directement l’URL publique à stocker dans le Display/Studio
  return json.publicUrl;
}
