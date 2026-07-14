'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Preview configs per template slug
const TEMPLATE_PREVIEW: Record<string, { bg: string; text: string; accent: string; names: string; font: string; mood: string }> = {
  'cote-dazur':            { bg: '#f9f9f9', text: '#1a1c1c', accent: '#B8956A', names: 'Olivia & Kevin',    font: 'Noto Serif',       mood: 'B&W Coastal'     },
  'il-monografo':          { bg: '#0a0a0a', text: '#f9f9f9', accent: '#ffffff', names: 'Luca & Isabella',   font: 'Newsreader',       mood: 'Editorial Black' },
  'lago-doro':             { bg: '#faf9f6', text: '#1a1c1a', accent: '#735a39', names: 'Gabriel & Maria',   font: 'Newsreader',       mood: 'Warm Gold'       },
  'the-manor':             { bg: '#200f0a', text: '#ffdbd1', accent: '#ffb3b6', names: 'Arabella & James',  font: 'Noto Serif',       mood: 'Dark Romance'    },
  'the-modern-heirloom':   { bg: '#fbf9f4', text: '#31332c', accent: '#6e5b42', names: 'Gabriel & Maria',   font: 'Noto Serif',       mood: 'Ivory Editorial' },
  'the-digital-salon':     { bg: '#fbf9f5', text: '#1b1c1a', accent: '#735c00', names: 'Isabelle & Laurent',font: 'Newsreader',       mood: 'Blush & Gold'    },
  'the-stationery':        { bg: '#fbf9f5', text: '#071524', accent: '#735a36', names: 'Isabelle & Laurent',font: 'Noto Serif',       mood: 'Deep Navy'       },
  'evergreen':             { bg: '#fdf9f4', text: '#270002', accent: '#546430', names: 'Lauren & Paul',     font: 'Noto Serif',       mood: 'Burgundy & Green'},
  'ethereal-conservatory': { bg: '#fcf9f6', text: '#1c1c1a', accent: '#496455', names: 'Henry & Amelia',   font: 'Noto Serif',       mood: 'Botanical Green' },
  'field-serif':           { bg: '#FAF7F1', text: '#23241F', accent: '#B7674B', names: 'Соломія & Марко',  font: 'Playfair Display', mood: 'Photo Editorial' },
  'noir':                  { bg: '#0E0E0E', text: '#F4F2ED', accent: '#F4F2ED', names: 'Аліса × Данило',   font: 'Prata',            mood: 'B&W Fashion' },
  'botanique':             { bg: '#F2F4EC', text: '#252B21', accent: '#55603F', names: 'Ірина та Остап',   font: 'Cormorant',        mood: 'Garden Sage' },
};

const CATEGORY_FILTERS = [
  { label: 'Всі',       value: 'all'     },
  { label: 'Мінімалізм', value: 'minimal' },
  { label: 'Романтика', value: 'romantic'},
  { label: 'Editorial', value: 'bold'    },
  { label: 'Елегантні', value: 'elegant' },
  { label: 'Botanical', value: 'modern'  },
  { label: 'Classic',   value: 'classic' },
];

