// app/api/dev/create-dummy-magic-clock/route.ts
import { NextResponse } from "next/server";
import {
  insertMagicClock,
  type MagicClockRecord,
} from "@/core/domain/magicClocksRepository.supabase";

export async function GET() {
  try {
    const slug = `demo-${Date.now()}`;

    const record: MagicClockRecord = await insertMagicClock({
      slug,
      creatorHandle: "demo_creator",
      creatorName: "Demo Creator",
      title: "Demo Magic Clock",
      subtitle: "Créé depuis la route dev",
      gatingMode: "FREE",
      // pas de PPV pour le test
      work: {
        // Ceci est juste un exemple – plus tard on mettra le vrai JSON Studio+Display
        studioVersion: 1,
        note: "Payload de test créé depuis /api/dev/create-dummy-magic-clock",
      },
    });

    return NextResponse.json({ ok: true, magicClock: record });
  } catch (err: any) {
    console.error("[create-dummy-magic-clock] error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
