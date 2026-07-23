'use client';
import { useState, useEffect } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

// ─── COLORS ──────────────────────────────────────────────
const C = {
  bg:        '#200f0a',
  bgLow:     '#291711',
  bgHigh:    '#3a251f',
  text:      '#ffdbd1',
  textMuted: '#dcc0c0',
  textWarm:  '#F5EDE3',
  primary:   '#ffb3b6',
  burgundy:  '#7b1c2a',
  secondary: '#c9c6c1',
  outline:   '#a48b8b',
  outlineV:  '#564242',
};

// ─── TYPES ────────────────────────────────────────────────
interface EventItem {
  time: string;
  title: string;
  location: string;
  description: string;
}

interface Hotel {
  name: string;
  description: string;
  url?: string;
}

interface WeddingData {
  locale?: string;
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;
  wedding_date_written: string;  // e.g. "Twenty-Fourth of June"
  location: string;
  location_written: string;      // e.g. "The Cotswolds, England"
  hero_image_url: string;
  portrait_image_url: string;
  story_quote: string;
  story_invite: string;
  story_paragraphs: string[];
  events: EventItem[];
  venue_name: string;
  venue_address: string;
  venue_image_url: string;
  venue_directions_url: string;
  hotels: Hotel[];
  dress_code_title: string;
  dress_code_description: string;
  gifts_description: string;
  gifts_url: string;
  faq: { question: string; answer: string }[];
  rsvp_deadline: string;
  slug: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Аделіна',
  partner_name_2: 'Ян',
  wedding_date: '2026-06-24T16:00:00',
  wedding_date_written: 'Двадцять четверте червня',
  location: 'Полісся',
  location_written: 'Замок Радомисль, Полісся',
  hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
  portrait_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  story_quote: '«У тихих закутках старого саду, під пильним поглядом каменю і плюща, ми знайшли любов, що ніби існувала завжди — архів моментів, які чекали бути записаними.»',
  story_invite: 'Запрошуємо вас розпочати разом із нами наше спільне життя в Маєтку — там, де час завмирає серед стрижених живоплотів і опівнічних бібліотечних полиць. Свято історії, спадку і тихої відданості на все життя.',
  story_paragraphs: [
    'Все почалося в тихому гулі львівської наукової бібліотеки — серед запаху старого паперу і м’якого ритму дощу за вікнами. Двоє незнайомців, поєднані любов’ю до забутих закутків історії, одночасно потяглися за тим самим томиком романтичної поезії у шкіряній палітурці.',
    'Сезони, що настали, були виром місячних прогулянок Карпатами і тихих розмов у бістро при свічках. Ми відкрили, що любов — не один великий жест, а колекція шепотів: те, як світло ловить усмішку, чи тепло руки, стиснутої міцніше проти зимового холоду.',
    'Туманного вечора на балконі старого палацу, під далекі дзвони Ратуші, пролунала обіцянка. Обіцянка збудувати життя, що відчувається як реліквія — багате традицією, шароване пам’яттю і бережене відданістю двох душ, які нарешті знайшли свій дім.',
    'Тепер, готуючись стати перед нашими родинами і самою вагою історії, ми запрошуємо вас у найважливіший розділ. Наша історія більше не лише наша — це гобелен, який ми тчемо далі разом із найдорожчими.',
  ],
  events: [
    { time: '23 червня · 19:00', title: 'Вечеря прибуття', location: 'Велика зала', description: 'Камерна зустріч найдорожчих гостей маєтку.' },
    { time: '24 червня · 15:30', title: 'Церемонія', location: 'Сад-святилище', description: 'Обітниці під старим дубом — за свідків камінь і небо.' },
    { time: '24 червня · 17:30', title: 'Коктейльна година', location: 'Тераса', description: 'Шампанське й розмови, поки сходить золота година.' },
    { time: '24 червня · 19:30', title: 'Бенкет', location: 'Трапезна зала', description: 'Вечеря при свічках і танці до перших годин ранку.' },
  ],
  venue_name: 'Замок Радомисль',
  venue_address: 'вул. Замкова, 1\nРадомишль, Житомирщина',
  venue_image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
  venue_directions_url: '#',
  hotels: [
    { name: 'Садиба «Стара пошта»', description: 'Історичний заїзд за десять хвилин від замку. Назвіть код «А&Я» для особливих умов.', url: '#' },
    { name: 'Бутік-готель «Плющ»', description: 'Камерний прихисток серед доглянутих садів.', url: '#' },
  ],
  dress_code_title: 'Black tie',
  dress_code_description: 'Просимо про урочисте вечірнє вбрання: панове — у смокінгах, пані — у сукнях у підлогу. Вітаємо палітру слонової кістки, шампанського, опівнічної синяви та лісової зелені.',
  gifts_description: 'Ваша присутність на нашому святі — найбільший подарунок, про який ми могли б просити. Якщо захочете вшанувати нас жестом, внесок у фонд нашої подорожі буде глибоко цінним.',
  gifts_url: '#',
  faq: [
    { question: 'Чи запрошені діти?', answer: 'Наше свято — для дорослих, за винятком немовлят. Сподіваємось, це подарує кожному свободу святкувати сповна.' },
    { question: 'Як дістатися до маєтку?', answer: 'До замку зручно доїхати автомобілем трасою на Житомир. Радимо подбати про проживання поблизу — у маєтку немає гостьових кімнат.' },
    { question: 'До котрої дати відповісти?', answer: 'Просимо про вашу відповідь до 1 травня 2026 — щоб ми встигли завершити приготування.' },
  ],
  rsvp_deadline: '1 травня 2026',
  slug: 'adelina-yan',
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
function addToCalendar(data: WeddingData, summary?: string) {
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
  const [form, setForm] = useState({ name: '', email: '', attendance: '', dietary: '', message: '' });
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
    <div className="text-center py-16 space-y-4">
      <div style={{ fontFamily: "'Corinthia', cursive", fontSize: 56, color: C.primary }}>
        {t('thanksYes', { name: '' }).replace(', !', '!')}
      </div>
      <p style={{ color: C.textMuted, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
        {t('envReceived')}
      </p>
    </div>
  );

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      <div className="border-b pb-6" style={{ borderColor: `${C.outlineV}50` }}>
        <input
          className="w-full bg-transparent focus:outline-none py-3 px-0 text-xl"
          style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', color: C.textWarm, borderBottom: `0.5px solid ${C.outlineV}` }}
          placeholder={t('nameLabel')} required
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div>
        <input
          className="w-full bg-transparent focus:outline-none py-3 px-0"
          style={{ fontFamily: "'Newsreader', serif", color: C.textWarm, borderBottom: `0.5px solid ${C.outlineV}` }}
          placeholder={t('emailLabel')} type="email"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div className="space-y-4">
        <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.secondary }}>
          {t('yourPresence')}
        </p>
        <div className="flex gap-10">
          {[{ val: 'attending', label: t('yes') }, { val: 'declined', label: t('no') }].map(o => (
            <label key={o.val} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="attendance" value={o.val}
                checked={form.attendance === o.val}
                onChange={() => setForm(f => ({ ...f, attendance: o.val }))}
                className="w-4 h-4" style={{ accentColor: C.burgundy }}
              />
              <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.textMuted }}>
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <input
          className="w-full bg-transparent focus:outline-none py-3 px-0"
          style={{ fontFamily: "'Newsreader', serif", color: C.textWarm, borderBottom: `0.5px solid ${C.outlineV}` }}
          placeholder={t('wishesLabel')}
          value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))}
        />
      </div>
      <button
        type="submit" disabled={status === 'loading'}
        className="w-full py-5 text-sm disabled:opacity-40 transition-opacity hover:opacity-80"
        style={{ background: C.burgundy, color: C.textWarm, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: "'Newsreader', serif', fontSize: 12" }}
      >
        {status === 'loading' ? t('sending') : t('submit')}
      </button>
      {status === 'error' && (
        <p style={{ color: '#ffb4ab', fontSize: 11, textAlign: 'center' }}>{t('errSend')}</p>
      )}
      <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.secondary, textAlign: 'center' }}>
        Kindly respond by {data.rsvp_deadline}
      </p>
    </form>
  );
}

