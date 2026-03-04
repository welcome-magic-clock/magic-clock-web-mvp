/**
 * app/api/r2/upload/route.ts
 *
 * Route Next.js (App Router) pour uploader des fichiers vers Cloudflare R2.
 *
 * Variables d'environnement requises (dans .env.local + Vercel) :
 *   R2_ACCOUNT_ID          → ID du compte Cloudflare
 *   R2_ACCESS_KEY_ID       → Access Key ID du token R2
 *   R2_SECRET_ACCESS_KEY   → Secret Access Key du token R2
 *   R2_BUCKET_NAME         → "mc-media-prod"
 *   R2_PUBLIC_CDN_BASE     → "https://cdn.magic-clock.com" (après custom domain)
 *
 * Endpoint : POST /api/r2/upload
 * Body     : multipart/form-data
 *   - file    : File
 *   - target  : "studio" | "display" | "avatar"
 *   - workId? : string (optionnel, pour organiser dans un dossier)
 *
 * Retourne : { url: string, key: string }
 */

import { NextRequest, NextResponse } from "next/server";

// Max file size : 50 MB (limite Cloudflare R2 par objet en un upload simple)
const MAX_SIZE_BYTES = 50 * 1024 * 1024;

// Extensions autorisées par cible
const ALLOWED_MIME: Record<string, string[]> = {
  studio:  ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"],
  display: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime", "application/pdf"],
  avatar:  ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

// Mapping mime → extension propre
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg":       "jpg",
  "image/png":        "png",
  "image/webp":       "webp",
  "image/gif":        "gif",
  "video/mp4":        "mp4",
  "video/webm":       "webm",
  "video/quicktime":  "mov",
  "application/pdf":  "pdf",
};

function generateKey(
  target: string,
  workId: string | null,
  originalName: string,
  mimeType: string,
): string {
  const ext = MIME_TO_EXT[mimeType] ?? originalName.split(".").pop() ?? "bin";
  const uniqueId = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const ts = Date.now();

  // Structure : target/[workId/]timestamp_uniqueId.ext
  // Exemple   : display/abc123/1709999999999_a1b2c3d4e5f6g7h8.webp
  const parts = [target];
  if (workId) parts.push(workId);
  parts.push(`${ts}_${uniqueId}.${ext}`);

  return parts.join("/");
}

