import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import CoteDazurTemplate from '@/components/templates/cote-dazur/CoteDazurTemplate';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('weddings')
    .select('partner_name_1, partner_name_2, wedding_date, location')
    .eq('slug', params.slug)
    .single();

  if (!data) return { title: 'Wedding' };

  return {
    title: `${data.partner_name_1} & ${data.partner_name_2}`,
    description: `You're invited to celebrate the wedding of ${data.partner_name_1} & ${data.partner_name_2} on ${new Date(data.wedding_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} in ${data.location}`,
    openGraph: {
      title: `${data.partner_name_1} & ${data.partner_name_2}`,
      description: `Wedding celebration · ${data.location}`,
    },
  };
}

export default async function WeddingPage({ params }: Props) {
  const supabase = createServerSupabase();

  const { data: wedding } = await supabase
    .from('weddings')
    .select(`
      *,
      wedding_itinerary(*),
      wedding_hotels(*),
      wedding_gifts(*),
      wedding_faq(*)
    `)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!wedding) notFound();

  // Map Supabase data → WeddingData shape
  const templateData = {
    partner_name_1:        wedding.partner_name_1,
    partner_name_2:        wedding.partner_name_2,
    wedding_date:          wedding.wedding_date,
    location:              wedding.location,
    story_short:           wedding.story_short    || 'We request the pleasure of your company at the celebration of our union.',
    story_quote:           wedding.story_quote    || '"Our love story"',
    story_long:            wedding.story_long     || '',
    polaroid_url:          wedding.polaroid_url   || '',
    polaroid_caption:      wedding.polaroid_caption || '',
    hero_bg_url:           wedding.hero_bg_url    || '',
    story_bg_url:          wedding.story_bg_url   || '',
    venue_name:            wedding.venue_name     || '',
    venue_address:         wedding.venue_address  || '',
    venue_map_url:         wedding.venue_map_url  || '',
    venue_directions_url:  wedding.venue_directions_url || '#',
    dress_code_description: wedding.dress_code_description || '',
    dress_code_colors:     wedding.dress_code_colors || ['#000000', '#ffffff'],
    rsvp_deadline:         wedding.rsvp_deadline  || '',
    slug:                  wedding.slug,
    hotels:  (wedding.wedding_hotels  || []).map((h: any) => ({ name: h.name, description: h.description, url: h.url || '#' })),
    itinerary: (wedding.wedding_itinerary || []).sort((a: any, b: any) => a.order - b.order).map((i: any) => ({ title: i.title, time: i.time, description: i.description })),
    gifts:   (wedding.wedding_gifts   || []).map((g: any) => ({ title: g.title, url: g.url || '#', type: g.type || 'wishlist' })),
    faq:     (wedding.wedding_faq     || []).sort((a: any, b: any) => a.order - b.order).map((f: any) => ({ question: f.question, answer: f.answer })),
  };

  return <CoteDazurTemplate data={templateData} />;
}
