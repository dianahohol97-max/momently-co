'use client';
import { useState, useEffect } from 'react';

// ─── PALETTE ──────────────────────────────────────────────
const C = {
  bg:        '#fdf9f4',
  bgLow:     '#f7f3ee',
  bgCard:    '#f1ede8',
  text:      '#270002',
  textMuted: '#554241',
  burgundy:  '#4d050c',
  burText:   '#d36c6a',
  green:     '#546430',
  greenLight:'#d4e7a6',
  outlineV:  '#dbc0bf',
  white:     '#ffffff',
};

// ─── TYPES ────────────────────────────────────────────────
interface ScheduleItem {
  time: string;
  title: string;
}

interface Hotel {
  name: string;
  description: string;
  url?: string;
}

interface WeddingData {
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;
  location: string;
  hero_image_url: string;
  story_image_url: string;
  story_quote: string;
  story_caption: string;
  polaroid_image_url: string;
  polaroid_caption: string;
  schedule: ScheduleItem[];
  rsvp_invite_image_url: string;
  rsvp_deadline: string;
  venue_name: string;
  venue_address_1: string;
  venue_address_2: string;
  venue_map_url: string;
  venue_map_image_url: string;
  hotels: Hotel[];
  dress_code_description: string;
  dress_code_colors: string[];
  gifts_description: string;
  gifts_url: string;
  faq: { question: string; answer: string }[];
  footer_image_url: string;
  contact_email: string;
  slug: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Lauren',
  partner_name_2: 'Paul',
  wedding_date: '2026-08-15T14:00:00',
  location: 'Northampton, MA',
  hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
  story_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  story_quote: '"From the moment our paths crossed under the golden afternoon light of a quiet city cafe, we knew this was the start of something eternal. Our journey has been a tapestry of shared dreams, whispered promises, and the quiet comfort of knowing we\'ve finally found home in one another."',
  story_caption: 'August 2024',
  polaroid_image_url: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&q=80',
  polaroid_caption: 'First trip together',
  schedule: [
    { time: '2:00 PM',  title: 'Ceremony' },
    { time: '4:00 PM',  title: 'Cocktail Hour' },
    { time: '5:30 PM',  title: 'Dinner' },
    { time: '7:00 PM',  title: 'First Dance' },
    { time: '8:00 PM',  title: 'Dancing & Celebration' },
    { time: '10:00 PM', title: 'Cake Cutting' },
  ],
  rsvp_invite_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  rsvp_deadline: '15th of June',
  venue_name: 'Estate of Evergreen',
  venue_address_1: '1234 Celebration Avenue',
  venue_address_2: 'Northampton, MA 01060',
  venue_map_url: '#',
  venue_map_image_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80',
  hotels: [
    { name: 'The Manor Hotel', description: 'A brief walk from the venue with historic charm.', url: '#' },
    { name: 'Willow Creek Inn', description: 'Boutique experience nestled in the valley.', url: '#' },
  ],
  dress_code_description: 'WE KINDLY INVITE OUR GUESTS TO DRESS IN FORMAL EVENING ATTIRE INSPIRED BY RICH, ELEGANT TONES. VELVET, SATIN, AND SOFT TEXTURES ARE ENCOURAGED FOR A TOUCH OF TIMELESS LUXURY.',
  dress_code_colors: ['#fdf9f4', '#dbc0bf', '#4d050c', '#2d3b0b', '#1c1c19'],
  gifts_description: 'YOUR PRESENCE IS THE BEST GIFT – BUT IF YOU WISH TO GIVE SOMETHING, WE KINDLY ASK YOU TO CHECK OUR REGISTRY HERE.',
  gifts_url: '#',
  faq: [
    { question: 'Can I Bring a Guest?', answer: 'Due to venue capacity, we can only accommodate those specifically named on your invitation.' },
    { question: 'Is There Parking Available?', answer: 'Yes, complimentary valet parking will be provided at the main entrance of the Estate.' },
    { question: 'Can I Take Photos During the Ceremony?', answer: 'We are having an unplugged ceremony and kindly ask that all devices remain off during this time.' },
  ],
  footer_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80',
  contact_email: 'hello@lauren-paul.wedding',
  slug: 'lauren-paul',
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
  const end = new Date(start.getTime() + 8 * 3600000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${data.partner_name_1} & ${data.partner_name_2} Wedding`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: `${data.venue_name}, ${data.venue_address_1}, ${data.venue_address_2}`,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
}

// ─── RSVP FORM ────────────────────────────────────────────
function RSVPForm({ data }: { data: WeddingData }) {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState('attending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, attendance, wedding_slug: data.slug }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setStatus('error');
    }
  };

  if (submitted) return (
    <div className="text-center space-y-4">
      <h3 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 32, color: C.text }}>
        Thank you
      </h3>
      <p style={{ color: C.textMuted, fontSize: 14 }}>We look forward to celebrating with you.</p>
    </div>
  );

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <input
        className="w-full bg-transparent focus:outline-none py-3 px-0 text-xl"
        style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', color: C.text,
          borderBottom: `1px solid ${C.outlineV}50`, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
        placeholder="Your name" required value={name} onChange={e => setName(e.target.value)}
      />
      <input
        className="w-full bg-transparent focus:outline-none py-3 px-0"
        style={{ color: C.text, borderBottom: `1px solid ${C.outlineV}50`,
          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15 }}
        placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}
      />
      <select
        className="w-full bg-transparent focus:outline-none py-3 px-0 appearance-none"
        style={{ color: C.text, borderBottom: `1px solid ${C.outlineV}50`,
          borderTop: 'none', borderLeft: 'none', borderRight: 'none',
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, letterSpacing: '0.05em' }}
        value={attendance} onChange={e => setAttendance(e.target.value)}>
        <option value="attending">Joyfully Accepts</option>
        <option value="declined">Regretfully Declines</option>
      </select>
      <button
        type="submit" disabled={status === 'loading'}
        style={{ background: C.burgundy, color: C.white, padding: '16px 48px',
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          border: 'none', cursor: 'pointer', width: '100%' }}
        className="hover:opacity-90 transition-opacity disabled:opacity-40">
        {status === 'loading' ? 'Sending...' : 'RSVP Online'}
      </button>
      {status === 'error' && <p style={{ color: '#ba1a1a', textAlign: 'center', fontSize: 13 }}>Something went wrong.</p>}
    </form>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function EvergreenTemplate({ data = DEMO }: { data?: WeddingData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown(data.wedding_date);
  const initials = `${data.partner_name_1[0]}&${data.partner_name_2[0]}`;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Newsreader:ital,wght@0,300;0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        .font-serif  { font-family: 'Noto Serif', serif; font-style: italic; }
        .font-body   { font-family: 'Newsreader', serif; }
        .font-label  { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 1s ease both; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-5"
        style={{ background: `${C.bg}CC`, backdropFilter: 'blur(12px)' }}>
        <div style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 20, fontWeight: 700, color: C.text }}>
          {initials}
        </div>
        <div className="hidden md:flex gap-10 items-center">
          {[['#home','Home'],['#our-story','Our Story'],['#details','Details'],['#schedule','Schedule'],['#rsvp','RSVP']].map(([href,label],i) => (
            <a key={href} href={href}
              style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 11, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: i === 0 ? C.text : `${C.text}80`,
                borderBottom: i === 0 ? `1px solid ${C.text}30` : undefined, paddingBottom: i === 0 ? 2 : undefined,
                textDecoration: 'none' }}
              className="hover:opacity-100 transition-opacity">
              {label}
            </a>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}
          style={{ color: C.text, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>☰</button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full flex flex-col py-6 px-8 gap-5 md:hidden"
            style={{ background: C.bg }}>
            {[['#home','Home'],['#our-story','Our Story'],['#details','Details'],['#schedule','Schedule'],['#rsvp','RSVP']].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 13, color: C.text, textDecoration: 'none' }}>
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden" id="home">
        <div className="absolute inset-0 -z-10">
          <img src={data.hero_image_url} alt="" className="w-full h-full object-cover brightness-90" />
        </div>
        <div className="relative z-10 text-white fade-up">
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.9, marginBottom: 12 }}>
            Our New Chapter
          </p>
          <h1 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 'clamp(56px, 11vw, 110px)', marginBottom: 16, textShadow: '0 2px 20px rgba(0,0,0,0.3)', lineHeight: 1 }}>
            {data.partner_name_1} & {data.partner_name_2}
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.8 }}>
            {data.location}
          </p>
          <div className="flex justify-center gap-4 mt-10">
            <a href="#rsvp"
              style={{ background: C.burgundy, color: C.white, padding: '14px 40px',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none' }}
              className="hover:opacity-90 transition-opacity">
              RSVP
            </a>
            <button onClick={() => addToCalendar(data)}
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                color: C.white, padding: '14px 20px', border: '1px solid rgba(255,255,255,0.3)',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.15em', cursor: 'pointer' }}
              className="flex items-center gap-2 hover:bg-white/25 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </button>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section style={{ padding: '100px 24px', background: C.bg, position: 'relative', overflow: 'hidden', textAlign: 'center' }} id="our-story">
        {/* Noise texture */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        <div className="max-w-3xl mx-auto relative z-10">
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: `${C.text}60`, marginBottom: 12 }}>
            You find all the information on this website
          </p>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 56, color: C.text, marginBottom: 48 }}>
            Our Story
          </h2>

          {/* Oval portrait */}
          <div className="relative inline-block mb-14">
            <div style={{ width: 280, height: 400, borderRadius: '50%', overflow: 'hidden',
              border: `12px solid ${C.bgCard}`, boxShadow: `0 20px 40px rgba(77,5,12,0.08)`, margin: '0 auto' }}>
              <img src={data.story_image_url} alt="The couple" className="w-full h-full object-cover" />
            </div>
          </div>

          <blockquote style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 20, lineHeight: 1.8, color: `${C.text}E8`, maxWidth: 600, margin: '0 auto 32px' }}>
            {data.story_quote}
          </blockquote>
          <div style={{ width: 80, height: 1, background: `${C.text}25`, margin: '0 auto 12px' }} />
          <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 16, color: C.text }}>
            {data.story_caption}
          </p>
        </div>
      </section>

      {/* SCHEDULE */}
      <section style={{ padding: '80px 24px', background: C.burgundy, color: C.white, textAlign: 'center', position: 'relative' }} id="schedule">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 52, marginBottom: 64, color: C.burText }}>
            The Wedding Day
          </h2>

          {/* Schedule items with center line */}
          <div className="relative space-y-10">
            <div className="absolute left-1/2 top-0 bottom-0 hidden md:block"
              style={{ width: 1, background: `${C.white}20`, transform: 'translateX(-50%)' }} />
            {data.schedule.map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${C.white}80` }} className="md:text-right">
                  {item.time}
                </div>
                <div style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 26 }} className="md:text-left">
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          {/* Polaroid */}
          <div className="mt-20 inline-block" style={{ padding: 16, background: C.white, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transform: 'rotate(3deg)' }}>
            <img src={data.polaroid_image_url} alt={data.polaroid_caption}
              className="w-56 h-72 object-cover" style={{ filter: 'grayscale(0.3)' }} />
            <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', color: C.text, textAlign: 'center', marginTop: 12, fontSize: 13 }}>
              {data.polaroid_caption}
            </p>
          </div>
        </div>
      </section>

      {/* RSVP BANNER */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: 600 }} id="rsvp">
        <div className="absolute inset-0 -z-10">
          <img src={data.rsvp_invite_image_url} alt="" className="w-full h-full object-cover brightness-75" />
        </div>
        <div style={{ background: `${C.bg}F5`, padding: '60px 48px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', maxWidth: 480, margin: '0 16px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 36, marginBottom: 24, color: C.text }}>
            Please let us know if you attend our wedding here
          </h2>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 16, marginBottom: 36, color: `${C.text}80`, lineHeight: 1.7 }}>
            Kindly respond by the {data.rsvp_deadline} to help us prepare for our celebration.
          </p>
          <RSVPForm data={data} />
        </div>
      </section>

      {/* LOCATION */}
      <section style={{ padding: '80px 24px', background: C.green, color: C.white, textAlign: 'center' }} id="details">
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 52, marginBottom: 24, color: C.greenLight }}>
            The Location
          </h2>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 15, maxWidth: 480, margin: '0 auto 48px', opacity: 0.9, lineHeight: 1.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            We can't wait to celebrate with you at our chosen venue. Please find the details below, and click the map for directions.
          </p>
          <h3 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 36, marginBottom: 12 }}>
            {data.venue_name}
          </h3>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>
            {data.venue_address_1}
          </p>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 40 }}>
            {data.venue_address_2}
          </p>
          <a href={data.venue_map_url} target="_blank" rel="noreferrer"
            className="block w-full overflow-hidden hover:opacity-90 transition-opacity" style={{ maxHeight: 400 }}>
            <img src={data.venue_map_image_url} alt="Venue map"
              className="w-full object-cover hover:grayscale-0 transition-all duration-700"
              style={{ height: 400, filter: 'grayscale(0.8) opacity(0.85)' }} />
          </a>
        </div>
      </section>

      {/* WHERE TO STAY */}
      <section style={{ padding: '80px 24px', background: C.green, color: C.white, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 52, marginBottom: 20, color: C.greenLight }}>
            Where to Stay
          </h2>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 15, maxWidth: 480, margin: '0 auto 60px', opacity: 0.9, lineHeight: 1.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            We're delighted to share some local accommodation suggestions to make your visit as enjoyable as possible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {data.hotels.map((h, i) => (
              <div key={i} style={{ padding: 32, border: '1px solid rgba(255,255,255,0.2)' }}
                className="hover:bg-white/5 transition-colors">
                <h4 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 24, marginBottom: 12 }}>
                  {h.name}
                </h4>
                <p style={{ opacity: 0.7, marginBottom: 20, fontFamily: "'Newsreader', serif", fontSize: 15 }}>{h.description}</p>
                {h.url && (
                  <a href={h.url}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                      borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: 4, color: C.white, textDecoration: 'none' }}
                    className="hover:opacity-70 transition-opacity">
                    Book Guest Rate
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DRESS CODE & GIFTS */}
      <section style={{ padding: '80px 24px', background: C.burgundy, color: C.white, textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto">
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 52, marginBottom: 24, color: C.burText }}>
            The Dress Code
          </h2>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 14, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {data.dress_code_description}
          </p>
          <div className="flex justify-center gap-3 mb-20 flex-wrap">
            {data.dress_code_colors.map((color, i) => (
              <div key={i} style={{ width: 40, height: 40, background: color, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
            ))}
          </div>

          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 52, marginBottom: 20, color: C.burText }}>
            Gift Ideas
          </h2>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 14, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.8, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.9 }}>
            {data.gifts_description}
          </p>
          <a href={data.gifts_url}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase',
              borderBottom: `1px solid ${C.burText}`, paddingBottom: 8, color: C.burText, textDecoration: 'none' }}
            className="hover:opacity-70 transition-opacity">
            View Registry
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: C.bg, textAlign: 'center' }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 52, color: C.text, marginBottom: 64 }}>
            Frequently Asked
          </h2>
          <div className="space-y-14">
            {data.faq.map((item, i) => (
              <div key={i}>
                <h4 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 20, color: C.text, marginBottom: 10 }}>
                  {item.question.toUpperCase()}
                </h4>
                <p style={{ fontFamily: "'Newsreader', serif", fontSize: 16, color: `${C.text}80`, lineHeight: 1.7 }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER / COUNTDOWN */}
      <footer className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: 500 }}>
        <div className="absolute inset-0 -z-10">
          <img src={data.footer_image_url} alt="" className="w-full h-full object-cover"
            style={{ opacity: 0.3, mixBlendMode: 'overlay', filter: 'brightness(0.5)' }} />
          <div className="absolute inset-0" style={{ background: C.burgundy }} />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-10 text-center px-6 py-20" style={{ color: C.burText }}>
          <div style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 'clamp(36px, 8vw, 80px)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {String(countdown.days).padStart(3,'0')}:{String(countdown.hours).padStart(2,'0')}:{String(countdown.minutes).padStart(2,'0')}:{String(countdown.seconds).padStart(2,'0')}
          </div>
          <div className="space-y-3">
            <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 28, opacity: 0.8 }}>
              Let&apos;s Make Memories Together
            </p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', opacity: 0.6 }}>
              On Our Big Day!
            </p>
          </div>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, marginTop: 24 }}>
            If you need more information:{' '}
            <a href={`mailto:${data.contact_email}`} style={{ textDecoration: 'underline', textUnderlineOffset: 4, color: 'inherit' }}>
              {data.contact_email}
            </a>
          </p>
          <div style={{ borderTop: `1px solid ${C.burText}20`, width: '100%', paddingTop: 24 }}
            className="flex flex-col md:flex-row justify-center gap-6 items-center">
            <span style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 16 }}>
              © {data.partner_name_1} & {data.partner_name_2} · Momently
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
