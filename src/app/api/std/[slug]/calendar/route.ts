import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function icsEscape(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: w } = await supabase
      .from('weddings')
      .select('slug, partner_name_1, partner_name_2, wedding_date, location')
      .eq('slug', params.slug)
      .single();
    if (!w?.wedding_date) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const d = new Date(w.wedding_date);
    const end = new Date(d.getTime() + 6 * 3600 * 1000);
    const p = (n: number) => String(n).padStart(2, '0');
    const local = (x: Date) => `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
    const now = new Date();
    const stampUtc = `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}T${p(now.getUTCHours())}${p(now.getUTCMinutes())}00Z`;
    const names = [w.partner_name_1, w.partner_name_2].filter(Boolean).join(' & ');

    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Momently//Save the Date//UK', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:std-' + w.slug + '@momently.co',
      'DTSTAMP:' + stampUtc,
      'DTSTART:' + local(d),
      'DTEND:' + local(end),
      'SUMMARY:' + icsEscape('💍 ' + names),
      w.location ? 'LOCATION:' + icsEscape(w.location) : '',
      'DESCRIPTION:' + icsEscape('Save the Date · momently.co/std/' + w.slug),
      'END:VEVENT', 'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="save-the-date-' + w.slug + '.ics"',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
