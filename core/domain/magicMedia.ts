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
    url?: string;
    path?: string;
    error?: string;
  };

  const finalUrl = json.publicUrl ?? json.url;

  if (!json.ok || !finalUrl) {
    throw new Error(json.error || "Upload failed");
  }

  return finalUrl;
}
