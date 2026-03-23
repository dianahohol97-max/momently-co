import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { data: wedding, error } = await supabase.from('weddings').insert({
      user_id: user.id,
      partner_name_1: body.partner_name_1 || 'Партнер 1',
      partner_name_2: body.partner_name_2 || 'Партнер 2',
      locale: body.locale || 'ua',
      status: 'draft',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    if (body.template_id) {
      await supabase.from('wedding_templates').insert({ wedding_id: wedding.id, template_id: body.template_id, applied_to: 'all', payment_provider: 'free', amount_paid: 0 });
      await supabase.from('wedding_websites').insert({ wedding_id: wedding.id, template_id: body.template_id, pages_json: {} });
    }

    return NextResponse.json(wedding);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
