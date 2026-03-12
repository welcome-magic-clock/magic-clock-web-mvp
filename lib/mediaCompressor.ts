/**
 * lib/mediaCompressor.ts
 *
 * Compression côté client avant tout upload vers Cloudflare R2.
 * Objectif : UX vitesse maximale — chaque octet compte.
 *
 * Pipeline :
 *   Image  → redimensionner (max 1920px) → encoder WebP qualité 0.82
 *   Vidéo  → extraire frame thumbnail → encoder JPEG 480p qualité 0.75
 *            → retourner File original + thumbnail File séparé
 */

export type CompressedImage = {
  file: File;           // WebP compressé, prêt pour l'upload
  width: number;
  height: number;
  originalSizeKb: number;
  compressedSizeKb: number;
};

export type VideoWithThumbnail = {
  file: File;                // Vidéo originale (pas recompressée côté client)
  thumbnailFile: File;       // JPEG 480p de la première frame utile
  thumbnailDataUrl: string;  // dataURL pour preview immédiate
  durationSeconds: number;
};

// ─── Constantes de compression ──────────────────────────────────────────────

const IMAGE_MAX_DIMENSION = 1920;   // px — côté le plus long
const IMAGE_QUALITY       = 0.82;   // WebP quality (0–1)
const THUMB_MAX_HEIGHT    = 480;    // px — thumbnail vidéo
const THUMB_QUALITY       = 0.75;   // JPEG quality
const VIDEO_SEEK_OFFSET   = 1.5;    // secondes — évite les frames noires d'intro

// ─── Utilitaires internes ───────────────────────────────────────────────────

function clampDimensions(
  w: number,
  h: number,
  max: number,
): { w: number; h: number } {
  if (w <= max && h <= max) return { w, h };
  const ratio = Math.min(max / w, max / h);
  return { w: Math.round(w * ratio), h: Math.round(h * ratio) };
}

function canvasToFile(
  canvas: HTMLCanvasElement,
  filename: string,
  mimeType: "image/webp" | "image/jpeg",
  quality: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob returned null"));
          return;
        }
        resolve(new File([blob], filename, { type: mimeType }));
      },
      mimeType,
      quality,
    );
  });
}

// ─── Image compression ──────────────────────────────────────────────────────

/**
 * Compresse une image vers WebP max 1920px.
 * Retourne immédiatement si le fichier est déjà petit (<150 KB).
 */
export async function compressImage(
  original: File,
): Promise<CompressedImage> {
  const originalSizeKb = original.size / 1024;

  // Pas besoin de compresser les petites images
  if (originalSizeKb < 150 && original.type === "image/webp") {
    return {
      file: original,
      width: 0,
      height: 0,
      originalSizeKb,
      compressedSizeKb: originalSizeKb,
    };
  }

  const bitmap = await createImageBitmap(original);
  const { w, h } = clampDimensions(
    bitmap.width,
    bitmap.height,
    IMAGE_MAX_DIMENSION,
  );

  const canvas = document.createElement("canvas");
  canvas.width  = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");

  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  // Nom de fichier : même base mais extension .webp
  const baseName = original.name.replace(/\.[^.]+$/, "");
  const webpFile = await canvasToFile(
    canvas,
    `${baseName}.webp`,
    "image/webp",
    IMAGE_QUALITY,
  );

  return {
    file: webpFile,
    width: w,
    height: h,
    originalSizeKb,
    compressedSizeKb: webpFile.size / 1024,
  };
}

// ─── Video thumbnail extraction ─────────────────────────────────────────────

/**
 * Extrait un thumbnail JPEG d'une vidéo à t = VIDEO_SEEK_OFFSET secondes.
 * Si la vidéo est trop courte, prend la frame à t = duration / 4.
 */
