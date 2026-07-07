import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { name, email, attendance, dietary, plus_one, wedding_slug } = await req.json();

    // Validate
    if (!name || !attendance || !wedding_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!['attending', 'declined'].includes(attendance)) {
      return NextResponse.json({ error: 'Invalid attendance value' }, { status: 400 });
    }

    // Get wedding id by slug (must be published)
    const { data: wedding, error: weddingError } = await supabase()
      .from('weddings')
      .select('id, status')
      .eq('slug', wedding_slug)
      .eq('status', 'published')
      .single();

    if (weddingError || !wedding) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }

    // Check for duplicate (same email)
    if (email) {
      const { data: existing } = await supabase()
        .from('rsvp_responses')
        .select('id')
        .eq('wedding_id', wedding.id)
        .eq('email', email)
        .single();

      if (existing) {
        // Update existing response
        await supabase()
          .from('rsvp_responses')
          .update({ name, attendance, dietary: dietary || null, plus_one: plus_one || false })
          .eq('id', existing.id);

        return NextResponse.json({ success: true, updated: true });
      }
    }

    // Insert new RSVP
    const { error: insertError } = await supabase()
      .from('rsvp_responses')
      .insert({
        wedding_id: wedding.id,
        name,
        email: email || null,
        attendance,
        dietary: dietary || null,
        plus_one: plus_one || false,
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
