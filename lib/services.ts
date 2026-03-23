import type { Wedding, WizardData, Guest, RSVPResponse, Template } from '@/types/wedding';

// ─── Helpers ──────────────────────────────────────────────────

function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

// ─── Wedding Service ──────────────────────────────────────────

export const WeddingService = {
  async create(supabase: any, userId: string, data: WizardData): Promise<Wedding> {
    const { data: wedding, error } = await supabase
      .from('weddings')
      .insert({
        user_id: userId,
        partner_name_1: data.couple.partner1.firstName,
        partner_name_2: data.couple.partner2.firstName,
        partner_lastname_1: data.couple.partner1.lastName || null,
        partner_lastname_2: data.couple.partner2.lastName || null,
        partner_email_1: data.couple.partner1.email || null,
        partner_email_2: data.couple.partner2.email || null,
        display_format: data.couple.displayFormat,
        custom_display: data.couple.customDisplay || null,
        couple_photo_url: data.couple.photoUrl || null,
        wedding_date: data.weddingDate || null,
        ceremony_time: data.ceremonyTime || null,
        locale: data.locale,
        venue_data: data.venue,
        schedule_data: data.schedule,
        details_data: data.details,
        rsvp_settings: data.rsvpSettings,
        template_customizations: data.templateCustomizations,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    // Link template if selected
    if (data.templateId) {
      await supabase.from('wedding_templates').insert({
        wedding_id: wedding.id,
        template_id: data.templateId,
        applied_to: 'all',
        payment_provider: 'free',
        amount_paid: 0,
      });

      // Create wedding_website record
      await supabase.from('wedding_websites').insert({
        wedding_id: wedding.id,
        template_id: data.templateId,
        pages_json: {},
      });
    }

    return snakeToCamel(wedding) as Wedding;
  },

  async getById(supabase: any, id: string): Promise<Wedding | null> {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return snakeToCamel(data) as Wedding;
  },

  async getBySlug(supabase: any, slug: string): Promise<Wedding | null> {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return snakeToCamel(data) as Wedding;
  },

  async getByUserId(supabase: any, userId: string): Promise<Wedding[]> {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((w: any) => snakeToCamel(w) as Wedding);
  },

  async update(supabase: any, id: string, updates: Partial<Record<string, any>>): Promise<Wedding> {
    const snakeUpdates = camelToSnake(updates);
    snakeUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('weddings')
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data) as Wedding;
  },

  async delete(supabase: any, id: string): Promise<void> {
    const { error } = await supabase
      .from('weddings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async publish(supabase: any, id: string): Promise<Wedding> {
    return this.update(supabase, id, {
      status: 'published',
      publishedUrl: `${process.env.NEXT_PUBLIC_APP_URL}/w/`,
    });
  },
};

// ─── Template Service ─────────────────────────────────────────

export const TemplateService = {
  async getAll(supabase: any): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []).map((t: any) => snakeToCamel(t) as Template);
  },

  async getBySlug(supabase: any, slug: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return snakeToCamel(data) as Template;
  },

  async getById(supabase: any, id: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return snakeToCamel(data) as Template;
  },
};

// ─── Guest Service ────────────────────────────────────────────

export const GuestService = {
  async getByWedding(supabase: any, weddingId: string): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []).map((g: any) => snakeToCamel(g) as Guest);
  },

  async add(supabase: any, weddingId: string, guest: Partial<Guest>): Promise<Guest> {
    const { data, error } = await supabase
      .from('guests')
      .insert({
        wedding_id: weddingId,
        name: guest.name,
        email: guest.email || null,
        phone: guest.phone || null,
        guest_group: guest.guestGroup || 'friends',
        plus_ones: guest.plusOnes || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data) as Guest;
  },

  async submitRSVP(supabase: any, guestToken: string, response: Partial<RSVPResponse>): Promise<void> {
    // Find guest by token
    const { data: guest, error: guestErr } = await supabase
      .from('guests')
      .select('id, wedding_id')
      .eq('guest_token', guestToken)
      .single();

    if (guestErr || !guest) throw new Error('Invalid guest token');

    // Insert RSVP response
    await supabase.from('rsvp_responses').insert({
      guest_id: guest.id,
      wedding_id: guest.wedding_id,
      attending: response.attending,
      meal_choice: response.mealChoice || null,
      plus_one_names: response.plusOneNames || null,
      song_request: response.songRequest || null,
      message: response.message || null,
    });

    // Update guest status
    await supabase
      .from('guests')
      .update({
        rsvp_status: response.attending ? 'yes' : 'no',
        responded_at: new Date().toISOString(),
      })
      .eq('id', guest.id);
  },
};
