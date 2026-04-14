import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createServerSupabase } from '@/lib/supabase/server';
import TemplatesClient from './templates-client';

export const metadata = { title: 'Шаблони — Momently' };

export default async function TemplatesPage() {
  const supabase = createServerSupabase();
  const { data: templates } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return <TemplatesClient templates={templates || []} />;
}
