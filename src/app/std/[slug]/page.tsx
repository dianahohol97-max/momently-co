import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import SaveTheDate from '@/components/std/save-the-date';

export const dynamic = 'force-dynamic';

const FALLBACK = { background: '#FAF7F1', text: '#23241F', primary: '#B7674B', headingFont: 'Playfair Display' };

async function getStdData(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: w } = await supabase
    .from('weddings')
    .select('slug, locale, status, partner_name_1, partner_name_2, wedding_date, location, template_id')
    .eq('slug', slug)
    .single();
  if (!w || !w.partner_name_1 || !w.wedding_date) return null;
  let theme = { ...FALLBACK };
  if (w.template_id) {
    const { data: tpl } = await supabase.from('templates').select('config_json').eq('id', w.template_id).single();
    const c = tpl?.config_json?.colors || {};
    const ty = tpl?.config_json?.typography || {};
    theme = {
      background: c.background || FALLBACK.background,
      text: c.text || c.secondary || FALLBACK.text,
      primary: c.primary || FALLBACK.primary,
      headingFont: ty.headingFont || FALLBACK.headingFont,
    };
  }
  return { w, theme };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getStdData(params.slug);
  if (!data) return { title: 'Save the Date · Momently' };
  const names = data.w.partner_name_1 + ' & ' + data.w.partner_name_2;
  const date = new Date(data.w.wedding_date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  return {
    title: 'Save the Date — ' + names,
    description: names + ' · ' + date + (data.w.location ? ' · ' + data.w.location : ''),
  };
}

export default async function StdPage({ params }: { params: { slug: string } }) {
  const data = await getStdData(params.slug);
  if (!data) notFound();
  const { w, theme } = data!;
  return (
    <SaveTheDate
      slug={w.slug}
      locale={w.locale}
      partner_name_1={w.partner_name_1}
      partner_name_2={w.partner_name_2}
      wedding_date={w.wedding_date}
      location={w.location || undefined}
      published={w.status === 'published'}
      colors={{ background: theme.background, text: theme.text, primary: theme.primary }}
      headingFont={theme.headingFont}
    />
  );
}
