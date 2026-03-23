import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { Navbar, Footer } from '@/components/shared/navbar';

export const metadata = { title: 'Wedding Templates', description: 'Browse our collection of beautiful wedding invitation templates.' };

const categoryLabels: Record<string, string> = { romantic: 'Романтичний', minimal: 'Мінімалізм', classic: 'Класичний', modern: 'Сучасний', bold: 'Сміливий', elegant: 'Елегантний' };

async function getTemplates() {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('templates').select('*').eq('is_active', true).order('display_order', { ascending: true });
  return data || [];
}

export default async function TemplatesPage() {
  const templates = await getTemplates();
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] font-medium mb-4">Шаблони</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1a1a2e] leading-tight">Знайдіть свій стиль</h1>
          <p className="text-lg text-gray-500 mt-4 max-w-md mx-auto">Кожен шаблон — це повний набір: запрошення, сайт, RSVP і гостьова камера.</p>
        </div>
      </section>
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {templates.length === 0 ? (
            <div className="text-center py-20"><p className="text-gray-400 text-lg">Шаблони скоро з&apos;являться...</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {templates.map((template: any) => {
                const config = template.config_json as any;
                const colors = config?.colors || {};
                return (
                  <Link key={template.id} href={`/templates/${template.slug}`} className="group block">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden relative border border-[#e8e0d4] transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1" style={{ backgroundColor: colors.background || '#fdf8f4' }}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                        <div className="w-12 h-px mb-6" style={{ backgroundColor: colors.accent || '#b8956a' }} />
                        <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: colors.textMuted || '#999' }}>{categoryLabels[template.category] || template.category}</p>
                        <h2 className="text-4xl md:text-5xl leading-tight" style={{ color: colors.text || '#1a1a2e', fontFamily: config?.typography?.headingFont || 'Playfair Display' }}>Anna<br /><span style={{ color: colors.primary || '#b8956a' }}>&amp;</span><br />Oleksandr</h2>
                        <div className="w-12 h-px mt-6" style={{ backgroundColor: colors.accent || '#b8956a' }} />
                        <p className="text-sm mt-4" style={{ color: colors.textMuted || '#999' }}>15 серпня 2026</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div><h3 className="font-serif text-lg text-[#1a1a2e]">{template.name}</h3><p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{template.description || categoryLabels[template.category]}</p></div>
                      <div>{template.price_uah === 0 ? <span className="text-xs uppercase tracking-wider text-[#b8956a] font-medium">Безкоштовно</span> : <span className="text-sm text-[#1a1a2e] font-medium">{template.price_uah} ₴</span>}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