// ─── WAX SEAL ─────────────────────────────────────────────
function WaxSeal({ initials }: { initials: string }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${C.secondary}, #8a8680)` }} />
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 65% 65%, rgba(0,0,0,0.3), transparent)' }} />
      <span className="relative z-10" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: C.bg, fontSize: 20 }}>
        {initials}
      </span>
    </div>
  );
}

// ─── ORNATE CORNER ────────────────────────────────────────
function OrnateCorners({ children }: { children: React.ReactNode }) {
  const cornerStyle = (pos: string): React.CSSProperties => ({
    position: 'absolute',
    width: 40, height: 40,
    ...(pos.includes('top') ? { top: -8 } : { bottom: -8 }),
    ...(pos.includes('left') ? { left: -8 } : { right: -8 }),
    borderTop: pos.includes('top') ? `1.5px solid ${C.primary}40` : undefined,
    borderBottom: pos.includes('bottom') ? `1.5px solid ${C.primary}40` : undefined,
    borderLeft: pos.includes('left') ? `1.5px solid ${C.primary}40` : undefined,
    borderRight: pos.includes('right') ? `1.5px solid ${C.primary}40` : undefined,
  });
  return (
    <div className="relative">
      <div style={cornerStyle('top-left')} />
      <div style={cornerStyle('top-right')} />
      <div style={cornerStyle('bottom-left')} />
      <div style={cornerStyle('bottom-right')} />
      {children}
    </div>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function TheManorTemplate({ data = DEMO }: { data?: WeddingData }) {
  const L = normalizeLocale(data.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [menuOpen, setMenuOpen] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const countdown = useCountdown(data.wedding_date);
  const initials = `${data.partner_name_1[0]}&${data.partner_name_2[0]}`;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: "'Newsreader', serif", overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Corinthia&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
        ::selection { background: #7b1c2a; color: #F5EDE3; }
        ::-webkit-scrollbar { width: 4px; background: #1a0a06; }
        ::-webkit-scrollbar-thumb { background: #3a251f; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes envelopeOpen { from { transform: scaleY(1); } to { transform: scaleY(0); transform-origin: top; } }
        .fade-up { animation: fadeUp 1s ease both; }
        .fade-up-delay { animation: fadeUp 1s ease 0.3s both; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-5"
        style={{ background: `${C.bg}CC`, backdropFilter: 'blur(20px)', boxShadow: '0 24px 24px rgba(26,10,6,0.06)' }}>
        <div className="hidden md:flex gap-8 items-center">
          {['#story', '#details', '#stay'].map((href, i) => (
            <a key={href} href={href}
              style={{ color: i === 0 ? C.primary : `${C.textWarm}99`, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                borderBottom: i === 0 ? `1px solid ${C.primary}` : undefined, paddingBottom: i === 0 ? 2 : undefined }}
              className="hover:opacity-100 transition-opacity">
              {[t('navStory'), t('navDetails'), 'Where to Stay'][i]}
            </a>
          ))}
        </div>

        <div className="flex-1 md:flex-none flex justify-center">
          <span style={{ fontFamily: "'Corinthia', cursive", fontSize: 28, color: C.text }}>
            {data.partner_name_1} & {data.partner_name_2}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#rsvp" style={{ color: `${C.textWarm}99`, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}
            className="hover:text-white transition-colors">RSVP</a>
          <a href="#gifts"
            style={{ background: C.burgundy, color: C.textWarm, padding: '8px 16px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {t('giftsLabel')}
          </a>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}
          style={{ color: C.primary, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {t('navMenu')}
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full flex flex-col py-8 px-8 gap-6 md:hidden"
            style={{ background: C.bg, borderTop: `1px solid ${C.outlineV}20` }}>
            {['#story', '#details', '#stay', '#rsvp'].map((href, i) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ color: C.textMuted, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {[t('navStory'), t('navDetails'), 'Where to Stay', 'RSVP'][i]}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO — Envelope */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 text-center pt-20">
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, transparent 0%, ${C.bg} 75%)`, zIndex: 1 }} />

        <div className="relative z-10 flex flex-col items-center space-y-8 fade-up">
          <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.primary, opacity: 0.8 }}>
            We&apos;re Getting Married
          </p>

          <h1 style={{ fontFamily: "'Corinthia', cursive", fontSize: 'clamp(64px, 12vw, 120px)', color: C.text, lineHeight: 1 }}>
            {data.partner_name_1} & {data.partner_name_2}
          </h1>

          {/* Envelope */}
          <div
            className="relative cursor-pointer group"
            style={{ transform: 'scale(1)', transition: 'transform 0.7s ease' }}
            onClick={() => setEnvelopeOpen(true)}
          >
            <div className="relative flex items-center justify-center overflow-hidden"
              style={{ width: 'min(480px, 85vw)', height: 'min(340px, 60vw)', background: '#f5ede3',
                boxShadow: '0 40px 60px -20px rgba(0,0,0,0.7), 0 20px 30px -10px rgba(0,0,0,0.5)' }}>
              {/* Envelope lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 480 340" fill="none">
                <path d="M0 0L240 170L480 0" stroke="#dcc0c0" strokeOpacity="0.3" strokeWidth="0.5" />
                <path d="M0 340L180 170" stroke="#dcc0c0" strokeOpacity="0.3" strokeWidth="0.5" />
                <path d="M480 340L300 170" stroke="#dcc0c0" strokeOpacity="0.3" strokeWidth="0.5" />
              </svg>
              <WaxSeal initials={initials} />
              {!envelopeOpen && (
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${C.bg}60` }}>
                    {t('privateInv')}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full"
              style={{ background: 'rgba(0,0,0,0.4)', filter: 'blur(24px)' }} />
          </div>

          {!envelopeOpen ? (
            <button
              onClick={() => setEnvelopeOpen(true)}
              style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.textMuted }}
              className="flex flex-col items-center gap-3 hover:text-white transition-colors mt-8">
              <span>{t('envOpen')}</span>
              <span style={{ animation: 'bounce 2s infinite' }}>↓</span>
            </button>
          ) : (
            <div className="fade-up-delay space-y-6 max-w-lg text-center mt-8">
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 18, color: C.text, lineHeight: 1.7 }}>
                {data.story_invite}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <a href="#rsvp"
                  style={{ background: C.burgundy, color: C.textWarm, padding: '14px 40px', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                  RSVP
                </a>
                <button onClick={() => addToCalendar(data, t('stdEvent', { names: data.partner_name_1 + ' & ' + data.partner_name_2 }))}
                  style={{ border: `1px solid ${C.outlineV}`, color: C.textMuted, padding: '14px 28px', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}
                  className="flex items-center gap-2 justify-center hover:border-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t('addToCalendar')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ background: C.bgLow, padding: '80px 32px' }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.outline, textAlign: 'center', marginBottom: 48 }}>
            {t('countdownLabel')}
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
            {[
              { val: countdown.days, label: t('unitDays') },
              { val: countdown.hours, label: t('unitHours') },
              { val: countdown.minutes, label: t('unitMin') },
              { val: countdown.seconds, label: t('unitSec') },
            ].map(({ val, label }, i) => (
              <>
                <div key={label} className="text-center">
                  <div style={{ fontFamily: "'Noto Serif', serif", fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 200, color: C.primary, lineHeight: 1 }}>
                    {String(val).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.secondary, marginTop: 8 }}>
                    {label}
                  </div>
                </div>
                {i < 3 && <div className="hidden md:block w-px h-16" style={{ background: `${C.outlineV}40` }} />}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section style={{ padding: '100px 32px' }} id="story">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.secondary, marginBottom: 12 }}>
              Archive No. 07
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(36px, 5vw, 60px)', color: C.text }}>
              {`${t('storyA')} ${t('storyB')}`}
            </h2>
            <div className="mx-auto mt-6 w-12 h-px" style={{ background: `${C.outlineV}60` }} />
          </div>

          {/* Portrait with ornate frame */}
          <div className="max-w-2xl mx-auto mb-20">
            <OrnateCorners>
              <div style={{ background: C.bgLow, padding: '32px', border: `1px solid ${C.outlineV}20` }}>
                <div style={{ border: `1px solid ${C.outlineV}20`, overflow: 'hidden', aspectRatio: '4/5' }}>
                  <img src={data.portrait_image_url} alt="The couple"
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(0.6) sepia(0.2) contrast(1.1)', transition: 'transform 0.7s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              </div>
            </OrnateCorners>
          </div>

          {/* Narrative */}
          <div className="max-w-xl mx-auto text-center space-y-10">
            {data.story_paragraphs.map((p, i) => (
              <p key={i} style={{ fontStyle: 'italic', fontSize: 18, lineHeight: 1.8, color: `${C.text}E6` }}>{p}</p>
            ))}
            <div className="pt-12">
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.secondary, marginBottom: 12 }}>
                {t('withLove')}
              </p>
              <div style={{ fontFamily: "'Corinthia', cursive", fontSize: 56, color: C.text }}>
                {data.partner_name_1} & {data.partner_name_2}
              </div>
            </div>
            <div className="flex justify-center opacity-20">
              <span>✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* THE DETAILS / EVENTS */}
      <section style={{ background: C.bgLow, padding: '100px 32px' }} id="details">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.secondary, marginBottom: 12 }}>
              {t('celebrationLabel')}
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 48, color: C.text }}>
              {t('detailsTag')}
            </h2>
          </div>
          <p style={{ textAlign: 'center', color: C.textMuted, fontSize: 14, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 60px' }}>
            From the ancestral halls of the estate to the moonlit dance floor, every moment has been curated to honour our heritage and celebrate our future.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.events.map((ev, i) => (
              <div key={i} style={{ background: C.bg, padding: '32px', border: `1px solid ${C.outlineV}20` }}>
                <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.primary, marginBottom: 8 }}>
                  {ev.time}
                </p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 8, color: C.text }}>
                  {ev.title}
                </h3>
                <p style={{ fontStyle: 'italic', color: C.textMuted, fontSize: 13, marginBottom: 12 }}>{ev.location}</p>
                <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section style={{ padding: '100px 32px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.secondary, marginBottom: 16 }}>
                {t('locationLabel')}
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, lineHeight: 1.2, color: C.text, marginBottom: 20 }}>
                {data.venue_name}
              </h3>
              <p style={{ color: C.textMuted, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 2, whiteSpace: 'pre-line', marginBottom: 32 }}>
                {data.venue_address}
              </p>
              <a href={data.venue_directions_url} target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', border: `1px solid ${C.primary}40`, color: C.primary,
                  padding: '12px 32px', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' }}
                className="hover:border-white hover:text-white transition-colors">
                {t('routeBtn')}
              </a>
            </div>
            <div style={{ overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src={data.venue_image_url} alt={data.venue_name}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.7) sepia(0.2) contrast(1.1)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* WHERE TO STAY */}
      <section style={{ background: C.bgLow, padding: '100px 32px' }} id="stay">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.secondary, marginBottom: 12 }}>
              {t('stayLabel')}
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 42, color: C.text }}>
              {t('stayLabel')}
            </h2>
          </div>
          <div className="space-y-6">
            {data.hotels.map((h, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.outlineV}30`, paddingBottom: 24 }} className="flex justify-between items-start">
                <div>
                  <h4 style={{ fontFamily: "'Noto Serif', serif", fontSize: 18, color: C.text, marginBottom: 6 }}>{h.name}</h4>
                  <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>{h.description}</p>
                </div>
                {h.url && h.url !== '#' && (
                  <a href={h.url} target="_blank" rel="noreferrer" style={{ color: `${C.primary}60`, fontSize: 18, flexShrink: 0, marginLeft: 16 }}>↗</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DRESS CODE */}
      <section style={{ padding: '100px 32px' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: C.secondary, marginBottom: 16 }}>
            {t('dressLabel')}
          </p>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 'clamp(48px, 8vw, 96px)', textTransform: 'uppercase', letterSpacing: '-0.02em', color: C.text }}>
            {data.dress_code_title}
          </h2>
          <p style={{ color: C.textMuted, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1.8, maxWidth: 480, margin: '24px auto 0' }}>
            {data.dress_code_description}
          </p>
        </div>
      </section>

      {/* GIFTS */}
      <section style={{ background: C.bgLow, padding: '100px 32px' }} id="gifts">
        <div className="max-w-2xl mx-auto text-center">
          <OrnateCorners>
            <div style={{ padding: '60px 48px', border: `1px solid ${C.outlineV}15` }}>
              <div className="flex justify-center mb-8">
                <WaxSeal initials="♡" />
              </div>
              <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.secondary, marginBottom: 12 }}>
                {t('giftsLabel')}
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 40, color: C.text, marginBottom: 20 }}>
                {`${t('storyA')} ${t('storyB')}`}
              </h2>
              <p style={{ fontStyle: 'italic', color: C.textMuted, fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                {data.gifts_description}
              </p>
              <a href={data.gifts_url}
                style={{ display: 'inline-block', background: C.burgundy, color: C.textWarm, padding: '14px 48px', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' }}
                className="hover:opacity-80 transition-opacity">
                {t('fundLabel')}
              </a>
            </div>
          </OrnateCorners>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 32px' }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: C.secondary, marginBottom: 60, textAlign: 'center' }}>
            {t('faqTitle')}
          </p>
          <div className="space-y-12">
            {data.faq.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.outlineV}20`, paddingBottom: 24 }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.text, marginBottom: 12 }}>
                  {item.question}
                </h4>
                <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ background: C.bgLow, padding: '100px 32px' }} id="rsvp">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-16">
            <div style={{ fontFamily: "'Corinthia', cursive", fontSize: 56, color: C.primary, marginBottom: 8 }}>
              {t('kindlyConfirm')}
            </div>
            <p style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.secondary }}>
              {t('envWaiting')}
            </p>
          </div>
          <OrnateCorners>
            <div style={{ padding: '48px', background: C.bg, border: `1px solid ${C.outlineV}15` }}>
              <RSVPForm data={data} />
            </div>
          </OrnateCorners>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bg, padding: '80px 32px', borderTop: `1px solid ${C.outlineV}10` }}
        className="flex flex-col items-center gap-6">
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 16, color: C.text }}>
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', color: C.secondary, opacity: 0.5 }}>
          {t('estLine')}
        </div>
        <div className="flex gap-10">
          {[t('privacyLbl'), t('contactUs')].map(label => (
            <a key={label} href="#"
              style={{ color: C.secondary, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}
              className="hover:text-white transition-colors">
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
