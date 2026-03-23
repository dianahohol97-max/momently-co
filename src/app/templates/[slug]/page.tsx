import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { Navbar, Footer } from '@/components/shared/navbar';
import type { Metadata } from 'next';

interface Props { params: { slug: string } }

async function getTemplate(slug: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from('templates').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTemplate(params.slug);
  if (!t) return { title: 'Template Not Found' };
  return { title: `${t.name} — Wedding Template`, description: t.seo_description || t.description || `${t.name} wedding invitation template` };
}

export default async function TemplateDetailPage({ params }: Props) {
  const template = await getTemplate(params.slug);
  if (!template) notFound();
  const config = template.config_json as any;
  const colors = config?.colors || {};
  const typography = config?.typography || {};

  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/templates" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#b8956a] transition-colors">← Всі шаблони</Link>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-[#e8e0d4]" style={{ backgroundColor: colors.background || '#fdf8f4' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                <div className="w-12 h-px mb-6" style={{ backgroundColor: colors.accent || '#b8956a' }} />
                <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: colors.textMuted || '#999' }}>Запрошуємо вас</p>
                <h2 className="text-5xl leading-tight" style={{ color: colors.text || '#1a1a2e', fontFamily: typography.headingFont }}>Anna<br /><span style={{ color: colors.primary || '#b8956a' }}>&amp;</span><br />Oleksandr</h2>
                <div className="w-12 h-px mt-6" style={{ backgroundColor: colors.accent || '#b8956a' }} />
                <p className="text-sm mt-4" style={{ color: colors.textMuted || '#999', fontFamily: typography.accentFont }}>15 серпня 2026 · 16:00</p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] font-medium mb-3">{template.category}</p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a2e]">{template.name}</h1>
              <p className="text-gray-500 mt-4 leading-relaxed">{template.description || 'Елегантний шаблон для вашого весільного запрошення.'}</p>
              <div className="mt-8 space-y-4">
                {['Запрошення + Сайт + RSVP', 'Повна кастомізація кольорів і шрифтів', 'Гостьова камера та фотобудка', '3 мови: UA / EN / RO'].map(f => (
                  <div key={f} className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#b8956a]/10 flex items-center justify-center text-[#b8956a] text-xs">✓</div><span className="text-sm text-gray-600">{f}</span></div>
                ))}
              </div>
              <div className="mt-10 flex items-center gap-4">
                <Link href={`/auth/signup?template=${template.slug}`} className="bg-[#1a1a2e] text-[#faf8f4] px-8 py-3.5 rounded-lg font-medium text-sm hover:bg-[#2a2a3e] transition-colors">Обрати шаблон</Link>
                {template.price_uah === 0 ? <span className="text-sm text-[#b8956a] font-medium">Безкоштовно</span> : <span className="text-lg text-[#1a1a2e] font-semibold">{template.price_uah} ₴</span>}
              </div>
              <div className="mt-10"><p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Палітра</p>
                <div className="flex gap-2">{Object.entries(colors).slice(0, 6).map(([key, value]) => <div key={key} className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: value as string }} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