export async function extractVideoThumbnail(
  videoFile: File,
): Promise<VideoWithThumbnail> {
  return new Promise((resolve, reject) => {
    const video   = document.createElement("video");
    const blobUrl = URL.createObjectURL(videoFile);

    video.preload  = "metadata";
    video.muted    = true;
    video.playsInline = true;
    video.src      = blobUrl;

    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration || 0;

      // Choisir la frame la plus représentative
      const seekTo =
        duration > VIDEO_SEEK_OFFSET * 2
          ? VIDEO_SEEK_OFFSET
          : duration > 0
            ? duration / 4
            : 0;

      video.currentTime = seekTo;
    });

    video.addEventListener("seeked", async () => {
      try {
        // Dimensions pour le thumbnail
        const vw = video.videoWidth  || 1280;
        const vh = video.videoHeight || 720;
        const { w: tw, h: th } = clampDimensions(
          vw,
          vh,
          (THUMB_MAX_HEIGHT / vh) * vw > vw ? vw : Math.round((THUMB_MAX_HEIGHT / vh) * vw),
        );

        // Canvas limité à THUMB_MAX_HEIGHT
        const scale  = Math.min(1, THUMB_MAX_HEIGHT / vh);
        const finalW = Math.round(vw * scale);
        const finalH = Math.round(vh * scale);

        const canvas = document.createElement("canvas");
        canvas.width  = finalW;
        canvas.height = finalH;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No 2D context for thumbnail");

        ctx.drawImage(video, 0, 0, finalW, finalH);

        const baseName = videoFile.name.replace(/\.[^.]+$/, "");
        const thumbFile = await canvasToFile(
          canvas,
          `${baseName}_thumb.jpg`,
          "image/jpeg",
          THUMB_QUALITY,
        );

        const thumbDataUrl = canvas.toDataURL("image/jpeg", THUMB_QUALITY);

        URL.revokeObjectURL(blobUrl);

        resolve({
          file: videoFile,
          thumbnailFile: thumbFile,
          thumbnailDataUrl: thumbDataUrl,
          durationSeconds: video.duration || 0,
        });
      } catch (err) {
        URL.revokeObjectURL(blobUrl);
        reject(err);
      }
    });

    video.addEventListener("error", (e) => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error(`Video load error: ${e.type}`));
    });

    // Timeout de sécurité (10 s)
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Video thumbnail extraction timeout"));
    }, 10_000);
  });
}

// ─── Upload vers R2 via route Next.js ───────────────────────────────────────

export type UploadTarget = "studio" | "display" | "avatar";

type UploadResult = {
  url: string;         // URL publique CDN (cdn.magic-clock.com/…)
  key: string;         // Clé R2 (ex: studio/abc123.webp)
};

// ─── Seuil de bascule vers presigned URL ────────────────────────────────────
// Au-dessus de 10 MB, on contourne Vercel (limite 50 MB bodyParser)
// et on PUT directement vers R2 via une URL signée.
// Les images compressées WebP sont toujours < 2 MB → route directe suffisante.
// Les thumbnails JPEG 480p sont toujours < 200 KB → route directe suffisante.
// Les vidéos originales peuvent dépasser 50 MB → presigned obligatoire.
const PRESIGNED_THRESHOLD_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Upload d'un File vers R2.
 * - Fichier < 10 MB  → /api/r2/upload (multipart via Vercel, simple)
 * - Fichier ≥ 10 MB  → /api/upload/init (presigned URL, PUT direct vers R2)
 *   → Bypass Vercel, limite 200 MB, zéro surcharge serverless
 */
