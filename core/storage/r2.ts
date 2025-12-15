// core/storage/r2.ts

export type InitUploadResponse = {
  uploadUrl: string;
  fileUrl: string | null;
  key: string;
  maxSize: number;
};

/**
 * Appelle l’API /api/upload/init pour récupérer une URL signée R2.
 * Ne fait pas l’upload lui-même, il prépare juste la mise en ligne.
 */
export async function initUploadOnServer(file: File): Promise<InitUploadResponse> {
  const res = await fetch("/api/upload/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.error ?? `Upload init failed with status ${res.status}`
    );
  }

  return data as InitUploadResponse;
}

/**
 * Fait l’upload du fichier vers l’URL signée R2, puis renvoie la clé et l’URL finale.
 */
export async function uploadFileToR2(file: File): Promise<{
  key: string;
  url: string | null;
}> {
  // 1) On récupère l’URL signée + meta
  const init = await initUploadOnServer(file);

  // 2) On envoie le fichier sur R2 (PUT direct depuis le navigateur)
  const putRes = await fetch(init.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`R2 upload failed with status ${putRes.status}`);
  }

  return {
    key: init.key,
    url: init.fileUrl ?? null,
  };
}
