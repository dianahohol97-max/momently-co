import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: { slug: string } }) {
  let names = 'Save the Date';
  let date = '';
  let loc = '';
  let bg = '#FAF7F1';
  let text = '#23241F';
  let accent = '#B7674B';
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: w } = await supabase
      .from('weddings')
      .select('partner_name_1, partner_name_2, wedding_date, location, template_id')
      .eq('slug', params.slug)
      .single();
    if (w?.partner_name_1) {
      names = w.partner_name_1 + ' & ' + w.partner_name_2;
      date = new Date(w.wedding_date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
      loc = w.location || '';
      if (w.template_id) {
        const { data: tpl } = await supabase.from('templates').select('config_json').eq('id', w.template_id).single();
        const c = tpl?.config_json?.colors || {};
        bg = c.background || bg; text = c.text || c.secondary || text; accent = c.primary || accent;
      }
    }
  } catch { /* fall back to defaults */ }

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: bg, color: text, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, right: 24, bottom: 24, border: '2px solid ' + accent, opacity: 0.5, display: 'flex' }} />
        <div style={{ fontSize: 26, letterSpacing: 14, textTransform: 'uppercase', color: accent, display: 'flex' }}>SAVE THE DATE</div>
        <div style={{ fontSize: 92, marginTop: 30, marginBottom: 26, fontFamily: 'Georgia, serif', display: 'flex', textAlign: 'center', padding: '0 60px' }}>{names}</div>
        <div style={{ fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', display: 'flex' }}>{date}</div>
        {loc ? <div style={{ fontSize: 24, marginTop: 14, opacity: 0.75, display: 'flex' }}>{loc}</div> : null}
        <div style={{ position: 'absolute', bottom: 44, fontSize: 16, letterSpacing: 6, textTransform: 'uppercase', opacity: 0.45, display: 'flex' }}>MOMENTLY.CO</div>
      </div>
    ),
    size
  );
}
