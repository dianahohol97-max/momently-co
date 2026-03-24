import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://momently-co.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { wedding_id, emails } = await request.json();
    if (!wedding_id || !emails?.length) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return NextResponse.json({ error: 'Email not configured' }, { status: 500 });

    const { data: wedding } = await supabase.from('weddings').select('*').eq('id', wedding_id).eq('user_id', user.id).single();
    if (!wedding) return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });

    const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
    const weddingUrl = APP_URL + '/w/' + wedding.slug;
    const date = wedding.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

    const results = [];
    for (const email of emails.slice(0, 50)) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Momently <invites@momently.co>',
            to: [email],
            subject: names + ' запрошують вас на весілля!',
            html: [
              '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;text-align:center">',
              '<p style="font-size:12px;letter-spacing:3px;color:#b8956a;text-transform:uppercase;margin-bottom:24px">Весільне запрошення</p>',
              '<h1 style="font-size:36px;color:#1a1a2e;margin:0;line-height:1.3">' + wedding.partner_name_1 + '</h1>',
              '<p style="font-size:24px;color:#b8956a;margin:8px 0;font-style:italic">&amp;</p>',
              '<h1 style="font-size:36px;color:#1a1a2e;margin:0;line-height:1.3">' + wedding.partner_name_2 + '</h1>',
              date ? '<p style="font-size:16px;color:#8a7b6b;margin-top:24px">' + date + '</p>' : '',
              '<div style="width:60px;height:1px;background:#b8956a;margin:32px auto"></div>',
              '<p style="font-size:14px;color:#8a7b6b;line-height:1.6;margin-bottom:32px">Ми будемо щасливі бачити вас на нашому святі!</p>',
              '<a href="' + weddingUrl + '" style="display:inline-block;background:#1a1a2e;color:#faf8f4;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">Відкрити запрошення</a>',
              '<p style="font-size:11px;color:#ccc;margin-top:40px">Momently.co</p>',
              '</div>',
            ].join(''),
          }),
        });
        const data = await res.json();
        results.push({ email, success: res.ok, id: data.id });

        // Update guest invitation status
        await supabase.from('guests').update({ invitation_sent: true, invitation_sent_at: new Date().toISOString() }).eq('wedding_id', wedding_id).eq('email', email);
      } catch (e: any) {
        results.push({ email, success: false, error: e.message });
      }
    }

    return NextResponse.json({ sent: results.filter(r => r.success).length, total: results.length, results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
