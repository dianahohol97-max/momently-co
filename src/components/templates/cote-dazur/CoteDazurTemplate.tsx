'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// ─── TYPES ───────────────────────────────────────────────
interface ItineraryItem {
  title: string;
  time: string;
  description: string;
}

interface GiftItem {
  title: string;
  url: string;
  type: 'wishlist' | 'fund';
}

interface WeddingData {
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;         // ISO string
  location: string;
  story_short: string;          // short invite text
  story_quote: string;          // full-width quote
  story_long: string;           // paragraph under quote
  polaroid_url: string;         // photo URL
  polaroid_caption: string;
  hero_bg_url: string;
  story_bg_url: string;
  venue_name: string;
  venue_address: string;
  venue_map_url: string;
  venue_directions_url: string;
  hotels: { name: string; description: string; url: string }[];
  dress_code_description: string;
  dress_code_colors: string[];  // hex values
  itinerary: ItineraryItem[];
  gifts: GiftItem[];
  faq: { question: string; answer: string }[];
  rsvp_deadline: string;        // e.g. "January 17, 2025"
  slug: string;
}

// ─── DEMO DATA (замінюється Supabase даними) ─────────────
const DEMO: WeddingData = {
  partner_name_1: 'Olivia',
  partner_name_2: 'Kevin',
  wedding_date: '2026-08-24T16:30:00',
  location: 'Biarritz, France',
  story_short: 'We request the pleasure of your company at the celebration of our union.',
  story_quote: '"Our love started by the sea"',
  story_long: 'There is something about the rhythm of the waves that matched our own from the very beginning. From the cold Atlantic breeze to the warm Mediterranean sun, every horizon we\'ve seen together has led us to this moment.',
  polaroid_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  polaroid_caption: 'Our first summer together, 2019',
  hero_bg_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
  story_bg_url: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1600&q=80',
  venue_name: 'Château de Brindos',
  venue_address: '1 Allée du Château, 64600 Anglet, France',
  venue_map_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
  venue_directions_url: 'https://maps.google.com',
  hotels: [
    { name: 'Hôtel du Palais', description: 'Iconic oceanfront luxury', url: '#' },
    { name: 'Le Regina Biarritz', description: 'Boutique charm near the lighthouse', url: '#' },
  ],
  dress_code_description: 'The celebration is Black Tie Optional. We invite you to embrace the coastal elegance.',
  dress_code_colors: ['#000000', '#3b3b3c', '#d6d4d3', '#ffffff'],
  itinerary: [
    { title: 'Welcome Drinks', time: 'Friday • 7:00 PM', description: 'Le Bar Basque, Biarritz. Casual attire. Kick off the weekend with cocktails.' },
    { title: 'The Ceremony', time: 'Saturday • 4:30 PM', description: 'The main event. Garden ceremony followed by cocktails on the terrace.' },
    { title: 'Dinner & Dancing', time: 'Saturday • 7:30 PM', description: 'A celebration under the stars in the Grand Ballroom.' },
    { title: 'Farewell Brunch', time: 'Sunday • 11:00 AM', description: 'A leisurely goodbye. Pastries and coffee by the pool.' },
  ],
  gifts: [
    { title: 'The Wish List', url: '#', type: 'wishlist' },
    { title: 'Honeymoon Fund', url: '#', type: 'fund' },
  ],
  faq: [
    { question: 'Are children invited?', answer: 'While we love your little ones, our wedding weekend will be an adults-only celebration. We hope you understand.' },
    { question: 'Transport on the day?', answer: 'Shuttles will be provided from Biarritz City Centre to the venue starting at 3:45 PM. Return shuttles will run throughout the evening.' },
    { question: 'RSVP Deadline?', answer: 'We kindly ask for all RSVPs to be submitted by January 17, 2026.' },
  ],
  rsvp_deadline: 'January 17, 2026',
  slug: 'olivia-kevin',
};

