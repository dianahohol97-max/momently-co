import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import SaveTheDateView, { type StdTheme } from '@/components/std/save-the-date-view';

export const dynamic = 'force-dynamic';

const FALLBACK_THEME: StdTheme = {
  background: '#FAF7F1', text: '#23241F', accent: '#B7674B',
  headingFont: 'Playfair Display', bodyFont: 'Golos Text', accentFont: 'Bad Script',
};

async function getWedding(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: wedding } = await supabase
    .from('weddings')
    .select('slug, locale, status, partner_name_1, partner_name_2, wedding_date, wedding_date_written, location, hero_bg_url, template_id')
    .eq('slug', slug)
    .single();
  if (!wedding) return null;
  let theme = FALLBACK_THEME;
  if (wedding.template_id) {
    const { data: tpl } = await supabase.from('templates').select('config_json').eq('id', wedding.template_id).single();
    const c = tpl?.config_json?.colors; const ty = tpl?.config_json?.typography;
    if (c && ty) {
      theme = {
        background: c.background || FALLBACK_THEME.background,
        text: c.text || c.secondary || FALLBACK_THEME.text,
        accent: c.primary || FALLBACK_THEME.accent,
        headingFont: ty.headingFont || FALLBACK_THEME.headingFont,
        bodyFont: ty.bodyFont || FALLBACK_THEME.bodyFont,
        accentFont: ty.accentFont,
      };
    }
  }
  return { wedding, theme };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const res = await getWedding(params.slug);
  if (!res) return { title: 'Save the Date' };
  const { wedding } = res;
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
  return {
    title: 'Save the Date — ' + names,
    description: (wedding.wedding_date_written || wedding.wedding_date) + (wedding.location ? ' · ' + wedding.location : ''),
  };
}

export default async function SaveTheDatePage({ params }: { params: { slug: string } }) {
  const res = await getWedding(params.slug);
  if (!res) notFound();
  const { wedding, theme } = res;
  return (
    <SaveTheDateView
      theme={theme}
      data={{
        slug: wedding.slug,
        locale: wedding.locale,
        partner_name_1: wedding.partner_name_1 || '',
        partner_name_2: wedding.partner_name_2 || '',
        wedding_date: wedding.wedding_date,
        wedding_date_display: wedding.wedding_date_written || undefined,
        location: wedding.location || undefined,
        hero_image_url: wedding.hero_bg_url,
        published: wedding.status === 'published',
      }}
    />
  );
}
