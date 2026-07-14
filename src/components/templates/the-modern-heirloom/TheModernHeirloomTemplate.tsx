'use client';
import { useState, useEffect } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

// ─── PALETTE ──────────────────────────────────────────────
const C = {
  bg:        '#fbf9f4',
  bgLow:     '#f5f4ed',
  bgWhite:   '#ffffff',
  text:      '#31332c',
  textMuted: '#797c73',
  primary:   '#6e5b42',
  primaryDim:'#594a35',
  gold:      '#745c00',
  outline:   '#797c73',
  outlineV:  '#b1b3a9',
};

// ─── TYPES ────────────────────────────────────────────────
interface EventItem {
  date_time: string;
  title: string;
  location: string;
  description: string;
}

interface WeddingData {
  locale?: string;
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;
  location: string;
  hero_image_url: string;
  story_image_url: string;
  story_heading: string;
  story_paragraph_1: string;
  story_paragraph_2: string;
  events: EventItem[];
  venue_name: string;
  venue_city: string;
  venue_address: string;
  venue_description: string;
  venue_image_url: string;
  venue_map_url: string;
  transport_description: string;
  dress_code_title: string;
  dress_code_description: string;
  gallery_images: string[];
  faq: { question: string; answer: string }[];
  rsvp_deadline: string;
  slug: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Марта',
  partner_name_2: 'Богдан',
  wedding_date: '2026-09-14T16:00:00',
  location: 'озеро Комо, Італія',
  hero_image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600&q=80',
  story_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80',
  story_heading: 'З Барселони —\nз любов’ю.',
  story_paragraph_1: 'Все почалося в теплому бурштиновому світлі барселонського заходу сонця, коли випадкова зустріч у маленькому тапас-барі перетворилася на колекцію спільних пригод. Від звивистих вуличок Готичного кварталу до тихих п’яцц Тоскани — наша історія складалася з маленьких спільних відкриттів.',
  story_paragraph_2: 'Роки потому, серед ренесансної краси Флоренції, пролунала обіцянка. Запрошуємо вас на береги озера Комо — стати свідками початку нашого найбільшого розділу.',
  events: [
    { date_time: '13 вересня · 19:00', title: 'Вітальні коктейлі', location: 'Тераса Вілли Бальб’янелло', description: 'Вечір знайомств з живою музикою, аперитивами й першими тостами на історичній терасі над озером.' },
    { date_time: '14 вересня · 15:30', title: 'Церемонія', location: 'Сади Вілли дель Бальб’янелло', description: 'Головна подія. Обмін обітницями серед столітніх садів і шампанське на лоджії з видом на Комо.' },
    { date_time: '15 вересня · 11:00', title: 'Прощальний бранч', location: 'Гранд-готель Тремеццо', description: 'Неспішний ранок прощань за просеко і випічкою — крапка вихідних, яку хочеться поставити красиво.' },
  ],
  venue_name: 'Вілла дель Бальб’янелло',
  venue_city: 'озеро Комо',
  venue_address: 'Via Comoedia, 5\n22016 Lenno, Італія',
  venue_description: 'Місце позачасової елегантності. Команда Гранд-готелю Тремеццо подбала про кожну деталь цих вихідних — від трансферів до останнього келиха.',
  venue_image_url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=900&q=80',
  venue_map_url: '#',
  transport_description: 'До Комо найзручніше з міланських аеропортів Мальпенса (MXP) або Бергамо (BGY): потяг Malpensa Express до станції Como Lago, або приватний трансфер через нашого консьєржа.',
  dress_code_title: 'Дрес-код',
  dress_code_description: 'Найурочистіше з вашого гардероба. Для панів — смокінг або строгий костюм, для пань — сукня в підлогу чи елегантний коктейль. Врахуйте гравійні доріжки біля озера, обираючи взуття.',
  gallery_images: [
    'https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80',
    'https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?w=600&q=80',
    'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  ],
  faq: [
    { question: 'Чи можна прийти з парою?', answer: 'Через камерність вілли ми можемо прийняти лише гостей, названих у запрошенні. Якщо є питання — напишіть нам особисто.' },
    { question: 'Чи запрошені діти?', answer: 'Це свято ми задумали лише для дорослих — щоб кожен міг святкувати на повну.' },
    { question: 'Як дістатися в день церемонії?', answer: 'Ми організуємо приватні водні таксі від Тремеццо до вілли. Точний розклад надішлемо ближче до дати.' },
  ],
  rsvp_deadline: '1 липня 2026',
  slug: 'marta-bohdan',
};

// ─── COUNTDOWN ────────────────────────────────────────────
function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

// ─── ADD TO CALENDAR ──────────────────────────────────────
function addToCalendar(data: WeddingData) {
  const start = new Date(data.wedding_date);
  const end = new Date(start.getTime() + 6 * 3600000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${data.partner_name_1} & ${data.partner_name_2} Wedding`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: `${data.venue_name}, ${data.venue_address}`,
    details: `You are invited to the wedding of ${data.partner_name_1} & ${data.partner_name_2}`,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
}

// ─── RSVP FORM ────────────────────────────────────────────
function RSVPForm({ data }: { data: WeddingData }) {
  const L = normalizeLocale(data.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [form, setForm] = useState({ name: '', email: '', attendance: '', dietary: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, wedding_slug: data.slug }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <div className="py-16 space-y-3">
      <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 28, color: C.text }}>
        {t('thanksYes', { name: form.name })}
      </p>
      <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.textMuted }}>
        {t('thanksSub')}
      </p>
    </div>
  );

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      <div>
        <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, display: 'block', marginBottom: 8 }}>
          {t('nameLabel')}
        </label>
        <input
          className="w-full bg-transparent focus:outline-none py-3 px-0 text-xl"
          style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', color: C.text,
            borderBottom: `0.5px solid ${C.outline}`, transition: 'border-color 0.3s' }}
          placeholder={t('namePlaceholder')} required
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div>
        <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, display: 'block', marginBottom: 8 }}>
          {t('emailLabel')}
        </label>
        <input
          className="w-full bg-transparent focus:outline-none py-3 px-0"
          style={{ color: C.text, borderBottom: `0.5px solid ${C.outline}` }}
          placeholder="your@email.com" type="email"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div>
        <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, display: 'block', marginBottom: 12 }}>
          {t('presenceLabel')}
        </label>
        <div className="flex gap-10">
          {[{ val: 'attending', label: t('yes') }, { val: 'declined', label: t('no') }].map(o => (
            <label key={o.val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="attendance" value={o.val}
                checked={form.attendance === o.val}
                onChange={() => setForm(f => ({ ...f, attendance: o.val }))}
                style={{ accentColor: C.primary, width: 16, height: 16 }}
              />
              <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.text }}>
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, display: 'block', marginBottom: 8 }}>
          {t('wishesLabel')}
        </label>
        <input
          className="w-full bg-transparent focus:outline-none py-3 px-0 text-xl"
          style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', color: C.text, borderBottom: `0.5px solid ${C.outline}` }}
          placeholder={t('wishesPlaceholder')}
          value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))}
        />
      </div>
      <button
        type="submit" disabled={status === 'loading'}
        className="w-full py-5 disabled:opacity-40 hover:opacity-80 transition-opacity"
        style={{ background: C.primary, color: '#fff6ef', fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase' }}
      >
        {status === 'loading' ? t('sending') : t('submit')}
      </button>
      {status === 'error' && (
        <p style={{ fontSize: 11, color: '#9e422c', textAlign: 'center' }}>{t('errSend')}</p>
      )}
      <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted, textAlign: 'center' }}>
        {t('rsvpDeadline', { date: data.rsvp_deadline })}
      </p>
    </form>
  );
}


// ─── WAX SEAL (signature) ─────────────────────────────────
const SEAL_CSS = `
.mh-sealwrap{text-align:center;padding:24px 0 8px}
.mh-seal{position:relative;width:150px;height:150px;background:none;border:none;cursor:pointer;display:inline-block;transition:transform .3s}
.mh-seal:hover{transform:scale(1.04) rotate(-2deg)}
.mh-half{position:absolute;inset:0;display:block;transition:transform .55s cubic-bezier(.6,-.2,.3,1),opacity .55s}
.mh-l{clip-path:polygon(0 0,54% 0,42% 18%,58% 34%,44% 52%,60% 70%,46% 86%,52% 100%,0 100%)}
.mh-r{clip-path:polygon(54% 0,100% 0,100% 100%,52% 100%,46% 86%,60% 70%,44% 52%,58% 34%,42% 18%)}
.mh-seal.broken{cursor:default}
.mh-seal.broken .mh-l{transform:translate(-26px,10px) rotate(-9deg);opacity:0}
.mh-seal.broken .mh-r{transform:translate(24px,12px) rotate(8deg);opacity:0}
.mh-hint{margin-top:14px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#797c73}
.mh-form{opacity:0;transform:translateY(14px);transition:opacity .6s,transform .6s}
.mh-form.open{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.mh-half,.mh-form{transition:none}}
`;
function SealFace({ a, b }: { a: string; b: string }) {
  return (
    <svg viewBox="0 0 160 160" width="150" height="150" aria-hidden="true">
      <path d="M80 6 C96 4 104 14 118 14 C132 14 138 26 148 34 C158 42 154 56 156 68 C158 80 152 90 152 100 C152 112 142 120 136 130 C130 140 118 140 108 146 C98 152 88 148 80 150 C70 152 62 144 52 142 C40 140 34 132 28 122 C22 112 12 108 10 96 C8 84 14 76 12 64 C10 52 18 44 26 36 C34 28 40 18 52 14 C64 10 70 8 80 6 Z" fill="#7A2E2B"/>
      <circle cx="80" cy="78" r="52" fill="none" stroke="#5E211F" strokeWidth="2"/>
      <circle cx="80" cy="78" r="46" fill="none" stroke="#93433D" strokeWidth="1"/>
      <text x="80" y="92" textAnchor="middle" fontFamily="'Noto Serif', serif" fontStyle="italic" fontSize="40" fill="#F3E4D8">{a}&amp;{b}</text>
    </svg>
  );
}
function SealedRSVP({ data }: { data: WeddingData }) {
  const L = normalizeLocale(data.locale);
  const t = (k: string) => tr(L, k);
  const [broken, setBroken] = useState(false);
  const [open, setOpen] = useState(false);
  const crack = () => { if (broken) return; setBroken(true); setTimeout(() => setOpen(true), 550); };
  const a = data.partner_name_1?.[0] || '';
  const b = data.partner_name_2?.[0] || '';
  return (
    <div>
      <style>{SEAL_CSS}</style>
      {!open && (
        <div className="mh-sealwrap">
          <button type="button" aria-label={t('breakSeal')} onClick={crack} className={'mh-seal' + (broken ? ' broken' : '')}>
            <span className="mh-half mh-l"><SealFace a={a} b={b} /></span>
            <span className="mh-half mh-r"><SealFace a={a} b={b} /></span>
          </button>
          <p className="mh-hint">{t('breakSeal')}</p>
        </div>
      )}
      <div className={'mh-form' + (open ? ' open' : '')}>{open && <RSVPForm data={data} />}</div>
    </div>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function TheModernHeirloomTemplate({ data = DEMO }: { data?: WeddingData }) {
  const L = normalizeLocale(data.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown(data.wedding_date);
  const initials = `${data.partner_name_1[0]}&${data.partner_name_2[0]}`;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}
      className="font-sans">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Manrope:wght@200..800&display=swap');
        .font-serif { font-family: 'Noto Serif', serif; }
        .font-sans  { font-family: 'Manrope', sans-serif; }
        ::-webkit-scrollbar { width: 0; background: transparent; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-4"
        style={{ background: `${C.bgWhite}CC`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.outlineV}20` }}>
        <div style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 18, color: C.text, letterSpacing: '0.02em' }}>
          {initials}
        </div>
        <div className="hidden md:flex gap-10 items-center">
          {[['#story', t('navStory')], ['#events', t('navSchedule')], ['#venue', t('locationLabel')], ['#rsvp', 'RSVP']].map(([href, label]) => (
            <a key={href} href={href}
              style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted }}
              className="hover:text-black transition-colors">
              {label}
            </a>
          ))}
          <a href="#rsvp"
            style={{ background: C.primary, color: '#fff6ef', padding: '10px 24px', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}
            className="hover:opacity-80 transition-opacity">
            RSVP
          </a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}
          style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted }}>
          {t('navMenu')}
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full flex flex-col py-6 px-8 gap-5 md:hidden"
            style={{ background: C.bgWhite, borderBottom: `1px solid ${C.outlineV}20` }}>
            {[['#story', t('navStory')], ['#events', t('navSchedule')], ['#venue', t('locationLabel')], ['#rsvp', 'RSVP']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted }}>
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <img src={data.hero_image_url} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${C.bg} 100%)` }} />
        </div>

        <div className="relative z-10 px-6 max-w-4xl mx-auto fade-in">
          <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.primary, marginBottom: 16 }}>
            {t('saveTheDate')}
          </p>
          <h1 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 'clamp(52px, 10vw, 96px)', fontWeight: 300, color: C.text, lineHeight: 1.05, marginBottom: 20 }}>
            {data.partner_name_1} & {data.partner_name_2}
          </h1>
          <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 18, color: C.text, opacity: 0.7, marginBottom: 6 }}>
            {new Date(data.wedding_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 40 }}>
            {data.location}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#rsvp"
              style={{ background: C.primary, color: '#fff6ef', padding: '16px 48px', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
              className="hover:opacity-80 transition-opacity">
              {t('viewDetails')}
            </a>
            <button onClick={() => addToCalendar(data)}
              style={{ border: `1px solid ${C.outlineV}50`, color: C.textMuted, padding: '16px 28px', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}
              className="flex items-center gap-2 justify-center hover:border-black transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('addToCalendar')}
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '80px 40px', background: C.bgWhite }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-8 md:gap-0">
            {[
              { val: countdown.days, label: t('unitDays') },
              { val: countdown.hours, label: t('unitHours') },
              { val: countdown.minutes, label: t('unitMin') },
              { val: countdown.seconds, label: t('unitSec') },
            ].map(({ val, label }, i) => (
              <>
                <div key={label} className="flex flex-col">
                  <span style={{ fontFamily: "'Noto Serif', serif", fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 200, color: C.text, lineHeight: 1, tabularNums: 'tabular-nums' } as React.CSSProperties}>
                    {String(val).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.textMuted, marginTop: 8 }}>
                    {label}
                  </span>
                </div>
                {i < 3 && <div key={`div-${i}`} className="hidden md:block w-px h-16" style={{ background: `${C.outlineV}40` }} />}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY — Editorial Asymmetric */}
      <section style={{ padding: '100px 40px', background: C.bgLow }} id="story">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Image left */}
            <div style={{ overflow: 'hidden', aspectRatio: '3/4' }}>
              <img src={data.story_image_url} alt="The couple"
                className="w-full h-full object-cover grayscale-[20%]"
                style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
            {/* Text right — editorial offset */}
            <div style={{ paddingTop: 48 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold, marginBottom: 20 }}>
                {`${t('storyA')} ${t('storyB')}`}
              </p>
              <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 'clamp(32px, 4vw, 52px)', color: C.text, lineHeight: 1.15, marginBottom: 28, whiteSpace: 'pre-line' }}>
                {data.story_heading}
              </h2>
              <div style={{ width: 40, height: 1, background: C.gold, marginBottom: 28, opacity: 0.5 }} />
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.textMuted, marginBottom: 20 }}>{data.story_paragraph_1}</p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.textMuted }}>{data.story_paragraph_2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section style={{ padding: '100px 40px', background: C.bg }} id="events">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 12 }}>
              {t('celebrationLabel')}
            </p>
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 42, fontWeight: 300, color: C.text }}>
              {t('weekendLabel')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.events.map((ev, i) => (
              <div key={i}>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 10 }}>
                  {ev.date_time}
                </p>
                <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: 26, marginBottom: 8, color: C.text }}>
                  {ev.title}
                </h3>
                <p style={{ fontStyle: 'italic', fontSize: 13, color: C.textMuted, marginBottom: 10 }}>{ev.location}</p>
                <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section style={{ padding: '100px 40px', background: C.bgLow }} id="venue">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 48, fontWeight: 300, color: C.text, marginBottom: 24 }}>
                {data.venue_city}
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: C.textMuted, marginBottom: 32 }}>{data.venue_description}</p>
              <div className="space-y-8">
                <div>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>
                    Venue
                  </p>
                  <p style={{ fontFamily: "'Noto Serif', serif", fontSize: 18, color: C.text }}>{data.venue_name}</p>
                  <p style={{ fontSize: 12, color: C.textMuted, marginTop: 4, whiteSpace: 'pre-line' }}>{data.venue_address}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>
                    {t('transportLabel')}
                  </p>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>{data.transport_description}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <a href={data.venue_map_url} target="_blank" rel="noreferrer"
                  style={{ border: `1px solid ${C.outlineV}50`, color: C.text, padding: '12px 28px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}
                  className="hover:border-black transition-colors">
                  {t('viewMap')}
                </a>
              </div>
            </div>
            <div style={{ overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src={data.venue_image_url} alt={data.venue_name}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DRESS CODE */}
      <section style={{ padding: '100px 40px', background: C.bgWhite, textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.gold, margin: '0 auto 32px' }} />
          <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 16 }}>
            {data.dress_code_title}
          </p>
          <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 32, color: C.text, marginBottom: 20 }}>
            {t('dressLabel')}
          </p>
          <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
            {data.dress_code_description}
          </p>
        </div>
      </section>

      {/* GALLERY */}
      {data.gallery_images.length > 0 && (
        <section style={{ padding: '0' }}>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {data.gallery_images.map((url, i) => (
              <div key={i} style={{ overflow: 'hidden', aspectRatio: i % 3 === 0 ? '3/4' : '1/1' }}>
                <img src={url} alt="" className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.9)', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section style={{ padding: '100px 40px', background: C.bg }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 64 }}>
            {t('faqTitle')}
          </p>
          <div className="space-y-16">
            {data.faq.map((item, i) => (
              <div key={i}>
                <h4 style={{ fontFamily: "'Noto Serif', serif", fontSize: 22, color: C.text, marginBottom: 12 }}>
                  {item.question}
                </h4>
                <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '100px 40px', background: C.bgWhite }} id="rsvp">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 16 }}>
                RSVP
              </p>
              <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 52, fontWeight: 300, lineHeight: 1.15, color: C.text }}>
                {t('kindlyConfirm')}<br />your attendance.
              </h2>
              <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted, marginTop: 16 }}>
                {data.location}
              </p>
            </div>
            <SealedRSVP data={data} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bgLow, padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 28, color: C.primary, marginBottom: 20 }}>
          {initials}
        </div>
        <div className="flex justify-center gap-8 mb-6">
          {['#story', '#events', '#venue', '#rsvp'].map(href => (
            <a key={href} href={href}
              style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted }}
              className="hover:text-black transition-colors">
              {href.replace('#', '')}
            </a>
          ))}
        </div>
        <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.textMuted, opacity: 0.5 }}>
          © 2026 {data.partner_name_1} & {data.partner_name_2} · Momently
        </p>
      </footer>
    </div>
  );
}
