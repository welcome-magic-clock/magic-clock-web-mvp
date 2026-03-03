// app/api/magic-media/upload/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase/admin";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string | null) ?? "studio";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Missing file in form-data" },
        { status: 400 },
      );
    }

    const originalName = file.name || "upload.bin";
    const ext = originalName.includes(".")
      ? originalName.split(".").pop()
      : "bin";

    // 🐉 ICI : avec backticks, sinon Turbopack hurle
    const objectPath = `${folder}/${randomUUID()}.${ext}`;

    // Upload vers le bucket magic-media
    const { error: uploadError } = await supabaseAdmin.storage
      .from("magic-media")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[MagicClock] Upload error", uploadError);
      return NextResponse.json(
        { ok: false, error: uploadError.message },
        { status: 500 },
      );
    }

    // URL publique
    const { data } = supabaseAdmin.storage
      .from("magic-media")
      .getPublicUrl(objectPath);

    const publicUrl = data.publicUrl;

    return NextResponse.json({
      ok: true,
      path: objectPath,
      publicUrl, // ✅ même clé que dans magicMedia.ts
    });
  } catch (error: any) {
    console.error("[MagicClock] /api/magic-media/upload failed", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
