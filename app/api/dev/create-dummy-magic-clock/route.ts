// app/api/dev/create-dummy-magic-clock/route.ts
// ⚠️ Route de développement uniquement — désactivée en production
// Pour tester la création d'un Magic Clock sans passer par le Studio/Display

import { NextResponse } from "next/server";

export async function GET() {
  // ✅ Bloqué en production — cette route ne doit jamais être accessible hors dev
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "Route désactivée en production." },
      { status: 403 }
    );
  }

  // En développement uniquement
  try {
    const { insertMagicClock } = await import(
      "@/core/domain/magicClocksRepository.supabase"
    );
    const slug = `dev-test-${Date.now()}`;
    const record = await insertMagicClock({
      slug,
      creatorHandle: "dev_creator",
      creatorName: "Dev Creator",
      title: "Dev Test Magic Clock",
      subtitle: "Créé depuis la route dev (NODE_ENV=development uniquement)",
      gatingMode: "FREE",
      work: {
        studioVersion: 1,
        note: "Payload de test — dev uniquement",
      },
    });
    return NextResponse.json({ ok: true, magicClock: record });
  } catch (err: any) {
    console.error("[create-dev-magic-clock] error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
