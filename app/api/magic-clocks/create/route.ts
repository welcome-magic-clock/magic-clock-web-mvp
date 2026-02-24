import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, gatingMode, work } = body;

    if (!title || !slug || !gatingMode) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('magic_clocks')
      .insert({
        title,
        slug,
        gating_mode: gatingMode,
        work,
        creator_handle: 'aiko_tanaka',
        creator_name: 'Aiko Tanaka',
        is_published: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error', error);
      return NextResponse.json(
        { ok: false, error: error.message ?? 'Supabase error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, magicClock: data });
  } catch (err: any) {
    console.error('Route /api/magic-clocks/create error', err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
