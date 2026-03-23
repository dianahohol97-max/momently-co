import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { AdminPanel } from '@/components/admin/admin-panel';

interface Props { params: { id: string } }

async function getWeddingData(id: string) {
  const supabase = createServerSupabase();
  const { data: wedding, error } = await supabase.from('weddings').select('*').eq('id', id).single();
  if (error || !wedding) return null;
  const { data: weddingTemplate } = await supabase.from('wedding_templates').select('template_id').eq('wedding_id', id).single();
  let template = null;
  if (weddingTemplate?.template_id) {
    const { data } = await supabase.from('templates').select('*').eq('id', weddingTemplate.template_id).single();
    template = data;
  }
  const { data: guests } = await supabase.from('guests').select('*').eq('wedding_id', id).order('created_at', { ascending: true });
  const { data: rsvpResponses } = await supabase.from('rsvp_responses').select('*').eq('wedding_id', id);
  const { data: allTemplates } = await supabase.from('templates').select('*').eq('is_active', true).order('display_order');
  return { wedding, template, guests: guests || [], rsvpResponses: rsvpResponses || [], allTemplates: allTemplates || [] };
}

export default async function AdminPage({ params }: Props) {
  const data = await getWeddingData(params.id);
  if (!data) notFound();
  return <AdminPanel {...data} />;
}
