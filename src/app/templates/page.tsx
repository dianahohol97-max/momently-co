'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const templates = [
  { name: 'Golden Elegance', slug: 'golden-hour',      cat: 'classic',  mood: 'Cream & Gold',     bg: '#FAF7F2', text: '#2C2420', accent: '#B8956A', names: 'Olivia & Noah',      font: 'Cormorant Garamond' },
  { name: 'Old Money',       slug: 'midnight-elegance', cat: 'dark',     mood: 'Dark Luxe',         bg: '#0F0F0F', text: '#F5F0E8', accent: '#B8956A', names: 'Olivia & Noah',      font: 'Playfair Display'   },
  { name: 'Burgundy Romance',slug: 'botanical-garden',  cat: 'romantic', mood: 'Wine & Rose',       bg: '#1A0F10', text: '#F2E8E0', accent: '#C4786E', names: 'Sophia & James',     font: 'Playfair Display'   },
  { name: 'Lavender Dream',  slug: 'lavender-dream',    cat: 'pastel',   mood: 'Soft Pastel',       bg: '#F8F4F9', text: '#3A2E3E', accent: '#9B7BA8', names: 'Emma & Luca',        font: 'Cormorant Garamond' },
  { name: 'Cream Elegance',  slug: 'modern-minimal',    cat: 'classic',  mood: 'UA Classic',        bg: '#FAF7F2', text: '#2C2420', accent: '#B8956A', names: 'Вікторія & Андрій', font: 'Cormorant Garamond' },
  { name: 'Emerald Garden',  slug: 'emerald-garden',    cat: 'nature',   mood: 'Nature Green',      bg: '#F5F8F2', text: '#2D3A2D', accent: '#5B7F5B', names: 'Вікторія & Андрій', font: 'Cormorant Garamond' },
  { name: 'Noir Gold',       slug: 'noir-gold',         cat: 'dark',     mood: 'Black & Gold',      bg: '#0A0A0A', text: '#F0ECE0', accent: '#C9A84C', names: 'Olivia & Noah',      font: 'Playfair Display'   },
  { name: 'Rose Blush',      slug: 'rose-blush',        cat: 'pastel',   mood: 'Soft Pink',         bg: '#FDF0F0', text: '#3D1F1F', accent: '#D4847A', names: 'Sophie & Marc',      font: 'Cormorant Garamond' },
  { name: 'Sage & Stone',    slug: 'sage-stone',        cat: 'nature',   mood: 'Earthy Minimal',    bg: '#F4F2EE', text: '#2E2A24', accent: '#8A9070', names: 'Clara & Felix',      font: 'Cormorant Garamond' },
  { name: 'Midnight Blue',   slug: 'midnight-blue',     cat: 'dark',     mood: 'Deep Blue',         bg: '#0A0F1A', text: '#E8EEF5', accent: '#6B8CAE', names: 'Isabelle & Hugo',    font: 'Playfair Display'   },
];

const filters = [
  { label: 'Всі', value: 'all' },
  { label: 'Класика', value: 'classic' },
  { label: 'Романтика', value: 'romantic' },
  { label: 'Темні', value: 'dark' },
  { label: 'Пастель', value: 'pastel' },
  { label: 'Природа', value: 'nature' },
];

