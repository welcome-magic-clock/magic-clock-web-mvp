// core/storage/r2.ts
//
// Client R2 (S3 compatible) pour Magic Clock.
// Ne sera utilisé que côté serveur (API routes / actions).

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN; // ex: https://media.magic-clock.com

if (!ACCOUNT_ID) {
  console.warn("[R2] R2_ACCOUNT_ID n'est pas défini. R2 est inactif pour l'instant.");
}

const r2Client =
  ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY
    ? new S3Client({
        region: "auto",
        endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: ACCESS_KEY_ID,
          secretAccessKey: SECRET_ACCESS_KEY,
        },
      })
    : null;

export type R2UploadParams = {
  key: string; // chemin dans le bucket (ex: creators/123/magic-clock/...)
  contentType: string;
  expiresInSeconds?: number;
};

export type R2UploadResult = {
  uploadUrl: string;
  publicUrl: string;
  bucket: string;
  key: string;
};

export async function getR2UploadUrl(
  params: R2UploadParams
): Promise<R2UploadResult> {
  if (!r2Client || !BUCKET_NAME) {
    throw new Error("[R2] R2 n'est pas configuré (variables d'environnement manquantes).");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: params.key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: params.expiresInSeconds ?? 3600, // 1h
  });

  const publicUrl = PUBLIC_DOMAIN
    ? `${PUBLIC_DOMAIN}/${params.key}`
    : `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${params.key}`;

  return {
    uploadUrl,
    publicUrl,
    bucket: BUCKET_NAME,
    key: params.key,
  };
}