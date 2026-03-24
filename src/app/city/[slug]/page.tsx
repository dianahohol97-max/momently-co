import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { Navbar, Footer } from '@/components/shared/navbar';
import type { Metadata } from 'next';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('pseo_cities').select('name_ua').eq('slug_ua', params.slug).eq('is_active', true).single();
  if (!data) return { title: 'Not Found' };
  return {
    title: 'Весільні запрошення в місті ' + data.name_ua + ' — Momently Co',
    description: 'Створіть цифрове весільне запрошення для весілля в ' + data.name_ua + '. Запрошення, RSVP, гостьова камера — все в одному місці. Від 599 грн.',
  };
}

export default async function CityPage({ params }: Props) {
  const supabase = createServerSupabase();
  const { data: city } = await supabase.from('pseo_cities').select('*').eq('slug_ua', params.slug).eq('is_active', true).single();
  if (!city) notFound();

  const { data: templates } = await supabase.from('templates').select('name, slug, description, category, price_uah, config_json').eq('is_active', true).order('display_order');

  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] mb-3">{city.country === 'UA' ? 'Україна' : city.country}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a2e] leading-tight">
            {"Весільні запрошення в місті " + city.name_ua}
          </h1>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">{city.wedding_tips_ua}</p>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl text-[#1a1a2e] text-center mb-10">Шаблони для весілля в {city.name_ua}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates?.map((t: any) => {
              const colors = t.config_json?.colors || {};
              return (
                <Link key={t.slug} href={'/templates/' + t.slug} className="group rounded-2xl border border-[#e8e0d4] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="aspect-[4/5] flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: colors.background || '#fdf8f4' }}>
                    <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: colors.textMuted || '#999' }}>Запрошуємо вас</p>
                    <p className="text-3xl leading-tight" style={{ color: colors.text || '#1a1a2e', fontFamily: 'serif' }}>Anna<br /><span style={{ color: colors.primary || '#b8956a' }}>&amp;</span><br />Oleksandr</p>
                  </div>
                  <div className="p-5 bg-[#faf8f4]">
                    <h3 className="font-serif text-lg text-[#1a1a2e]">{t.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.description}</p>
                    <p className="text-sm font-medium text-[#b8956a] mt-3">{t.price_uah} ₴</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl text-[#1a1a2e] mb-6">Чому обрати Momently для весілля в {city.name_ua}?</h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>Цифрове запрошення від Momently — це сучасний спосіб запросити гостей на ваше весілля в {city.name_ua}. Замість паперових листівок — стильне онлайн-запрошення з RSVP, зворотнім відліком, картою проїзду та гостьовою камерою.</p>
            <p>Все, що потрібно: обрати шаблон, додати деталі та поділитися посиланням через WhatsApp, Viber чи Telegram. Гості підтверджують присутність онлайн, а ви бачите статистику в реальному часі.</p>
            <p>Одна оплата — 599 ₴. Без підписки. Без обмежень на кількість гостей.</p>
          </div>
          <Link href="/templates" className="inline-block mt-8 bg-[#1a1a2e] text-[#faf8f4] px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors">Обрати шаблон — 599 ₴</Link>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Інші міста</p>
          <CityLinks currentSlug={params.slug} />
        </div>
      </section>

      <Footer />
    </main>
  );
}

async function CityLinks({ currentSlug }: { currentSlug: string }) {
  const supabase = createServerSupabase();
  const { data: cities } = await supabase.from('pseo_cities').select('name_ua, slug_ua').eq('is_active', true).order('population', { ascending: false });
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {cities?.filter((c: any) => c.slug_ua !== currentSlug).map((c: any) => (
        <Link key={c.slug_ua} href={'/city/' + c.slug_ua} className="text-xs text-gray-500 hover:text-[#b8956a] border border-[#e8e0d4] px-3 py-1.5 rounded-full transition-colors">{c.name_ua}</Link>
      ))}
    </div>
  );
}
