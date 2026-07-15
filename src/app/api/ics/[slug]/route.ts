import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function icsDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: w } = await supabase
      .from('weddings')
      .select('partner_name_1, partner_name_2, wedding_date, location, venue_name, slug')
      .eq('slug', params.slug)
      .single();
    if (!w?.wedding_date) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const start = new Date(w.wedding_date);
    const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);
    const names = [w.partner_name_1, w.partner_name_2].filter(Boolean).join(' & ');
    const loc = [w.venue_name, w.location].filter(Boolean).join(', ');
    const esc = (t: string) => String(t || '').replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');

    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Momently//STD//UK', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:std-' + w.slug + '@momently.co',
      'DTSTAMP:' + icsDate(new Date()),
      'DTSTART:' + icsDate(start),
      'DTEND:' + icsDate(end),
      'SUMMARY:' + esc('Весілля — ' + names),
      loc ? 'LOCATION:' + esc(loc) : '',
      'DESCRIPTION:' + esc('Save the Date · ' + names),
      'END:VEVENT', 'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="save-the-date-' + w.slug + '.ics"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
