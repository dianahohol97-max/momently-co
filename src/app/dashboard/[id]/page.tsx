import { redirect, notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { AdminPanel } from '@/components/admin/admin-panel';

interface Props { params: { id: string } }

export default async function WeddingAdminPage({ params }: Props) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: wedding } = await supabase.from('weddings').select('*').eq('id', params.id).eq('user_id', user.id).single();
  if (!wedding) notFound();

  // Get linked template (direct foreign key on weddings)
  let template = null;
  if (wedding.template_id) {
    const { data } = await supabase.from('templates').select('*').eq('id', wedding.template_id).single();
    template = data;
  }

  // Get all templates for the picker
  const { data: allTemplates } = await supabase.from('templates').select('*').eq('is_active', true);

  // Get guests and RSVP responses
  const { data: guests } = await supabase.from('guests').select('*').eq('wedding_id', wedding.id).order('created_at', { ascending: false });
  const { data: rsvpResponses } = await supabase.from('rsvp_responses').select('*').eq('wedding_id', wedding.id);

  // Get guest photos
  const { data: photos } = await supabase.from('guest_photos').select('*').eq('wedding_id', wedding.id).order('created_at', { ascending: false });

  return (
    <AdminPanel
      wedding={wedding}
      template={template}
      guests={guests || []}
      rsvpResponses={rsvpResponses || []}
      allTemplates={allTemplates || []}
      photos={photos || []}
    />
  );
}
