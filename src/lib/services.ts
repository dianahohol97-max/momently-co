import type { Wedding, WizardData, Guest, RSVPResponse, Template } from '@/types/wedding';

function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`)] = value;
  }
  return result;
}

function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = value;
  }
  return result;
}

export const WeddingService = {
  async create(supabase: any, userId: string, data: WizardData): Promise<Wedding> {
    const { data: wedding, error } = await supabase.from('weddings').insert({
      user_id: userId,
      partner_name_1: data.couple.partner1.firstName,
      partner_name_2: data.couple.partner2.firstName,
      partner_lastname_1: data.couple.partner1.lastName || null,
      partner_lastname_2: data.couple.partner2.lastName || null,
      display_format: data.couple.displayFormat,
      wedding_date: data.weddingDate || null,
      ceremony_time: data.ceremonyTime || null,
      locale: data.locale,
      venue_data: data.venue,
      schedule_data: data.schedule,
      details_data: data.details,
      rsvp_settings: data.rsvpSettings,
      template_customizations: data.templateCustomizations,
      status: 'draft',
    }).select().single();
    if (error) throw error;
    if (data.templateId) {
      await supabase.from('wedding_templates').insert({ wedding_id: wedding.id, template_id: data.templateId, applied_to: 'all', payment_provider: 'free', amount_paid: 0 });
      await supabase.from('wedding_websites').insert({ wedding_id: wedding.id, template_id: data.templateId, pages_json: {} });
    }
    return snakeToCamel(wedding) as Wedding;
  },
  async getBySlug(supabase: any, slug: string): Promise<Wedding | null> {
    const { data, error } = await supabase.from('weddings').select('*').eq('slug', slug).single();
    if (error || !data) return null;
    return snakeToCamel(data) as Wedding;
  },
  async getByUserId(supabase: any, userId: string): Promise<Wedding[]> {
    const { data, error } = await supabase.from('weddings').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((w: any) => snakeToCamel(w) as Wedding);
  },
  async update(supabase: any, id: string, updates: Partial<Record<string, any>>): Promise<Wedding> {
    const snakeUpdates = camelToSnake(updates);
    snakeUpdates.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('weddings').update(snakeUpdates).eq('id', id).select().single();
    if (error) throw error;
    return snakeToCamel(data) as Wedding;
  },
};

export const TemplateService = {
  async getAll(supabase: any): Promise<Template[]> {
    const { data, error } = await supabase.from('templates').select('*').eq('is_active', true).order('display_order', { ascending: true });
    if (error) throw error;
    return (data || []).map((t: any) => snakeToCamel(t) as Template);
  },
  async getBySlug(supabase: any, slug: string): Promise<Template | null> {
    const { data, error } = await supabase.from('templates').select('*').eq('slug', slug).single();
    if (error || !data) return null;
    return snakeToCamel(data) as Template;
  },
};

export const GuestService = {
  async getByWedding(supabase: any, weddingId: string): Promise<Guest[]> {
    const { data, error } = await supabase.from('guests').select('*').eq('wedding_id', weddingId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map((g: any) => snakeToCamel(g) as Guest);
  },
  async submitRSVP(supabase: any, guestToken: string, response: Partial<RSVPResponse>): Promise<void> {
    const { data: guest, error: guestErr } = await supabase.from('guests').select('id, wedding_id').eq('guest_token', guestToken).single();
    if (guestErr || !guest) throw new Error('Invalid guest token');
    await supabase.from('rsvp_responses').insert({ guest_id: guest.id, wedding_id: guest.wedding_id, attending: response.attending, meal_choice: response.mealChoice || null, message: response.message || null });
    await supabase.from('guests').update({ rsvp_status: response.attending ? 'yes' : 'no', responded_at: new Date().toISOString() }).eq('id', guest.id);
  },
};
