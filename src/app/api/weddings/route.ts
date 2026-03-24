import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

function genSlug(n1: string, n2: string): string {
  const b = (n1 + '-' + n2).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
  return b + '-' + Math.random().toString(36).slice(2, 8);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const name1 = body.partner_name_1 || 'Partner 1';
    const name2 = body.partner_name_2 || 'Partner 2';

    const { data: wedding, error } = await supabase.from('weddings').insert({
      user_id: user.id,
      partner_name_1: name1,
      partner_name_2: name2,
      slug: genSlug(name1, name2),
      wedding_date: body.wedding_date || null,
      ceremony_time: body.ceremony_time || null,
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
      }import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

function generateSlug(name1: string, name2: string): string {
  const base = (name1 + '-' + name2)
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04ff]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
  const rand = Math.random().toString(36).slice(2, 8);
  return base + '-' + rand;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const name1 = body.partner_name_1 || 'Partner 1';
    const name2 = body.partner_name_2 || 'Partner 2';
    const slug = generateSlug(name1, name2);

    const { data: wedding, error } = await supabase.from('weddings').insert({
      user_id: user.id,
      partner_name_1: name1,
      partner_name_2: name2,
      slug: slug,
      wedding_date: body.wedding_date || null,
      ceremony_time: body.ceremony_time || null,
      locale: body.locale || 'ua',
      status: 'draft',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    if (body.template_id) {
      await supabase.from('wedding_templates').insert({
        wedding_id: wedding.id,
        template_id: body.template_id,
        applied_to: 'all',
        payment_provider: 'free',
        amount_paid: 0,
      });
      await supabase.from('wedding_websites').insert({
        wedding_id: wedding.id,
        template_id: body.template_id,
        pages_json: {},
      });
    }

    return NextResponse.json(wedding);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
      }import { NextRequest, NextResponse } from 'next/server';
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
