'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── TYPES ───────────────────────────────────────────────
interface ScheduleItem {
  time: string;
  title: string;
  location: string;
  description: string;
}

interface WeddingData {
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;
  location: string;
  story_quote: string;
  story_paragraph_1: string;
  story_paragraph_2: string;
  venue_name: string;
  venue_address: string;
  venue_image_url: string;
  venue_map_url: string;
  dress_code_title: string;
  dress_code_description: string;
  schedule: ScheduleItem[];
  faq: { question: string; answer: string }[];
  rsvp_deadline: string;
  slug: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Luca',
  partner_name_2: 'Isabella',
  wedding_date: '2026-09-24T16:00:00',
  location: 'Firenze, Italy',
  story_quote: '"Our story began in the quiet corners of a Milanese gallery, a chance encounter amidst the stark lines of modernist sculpture."',
  story_paragraph_1: 'What followed was a journey through the landscapes of architecture and art, finding beauty in the intersection of form and function. Luca, an architect of spaces; Isabella, a curator of light. Together, we have built a world that celebrates the essential.',
  story_paragraph_2: 'Join us as we formalize this union in an environment that reflects our shared aesthetic — where every detail is intentional, and every moment is a frame in our monograph.',
  venue_name: 'Villa Gamberaia, Firenze',
  venue_address: 'Via del Rossellino, 72\n50135 Firenze FI, Italy',
  venue_image_url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80',
  venue_map_url: '#',
  dress_code_title: 'Black Tie',
  dress_code_description: 'Formal evening attire required. We kindly request a palette of black, charcoal, or deep navy.',
  schedule: [
    { time: '16:00', title: 'The Vows', location: 'The Garden Sanctuary', description: 'Outdoor Ceremony' },
    { time: '17:30', title: 'Aperitivo', location: 'The Glass Pavilion', description: 'Cocktails & Curated Small Plates' },
    { time: '19:30', title: 'Dinner', location: 'The Grand Monolith Hall', description: 'Four-Course Seasonal Gastronomy' },
    { time: '22:00', title: 'Nocturnal', location: 'The Cellar Lounge', description: 'Music, Movement, & Midnight Spirits' },
  ],
  faq: [
    { question: 'Can I bring a plus one?', answer: 'Due to the intimate nature of the venue, we can only accommodate guests specifically named on the invitation.' },
    { question: 'Are children invited?', answer: 'We love your children, but we have chosen for our wedding to be an adult-only occasion to allow everyone to relax and enjoy the evening.' },
    { question: 'Transport to the Villa?', answer: 'Shuttles will depart from the Four Seasons Firenze at 15:15. Private transport is available; however, parking at the villa is limited.' },
  ],
  rsvp_deadline: 'August 1st',
  slug: 'luca-isabella',
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
    details: `You're invited to celebrate the wedding of ${data.partner_name_1} & ${data.partner_name_2}`,
    location: `${data.venue_name}, ${data.venue_address}`,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
}

