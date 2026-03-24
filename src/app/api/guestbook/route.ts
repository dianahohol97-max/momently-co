import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const body = await request.json();
    if (!body.wedding_id || !body.guest_name || !body.content_text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const { data, error } = await supabase.from('guestbook_entries').insert({
      wedding_id: body.wedding_id,
      guest_name: body.guest_name,
      entry_type: 'text',
      content_text: body.content_text,
    }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
