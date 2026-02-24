import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/core/server/supabaseClient";

export async function GET() {
  const debug = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("magic_clocks")
      .select("id, slug, creator_handle, gating_mode, ppv_price")
      .limit(5);

    if (error) {
      // On extrait proprement les infos de l'erreur
      const cleanError = {
        message: (error as any).message,
        code: (error as any).code,
        details: (error as any).details,
        hint: (error as any).hint,
        name: (error as any).name,
      };

      return NextResponse.json(
        {
          ok: false,
          step: "query",
          error: cleanError,
          debug,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        count: data?.length ?? 0,
        items: data ?? [],
        debug,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        step: "exception",
        error: {
          message: err?.message ?? String(err),
          name: err?.name,
        },
        debug,
      },
      { status: 500 }
    );
  }
}
