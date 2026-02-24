import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/core/server/supabaseClient";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const client = getSupabaseServerClient();

    const { data, error } = await client
      .from("magic_clocks")
      .select("*")
      .limit(5);

    if (error) {
      return NextResponse.json({
        ok: false,
        step: "query",
        error: error.message,
      });
    }

    return NextResponse.json({
      ok: true,
      envDebug: {
        urlStartsWith: url?.slice(0, 40),
        anonLength: anon?.length ?? 0,
        serviceLength: service?.length ?? 0,
      },
      count: data?.length ?? 0,
      items: data ?? [],
    });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      step: "catch",
      error: String(e?.message ?? e),
    });
  }
}
