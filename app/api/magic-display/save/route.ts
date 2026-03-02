import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

function buildSlug(rawTitle: string, id: string) {
  const base =
    (rawTitle || "magic-clock")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "magic-clock";

  const shortId = id.slice(0, 8);
  return `${base}-${shortId}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id: string =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`;

    const title: string = body.title || "Magic Clock";
    const payload = body.payload;

    if (!payload) {
      return NextResponse.json(
        { error: "Missing payload" },
        { status: 400 },
      );
    }

    const slug = buildSlug(title, id);

    const { error } = await supabase.from("magic_display").insert({
      id,
      slug,
      title,
      payload,
    });

    if (error) {
      console.error("[Magic Clock] Supabase insert error", error);
      return NextResponse.json(
        { error: "Insert failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ id, slug });
  } catch (error) {
    console.error("[Magic Clock] magic-display/save error", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
