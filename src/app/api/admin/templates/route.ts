import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = ['gogolka16@gmail.com', 'dianahohol97@gmail.com'];

async function checkAdmin(request: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) return null;
  return supabase;
}

export async function POST(request: NextRequest) {
  const supabase = await checkAdmin(request);
  if (!supabase) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);
  const { data, error } = await supabase.from('templates').insert({
    name: body.name, slug, description: body.description || '', category: body.category || 'modern',
    price_uah: body.price_uah || 599, price_usd: body.price_usd || 15, is_premium: body.is_premium || false,
    is_active: body.is_active ?? true, display_order: body.display_order || 0,
    thumbnail_url: body.thumbnail_url || null, preview_url: body.preview_url || null,
    config_json: body.config_json || {
      colors: { primary: '#b8956a', secondary: '#8B6F4E', accent: '#E8D4C4', background: '#FDF8F4', surface: '#FFFFFF', text: '#3D3027', textMuted: '#8A7B6B', border: '#E8E0D4' },
      typography: { headingFont: 'Playfair Display', bodyFont: 'DM Sans', accentFont: 'Cormorant Garamond' },
    },
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const supabase = await checkAdmin(request);
  if (!supabase) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'Missing template id' }, { status: 400 });
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('templates').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const supabase = await checkAdmin(request);
  if (!supabase) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('templates').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
    }
