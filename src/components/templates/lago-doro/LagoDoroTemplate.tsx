'use client';
import { useState, useEffect } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

// ─── TYPES ───────────────────────────────────────────────
interface EventItem {
  date_time: string;
  title: string;
  venue: string;
  description: string;
  highlight?: boolean;
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
  location: string;
  hero_image_url: string;
  story_heading: string;
  story_paragraph_1: string;
  story_paragraph_2: string;
  story_image_1_url: string;
  story_image_2_url: string;
  story_image_3_url: string;
  events: EventItem[];
  venue_name: string;
  venue_address: string;
  venue_map_url: string;
  venue_image_url: string;
  hotels: Hotel[];
  travel_description: string;
  dress_code_title: string;
  dress_code_description: string;
  dress_code_image_1_url: string;
  dress_code_image_2_url: string;
  faq: { question: string; answer: string }[];
  meal_options: string[];
  rsvp_deadline: string;
  slug: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Матвій',
  partner_name_2: 'Злата',
  wedding_date: '2026-09-14T16:00:00',
  location: 'озеро Гарда, Італія',
  hero_image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600&q=80',
  story_heading: 'Подорож, що почалася у Львові й привела нас на береги Гарди.',
  story_paragraph_1: 'Все почалося з випадкової зустрічі дощового вечора на Вірменській. Далі був вихор спільних мрій, перельотів і глибокої любові до позачасової краси італійських озер.',
  story_paragraph_2: 'Після п’яти років пригод ми не змогли уявити чарівнішого місця для нашої обіцянки назавжди, ніж стара вілла над Гардою. Запрошуємо вас на вікенд елегантності, сміху та amore.',
  story_image_1_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  story_image_2_url: 'https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?w=600&q=80',
  story_image_3_url: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=900&q=80',
  events: [
    { date_time: '13.09 · 19:00', title: 'Вітальна вечеря', venue: 'Тераса гранд-готелю, Сірміоне', description: 'Вечір коктейлів і озерних смаків — відкриваємо весільний вікенд під зорями.' },
    { date_time: '14.09 · 16:00', title: 'Церемонія', venue: 'Сади вілли Кортіне', description: 'Обмінюємось обітницями серед азалій і столітніх кипарисів найкрасивішої вілли озера.', highlight: true },
    { date_time: '14.09 · 18:00', title: 'Прийом', venue: 'Лоджія над озером', description: 'Вечеря, танці й тости — святкуємо нашу першу ніч як подружжя.' },
  ],
  venue_name: 'Вілла Кортіне',
  venue_address: 'Via Grotte, 6\n25019 Сірміоне, озеро Гарда, Італія',
  venue_map_url: '#',
  venue_image_url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
  hotels: [
    { name: 'Grand Hotel Terme', description: 'Наш основний блок номерів. Назвіть код «М&З» для спеціальних умов.', url: '#' },
    { name: 'Villa Cortine Palace', description: 'Історична перлина для по-справжньому розкішного відпочинку.', url: '#' },
  ],
  travel_description: 'До Гарди найзручніше з Мілана (MXP) або Верони (VRN): потяг до станції Дезенцано, далі — 15 хвилин таксі до Сірміоне, або трансфер через нашого консьєржа.',
  dress_code_title: 'Black tie optional',
  dress_code_description: 'Просимо гостей про урочисте вбрання: панове — смокінги або темні костюми, пані — сукні в підлогу або елегантний коктейль.',
  dress_code_image_1_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
  dress_code_image_2_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  faq: [
    { question: 'Чи запрошені діти?', answer: 'Ми любимо ваших малюків, але це свято задумали лише для дорослих.' },
    { question: 'Чи є паркінг біля вілли?', answer: 'Заїзд на територію обмежений — від центру Сірміоне курсуватимуть приватні шатли.' },
    { question: 'Подарунки', answer: 'Ваша присутність — єдиний подарунок, який нам потрібен. За бажання будемо вдячні за внесок у фонд нашої подорожі.' },
  ],
  meal_options: ['Яловичина з розмарином', 'Сібас на грилі', 'Різото з білими грибами (веган)'],
  rsvp_deadline: '1 серпня 2026',
  slug: 'matvii-zlata',
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
    details: `You're invited to celebrate the wedding of ${data.partner_name_1} & ${data.partner_name_2}`,
    location: `${data.venue_name}, ${data.venue_address}`,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
}

