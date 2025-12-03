import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // MVP : on autorise toujours l'accès PPV.
  // Plus tard, on branchera la vraie logique (paiements, droits d'accès, etc.).
  try {
    const body = await req.json().catch(() => null);

    return NextResponse.json(
      {
        allowed: true,
        reason: "mvp-mock",
        contentId: body?.contentId ?? null,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        allowed: false,
        reason: "invalid-request",
      },
      { status: 400 }
    );
  }
}
