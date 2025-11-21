import { NextResponse } from "next/server";
import type { Access } from "@/core/domain/types";
import { canViewContent } from "@/core/domain/access";
import { addSubscription } from "@/core/server/accessCookie";

type Body = {
  creatorHandle: string;
  contentId?: string | number;
};

/**
 * Endpoint ABONNEMENT (Abo)
 * - Ajoute le créateur à la liste des abonnements dans le cookie.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (!body.creatorHandle) {
    return NextResponse.json(
      { ok: false, error: "creatorHandle manquant" },
      { status: 400 }
    );
  }

  const viewer = await addSubscription(body.creatorHandle);

  let decision: string | null = null;
  if (body.contentId != null) {
    const content = {
      id: body.contentId,
      access: "ABO" as Access,
      user: body.creatorHandle,
    };
    decision = canViewContent(content, viewer);
  }

  return NextResponse.json({
    ok: true,
    access: "ABO",
    decision,
    context: viewer,
  });
}