function IPhoneCard({ t }: { t: typeof templates[0] }) {
  return (
    <div style={{ background: '#1a1a1a', borderRadius: 28, padding: '8px 6px', boxShadow: '0 20px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)' }}>
      <div style={{ width: 60, height: 14, background: '#1a1a1a', borderRadius: '0 0 10px 10px', margin: '0 auto 3px' }} />
      <div style={{ background: t.bg, borderRadius: 16, overflow: 'hidden', height: 300 }}>
        <div style={{ padding: '28px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ width: 24, height: 1, background: t.accent, marginBottom: 12 }} />
          <p style={{ fontSize: 5, textTransform: 'uppercase', letterSpacing: '0.3em', color: t.accent, marginBottom: 6 }}>We invite you</p>
          <h3 style={{ fontFamily: `'${t.font}', serif`, fontSize: 17, fontWeight: 300, color: t.text, lineHeight: 1.2 }}>{t.names.split(' & ')[0]}</h3>
          <p style={{ fontFamily: `'${t.font}', serif`, fontSize: 12, fontStyle: 'italic', color: t.accent, margin: '3px 0' }}>&amp;</p>
          <h3 style={{ fontFamily: `'${t.font}', serif`, fontSize: 17, fontWeight: 300, color: t.text, lineHeight: 1.2 }}>{t.names.split(' & ')[1]}</h3>
          <div style={{ width: 24, height: 1, background: t.accent, margin: '12px 0 8px' }} />
          <p style={{ fontSize: 6, color: t.accent, fontFamily: `'${t.font}', serif`, letterSpacing: '0.15em' }}>12.09.2026</p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
            {['142', '08', '34'].map((n, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: `'${t.font}', serif`, fontSize: 11, color: t.text }}>{n}</div>
                <div style={{ fontSize: 4, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent }}>{['days', 'hrs', 'min'][i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: 48, height: 3, background: '#333', borderRadius: 2, margin: '6px auto 2px' }} />
    </div>
  );
}

export default function TemplatesPage() {
  const [active, setActive] = useState('all');

  const filtered = active === 'all' ? templates : templates.filter(t => t.cat === active);

  return (
    <div className="min-h-screen bg-[#FDFAF6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-animate { animation: fadeUp 0.5s ease both; }
      `}</style>

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-[#E8E0D4]/60 bg-[#FDFAF6]/90 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#B8956A', textDecoration: 'none' }}>Momently</Link>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/auth/login" className="text-xs font-medium uppercase tracking-widest text-[#8A7B6B] hover:text-[#2C2420] transition-colors">Увійти</Link>
          <Link href="/templates" className="bg-[#2C2420] text-[#FDFAF6] px-4 md:px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-[#2C2420]/80 transition-colors">
            Створити
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 md:px-12 pt-16 pb-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#B8956A]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#B8956A]">Колекція</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, color: '#2C2420', lineHeight: 1.1 }}>
            Весільні шаблони
          </h1>
          <p className="text-sm text-[#8A7B6B] max-w-xs leading-relaxed">
            Кожен шаблон розроблений для особливого настрою. Оберіть свій стиль.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="px-6 md:px-12 max-w-6xl mx-auto mb-10">
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                active === f.value
                  ? 'bg-[#2C2420] text-white'
                  : 'border border-[#E8E0D4] text-[#8A7B6B] hover:border-[#B8956A] hover:text-[#2C2420]'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#8A7B6B] self-center">{filtered.length} шаблонів</span>
        </div>
      </div>

      {/* Grid */}
      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((t, i) => (
            <div
              key={t.slug}
              className="card-animate group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Phone */}
              <div className="relative">
                <IPhoneCard t={t} />
              </div>

              {/* Info */}
              <div className="mt-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[#2C2420]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-[#8A7B6B] mt-0.5">{t.mood}</p>
                  </div>
                </div>

                <Link
                  href={`/templates/${t.slug}`}
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#E8E0D4] text-[10px] uppercase tracking-widest text-[#8A7B6B] hover:bg-[#B8956A] hover:text-white hover:border-[#B8956A] transition-all group/btn"
                >
                  Переглянути
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon placeholder */}
        {filtered.length === templates.length && (
          <div className="mt-12 border border-dashed border-[#E8E0D4] rounded-[28px] p-12 text-center">
            <p className="text-[#B8956A]" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300 }}>
              Більше шаблонів незабаром
            </p>
            <p className="text-xs text-[#8A7B6B] mt-2 uppercase tracking-widest">Нові стилі кожного місяця</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#F5F0EA] text-center">
        <div className="w-10 h-px bg-[#B8956A] mx-auto mb-8" />
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: '#2C2420' }}>
          Знайшли свій стиль?
        </h2>
        <p className="text-sm text-[#8A7B6B] mt-3 mb-8">Всі шаблони включені в одну ціну — 599₴</p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-3 bg-[#B8956A] text-white px-8 py-4 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-[#A07850] transition-all group"
        >
          Почати зараз
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-10 border-t border-[#E8E0D4] flex flex-col md:flex-row justify-between items-center gap-4 text-[#8A7B6B]">
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#B8956A', textDecoration: 'none' }}>Momently</Link>
        <div className="flex gap-6 text-xs uppercase tracking-widest">
          <Link href="/" className="hover:text-[#2C2420] transition-colors">Головна</Link>
          <Link href="/auth/login" className="hover:text-[#2C2420] transition-colors">Увійти</Link>
        </div>
        <div className="text-xs">© 2026 Momently</div>
      </footer>
    </div>
  );
}
