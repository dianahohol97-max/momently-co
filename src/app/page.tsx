import Link from 'next/link';
import { ArrowRight, Check, Heart, Calendar, Users } from 'lucide-react';

const templates = [
  { name: 'Golden Elegance', slug: 'golden-hour', cat: 'Cream & Gold', bg: '#FAF7F2', text: '#2C2420', accent: '#B8956A', names: 'Olivia & Noah', font: 'Cormorant Garamond' },
  { name: 'Old Money', slug: 'midnight-elegance', cat: 'Dark Luxe', bg: '#0F0F0F', text: '#F5F0E8', accent: '#B8956A', names: 'Olivia & Noah', font: 'Playfair Display' },
  { name: 'Burgundy Romance', slug: 'botanical-garden', cat: 'Wine & Rose', bg: '#1A0F10', text: '#F2E8E0', accent: '#C4786E', names: 'Sophia & James', font: 'Playfair Display' },
  { name: 'Lavender Dream', slug: 'lavender-dream', cat: 'Soft Pastel', bg: '#F8F4F9', text: '#3A2E3E', accent: '#9B7BA8', names: 'Emma & Luca', font: 'Cormorant Garamond' },
  { name: 'Cream Elegance', slug: 'modern-minimal', cat: 'UA Classic', bg: '#FAF7F2', text: '#2C2420', accent: '#B8956A', names: 'Вікторія & Андрій', font: 'Cormorant Garamond' },
  { name: 'Emerald Garden', slug: 'emerald-garden', cat: 'Nature Green', bg: '#F5F8F2', text: '#2D3A2D', accent: '#5B7F5B', names: 'Вікторія & Андрій', font: 'Cormorant Garamond' },
  { name: 'Noir Gold', slug: 'noir-gold', cat: 'Black & Gold', bg: '#0A0A0A', text: '#F0ECE0', accent: '#C9A84C', names: 'Olivia & Noah', font: 'Playfair Display' },
];

const features = [
  { icon: Heart, title: 'Save the Date', desc: 'Анімоване запрошення з посиланням, яке хочеться відкрити одразу.' },
  { icon: Calendar, title: 'Wedding Website', desc: 'Персональний сайт з таймером зворотного відліку, вашою історією та всіма деталями.' },
  { icon: Users, title: 'RSVP System', desc: 'Гості підтверджують присутність онлайн. Відстежуйте відповіді в дашборді.' },
];