function IPhoneCard({ t, preview }: { t: any; preview: any }) {
  const p = preview || { bg: '#faf9f6', text: '#2C2420', accent: '#B8956A', names: 'A & B', font: 'serif', mood: '' };
  const [name1, name2] = p.names.split(' & ');

  return (
    <div style={{ background: '#1a1a1a', borderRadius: 28, padding: '8px 6px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)' }}>
      <div style={{ width: 60, height: 14, background: '#1a1a1a', borderRadius: '0 0 10px 10px', margin: '0 auto 3px' }} />
      <div style={{ background: p.bg, borderRadius: 16, overflow: 'hidden', height: 300 }}>
        <div style={{ padding: '28px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ width: 24, height: 1, background: p.accent, marginBottom: 12 }} />
          <p style={{ fontSize: 5, textTransform: 'uppercase', letterSpacing: '0.3em', color: p.accent, marginBottom: 6 }}>
            We invite you
          </p>
          <h3 style={{ fontFamily: `'${p.font}', serif`, fontSize: 17, fontWeight: 300, color: p.text, lineHeight: 1.2 }}>
            {name1}
          </h3>
          <p style={{ fontFamily: `'${p.font}', serif`, fontSize: 12, fontStyle: 'italic', color: p.accent, margin: '3px 0' }}>&amp;</p>
          <h3 style={{ fontFamily: `'${p.font}', serif`, fontSize: 17, fontWeight: 300, color: p.text, lineHeight: 1.2 }}>
            {name2}
          </h3>
          <div style={{ width: 24, height: 1, background: p.accent, margin: '12px 0 8px' }} />
          <p style={{ fontSize: 6, color: p.accent, letterSpacing: '0.15em' }}>12.09.2026</p>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
            {['142', '08', '34'].map((n, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: `'${p.font}', serif`, fontSize: 11, color: p.text }}>{n}</div>
                <div style={{ fontSize: 4, textTransform: 'uppercase', letterSpacing: '0.1em', color: p.accent }}>
                  {['days', 'hrs', 'min'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: 48, height: 3, background: '#333', borderRadius: 2, margin: '6px auto 2px' }} />
    </div>
  );
}

export default function TemplatesClient({ templates }: { templates: any[] }) {
  const [active, setActive] = useState('all');

  const filtered = active === 'all'
    ? templates
    : templates.filter(t => t.category === active);

  return (
    <div className="min-h-screen bg-[#FDFAF6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .card-animate { animation: fadeUp 0.5s ease both; }
      `}</style>

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-[#E8E0D4]/60 bg-[#FDFAF6]/90 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#B8956A', textDecoration: 'none' }}>
          Momently
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/auth/login" className="text-xs font-medium uppercase tracking-widest text-[#8A7B6B] hover:text-[#2C2420] transition-colors">
            Увійти
          </Link>
          <Link href="/auth/login" className="bg-[#2C2420] text-[#FDFAF6] px-4 md:px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-[#2C2420]/80 transition-colors">
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
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300,
            color: '#2C2420', lineHeight: 1.1 }}>
            Весільні шаблони
          </h1>
          <p className="text-sm text-[#8A7B6B] max-w-xs leading-relaxed">
            Кожен шаблон розроблений для особливого настрою. Оберіть свій стиль.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="px-6 md:px-12 max-w-6xl mx-auto mb-10">
        <div className="flex gap-2 flex-wrap items-center">
          {CATEGORY_FILTERS.map(f => (
            <button key={f.value} onClick={() => setActive(f.value)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                active === f.value
                  ? 'bg-[#2C2420] text-white'
                  : 'border border-[#E8E0D4] text-[#8A7B6B] hover:border-[#B8956A] hover:text-[#2C2420]'
              }`}>
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#8A7B6B]">{filtered.length} шаблонів</span>
        </div>
      </div>

      {/* Grid */}
      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((t, i) => {
            const preview = TEMPLATE_PREVIEW[t.slug];
            return (
              <div key={t.id} className="card-animate group" style={{ animationDelay: `${i * 0.05}s` }}>
                <IPhoneCard t={t} preview={preview} />
                <div className="mt-4">
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: '#2C2420' }}>
                    {t.name}
                  </h3>
                  <p className="text-[11px] text-[#8A7B6B] mt-0.5">{preview?.mood || t.category}</p>
                  <Link href={`/templates/${t.slug}`}
                    className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#E8E0D4] text-[10px] uppercase tracking-widest text-[#8A7B6B] hover:bg-[#B8956A] hover:text-white hover:border-[#B8956A] transition-all group/btn">
                    Переглянути
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#8A7B6B]">Шаблони не знайдено</p>
          </div>
        )}

        <div className="mt-12 border border-dashed border-[#E8E0D4] rounded-[28px] p-12 text-center">
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: '#B8956A' }}>
            Більше шаблонів незабаром
          </p>
          <p className="text-xs text-[#8A7B6B] mt-2 uppercase tracking-widest">Нові стилі кожного місяця</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#F5F0EA] text-center">
        <div className="w-10 h-px bg-[#B8956A] mx-auto mb-8" />
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: '#2C2420' }}>
          Знайшли свій стиль?
        </h2>
        <p className="text-sm text-[#8A7B6B] mt-3 mb-8">Всі шаблони включені в одну ціну — 599₴</p>
        <Link href="/auth/login"
          className="inline-flex items-center gap-3 bg-[#B8956A] text-white px-8 py-4 rounded-full text-sm font-medium uppercase tracking-widest hover:bg-[#A07850] transition-all group">
          Почати зараз
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      <footer className="px-8 py-10 border-t border-[#E8E0D4] flex flex-col md:flex-row justify-between items-center gap-4 text-[#8A7B6B]">
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#B8956A', textDecoration: 'none' }}>
          Momently
        </Link>
        <div className="flex gap-6 text-xs uppercase tracking-widest">
          <Link href="/" className="hover:text-[#2C2420] transition-colors">Головна</Link>
          <Link href="/auth/login" className="hover:text-[#2C2420] transition-colors">Увійти</Link>
        </div>
        <div className="text-xs">© 2026 Momently</div>
      </footer>
    </div>
  );
}
