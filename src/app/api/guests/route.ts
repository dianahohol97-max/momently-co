import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const body = await request.json();
    const { data, error } = await supabase.from('guests').insert({
      wedding_id: body.wedding_id,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      guest_group: body.guest_group || 'friends',
      plus_ones: body.plus_ones || 0,
    }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
