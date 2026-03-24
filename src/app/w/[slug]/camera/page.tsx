import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { GuestCamera } from '@/components/camera/guest-camera';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('weddings').select('partner_name_1, partner_name_2').eq('slug', params.slug).eq('status', 'published').single();
  if (!data) return { title: 'Camera' };
  return { title: data.partner_name_1 + ' & ' + data.partner_name_2 + ' — Camera' };
}

export default async function CameraPage({ params }: Props) {
  const supabase = createServerSupabase();
  const { data: wedding } = await supabase.from('weddings').select('id, slug, partner_name_1, partner_name_2, template_id').eq('slug', params.slug).eq('status', 'published').single();
  if (!wedding) notFound();

  const { data: photos } = await supabase.from('guest_photos').select('*').eq('wedding_id', wedding.id).eq('is_approved', true).order('created_at', { ascending: false }).limit(50);

  return <GuestCamera wedding={wedding} photos={photos || []} />;
    }
