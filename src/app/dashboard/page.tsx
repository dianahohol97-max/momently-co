import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { ArrowRight, Plus, Calendar, MapPin, ExternalLink } from 'lucide-react';

export const metadata = { title: 'Dashboard — Momently' };

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: weddings } = await supabase
    .from('weddings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';

  return (
    <div className="min-h-screen bg-[#FDFAF6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-[#FDFAF6]/90 backdrop-blur-sm border-b border-[#E8E0D4]/60 px-8 py-4 flex justify-between items-center">
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#B8956A', textDecoration: 'none' }}>
          Momently
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-xs uppercase tracking-widest text-[#8A7B6B]">{user?.email}</span>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="text-xs uppercase tracking-widest text-[#8A7B6B] hover:text-[#2C2420] transition-colors">
              Вийти
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-14">

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#B8956A] mb-2">Ваш акаунт</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#2C2420' }}>
              {userName ? `Привіт, ${userName}` : 'Мої весілля'}
            </h1>
            <p className="text-sm text-[#8A7B6B] mt-1">Керуйте вашими запрошеннями та сайтами</p>
          </div>
          <Link
            href="/templates"
            className="flex items-center gap-2 bg-[#2C2420] text-[#FDFAF6] px-6 py-3 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-[#2C2420]/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Нове весілля
          </Link>
        </div>

        {/* Empty state */}
        {(!weddings || weddings.length === 0) ? (
          <div className="border border-dashed border-[#E8DDD4] rounded-[32px] p-20 text-center bg-white">
            <div className="w-14 h-14 rounded-2xl bg-[#B8956A]/10 flex items-center justify-center text-[#B8956A] mx-auto mb-6">
              <Plus className="w-7 h-7" />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: '#2C2420' }}>
              Поки що пусто
            </h2>
            <p className="text-sm text-[#8A7B6B] mt-3 max-w-xs mx-auto leading-relaxed">
              Створіть ваше перше цифрове весільне запрошення за кілька хвилин
            </p>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 mt-8 bg-[#B8956A] text-white px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-[#A07850] transition-colors group"
            >
              Обрати шаблон
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {weddings.map((wedding: any) => {
              const isPublished = wedding.status === 'published';
              return (
                <Link
                  key={wedding.id}
                  href={`/dashboard/${wedding.id}`}
                  className="group bg-white rounded-[28px] border border-[#E8E0D4] p-8 hover:shadow-xl hover:-translate-y-1 transition-all no-underline"
                >
                  {/* Status + date row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-green-500' : 'bg-amber-400'}`} />
                      <span className="text-[9px] uppercase tracking-widest text-[#8A7B6B]">
                        {isPublished ? 'Опубліковано' : 'Чернетка'}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8A7B6B]">
                      {new Date(wedding.created_at).toLocaleDateString('uk-UA')}
                    </span>
                  </div>

                  {/* Names */}
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#2C2420', lineHeight: 1.2 }}>
                    {wedding.partner_name_1} & {wedding.partner_name_2}
                  </h3>

                  {/* Meta */}
                  <div className="mt-4 space-y-2">
                    {wedding.wedding_date && (
                      <div className="flex items-center gap-2 text-xs text-[#8A7B6B]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(wedding.wedding_date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    {wedding.location && (
                      <div className="flex items-center gap-2 text-xs text-[#8A7B6B]">
                        <MapPin className="w-3.5 h-3.5" />
                        {wedding.location}
                      </div>
                    )}
                    {wedding.slug && (
                      <div className="flex items-center gap-2 text-xs text-[#B8956A] opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-3.5 h-3.5" />
                        /w/{wedding.slug}
                      </div>
                    )}
                  </div>

                  {/* Bottom actions */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8E0D4]">
                    <div className="flex gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#F5F0EA] text-[9px] uppercase tracking-widest text-[#8A7B6B]">
                        Save the Date
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#F5F0EA] text-[9px] uppercase tracking-widest text-[#8A7B6B]">
                        RSVP
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#B8956A]/10 flex items-center justify-center text-[#B8956A] group-hover:bg-[#B8956A] group-hover:text-white transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
