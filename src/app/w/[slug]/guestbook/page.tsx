import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { GuestbookView } from '@/components/guestbook/guestbook-view';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('weddings').select('partner_name_1, partner_name_2').eq('slug', params.slug).eq('status', 'published').single();
  if (!data) return { title: 'Guestbook' };
  return { title: data.partner_name_1 + ' & ' + data.partner_name_2 + ' — Книга гостей' };
}

export default async function GuestbookPage({ params }: Props) {
  const supabase = createServerSupabase();
  const { data: wedding } = await supabase.from('weddings').select('id, slug, partner_name_1, partner_name_2').eq('slug', params.slug).eq('status', 'published').single();
  if (!wedding) notFound();

  const { data: entries } = await supabase.from('guestbook_entries').select('*').eq('wedding_id', wedding.id).order('created_at', { ascending: false }).limit(100);

  return <GuestbookView wedding={wedding} entries={entries || []} />;
}
