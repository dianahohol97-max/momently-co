import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const body = await request.json();
    if (!body.wedding_id || !body.name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const { data: guest, error: guestErr } = await supabase.from('guests').insert({
      wedding_id: body.wedding_id, name: body.name, email: body.email || null,
      guest_group: 'other', rsvp_status: body.attending ? 'yes' : 'no',
      plus_ones: body.guests || 0, responded_at: new Date().toISOString(),
    }).select().single();

    if (guestErr) return NextResponse.json({ error: guestErr.message }, { status: 400 });

    await supabase.from('rsvp_responses').insert({
      guest_id: guest.id, wedding_id: body.wedding_id, attending: body.attending,
      plus_one_names: body.guests > 0 ? '+' + body.guests : null,
      song_request: body.songRequest || null, message: body.message || null,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