// ─── RSVP FORM ────────────────────────────────────────────
function RSVPForm({ slug, deadline }: { slug: string; deadline: string }) {
  const [form, setForm] = useState({ name: '', email: '', attendance: '', dietary: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, wedding_slug: slug }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <div className="py-20">
      <h3 className="font-headline text-5xl leading-tight mb-6">Thank you.</h3>
      <p className="font-body text-sm uppercase tracking-widest text-zinc-500">We look forward to celebrating with you.</p>
    </div>
  );

  return (
    <form className="space-y-12" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="font-sans text-[10px] uppercase tracking-widest text-black block">Full Name</label>
        <input
          className="w-full border-b border-zinc-300 bg-transparent py-4 focus:outline-none focus:border-black px-0 text-xl font-headline placeholder:text-zinc-300"
          placeholder="John Doe" required
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <label className="font-sans text-[10px] uppercase tracking-widest text-black block">Email</label>
        <input
          className="w-full border-b border-zinc-300 bg-transparent py-4 focus:outline-none focus:border-black px-0 text-xl font-headline placeholder:text-zinc-300"
          placeholder="your@email.com" type="email"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div className="space-y-4">
        <label className="font-sans text-[10px] uppercase tracking-widest text-black block">Presence</label>
        <div className="flex gap-10 pt-2">
          {[{ val: 'attending', label: 'Joyfully Accept' }, { val: 'declined', label: 'Regretfully Decline' }].map(o => (
            <label key={o.val} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio" name="attendance" value={o.val}
                checked={form.attendance === o.val}
                onChange={() => setForm(f => ({ ...f, attendance: o.val }))}
                className="w-4 h-4 accent-black"
              />
              <span className="font-sans text-xs uppercase tracking-widest">{o.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="font-sans text-[10px] uppercase tracking-widest text-black block">Dietary Preferences</label>
        <input
          className="w-full border-b border-zinc-300 bg-transparent py-4 focus:outline-none focus:border-black px-0 text-xl font-headline placeholder:text-zinc-300"
          placeholder="None, Vegan, Allergies..."
          value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))}
        />
      </div>
      <button
        type="submit" disabled={status === 'loading'}
        className="w-full bg-black text-white py-6 font-sans uppercase tracking-[0.3em] text-sm hover:bg-zinc-800 transition-colors disabled:opacity-40"
      >
        {status === 'loading' ? 'Sending...' : 'Submit Response'}
      </button>
      {status === 'error' && <p className="text-red-500 text-xs text-center uppercase tracking-widest">Something went wrong. Please try again.</p>}
      <p className="font-body text-xs uppercase tracking-widest text-zinc-400">Responses requested by {deadline}.</p>
    </form>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function IlMonografoTemplate({ data = DEMO }: { data?: WeddingData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown(data.wedding_date);

  const weddingDateFormatted = new Date(data.wedding_date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Inter:wght@100..900&display=swap');
        .font-headline { font-family: 'Newsreader', serif; }
        .font-sans-custom { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>

      {/* NAV */}
      <header className="bg-white/80 backdrop-blur-xl fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-10 py-5">
        <div className="font-headline text-lg tracking-[0.2em] font-semibold text-zinc-900 uppercase">
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <div className="hidden md:flex gap-10 items-center">
          {[['#couple', 'The Couple'], ['#schedule', 'Schedule'], ['#venue', 'Venue']].map(([href, label]) => (
            <a key={href} href={href}
              className="text-zinc-400 font-sans tracking-widest text-[10px] uppercase hover:text-zinc-900 transition-colors">
              {label}
            </a>
          ))}
          <a href="#rsvp"
            className="bg-black text-white px-8 py-3 text-[10px] tracking-[0.2em] font-sans uppercase hover:bg-zinc-800 transition-colors">
            RSVP
          </a>
        </div>
        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(o => !o)}>☰</button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-zinc-100 flex flex-col py-6 px-8 gap-5 md:hidden shadow-sm">
            {[['#couple', 'The Couple'], ['#schedule', 'Schedule'], ['#venue', 'Venue'], ['#rsvp', 'RSVP']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="text-zinc-500 font-sans uppercase tracking-[0.2em] text-xs hover:text-black transition-colors">
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden px-6 md:px-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-zinc-900 opacity-60" />
        <div className="relative z-10 text-center space-y-10">
          <h1 className="font-headline text-[18vw] md:text-[15vw] leading-[0.85] text-white tracking-tighter">
            {data.partner_name_1} <span className="italic">&</span><br />{data.partner_name_2}
          </h1>
          <p className="text-white/50 font-sans tracking-[0.4em] uppercase text-xs">
            {weddingDateFormatted}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="#rsvp"
              className="bg-white text-black px-12 py-5 font-sans uppercase tracking-[0.2em] text-sm hover:bg-zinc-100 transition-colors">
              RSVP
            </a>
            <button
              onClick={() => addToCalendar(data)}
              className="border border-white/30 text-white px-8 py-5 font-sans uppercase tracking-[0.2em] text-xs hover:border-white transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-20 bg-white border-b border-zinc-100">
        <div className="max-w-screen-xl mx-auto px-8 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-baseline gap-8 md:gap-0">
            {[
              { val: countdown.days, label: 'Days' },
              { val: countdown.hours, label: 'Hours' },
              { val: countdown.minutes, label: 'Minutes' },
              { val: countdown.seconds, label: 'Seconds' },
            ].map(({ val, label }, i) => (
              <>
                <div key={label} className="flex flex-col">
                  <span className="font-headline text-7xl md:text-9xl tabular-nums">{String(val).padStart(2, '0')}</span>
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-zinc-400 mt-1">{label}</span>
                </div>
                {i < 3 && <div className="hidden md:block w-px h-20 bg-zinc-200 self-center" />}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-32 md:py-40 bg-zinc-50" id="couple">
        <div className="max-w-4xl mx-auto px-8 md:px-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-10">The Monograph</p>
          <p className="font-headline italic text-3xl md:text-5xl leading-tight text-black mb-14">
            {data.story_quote}
          </p>
          <div className="space-y-8 max-w-2xl">
            <p className="font-sans text-base text-zinc-700 leading-relaxed">{data.story_paragraph_1}</p>
            <p className="font-sans text-base text-zinc-700 leading-relaxed">{data.story_paragraph_2}</p>
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="py-32 md:py-40 bg-[#f9f9f9]" id="schedule">
        <div className="max-w-screen-xl mx-auto px-8 md:px-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-20">Order of Events</p>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-y-28">
            {data.schedule.map((item, i) => {
              const colSpans = ['md:col-span-5', 'md:col-span-5 md:col-start-7', 'md:col-span-6', 'md:col-span-4 md:col-start-8'];
              const offsets = ['', '', 'md:mt-[-4rem]', ''];
              return (
                <div key={i} className={`${colSpans[i] || 'md:col-span-5'} ${offsets[i]} flex flex-col items-start border-l border-black/10 pl-8`}>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-zinc-400 mb-3">{item.time}</span>
                  <h3 className="font-headline text-4xl md:text-5xl mb-5">{item.title}</h3>
                  <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-loose">
                    {item.location}<br />{item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]" id="venue">
        <div className="bg-black text-white flex flex-col justify-center p-12 md:p-24">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/40 mb-10">The Location</p>
          <h3 className="font-headline text-5xl md:text-6xl mb-10 leading-tight">
            {data.venue_name.split(',').map((part, i) => (
              <span key={i}>{i > 0 ? (<><br /><span className="italic">{part}</span></>) : part}</span>
            ))}
          </h3>
          <p className="font-sans text-xs uppercase tracking-widest leading-loose opacity-60 whitespace-pre-line">
            {data.venue_address}
          </p>
          <div className="mt-14">
            <a href={data.venue_map_url} target="_blank" rel="noreferrer"
              className="inline-block border border-white px-10 py-4 font-sans text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors">
              View Map
            </a>
          </div>
        </div>
        <div className="bg-zinc-200 overflow-hidden h-[400px] md:h-auto">
          <img src={data.venue_image_url} alt={data.venue_name}
            className="w-full h-full object-cover grayscale brightness-75 contrast-125" />
        </div>
      </section>

      {/* DRESS CODE */}
      <section className="py-32 md:py-40 bg-zinc-50 text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-10">Attire</p>
        <div className="max-w-4xl mx-auto px-8 md:px-10">
          <p className="font-headline text-6xl md:text-9xl uppercase tracking-tighter text-black">
            {data.dress_code_title}
          </p>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-zinc-400 mt-10 max-w-md mx-auto leading-relaxed">
            {data.dress_code_description}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 md:py-40 bg-white">
        <div className="max-w-3xl mx-auto px-8 md:px-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-20">Common Queries</p>
          <div className="space-y-16">
            {data.faq.map((item, i) => (
              <div key={i}>
                <h4 className="font-headline text-2xl mb-5">{item.question}</h4>
                <p className="font-sans text-zinc-500 leading-relaxed text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="py-32 md:py-40 bg-[#f9f9f9]" id="rsvp">
        <div className="max-w-screen-xl mx-auto px-8 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-24 items-start">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-10">Presence</p>
              <h3 className="font-headline text-5xl md:text-6xl leading-tight">
                Kindly confirm your attendance.
              </h3>
              <p className="mt-8 font-sans text-xs text-zinc-400 uppercase tracking-widest">{data.location}</p>
            </div>
            <RSVPForm slug={data.slug} deadline={data.rsvp_deadline} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-100 py-16 px-8 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-zinc-800">
        <div className="font-headline text-xl italic text-zinc-100">
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <div className="flex gap-10">
          {['#couple', '#schedule', '#venue', '#rsvp'].map(href => (
            <a key={href} href={href}
              className="text-zinc-500 font-sans text-[10px] tracking-[0.2em] uppercase hover:text-zinc-100 transition-colors">
              {href.replace('#', '')}
            </a>
          ))}
        </div>
        <p className="text-zinc-600 font-sans text-[10px] tracking-widest uppercase">
          © {data.partner_name_1} & {data.partner_name_2} · Momently
        </p>
      </footer>
    </div>
  );
}
