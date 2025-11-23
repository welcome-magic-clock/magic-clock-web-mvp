import { NextResponse } from "next/server";
import { canViewContent } from "@/core/domain/access";
import { addUnlockedPpv } from "@/core/server/accessCookie";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Décision d’accès (même logique qu’avant, mais sans typage Access)
    const decision = canViewContent(body);

    // Si l’accès PPV est autorisé, on mémorise le contenu comme “débloqué”
    if (decision?.allowed && body?.contentId) {
      addUnlockedPpv(body.contentId);
    }

    return NextResponse.json(decision);
  } catch (error) {
    console.error("[access/ppv] error:", error);
    return NextResponse.json(
      { allowed: false, reason: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