export async function uploadToR2(
  file: File,
  target: UploadTarget,
  workId?: string,
): Promise<UploadResult> {
  // ── Route presigned pour les gros fichiers (vidéos) ─────────────────────
  if (file.size >= PRESIGNED_THRESHOLD_BYTES) {
    return uploadToR2Presigned(file, workId);
  }

  // ── Route directe pour les petits fichiers (images, thumbnails) ──────────
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target", target);
  if (workId) formData.append("workId", workId);

  const res = await fetch("/api/r2/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`R2 upload failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<UploadResult>;
}

/**
 * Upload via presigned URL — PUT direct navigateur → R2, sans passer par Vercel.
 * Utilisé automatiquement pour tout fichier ≥ 10 MB (typiquement les vidéos).
 * Requiert que l'utilisateur soit authentifié (JWT Supabase en localStorage).
 */
async function uploadToR2Presigned(
  file: File,
  _workId?: string,
): Promise<UploadResult> {
  // 1) Récupérer le JWT Supabase depuis le storage local
  //    Supabase stocke la session sous la clé "sb-*-auth-token"
  let token: string | null = null;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) ?? "";
      if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.access_token ?? null;
        }
        break;
      }
    }
  } catch {
    // localStorage indisponible (SSR guard) → fallback route directe
  }

  if (!token) {
    // Pas de JWT disponible → fallback sur la route directe (max 50 MB)
    console.warn("[uploadToR2] No JWT found — falling back to direct route (50 MB limit)");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", "display");
    const res = await fetch("/api/r2/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error(`R2 fallback upload failed: ${res.status}`);
    return res.json() as Promise<UploadResult>;
  }

  // 2) Obtenir une URL signée depuis /api/upload/init
  const initRes = await fetch("/api/upload/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    }),
  });

  if (!initRes.ok) {
    const err = await initRes.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error(`Presigned init failed (${initRes.status}): ${String(err?.error ?? "")}`);
  }

  const { uploadUrl, fileUrl, key } = await initRes.json() as {
    uploadUrl: string;
    fileUrl: string | null;
    key: string;
    maxSize: number;
  };

  // 3) PUT direct navigateur → R2 (aucun byte ne transite par Vercel)
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`Presigned PUT failed: ${putRes.status}`);
  }

  // 4) URL publique CDN — fileUrl si disponible, sinon CDN_BASE + key
  const CDN_BASE = "https://cdn.magic-clock.com";
  const url = fileUrl ?? `${CDN_BASE}/${key}`;

  return { url, key };
}

// ─── Pipeline complet : compress + upload ───────────────────────────────────

export type ProcessedMedia =
  | {
      kind: "image";
      cdnUrl: string;           // URL WebP sur cdn.magic-clock.com
      localPreviewUrl: string;  // blob: URL pour preview immédiate
      width: number;
      height: number;
    }
  | {
      kind: "video";
      cdnUrl: string;           // URL vidéo originale sur CDN
      thumbnailCdnUrl: string;  // URL thumbnail JPEG sur CDN
      thumbnailDataUrl: string; // dataURL local pour preview immédiate
      durationSeconds: number;
      localPreviewUrl: string;  // blob: URL pour preview immédiate
    };

/**
 * Pipeline complet pour un fichier sélectionné par l'utilisateur :
 * 1. Créer une preview locale immédiate (blob:)
 * 2. Compresser (image) ou extraire thumbnail (vidéo)
 * 3. Uploader vers R2
 * 4. Retourner l'URL CDN publique
 *
 * onProgress(phase) permet à l'UI d'afficher l'état.
 */
export async function processAndUpload(
  file: File,
  target: UploadTarget,
  workId?: string,
  onProgress?: (phase: "compressing" | "uploading" | "done") => void,
): Promise<ProcessedMedia> {
  const isVideo = file.type.startsWith("video/");

  // Preview locale immédiate — zéro latence pour l'UX
  const localPreviewUrl = URL.createObjectURL(file);

  if (isVideo) {
    onProgress?.("compressing");

    const { thumbnailFile, thumbnailDataUrl, durationSeconds } =
      await extractVideoThumbnail(file);

    onProgress?.("uploading");

    // Upload en parallèle : vidéo originale + thumbnail
    const [videoResult, thumbResult] = await Promise.all([
      uploadToR2(file, target, workId),
      uploadToR2(thumbnailFile, target, workId),
    ]);

    onProgress?.("done");

    return {
      kind: "video",
      cdnUrl: videoResult.url,
      thumbnailCdnUrl: thumbResult.url,
      thumbnailDataUrl,
      durationSeconds,
      localPreviewUrl,
    };
  } else {
    onProgress?.("compressing");

    const { file: compressedFile, width, height } = await compressImage(file);

    onProgress?.("uploading");

    const result = await uploadToR2(compressedFile, target, workId);

    onProgress?.("done");

    return {
      kind: "image",
      cdnUrl: result.url,
      localPreviewUrl,
      width,
      height,
    };
  }
}