// ─── COUNTDOWN ───────────────────────────────────────────
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
  const end = new Date(start.getTime() + 4 * 3600000);
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
function RSVPForm({ slug }: { slug: string }) {
  const [form, setForm] = useState({ name: '', email: '', attendance: '', dietary: '', plus_one: false });
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
    <div className="text-center py-12">
      <p className="font-headline text-3xl italic mb-4">Thank you</p>
      <p className="font-body text-sm opacity-60">We look forward to celebrating with you.</p>
    </div>
  );

  return (
    <form className="space-y-10 mt-8" onSubmit={handleSubmit}>
      <input
        className="w-full bg-transparent border-0 border-b border-black/20 py-4 px-0 focus:ring-0 focus:border-black placeholder:text-black/30 font-body transition-colors outline-none text-sm"
        placeholder="Full Name" required
        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
      />
      <input
        className="w-full bg-transparent border-0 border-b border-black/20 py-4 px-0 focus:ring-0 focus:border-black placeholder:text-black/30 font-body transition-colors outline-none text-sm"
        placeholder="Email Address" type="email" required
        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      />
      <div className="space-y-4">
        <p className="font-label text-[10px] tracking-widest uppercase opacity-40">Will you be joining us?</p>
        <div className="flex gap-8">
          {[{ val: 'attending', label: 'Happily Accept' }, { val: 'declined', label: 'Regretfully Decline' }].map(o => (
            <label key={o.val} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio" name="attendance" value={o.val}
                checked={form.attendance === o.val}
                onChange={() => setForm(f => ({ ...f, attendance: o.val }))}
                className="w-4 h-4 border-black/30 text-black focus:ring-0 accent-black"
              />
              <span className="font-body text-sm group-hover:opacity-60 transition-opacity">{o.label}</span>
            </label>
          ))}
        </div>
      </div>
      <input
        className="w-full bg-transparent border-0 border-b border-black/20 py-4 px-0 focus:ring-0 focus:border-black placeholder:text-black/30 font-body transition-colors outline-none text-sm"
        placeholder="Dietary Requirements (optional)"
        value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))}
      />
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox" checked={form.plus_one}
          onChange={e => setForm(f => ({ ...f, plus_one: e.target.checked }))}
          className="w-4 h-4 accent-black"
        />
        <span className="font-body text-sm opacity-60">I will bring a +1</span>
      </label>
      <button
        type="submit" disabled={status === 'loading'}
        className="w-full bg-black text-white py-5 font-label tracking-[0.4em] uppercase text-xs hover:opacity-80 transition-all active:scale-[0.98] duration-200 disabled:opacity-40"
      >
        {status === 'loading' ? 'Sending...' : 'Submit RSVP'}
      </button>
      {status === 'error' && <p className="text-red-500 text-xs text-center">Something went wrong. Please try again.</p>}
    </form>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function CoteDazurTemplate({ data = DEMO }: { data?: WeddingData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown(data.wedding_date);

  const weddingDateFormatted = new Date(data.wedding_date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] min-h-screen" style={{ fontFamily: "'Manrope', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;600;800&display=swap');
        .font-headline { font-family: 'Noto Serif', serif; }
        .font-body     { font-family: 'Manrope', sans-serif; }
        .torn-edge {
          clip-path: polygon(0% 0%, 5% 2%, 10% 0%, 15% 3%, 20% 0%, 25% 2%, 30% 0%, 35% 1%, 40% 0%, 45% 3%, 50% 0%, 55% 2%, 60% 0%, 65% 3%, 70% 0%, 75% 2%, 80% 0%, 85% 1%, 90% 0%, 95% 3%, 100% 0%, 100% 100%, 95% 98%, 90% 100%, 85% 97%, 80% 100%, 75% 98%, 70% 100%, 65% 97%, 60% 100%, 55% 98%, 50% 100%, 45% 97%, 40% 100%, 35% 99%, 30% 100%, 25% 97%, 20% 100%, 15% 98%, 10% 100%, 5% 97%, 0% 100%);
        }
        @keyframes bounce { 0%,100%{transform:translateY(0) translateX(-50%)} 50%{transform:translateY(-8px) translateX(-50%)} }
        .animate-bounce { animation: bounce 2s ease-in-out infinite; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 md:px-12 py-5">
        <div className="text-xl font-headline italic tracking-tighter">
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {['story', 'itinerary', 'venue', 'gifts', 'rsvp'].map(s => (
            <a key={s} href={`#${s}`}
              className="text-black/50 hover:text-black transition-colors font-body tracking-widest uppercase text-xs">
              {s === 'gifts' ? 'Gifts' : s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
          <a href="#rsvp" className="bg-black text-white px-6 py-2 font-body tracking-widest uppercase text-xs hover:opacity-70 transition-opacity">
            RSVP
          </a>
        </div>
        {/* Mobile menu */}
        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(o => !o)}>☰</button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-black/5 flex flex-col py-6 px-8 gap-6 md:hidden">
            {['story', 'itinerary', 'venue', 'gifts', 'rsvp'].map(s => (
              <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)}
                className="text-black/60 font-body tracking-widest uppercase text-xs hover:text-black transition-colors">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-24">
        <div className="absolute inset-0 z-0">
          <img src={data.hero_bg_url} alt="" className="w-full h-full object-cover opacity-20 grayscale" />
        </div>
        <div className="relative z-10 space-y-8">
          <h1 className="font-headline text-[clamp(2.6rem,6vw,4.5rem)] md:text-9xl tracking-tighter italic">
            {data.partner_name_1} & {data.partner_name_2}
          </h1>
          <p className="tracking-[0.4em] uppercase text-sm opacity-60 font-body">
            {weddingDateFormatted} • {data.location}
          </p>

          {/* Countdown */}
          <div className="flex gap-8 md:gap-16 pt-12 justify-center">
            {[
              { val: countdown.days,    label: 'Days' },
              { val: countdown.hours,   label: 'Hours' },
              { val: countdown.minutes, label: 'Mins' },
              { val: countdown.seconds, label: 'Secs' },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="font-headline text-[clamp(2.2rem,4.6vw,3.4rem)] md:text-[clamp(4rem,11vw,9.5rem)] tabular-nums">{String(val).padStart(2, '0')}</span>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase opacity-50 mt-1">{label}</span>
              </div>
            ))}
          </div>

          {/* Add to Calendar */}
          <button
            onClick={() => addToCalendar(data)}
            className="mt-4 inline-flex items-center gap-2 border border-black/20 px-6 py-3 font-body text-[10px] tracking-widest uppercase hover:bg-black hover:text-white transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Calendar
          </button>
        </div>
        <div className="absolute bottom-12 left-1/2 animate-bounce">
          <svg className="w-5 h-5 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* POLAROID + INVITE */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center" id="story">
        <div className="relative flex justify-center">
          <div className="bg-white p-4 pb-16 rotate-[-2deg] max-w-sm w-full hover:rotate-0 transition-transform duration-500">
            <img src={data.polaroid_url} alt={data.polaroid_caption}
              className="w-full aspect-square object-cover grayscale" />
            <p className="font-headline italic text-center pt-6 text-lg opacity-70">{data.polaroid_caption}</p>
          </div>
        </div>
        <div className="torn-edge bg-white p-10 md:p-16 relative">
          <p className="tracking-[0.3em] uppercase text-xs opacity-50 mb-5 font-body">Save the Date</p>
          <div className="font-headline text-3xl leading-relaxed mb-6">{data.story_short}</div>
          <p className="font-body text-[#474747] leading-loose mb-8 max-w-md text-sm">{data.story_long}</p>
          <button className="border-b border-black/20 pb-1.5 font-body uppercase text-[10px] tracking-widest hover:border-black transition-all">
            Read our full story
          </button>
        </div>
      </section>

      {/* STORY QUOTE */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={data.story_bg_url} alt="" className="w-full h-full object-cover grayscale brightness-50" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h2 className="font-headline italic text-white text-4xl md:text-[clamp(2.6rem,6vw,4.5rem)] mb-8">{data.story_quote}</h2>
          <p className="font-body text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">{data.story_long}</p>
        </div>
      </section>

      {/* ITINERARY */}
      <section className="py-32 bg-[#eeeeee] px-6" id="itinerary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="tracking-[0.4em] uppercase text-xs opacity-50 mb-4 font-body">The Weekend</p>
            <h3 className="font-headline text-[clamp(2.2rem,4.6vw,3.4rem)] italic">Itinerary</h3>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-black/10 -translate-y-1/2" />
            <div className="grid md:grid-cols-4 gap-12 relative">
              {data.itinerary.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-6">
                  <div className={`${i % 2 === 0 ? 'md:pb-12' : 'md:pt-12'} order-1`}>
                    <h4 className="font-headline text-2xl mb-2">{item.title}</h4>
                    <p className="font-body uppercase text-[10px] tracking-widest opacity-40">{item.time}</p>
                  </div>
                  <div className="w-3 h-3 bg-black rounded-full z-10 hidden md:block order-2" />
                  <div className={`${i % 2 === 0 ? 'md:pt-12' : 'md:pb-12'} order-3`}>
                    <p className="text-xs font-body text-[#474747] max-w-[200px] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section className="py-32 px-6 max-w-7xl mx-auto" id="venue">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div>
            <h3 className="font-headline text-[clamp(2.2rem,4.6vw,3.4rem)] mb-12">The Venue</h3>
            <div className="aspect-video w-full grayscale contrast-125 mb-8 overflow-hidden">
              <img src={data.venue_map_url} alt={data.venue_name} className="w-full h-full object-cover" />
            </div>
            <p className="font-headline text-xl mb-2">{data.venue_name}</p>
            <p className="font-body text-[#474747] text-sm mb-6">{data.venue_address}</p>
            <a href={data.venue_directions_url} target="_blank" rel="noreferrer"
              className="inline-block bg-black text-white px-8 py-3 font-body text-xs tracking-widest uppercase hover:opacity-80 transition-opacity">
              Get Directions
            </a>
          </div>

          <div className="space-y-20">
            {/* Hotels */}
            <div>
              <h3 className="font-headline text-3xl mb-8 italic">Where to stay</h3>
              <ul className="space-y-6">
                {data.hotels.map((h, i) => (
                  <li key={i} className="flex justify-between border-b border-black/10 pb-4">
                    <div>
                      <p className="font-body font-bold uppercase text-xs tracking-wider">{h.name}</p>
                      <p className="text-xs text-[#474747] mt-1">{h.description}</p>
                    </div>
                    <a href={h.url} target="_blank" rel="noreferrer" className="text-black/30 hover:text-black transition-colors text-lg">↗</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dress Code */}
            <div>
              <h3 className="font-headline text-3xl mb-6 italic">Dress Code</h3>
              <p className="font-body text-[#474747] mb-8 leading-relaxed text-sm">{data.dress_code_description}</p>
              <div className="flex gap-4 items-center flex-wrap">
                {data.dress_code_colors.map((color, i) => (
                  <div key={i}
                    className="w-10 h-10 rounded-full border border-black/10"
                    style={{ background: color }}
                    title={color}
                  />
                ))}
                <span className="font-body text-[10px] tracking-widest uppercase opacity-40 ml-2">Inspiration Palette</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GIFTS */}
      <section className="py-32 bg-white px-6" id="gifts">
        <div className="max-w-4xl mx-auto text-center">
          <p className="tracking-[0.4em] uppercase text-xs opacity-50 mb-6 font-body">Gifting</p>
          <h3 className="font-headline text-[clamp(2.2rem,4.6vw,3.4rem)] italic mb-12">Registry</h3>
          <p className="font-body text-[#474747] mb-16 text-lg leading-relaxed max-w-2xl mx-auto">
            Your presence is our greatest gift. However, if you wish to honor us with a gesture, we have curated a selection of items for our home and a fund for our first adventure as a married couple.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {data.gifts.map((g, i) => (
              <a key={i} href={g.url} target="_blank" rel="noreferrer"
                className={`px-10 py-4 font-body text-xs tracking-[0.2em] uppercase transition-all active:scale-95 ${
                  g.type === 'wishlist'
                    ? 'bg-black text-white hover:opacity-80'
                    : 'border border-black/20 text-black hover:bg-[#f3f3f4]'
                }`}>
                {g.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-[#f3f3f4] px-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-headline text-4xl mb-16 text-center italic">Frequently Asked</h3>
          <div className="space-y-12">
            {data.faq.map((item, i) => (
              <div key={i} className="space-y-3">
                <p className="font-body font-bold uppercase text-[10px] tracking-widest">{item.question}</p>
                <p className="font-body text-[#474747] text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="py-32 px-6" id="rsvp">
        <div className="max-w-xl mx-auto bg-white p-12 md:p-20 border border-black/5 relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-2.5 font-body text-[10px] tracking-[0.3em] uppercase whitespace-nowrap">
            RSVP by {data.rsvp_deadline}
          </div>
          <RSVPForm slug={data.slug} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-20 px-8 bg-[#eeeeee] flex flex-col items-center gap-8">
        <div className="font-headline text-lg italic">
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <div className="flex gap-10">
          {['#story', '#itinerary', '#venue', '#gifts', '#rsvp'].map((href, i) => (
            <a key={i} href={href}
              className="text-black/40 font-body text-[10px] tracking-[0.2em] uppercase hover:text-black transition-colors">
              {href.replace('#', '')}
            </a>
          ))}
        </div>
        <p className="font-body text-[10px] tracking-[0.2em] uppercase opacity-40">
          © 2026 {data.partner_name_1} & {data.partner_name_2} · Momently Co
        </p>
      </footer>
    </div>
  );
}
