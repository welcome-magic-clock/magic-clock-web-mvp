// app/api/upload/init/route.ts
//
// Initialise un upload vers R2 en renvoyant une URL signée.

import { NextRequest, NextResponse } from "next/server";
import { getR2UploadUrl } from "@/core/storage/r2";

type UploadInitBody = {
  fileName: string;
  mimeType: string;
  size?: number;
  kind?: "image" | "video" | "file";
  clockId?: string;
  face?: number;
  segment?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<UploadInitBody>;

    const fileName = body.fileName ?? "file.bin";
    const mimeType = body.mimeType ?? "application/octet-stream";

    const ext =
      typeof fileName === "string" && fileName.includes(".")
        ? fileName.split(".").pop()
        : "bin";

    // TODO: remplacer par l'ID réel du créateur une fois l'auth en place
    const creatorId = "demo-creator";

    const clockId = body.clockId ?? "tmp-clock";
    const faceIndex = typeof body.face === "number" ? body.face : 0;
    const segmentIndex = typeof body.segment === "number" ? body.segment : 0;

    const randomSuffix = Math.random().toString(36).slice(2, 10);

    const key = [
      "creators",
      creatorId,
      "magic-clock",
      clockId,
      "faces",
      String(faceIndex),
      "segments",
      `${segmentIndex}-${Date.now()}-${randomSuffix}.${ext}`,
    ].join("/");

    const { uploadUrl, publicUrl } = await getR2UploadUrl({
      key,
      contentType: mimeType,
    });

    return NextResponse.json(
      {
        ok: true,
        uploadUrl,
        publicUrl,
        key,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/upload/init] error", error);
    return NextResponse.json(
      {
        ok: false,
        error: "UPLOAD_INIT_FAILED",
      },
      { status: 500 }
    );
  }
}
