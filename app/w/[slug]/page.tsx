import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { WeddingView } from '@/components/templates/wedding-view';

interface Props {
  params: { slug: string };
}

async function getWeddingBySlug(slug: string) {
  const supabase = createServerSupabase();

  const { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .in('status', ['published', 'active'])
    .single();

  if (error || !wedding) return null;

  // Get linked template
  const { data: weddingTemplate } = await supabase
    .from('wedding_templates')
    .select('template_id')
    .eq('wedding_id', wedding.id)
    .single();

  let template = null;
  if (weddingTemplate?.template_id) {
    const { data } = await supabase
      .from('templates')
      .select('*')
      .eq('id', weddingTemplate.template_id)
      .single();
    template = data;
  }

  return { wedding, template };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getWeddingBySlug(params.slug);
  if (!result) return { title: 'Wedding Not Found' };

  const { wedding } = result;
  const names = `${wedding.partner_name_1} & ${wedding.partner_name_2}`;

  return {
    title: `${names} — Wedding Invitation`,
    description: `You're invited to the wedding of ${names}`,
    openGraph: {
      title: `${names} — Wedding Invitation`,
      description: `You're invited to the wedding of ${names}`,
    },
  };
}

export default async function PublicWeddingPage({ params }: Props) {
  const result = await getWeddingBySlug(params.slug);
  if (!result) notFound();

  const { wedding, template } = result;

  return <WeddingView wedding={wedding} template={template} />;
}
