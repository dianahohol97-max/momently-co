import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { PhotoBooth } from '@/components/booth/photo-booth';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('weddings').select('partner_name_1, partner_name_2').eq('slug', params.slug).eq('status', 'published').single();
  if (!data) return { title: 'Photo Booth' };
  return { title: data.partner_name_1 + ' & ' + data.partner_name_2 + ' — Photo Booth' };
}

export default async function BoothPage({ params }: Props) {
  const supabase = createServerSupabase();
  const { data: wedding } = await supabase.from('weddings').select('id, slug, partner_name_1, partner_name_2, details_data').eq('slug', params.slug).eq('status', 'published').single();
  if (!wedding) notFound();
  return <PhotoBooth wedding={wedding} />;
}
