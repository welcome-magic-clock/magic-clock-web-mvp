import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/core/supabase/admin'; // client avec SERVICE_ROLE_KEY

export async function POST(req: Request) {
  const body = await req.json();
  const { title, slug, gatingMode, work } = body;

  const { data, error } = await supabaseAdmin
    .from('magic_clocks')
    .insert({
      title,
      slug,
      gating_mode: gatingMode,
      work, // JSON du Magic Clock
      creator_handle: 'aiko_tanaka',
      creator_name: 'Aiko Tanaka',
      is_published: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error', error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, magicClock: data });
}