// ─── RSVP FORM ────────────────────────────────────────────
function RSVPForm({ data }: { data: WeddingData }) {
  const L = normalizeLocale(data.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [form, setForm] = useState({ name: '', email: '', attendance: '', meal: '', plus_one_name: '', dietary: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, attendance: form.attendance, dietary: form.meal || form.dietary, wedding_slug: data.slug }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <div className="text-center py-24">
      <h3 className="font-headline text-4xl mb-4" style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic' }}>{t('thanksYes', { name: '' }).replace(', !', '!')}</h3>
      <p className="text-xs uppercase tracking-widest text-[#7f756a]">{t('thanksSub')}</p>
    </div>
  );

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      <div>
        <input
          className="w-full bg-transparent border-b border-[#d1c4b8]/50 focus:border-[#735a39] focus:outline-none px-0 py-4 text-xl placeholder:text-[#7f756a]/40"
          style={{ fontFamily: "'Newsreader', serif" }}
          placeholder={t('nameLabel')} required
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div>
        <input
          className="w-full bg-transparent border-b border-[#d1c4b8]/50 focus:border-[#735a39] focus:outline-none px-0 py-4 text-base placeholder:text-[#7f756a]/40"
          placeholder={t('emailLabel')} type="email"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[{ val: 'attending', label: t('yes') }, { val: 'declined', label: t('no') }].map(o => (
          <label key={o.val} className="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="attendance" value={o.val}
              checked={form.attendance === o.val}
              onChange={() => setForm(f => ({ ...f, attendance: o.val }))}
              className="w-5 h-5 accent-[#735a39]"
            />
            <span className="text-xs uppercase tracking-widest group-hover:text-[#735a39] transition-colors">{o.label}</span>
          </label>
        ))}
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-[#7f756a] mb-3">Plus One Name (If applicable)</label>
        <input
          className="w-full bg-transparent border-b border-[#d1c4b8]/50 focus:border-[#735a39] focus:outline-none px-0 py-2"
          value={form.plus_one_name} onChange={e => setForm(f => ({ ...f, plus_one_name: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-[#7f756a] mb-3">{t('menuLabel')}</label>
        <select
          className="w-full bg-transparent border-b border-[#d1c4b8]/50 focus:border-[#735a39] focus:outline-none px-0 py-2 appearance-none"
          value={form.meal} onChange={e => setForm(f => ({ ...f, meal: e.target.value }))}
        >
          <option value="">{t('selectPh')}</option>
          {data.meal_options.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
      </div>
      <button
        type="submit" disabled={status === 'loading'}
        className="w-full py-5 bg-[#735a39] text-white text-sm uppercase tracking-[0.3em] hover:bg-[#594323] transition-colors rounded-none shadow-[#735a39]/10 disabled:opacity-40"
      >
        {status === 'loading' ? t('sending') : t('submit')}
      </button>
      {status === 'error' && <p className="text-red-500 text-xs text-center">{t('errSend')}</p>}
      <p className="text-[10px] uppercase tracking-widest text-[#7f756a] text-center">Kindly respond by {data.rsvp_deadline}</p>
    </form>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function LagoDoroTemplate({ data = DEMO }: { data?: WeddingData }) {
  const L = normalizeLocale(data.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [activeNav, setActiveNav] = useState('home');
  const countdown = useCountdown(data.wedding_date);

  const initials = `${data.partner_name_1[0]} & ${data.partner_name_2[0]}`;

  return (
    <div className="bg-[#faf9f6] text-[#1a1c1a] min-h-screen overflow-x-hidden pb-20 md:pb-0"
      style={{ fontFamily: "'Manrope', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap');
        .font-headline { font-family: 'Newsreader', serif; }
        .font-serif-italic { font-family: 'Newsreader', serif; font-style: italic; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* TOP NAV */}
      <header className="fixed top-0 w-full z-50 bg-[#faf9f6]/80 backdrop-blur-md border-b border-[#d1c4b8]/20">
        <div className="flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto">
          <button className="text-[#735a39] text-2xl"></button>
          <h1 className="font-headline text-2xl italic text-[#1a1c1a]">
            {data.partner_name_1} & {data.partner_name_2}
          </h1>
          <a href="#rsvp" className="text-sm font-semibold tracking-widest text-[#735a39] uppercase">RSVP</a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center pt-16" id="home">
        <div className="absolute inset-0 -z-10">
          <img src={data.hero_image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="space-y-4 relative z-10">
          <p className="uppercase tracking-[0.3em] text-white/80 text-xs">{t('celebrationLabel')}</p>
          <h2 className="text-[clamp(2.6rem,6vw,4.5rem)] md:text-8xl font-headline text-white leading-tight">
            {data.partner_name_1} <span className="font-serif-italic">&</span> {data.partner_name_2}
          </h2>
          <div className="pt-6 space-y-2">
            <p className="text-xl font-headline italic text-white/95">
              {new Date(data.wedding_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm uppercase tracking-widest text-white/70">{data.location}</p>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#rsvp"
              className="inline-block px-10 py-4 bg-[#735a39] text-white tracking-widest text-xs uppercase hover:bg-[#594323] transition-colors rounded-none">
              RSVP
            </a>
            <button onClick={() => addToCalendar(data, t('stdEvent', { names: data.partner_name_1 + ' & ' + data.partner_name_2 }))}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 text-white text-xs uppercase tracking-widest hover:border-white transition-colors rounded-none">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('addToCalendar')}
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-20 bg-white flex flex-col items-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#7f756a] mb-10">{t('countdownLabel')}</p>
        <div className="flex gap-8 md:gap-14">
          {[
            { val: countdown.days, label: t('unitDays') },
            { val: countdown.hours, label: t('unitHours') },
            { val: countdown.minutes, label: t('unitMin') },
            { val: countdown.seconds, label: t('unitSec') },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <span className="block font-headline text-[clamp(2.2rem,4.6vw,3.4rem)] md:text-[clamp(4rem,11vw,9.5rem)] font-light text-[#735a39] tabular-nums">
                {String(val).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#7f756a] mt-1 block">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="px-6 py-24 max-w-screen-xl mx-auto" id="story">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
          {/* Image cluster */}
          <div className="relative">
            <div className="relative w-full aspect-[4/5] z-10">
              <img src={data.story_image_1_url} alt="" className="w-full h-full object-cover rounded-none" />
            </div>
            <div className="absolute -bottom-10 -right-6 w-2/5 aspect-square z-20 border-[10px] border-[#faf9f6] rounded-none overflow-hidden">
              <img src={data.story_image_2_url} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Text */}
          <div className="space-y-7 md:pt-0 pt-12">
            <h3 className="font-headline text-4xl md:text-[clamp(2.2rem,4.6vw,3.4rem)] leading-tight"
              dangerouslySetInnerHTML={{ __html: data.story_heading.replace(/\*(.*?)\*/g, '<span style="font-style:italic">$1</span>') }}
            />
            <div className="space-y-5 text-[#4e453c] leading-relaxed text-sm">
              <p>{data.story_paragraph_1}</p>
              <p>{data.story_paragraph_2}</p>
            </div>
            {data.story_image_3_url && (
              <img src={data.story_image_3_url} alt="" className="w-full h-40 object-cover opacity-80 rounded-none" />
            )}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="py-20 bg-[#f4f3f1]" id="events">
        <div className="px-6 max-w-screen-xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#7f756a] mb-3">{t('celebrationLabel')}</p>
            <h3 className="font-headline text-4xl">{t('scheduleTitle')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.events.map((ev, i) => (
              <div key={i}
                className={`bg-white p-8 rounded-none hover: transition-shadow ${ev.highlight ? 'border-t-2 border-[#735a39]' : ''}`}>
                <p className="text-xs uppercase tracking-widest text-[#735a39] mb-2">{ev.date_time}</p>
                <h4 className="font-headline text-2xl mb-3">{ev.title}</h4>
                <p className="text-sm text-[#4e453c] mb-4 italic leading-relaxed">{ev.venue}</p>
                <p className="text-sm text-[#4e453c] leading-relaxed">{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAVEL & MAP */}
      <section className="py-20 px-6 max-w-screen-xl mx-auto" id="travel">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-7">
            <h3 className="font-headline text-4xl leading-tight">
              {t('transportLabel')} <br />
              <span className="font-serif-italic">to the Lake</span>
            </h3>
            <p className="text-[#4e453c] text-sm leading-relaxed">{data.travel_description}</p>
            <div className="space-y-5 pt-2">
              {data.hotels.map((h, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#735a39]/10 flex items-center justify-center text-[#735a39] flex-shrink-0 mt-0.5">
                                      </div>
                  <div>
                    <h5 className="font-semibold text-sm">{h.name}</h5>
                    <p className="text-xs text-[#4e453c] mt-1">{h.description}</p>
                    {h.url && h.url !== '#' && (
                      <a href={h.url} target="_blank" rel="noreferrer"
                        className="text-[10px] text-[#735a39] uppercase tracking-widest mt-1 inline-block hover:underline">
                        Book →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 h-[400px] bg-[#efeeeb] rounded-none overflow-hidden relative group">
            <img src={data.venue_image_url} alt={data.venue_name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full flex items-center gap-2">
                <span className="text-[#735a39]"></span>
                <span className="text-xs font-semibold uppercase tracking-widest">{data.venue_name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRESS CODE & FAQ */}
      <section className="py-20 bg-[#e9e8e5]/50 px-6" id="faq">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Dress Code */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#7f756a] mb-5">{t('dressLabel')}</p>
              <h3 className="font-headline text-4xl mb-6">
                {data.dress_code_title.includes(' ') ? (
                  <>
                    {data.dress_code_title.split(' ').slice(0, -1).join(' ')}{' '}
                    <span className="font-serif-italic">{data.dress_code_title.split(' ').slice(-1)}</span>
                  </>
                ) : data.dress_code_title}
              </h3>
              <p className="text-[#4e453c] text-sm mb-10 leading-relaxed">{data.dress_code_description}</p>
              <div className="grid grid-cols-2 gap-4">
                <img src={data.dress_code_image_1_url} alt="" className="aspect-square object-cover rounded-none" />
                <img src={data.dress_code_image_2_url} alt="" className="aspect-square object-cover rounded-none" />
              </div>
            </div>
            {/* FAQ */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#7f756a] mb-5">{t('faqTitle')}</p>
              <div className="space-y-6">
                {data.faq.map((item, i) => (
                  <div key={i} className="border-b border-[#d1c4b8]/30 pb-5">
                    <h5 className="font-headline text-xl mb-2">{item.question}</h5>
                    <p className="text-sm text-[#4e453c]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="py-24 px-6 max-w-2xl mx-auto" id="rsvp">
        <div className="text-center mb-14">
          <h2 className="font-headline text-[clamp(2.2rem,4.6vw,3.4rem)] mb-3">
            {t('rsvpTitle')} <span className="font-serif-italic">Us?</span>
          </h2>
          <p className="text-[#7f756a] uppercase tracking-widest text-[10px]">
            Kindly respond by {data.rsvp_deadline}
          </p>
        </div>
        <RSVPForm data={data} />
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-8 text-center bg-[#f4f3f1]">
        <h4 className="font-headline text-4xl text-[#735a39] mb-5 italic">{initials}</h4>
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          {['#story', '#events', '#travel', '#faq', '#rsvp'].map(href => (
            <a key={href} href={href}
              className="text-xs uppercase tracking-widest text-[#1a1c1a]/40 hover:text-[#735a39] transition-colors">
              {href.replace('#', '')}
            </a>
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#735a39]">
          {data.partner_name_1} & {data.partner_name_2} · {data.venue_name}
        </p>
        <p className="text-[9px] text-[#7f756a]/50 pt-8">© 2026 {data.partner_name_1} & {data.partner_name_2} · Momently</p>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#faf9f6]/90 backdrop-blur-xl flex justify-around items-center pt-3 pb-6 px-4 border-t border-[#d1c4b8]/20 shadow-[0_-8px_30px_rgba(26,28,26,0.04)] md:hidden">
        {[
          { href: '#home', label: t('navStory') },
          { href: '#events', label: t('navSchedule') },
          { href: '#travel', label: t('transportLabel') },
          { href: '#faq', label: t('navFaq') },
          { href: '#rsvp', label: 'RSVP' },
        ].map(({ href, label }) => (
          <a key={href} href={href}
            className="flex flex-col items-center justify-center text-[#1a1c1a]/50 hover:text-[#735a39] transition-colors">
            <span className="text-[10px] uppercase tracking-widest">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
