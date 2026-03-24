import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { Navbar, Footer } from '@/components/shared/navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Весільні запрошення по містах України — Momently Co',
  description: 'Цифрові весільні запрошення для весіль у Києві, Львові, Одесі, Харкові, Дніпрі та інших містах. Від 599 грн.',
};

export default async function CitiesPage() {
  const supabase = createServerSupabase();
  const { data: cities } = await supabase.from('pseo_cities').select('*').eq('is_active', true).order('population', { ascending: false });

  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] text-center mb-3">Міста</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a2e] text-center">Весільні запрошення по містах</h1>
          <p className="text-gray-500 mt-4 text-center max-w-lg mx-auto">Створіть цифрове запрошення для весілля у вашому місті</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {cities?.map((city: any) => (
              <Link key={city.slug_ua} href={'/city/' + city.slug_ua} className="group bg-white rounded-xl border border-[#e8e0d4] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-[#1a1a2e] group-hover:text-[#b8956a] transition-colors">{city.name_ua}</h2>
                    <p className="text-xs text-gray-400 mt-1">{city.region}</p>
                  </div>
                  <span className="text-xs text-[#b8956a] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                <p className="text-sm text-gray-500 mt-3 line-clamp-2">{city.wedding_tips_ua}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
