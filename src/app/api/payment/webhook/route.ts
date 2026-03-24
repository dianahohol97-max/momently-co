import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, status, reference } = body;

    if (!invoiceId) return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 });

    // Update payment record
    const updates: any = { webhook_data: body, status: status === 'success' ? 'paid' : status };
    if (status === 'success') updates.paid_at = new Date().toISOString();

    await supabaseAdmin.from('payments').update(updates).eq('invoice_id', invoiceId);

    // If payment successful, mark wedding as paid
    if (status === 'success' && reference) {
      await supabaseAdmin.from('weddings').update({ is_paid: true }).eq('id', reference);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
      }
