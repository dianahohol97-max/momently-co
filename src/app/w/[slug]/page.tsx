import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

import { TEMPLATE_MAP, DEFAULT_TEMPLATE } from '@/components/templates/template-map';

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

  // Fetch wedding with template info
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

  // Get template slug from templates table
  let templateSlug = 'cote-dazur';
  if (wedding.template_id) {
    const { data: tpl } = await supabase
      .from('templates')
      .select('slug')
      .eq('id', wedding.template_id)
      .single();
    if (tpl?.slug) templateSlug = tpl.slug;
  }

  // Also check template_customizations for override
  const customColors = wedding.template_customizations?.colors || null;

  // Pick the right component
  const TemplateComponent = TEMPLATE_MAP[templateSlug] || DEFAULT_TEMPLATE;

  // Build unified data shape (covers all template fields)
  const templateData = {
    // Core
    partner_name_1:         wedding.partner_name_1 || 'Partner',
    partner_name_2:         wedding.partner_name_2 || 'Partner',
    wedding_date:           wedding.wedding_date || new Date().toISOString(),
    wedding_date_display:   wedding.wedding_date
      ? new Date(wedding.wedding_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '',
    wedding_date_written:   wedding.wedding_date_written || '',
    location:               wedding.location || '',
    location_written:       wedding.location_written || wedding.location || '',
    slug:                   wedding.slug,

    // Images
    hero_image_url:         wedding.hero_bg_url || '',
    story_image_url:        wedding.story_image_url || wedding.polaroid_url || '',
    polaroid_url:           wedding.polaroid_url || '',
    polaroid_caption:       wedding.polaroid_caption || '',
    hero_bg_url:            wedding.hero_bg_url || '',
    story_bg_url:           wedding.story_bg_url || '',
    rsvp_invite_image_url:  wedding.rsvp_bg_url || wedding.hero_bg_url || '',
    venue_image_url:        wedding.venue_image_url || '',
    venue_map_url:          wedding.venue_map_url || '#',
    footer_image_url:       wedding.footer_image_url || wedding.story_bg_url || '',

    // Story
    story_short:            wedding.story_short || 'We request the pleasure of your company at the celebration of our union.',
    story_quote:            wedding.story_quote || '"Our love story"',
    story_long:             wedding.story_long || wedding.story_paragraph_1 || '',
    story_heading:          wedding.story_heading || wedding.story_quote || 'Our Story',
    story_paragraph_1:      wedding.story_paragraph_1 || '',
    story_paragraph_2:      wedding.story_paragraph_2 || '',
    story_paragraphs:       [wedding.story_paragraph_1, wedding.story_paragraph_2].filter(Boolean),
    story_caption:          wedding.polaroid_caption || '',

    // Venue
    venue_name:             wedding.venue_name || '',
    venue_city:             wedding.venue_city || wedding.location || '',
    venue_address:          wedding.venue_address || '',
    venue_address_1:        wedding.venue_address?.split('\n')[0] || wedding.venue_address || '',
    venue_address_2:        wedding.venue_address?.split('\n')[1] || '',
    venue_description:      wedding.venue_description || '',
    venue_directions_url:   wedding.venue_directions_url || '#',
    venue_stay_description: wedding.venue_stay_description || '',
    venue_travel_description: wedding.venue_travel_description || '',
    venue_parking:          wedding.venue_parking ?? false,
    venue_accommodation:    wedding.venue_accommodation ?? false,

    // Dress code
    dress_code_title:       wedding.dress_code_title || 'Black Tie',
    dress_code_subtitle:    wedding.dress_code_subtitle || wedding.dress_code_title || '',
    dress_code_description: wedding.dress_code_description || '',
    dress_code_colors:      wedding.dress_code_colors || ['#000000', '#ffffff'],
    dress_code_label:       wedding.dress_code_label || '',

    // RSVP
    rsvp_deadline:          wedding.rsvp_deadline || '',

    // Gifts
    gifts_description:      wedding.gifts_description || 'Your presence is our greatest gift.',
    gifts_url:              wedding.gifts_url || '#',

    // Closing
    closing_message:        wedding.closing_message || "We can't wait to\ncelebrate with you",
    contact_email:          wedding.contact_email || '',

    // Hero gradient (The Stationery)
    hero_gradient:          wedding.hero_gradient || 'linear-gradient(135deg, #a8edea 0%, #b8f5c8 25%, #e8d5a0 65%, #d4a0c8 100%)',

    // Related tables
    hotels: (wedding.wedding_hotels || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((h: any) => ({ name: h.name, description: h.description, url: h.url || '#' })),

    itinerary: (wedding.wedding_itinerary || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((i: any) => ({ title: i.title, time: i.time, description: i.description, location: i.location || '' })),

    schedule: (wedding.wedding_itinerary || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((i: any) => ({ time: i.time, title: i.title, location: i.location || '', description: i.description || '' })),

    events: (wedding.wedding_itinerary || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((i: any, idx: number) => ({
        day: i.day || (idx === 0 ? 'Friday' : 'Saturday'),
        time: i.time,
        title: i.title,
        description: i.description || '',
        location: i.location || '',
        accent: ['#95b3a1', '#a3b18a', '#496455'][idx % 3],
      })),

    gifts: (wedding.wedding_gifts || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((g: any) => ({ title: g.title, url: g.url || '#', type: g.type || 'wishlist' })),

    faq: (wedding.wedding_faq || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((f: any) => ({ question: f.question, answer: f.answer })),

    // Guest details (Ethereal Conservatory)
    guest_details: [
      wedding.dress_code_title && {
        icon: '👗',
        title: wedding.dress_code_title,
        description: wedding.dress_code_description || '',
      },
      wedding.gifts_description && {
        icon: '🎁',
        title: 'Gifts',
        description: wedding.gifts_description,
      },
    ].filter(Boolean),

    // Meal options (The Digital Salon / Lago d'Oro)
    meal_options: wedding.meal_options || ['Meat', 'Fish', 'Vegetarian'],

    // Timeline (The Digital Salon)
    timeline: (wedding.wedding_itinerary || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((i: any) => ({
        time: i.time,
        title: i.title,
        location: i.location || '',
        icon: i.icon || '✦',
      })),

    // Custom colors override
    ...(customColors ? { _customColors: customColors } : {}),
  };

  return <TemplateComponent data={templateData} />;
}
