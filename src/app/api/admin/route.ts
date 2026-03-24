import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = ['gogolka16@gmail.com', 'dianahohol97@gmail.com'];

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'No auth' }, { status: 401 });
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const [weddings, payments, users, templates] = await Promise.all([
      supabase.from('weddings').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('templates').select('*').order('display_order'),
    ]);
    const stats = {
      totalWeddings: weddings.data?.length || 0,
      paidWeddings: weddings.data?.filter((w: any) => w.is_paid).length || 0,
      totalRevenue: (payments.data || []).filter((p: any) => p.status === 'success').reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      totalUsers: users.data?.length || 0,
      activeTemplates: templates.data?.filter((t: any) => t.is_active).length || 0,
    };
    return NextResponse.json({ stats, weddings: weddings.data || [], payments: payments.data || [], users: users.data || [], templates: templates.data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
        }