function IPhoneFrame({ t }: { t: typeof templates[0] }) {
  return (
    <div className="relative flex-shrink-0 hover:-translate-y-2 transition-transform duration-300" style={{ width: 200 }}>
      <div style={{ background: '#1a1a1a', borderRadius: 32, padding: '10px 7px', boxShadow: '0 24px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div style={{ width: 72, height: 18, background: '#1a1a1a', borderRadius: '0 0 14px 14px', margin: '0 auto 4px' }} />
        <div style={{ background: t.bg, borderRadius: 20, overflow: 'hidden', height: 360 }}>
          <div style={{ padding: '36px 14px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ width: 28, height: 1, background: t.accent, marginBottom: 14 }} />
            <p style={{ fontSize: 6, textTransform: 'uppercase', letterSpacing: '0.3em', color: t.accent, marginBottom: 8 }}>We invite you</p>
            <h3 style={{ fontFamily: `'${t.font}', serif`, fontSize: 20, fontWeight: 300, color: t.text, lineHeight: 1.2 }}>{t.names.split(' & ')[0]}</h3>
            <p style={{ fontFamily: `'${t.font}', serif`, fontSize: 14, fontStyle: 'italic', color: t.accent, margin: '4px 0' }}>&amp;</p>
            <h3 style={{ fontFamily: `'${t.font}', serif`, fontSize: 20, fontWeight: 300, color: t.text, lineHeight: 1.2 }}>{t.names.split(' & ')[1]}</h3>
            <div style={{ width: 28, height: 1, background: t.accent, margin: '14px 0 10px' }} />
            <p style={{ fontSize: 7, color: t.accent, fontFamily: `'${t.font}', serif`, letterSpacing: '0.15em' }}>12.09.2026</p>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 14 }}>
              {['142', '08', '34'].map((n, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: `'${t.font}', serif`, fontSize: 13, color: t.text }}>{n}</div>
                  <div style={{ fontSize: 5, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent }}>{['days', 'hrs', 'min'][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ width: 56, height: 4, background: '#333', borderRadius: 2, margin: '7px auto 3px' }} />
      </div>
      <div className="text-center mt-4">
        <h4 className="text-sm font-semibold text-[#2C2420]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.name}</h4>
        <p className="text-[11px] text-[#8A7B6B] mt-1">{t.cat}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFAF6] text-[#2C2420]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes floatDown {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(10px); }
        }
        .animate-fade-up    { animation: fadeUp 0.8s ease both; }
        .animate-fade-in    { animation: fadeIn 1s ease 0.2s both; }
        .animate-float-up   { animation: floatUp 4s ease-in-out infinite; }
        .animate-float-down { animation: floatDown 5s ease-in-out infinite; }
        .feature-card { opacity: 0; animation: fadeUp 0.6s ease both; }
        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
      `}</style>

      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-[#E8E0D4]/60 bg-[#FDFAF6]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="text-xl text-[#B8956A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Momently</div>
        <div className="flex items-center gap-6">
          <Link href="/templates" className="text-xs font-medium uppercase tracking-widest text-[#8A7B6B] hover:text-[#2C2420] transition-colors">Шаблони</Link>
          <Link href="/auth/login" className="text-xs font-medium uppercase tracking-widest text-[#8A7B6B] hover:text-[#2C2420] transition-colors">Увійти</Link>
          <Link href="/templates" className="bg-[#2C2420] text-[#FDFAF6] px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-[#2C2420]/80 transition-colors">
            Створити весілля
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 py-24 lg:py-36 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full border border-[#E8DDD4]/40 -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full border border-[#E8DDD4]/30 translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-[#B8956A]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#B8956A]">Digital Wedding Platform</span>
          </div>
          <h1 className="leading-[0.95] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 300, color: '#2C2420' }}>
            Ваше весілля<br />
            <span style={{ fontStyle: 'italic', color: '#B8956A' }}>в одному лінку</span>
          </h1>
          <p className="text-[#8A7B6B] max-w-md mb-10 leading-relaxed" style={{ fontSize: 16 }}>
            Цифрові запрошення, персональний сайт та RSVP. Все в єдиному стилі для вашого особливого дня.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/templates" className="flex items-center gap-3 bg-[#B8956A] text-white px-8 py-4 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-[#A07850] transition-all group">
              Почати за 599₴
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/templates" className="text-sm text-[#8A7B6B] underline underline-offset-4 hover:text-[#2C2420] transition-colors">
              Переглянути шаблони
            </Link>
          </div>
        </div>

        {/* Hero card */}
        <div className="relative hidden lg:block animate-fade-in">
          <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-[#E8DDD4] shadow-2xl bg-[#FAF7F2]">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <div className="w-10 h-px bg-[#B8956A] mb-8" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#B8956A] mb-6">We invite you to celebrate</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: '#2C2420', lineHeight: 1.2 }}>
                Anna<br />
                <span style={{ fontStyle: 'italic', color: '#B8956A', fontSize: 32 }}>&amp;</span><br />
                Maxim
              </h2>
              <div className="w-10 h-px bg-[#B8956A] my-8" />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: '#8A7B6B', letterSpacing: '0.2em' }}>12 · 09 · 2026</p>
              <p className="text-xs text-[#8A7B6B] mt-2 tracking-widest uppercase">Kyiv, Restaurant Praha</p>
              <div className="flex gap-8 mt-10">
                {['142', '08', '34'].map((n, i) => (
                  <div key={i} className="text-center">
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#2C2420' }}>{n}</div>
                    <div className="text-[9px] uppercase tracking-widest text-[#B8956A] mt-1">{['days', 'hrs', 'min'][i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-[#E8DDD4] p-4 max-w-[160px] animate-float-up">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[9px] uppercase tracking-widest text-[#8A7B6B]">Нова відповідь</span>
            </div>
            <p className="text-xs font-medium text-[#2C2420]">Марія Коваль</p>
            <p className="text-[10px] text-[#B8956A]">Буде присутня ✓</p>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-[#2C2420] text-white rounded-2xl shadow-xl p-4 max-w-[160px] animate-float-down">
            <p className="text-[9px] uppercase tracking-widest text-white/50 mb-1">RSVP</p>
            <p className="text-lg font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>48 гостей</p>
            <p className="text-[10px] text-[#B8956A] mt-0.5">підтвердили участь</p>
          </div>
        </div>
      </section>

      {/* Templates Carousel */}
      <section className="py-24 bg-[#F5F0EA]">
        <div className="text-center mb-14 px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#B8956A] mb-3">Наша колекція</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#2C2420' }}>Весільні шаблони</h2>
        </div>
        <div className="flex gap-8 overflow-x-auto px-12 pb-8" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {templates.map(t => (
            <Link key={t.slug} href={`/templates/${t.slug}`} style={{ textDecoration: 'none', color: 'inherit', scrollSnapAlign: 'center' }}>
              <IPhoneFrame t={t} />
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#B8956A] mb-3">Все що потрібно</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#2C2420' }}>Три модулі. Один лінк.</h2>
            <p className="text-[#8A7B6B] mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Забудьте про паперові запрошення, Google Forms і хаотичні повідомлення. Все в одному місці.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="feature-card p-8 rounded-[28px] border border-[#E8E0D4] bg-white hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-[#B8956A]/10 flex items-center justify-center text-[#B8956A] mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-3" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.title}</h3>
                  <p className="text-[#8A7B6B] text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-28 px-8 bg-[#F5F0EA]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#B8956A] mb-3">Простий процес</p>
          <h2 className="mb-20" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#2C2420' }}>
            3 кроки до готового сайту
          </h2>
          <div className="flex justify-center gap-16 flex-wrap">
            {[
              { n: '01', t: 'Оберіть шаблон', d: 'Виберіть зі стилів від ніжного до розкішного' },
              { n: '02', t: 'Налаштуйте', d: 'Додайте імена, дату, локацію та свою історію' },
              { n: '03', t: 'Поділіться', d: 'Надішліть посилання гостям через будь-який месенджер' },
            ].map((s, i) => (
              <div key={i} className="text-center max-w-[180px]">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: '#B8956A' }}>{s.n}</div>
                <h3 className="text-sm font-semibold mt-2 mb-2">{s.t}</h3>
                <p className="text-xs text-[#8A7B6B] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-28 px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-[#B8956A]/10 text-[#B8956A] text-[10px] uppercase tracking-[0.2em] mb-6">Проста ціна</div>
          <h2 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: '#2C2420' }}>
            Все включено<br />за <span style={{ color: '#B8956A' }}>599₴</span>
          </h2>
          <p className="text-[#8A7B6B] text-sm mb-12">Один раз — назавжди. Жодних підписок.</p>
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-10">
            {[
              'Save the Date запрошення',
              'Персональний весільний сайт',
              'RSVP система з дашбордом',
              'Необмежена кількість гостей',
              "Персональний домен /w/ваше-ім'я",
              'Підтримка протягом 1 року',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#B8956A]/15 flex items-center justify-center text-[#B8956A] flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-[#2C2420]/80">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/templates" className="w-full block bg-[#2C2420] text-[#FDFAF6] py-5 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-[#2C2420]/80 transition-colors text-center">
            Створити весілля зараз
          </Link>
          <p className="text-xs text-[#8A7B6B] mt-4">Немає прихованих платежів. Оплата через Monobank.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-[#E8E0D4] flex flex-col md:flex-row justify-between items-center gap-6 text-[#8A7B6B]">
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#B8956A' }}>Momently</div>
        <div className="flex gap-8 text-xs uppercase tracking-widest">
          <Link href="/templates" className="hover:text-[#2C2420] transition-colors">Шаблони</Link>
          <Link href="/pricing" className="hover:text-[#2C2420] transition-colors">Ціни</Link>
          <Link href="/auth/login" className="hover:text-[#2C2420] transition-colors">Увійти</Link>
        </div>
        <div className="text-xs">© 2026 Momently. Зроблено з любов&apos;ю в Україні.</div>
      </footer>
    </div>
  );
}
