import { NextResponse } from "next/server";

// MVP : route simplifiée pour l'accès par abonnement
export async function POST(req: Request) {
  // On récupère le body en évitant les crash si ce n'est pas du JSON
  const body = await req.json().catch(() => ({} as any));
  const contentId = body?.contentId;

  // Petit garde-fou : si pas de contentId, on renvoie une erreur propre
  if (!contentId) {
    return NextResponse.json(
      {
        ok: false,
        error: "contentId manquant",
      },
      { status: 400 }
    );
  }

  // ✅ MVP : on considère que l’accès par abonnement est toujours autorisé
  return NextResponse.json(
    {
      ok: true,
      access: "SUBSCRIPTION",
      contentId,
    },
    { status: 200 }
  );
}
