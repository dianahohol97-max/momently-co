import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

const MONO_API_URL = 'https://api.monobank.ua/api/merchant/invoice/create';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://momently-co.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { wedding_id } = await request.json();
    if (!wedding_id) return NextResponse.json({ error: 'Missing wedding_id' }, { status: 400 });

    // Check wedding belongs to user
    const { data: wedding } = await supabase.from('weddings').select('id, partner_name_1, partner_name_2, is_paid').eq('id', wedding_id).eq('user_id', user.id).single();
    if (!wedding) return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    if (wedding.is_paid) return NextResponse.json({ error: 'Already paid' }, { status: 400 });

    const monoToken = process.env.MONOBANK_TOKEN;
    if (!monoToken) return NextResponse.json({ error: 'Payment not configured' }, { status: 500 });

    const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
    const amount = 59900; // 599.00 UAH in kopecks

    // Create Monobank invoice
    const monoRes = await fetch(MONO_API_URL, {
      method: 'POST',
      headers: { 'X-Token': monoToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        ccy: 980,
        merchantPaymInfo: {
          reference: wedding_id,
          destination: 'Momently Co — ' + names,
          comment: 'Wedding invitation package',
          basketOrder: [{ name: 'Wedding Package — ' + names, qty: 1, sum: amount, total: amount, unit: 'pcs' }],
        },
        redirectUrl: APP_URL + '/payment/success?wedding_id=' + wedding_id,
        webHookUrl: APP_URL + '/api/payment/webhook',
        validity: 3600,
        paymentType: 'debit',
      }),
    });

    if (!monoRes.ok) {
      const err = await monoRes.text();
      return NextResponse.json({ error: 'Monobank error: ' + err }, { status: 400 });
    }

    const monoData = await monoRes.json();

    // Save payment record
    await supabase.from('payments').insert({
      wedding_id,
      user_id: user.id,
      amount: 599,
      currency: 980,
      status: 'pending',
      provider: 'monobank',
      invoice_id: monoData.invoiceId,
      payment_url: monoData.pageUrl,
    });

    return NextResponse.json({ pageUrl: monoData.pageUrl, invoiceId: monoData.invoiceId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
                                                                              }
