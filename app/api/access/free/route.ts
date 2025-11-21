import { NextResponse } from "next/server";
import type { Access } from "@/core/domain/types";
import { canViewContent } from "@/core/domain/access";
import { getViewerAccessContextFromCookie } from "@/core/server/accessCookie";

type Body = {
  contentId: string | number;
  creatorHandle?: string;
};

/**
 * Endpoint FREE
 * - Ne modifie pas le cookie : le contenu est gratuit.
 * - Retourne la décision canViewContent + contexte courant.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const viewer = getViewerAccessContextFromCookie();

  const content = {
    id: body.contentId,
    access: "FREE" as Access,
    user: body.creatorHandle,
  };

  const decision = canViewContent(content, viewer);

  return NextResponse.json({
    ok: true,
    access: "FREE",
    decision,
    context: viewer,
  });
}
