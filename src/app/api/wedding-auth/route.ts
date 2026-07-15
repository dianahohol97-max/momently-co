import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { slug, password } = await request.json();
    if (!slug || !password) return NextResponse.json({ error: 'bad request' }, { status: 400 });
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data } = await supabase.from('weddings').select('guest_password').eq('slug', slug).single();
    if (!data?.guest_password || data.guest_password !== String(password).trim()) {
      return NextResponse.json({ error: 'wrong' }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set('wg_' + slug, createHash('sha256').update(data.guest_password).digest('hex'), {
      httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 60, sameSite: 'lax',
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