export async function POST(req: NextRequest) {
  try {
    // ── Vérifications env ────────────────────────────────────────────────────
    const accountId      = process.env.R2_ACCOUNT_ID;
    const accessKeyId    = process.env.R2_ACCESS_KEY_ID;
    const secretKey      = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName     = process.env.R2_BUCKET_NAME ?? "mc-media-prod";
    const cdnBase        = process.env.R2_PUBLIC_CDN_BASE ?? "https://cdn.magic-clock.com";

    if (!accountId || !accessKeyId || !secretKey) {
      console.error("[R2 Upload] Missing R2 environment variables");
      return NextResponse.json(
        { error: "R2 not configured" },
        { status: 500 },
      );
    }

    // ── Parse multipart ──────────────────────────────────────────────────────
    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    const target   = (formData.get("target") as string | null) ?? "display";
    const workId   = (formData.get("workId") as string | null) ?? null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ── Taille ───────────────────────────────────────────────────────────────
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_SIZE_BYTES / 1024 / 1024} MB)` },
        { status: 413 },
      );
    }

    // ── MIME type ────────────────────────────────────────────────────────────
    const mimeType     = file.type;
    const allowedMimes = ALLOWED_MIME[target] ?? ALLOWED_MIME.display;

    if (!allowedMimes.includes(mimeType)) {
      return NextResponse.json(
        { error: `MIME type not allowed: ${mimeType}` },
        { status: 415 },
      );
    }

    // ── Clé R2 ───────────────────────────────────────────────────────────────
    const key = generateKey(target, workId, file.name, mimeType);

    // ── Upload vers R2 via S3-compatible API ──────────────────────────────────
    // On utilise l'API S3 de R2 directement (pas besoin du SDK AWS)
    const r2Endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    const uploadUrl  = `${r2Endpoint}/${bucketName}/${key}`;

    // Conversion File → ArrayBuffer pour fetch
    const arrayBuffer = await file.arrayBuffer();

    // Date pour la signature AWS SigV4
    const now        = new Date();
    const dateISO    = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
    const dateShort  = dateISO.slice(0, 8);
    const region     = "auto";
    const service    = "s3";

    // Construction de la signature AWS SigV4
    const signedHeaders = await signR2Request({
      method: "PUT",
      url: uploadUrl,
      body: arrayBuffer,
      mimeType,
      accessKeyId,
      secretKey,
      region,
      service,
      dateISO,
      dateShort,
    });

    const uploadRes = await fetch(uploadUrl, {
      method:  "PUT",
      headers: {
        "Content-Type":   mimeType,
        "Content-Length": String(arrayBuffer.byteLength),
        ...signedHeaders,
      },
      body: arrayBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("[R2 Upload] R2 PUT failed:", uploadRes.status, errText);
      return NextResponse.json(
        { error: `R2 upload failed: ${uploadRes.status}` },
        { status: 502 },
      );
    }

    // ── URL publique CDN ──────────────────────────────────────────────────────
    const publicUrl = `${cdnBase}/${key}`;

    return NextResponse.json({
      url: publicUrl,
      key,
    });
  } catch (err) {
    console.error("[R2 Upload] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ─── AWS SigV4 pour R2 ──────────────────────────────────────────────────────
// R2 est compatible S3 — on doit signer avec HMAC-SHA256

async function hmacSHA256(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
}

async function sha256Hex(data: ArrayBuffer | string): Promise<string> {
  const buffer =
    typeof data === "string" ? new TextEncoder().encode(data) : data;
  const hash   = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signR2Request(params: {
  method: string;
  url: string;
  body: ArrayBuffer;
  mimeType: string;
  accessKeyId: string;
  secretKey: string;
  region: string;
  service: string;
  dateISO: string;
  dateShort: string;
}): Promise<Record<string, string>> {
  const {
    method, url, body, mimeType,
    accessKeyId, secretKey,
    region, service,
    dateISO, dateShort,
  } = params;

  const parsedUrl  = new URL(url);
  const host       = parsedUrl.host;
  const pathName   = parsedUrl.pathname;
  const bodyHash   = await sha256Hex(body);

  // Headers à signer
  const headers: Record<string, string> = {
    "host":               host,
    "content-type":       mimeType,
    "x-amz-content-sha256": bodyHash,
    "x-amz-date":         dateISO,
  };

  const sortedHeaderKeys = Object.keys(headers).sort();
  const canonicalHeaders = sortedHeaderKeys
    .map((k) => `${k}:${headers[k]}\n`)
    .join("");
  const signedHeadersStr = sortedHeaderKeys.join(";");

  // Canonical request
  const canonicalRequest = [
    method,
    pathName,
    "", // query string vide
    canonicalHeaders,
    signedHeadersStr,
    bodyHash,
  ].join("\n");

  const credentialScope = `${dateShort}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    dateISO,
    credentialScope,
    await sha256Hex(new TextEncoder().encode(canonicalRequest)),
  ].join("\n");

  // Signing key
  const enc = new TextEncoder();
  const kDate    = await hmacSHA256(enc.encode(`AWS4${secretKey}`), dateShort);
  const kRegion  = await hmacSHA256(kDate,    region);
  const kService = await hmacSHA256(kRegion,  service);
  const kSigning = await hmacSHA256(kService, "aws4_request");

  const signatureBuffer = await hmacSHA256(kSigning, stringToSign);
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const authHeader =
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeadersStr}, Signature=${signature}`;

  return {
    Authorization:          authHeader,
    "x-amz-date":           dateISO,
    "x-amz-content-sha256": bodyHash,
  };
}
