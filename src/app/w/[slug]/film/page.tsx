import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { MemoryFilm } from '@/components/film/memory-film';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('weddings').select('partner_name_1, partner_name_2').eq('slug', params.slug).eq('status', 'published').single();
  if (!data) return { title: 'Memory Film' };
  return { title: data.partner_name_1 + ' & ' + data.partner_name_2 + ' — Memory Film' };
}

export default async function FilmPage({ params }: Props) {
  const supabase = createServerSupabase();
  const { data: wedding } = await supabase.from('weddings').select('id, slug, partner_name_1, partner_name_2, wedding_date, details_data').eq('slug', params.slug).eq('status', 'published').single();
  if (!wedding) notFound();

  const { data: photos } = await supabase.from('guest_photos').select('*').eq('wedding_id', wedding.id).eq('is_approved', true).order('created_at', { ascending: true }).limit(50);

  return <MemoryFilm wedding={wedding} photos={photos || []} />;
}
