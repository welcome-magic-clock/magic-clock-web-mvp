// app/api/upload/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { supabaseAdmin } from "@/core/supabase/admin";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? "mc-media-dev";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

const MAX_UPLOAD_SIZE = 200 * 1024 * 1024; // 200 Mo

const r2Client =
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY
    ? new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
      })
    : null;

type InitBody = {
  filename: string;
  contentType: string;
  size?: number;
};

// Types de fichiers autorisés uniquement
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/quicktime", "video/webm",
];

export async function POST(req: NextRequest) {
  // 🔐 SÉCURITÉ — Vérifier le JWT Supabase AVANT tout
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: { user }, error: authError } =
    await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Token invalide" }, { status: 403 });
  }

  // 1) Vérifier que R2 est configuré
  if (!r2Client) {
    console.warn("[upload/init] R2 not configured – missing env vars");
    return NextResponse.json(
      { error: "R2 storage is not configured yet" },
      { status: 503 }
    );
  }

  // 2) Lire et valider le body
  let body: InitBody;
  try {
    body = (await req.json()) as InitBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { filename, contentType, size } = body;

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: "Missing filename or contentType" },
      { status: 400 }
    );
  }

  // 🔐 SÉCURITÉ — Vérifier le type de fichier
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Type de fichier non autorisé" },
      { status: 415 }
    );
  }

  if (size && size > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      { error: "File too large", maxSize: MAX_UPLOAD_SIZE },
      { status: 413 }
    );
  }

  // 3) Clé unique — organisée par userId pour isoler les données
  const safeName = filename.replace(/[^\w.\-]/g, "_");
  const key = `uploads/${user.id}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}-${safeName}`;

  // 4) URL signée PUT (5 minutes)
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: 60 * 5,
  });

  const fileUrl =
    R2_PUBLIC_DOMAIN != null ? `${R2_PUBLIC_DOMAIN}/${key}` : null;

  return NextResponse.json({
    uploadUrl,
    fileUrl,
    key,
    maxSize: MAX_UPLOAD_SIZE,
  });
}
