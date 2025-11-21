import { NextResponse } from "next/server";
import type { Access } from "@/core/domain/types";
import { canViewContent } from "@/core/domain/access";
import { addUnlockedPpv } from "@/core/server/accessCookie";

type Body = {
  contentId: string | number;
  creatorHandle?: string;
};

/**
 * Endpoint PPV (Pay-Per-View)
 * - Ajoute l'id de contenu à la liste des contenus PPV débloqués dans le cookie.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (body.contentId == null) {
    return NextResponse.json(
      { ok: false, error: "contentId manquant" },
      { status: 400 }
    );
  }

  const viewer = await addUnlockedPpv(body.contentId);

  const content = {
    id: body.contentId,
    access: "PPV" as Access,
    user: body.creatorHandle,
  };

  const decision = canViewContent(content, viewer);

  return NextResponse.json({
    ok: true,
    access: "PPV",
    decision,
    context: viewer,
  });
}
