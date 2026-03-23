import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { Navbar, Footer } from '@/components/shared/navbar';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: weddings } = await supabase.from('weddings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';

  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl text-[#1a1a2e]">{userName ? 'Привіт, ' + userName : 'Мої весілля'}</h1>
              <p className="text-sm text-gray-500 mt-1">Керуйте вашими запрошеннями</p>
            </div>
            <Link href="/templates" className="bg-[#1a1a2e] text-[#faf8f4] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors">+ Нове весілля</Link>
          </div>
          {(!weddings || weddings.length === 0) ? (
            <div className="mt-16 text-center py-20 border border-dashed border-[#e8e0d4] rounded-2xl">
              <p className="text-4xl mb-4">💍</p>
              <h2 className="font-serif text-xl text-[#1a1a2e]">Поки що пусто</h2>
              <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Створіть ваше перше цифрове весільне запрошення за кілька хвилин</p>
              <Link href="/templates" className="inline-block mt-6 bg-[#b8956a] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#a07850] transition-colors">Обрати шаблон</Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {weddings.map((wedding: any) => {
                const isPublished = wedding.status === 'published';
                return (
                  <Link key={wedding.id} href={'/dashboard/' + wedding.id} className="group bg-white rounded-2xl border border-[#e8e0d4] p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={'w-2 h-2 rounded-full ' + (isPublished ? 'bg-green-500' : 'bg-amber-400')} />
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">{isPublished ? 'Опубліковано' : 'Чернетка'}</span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(wedding.created_at).toLocaleDateString('uk-UA')}</span>
                    </div>
                    <h3 className="font-serif text-xl text-[#1a1a2e]">{wedding.partner_name_1} & {wedding.partner_name_2}</h3>
                    {wedding.wedding_date && <p className="text-sm text-gray-500 mt-1">{new Date(wedding.wedding_date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                    {wedding.slug && <p className="text-xs text-[#b8956a] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">/w/{wedding.slug} →</p>}
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
