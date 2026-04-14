'use client';
import { useState, useEffect } from 'react';

// ─── PALETTE ──────────────────────────────────────────────
const C = {
  bg:        '#fcf9f6',
  bgLow:     '#f6f3f0',
  bgCard:    '#f0edea',
  white:     '#ffffff',
  text:      '#1c1c1a',
  textMuted: '#45483f',
  primary:   '#496455',
  primaryCon:'#95b3a1',
  gold:      '#735a36',
  goldLight: '#fddaad',
  tertiary:  '#566342',
  terCon:    '#a3b18a',
  outlineV:  '#c6c8bb',
};

// ─── TYPES ────────────────────────────────────────────────
interface EventItem {
  day: string;
  time: string;
  title: string;
  description: string;
  location: string;
  accent: string;
}

interface GuestDetail {
  icon: string;
  title: string;
  description: string;
}

interface WeddingData {
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;
  wedding_date_display: string;
  location: string;
  hero_image_url: string;
  story_bg_url: string;
  story_paragraphs: string[];
  events: EventItem[];
  venue_name: string;
  venue_description: string;
  venue_image_url: string;
  venue_map_url: string;
  guest_details: GuestDetail[];
  rsvp_bg_url: string;
  rsvp_deadline: string;
  slug: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Henry',
  partner_name_2: 'Amelia',
  wedding_date: '2026-09-14T15:30:00',
  wedding_date_display: 'September 14, 2026',
  location: 'The Cotswolds, UK',
  hero_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
  story_bg_url: 'https://images.unsplash.com/photo-1487530811015-780f496f4b66?w=1400&q=80',
  story_paragraphs: [
    'From a chance encounter in a rain-drenched botanical garden to years of shared sunrises, our journey has always been rooted in nature\'s quiet beauty.',
    'We invite you to join us as we plant the seeds of our future together in the heart of the Ethereal Conservatory, surrounded by those who have helped us grow.',
  ],
  events: [
    { day: 'Friday', time: '6:00 PM', title: 'Welcome Drinks', description: 'A relaxed evening of cocktails and hors d\'oeuvres under the willow trees.', location: 'The North Terrace', accent: C.primaryCon },
    { day: 'Saturday', time: '3:30 PM', title: 'The Ceremony', description: 'Vows exchanged in the Heart of the Conservatory at the peak of the afternoon light.', location: 'The Glass Cathedral', accent: C.terCon },
    { day: 'Saturday', time: '5:00 PM', title: 'Reception', description: 'Dining, dancing, and starlit celebrations in the sunken English garden.', location: 'The Sunken Garden', accent: C.primary },
  ],
  venue_name: 'The Ethereal Conservatory',
  venue_description: 'A hidden sanctuary where wild blossoms meet architectural elegance. Located just an hour outside the city, yet worlds away in spirit.',
  venue_image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',
  venue_map_url: '#',
  guest_details: [
    { icon: '👗', title: 'Dress Code', description: 'Garden Formal. We encourage floral prints, light linens, and comfortable footwear suitable for grass paths.' },
    { icon: '🎁', title: 'Gifts', description: 'Your presence is our greatest gift. Should you wish to honor us, a contribution to our new home fund would be cherished.' },
    { icon: '🚐', title: 'Transport', description: 'Shuttles will be provided from the Grand Heritage Hotel starting at 2:30 PM on the day of the ceremony.' },
  ],
  rsvp_bg_url: 'https://images.unsplash.com/photo-1495274049782-6b00b0e1d785?w=1400&q=80',
  rsvp_deadline: 'August 1st, 2026',
  slug: 'henry-amelia',
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
    location: `${data.venue_name}, ${data.location}`,
    details: `You are invited to celebrate the wedding of ${data.partner_name_1} & ${data.partner_name_2}`,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
}

// ─── RSVP FORM ────────────────────────────────────────────
function RSVPForm({ data }: { data: WeddingData }) {
  const [form, setForm] = useState({ name: '', email: '', attendance: 'attending', dietary: '' });
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

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.5)', border: 'none',
    borderRadius: 12, padding: '16px 24px',
    fontFamily: "'Manrope', sans-serif", color: C.text, fontSize: 15,
    outline: 'none',
  };

  if (status === 'success') return (
    <div className="text-center py-12 space-y-4">
      <div style={{ fontSize: 40 }}>🌿</div>
      <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: 28, color: C.primary }}>Thank you</h3>
      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: C.textMuted }}>
        We look forward to celebrating with you.
      </p>
    </div>
  );

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="text-center mb-8">
        <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 36, color: C.primary, marginBottom: 6 }}>
          Kindly Respond
        </h2>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.textMuted }}>
          By {data.rsvp_deadline}
        </p>
      </div>

      <div>
        <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.primary, fontWeight: 700, display: 'block', marginBottom: 6, paddingLeft: 8 }}>
          Your Name
        </label>
        <input style={inputStyle} placeholder="First and Last Name" required
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div>
        <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.primary, fontWeight: 700, display: 'block', marginBottom: 6, paddingLeft: 8 }}>
          Email
        </label>
        <input style={inputStyle} type="email" placeholder="your@email.com"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>
      <div>
        <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.primary, fontWeight: 700, display: 'block', marginBottom: 6, paddingLeft: 8 }}>
          Attendance
        </label>
        <select style={inputStyle} value={form.attendance}
          onChange={e => setForm(f => ({ ...f, attendance: e.target.value }))}>
          <option value="attending">Happily Accepts</option>
          <option value="declined">Regretfully Declines</option>
        </select>
      </div>
      <div>
        <label style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.primary, fontWeight: 700, display: 'block', marginBottom: 6, paddingLeft: 8 }}>
          Dietary Notes
        </label>
        <textarea style={{ ...inputStyle, resize: 'none' }} rows={3}
          placeholder="Allergies or special requirements..."
          value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))} />
      </div>
      <button type="submit" disabled={status === 'loading'}
        style={{ width: '100%', padding: '20px', borderRadius: 9999,
          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryCon})`,
          color: C.white, fontFamily: "'Manrope', sans-serif", fontSize: 11,
          letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
          border: 'none', cursor: 'pointer',
          boxShadow: `0 8px 24px ${C.primary}30` }}
        className="hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40">
        {status === 'loading' ? 'Sending...' : 'Send RSVP'}
      </button>
      {status === 'error' && (
        <p style={{ color: '#ba1a1a', textAlign: 'center', fontSize: 13 }}>Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function EtherealConservatoryTemplate({ data = DEMO }: { data?: WeddingData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown(data.wedding_date);
  const initials = `${data.partner_name_1[0]} & ${data.partner_name_2[0]}`;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden', paddingBottom: 96 }}
      className="font-body md:pb-0">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,300;0,400;0,700;1,300&family=Manrope:wght@300;400;500;600;700&display=swap');
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.9s ease both; }
        .event-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
        .detail-card:hover { transform: translateY(-8px); transition: transform 0.5s ease; }
      `}</style>

      {/* TOP NAV */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20"
        style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', boxShadow: '0 12px 32px rgba(28,28,26,0.05)' }}>
        <button onClick={() => setMenuOpen(o => !o)}
          style={{ color: C.primary, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>☰</button>
        <div style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 22, color: C.primary, letterSpacing: '-0.01em' }}>
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <a href="#rsvp" style={{ color: C.primary, fontSize: 20 }}>♡</a>

        {menuOpen && (
          <div className="absolute top-full left-0 w-72 flex flex-col gap-5 p-10"
            style={{ background: C.bg, boxShadow: '0 12px 40px rgba(28,28,26,0.08)', borderRadius: '0 0 24px 24px' }}>
            {[['#our-story','Our Story'],['#events','Schedule'],['#venue','Venue'],['#rsvp','RSVP']].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 18, color: C.primary, textDecoration: 'none', borderBottom: `1px solid ${C.outlineV}30`, paddingBottom: 12 }}
                className="hover:text-[#735a36] transition-colors">
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={data.hero_image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
        </div>

        <div className="relative z-10 text-center px-4 fade-up">
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 16 }}>
            Save Our Date
          </span>
          <h1 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(72px, 14vw, 130px)', color: C.white, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 12 }}>
            {initials}
          </h1>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 32 }}>
            {data.wedding_date_display}
          </p>
          <button onClick={() => addToCalendar(data)}
            style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: 9999, color: C.white,
              fontFamily: "'Manrope', sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
            className="hover:bg-white/25 transition-colors flex items-center gap-2 mx-auto">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add to Calendar
          </button>
        </div>

        {/* Countdown — glassmorphism pill */}
        <div className="absolute bottom-10 md:bottom-16 z-20 flex gap-4 md:gap-8 px-8 py-6"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)',
            borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          {[
            { val: countdown.days, label: 'Days' },
            { val: countdown.hours, label: 'Hours' },
            { val: countdown.minutes, label: 'Mins' },
            { val: countdown.seconds, label: 'Secs' },
          ].map(({ val, label }, i) => (
            <>
              <div key={label} className="flex flex-col items-center">
                <span style={{ fontFamily: "'Noto Serif', serif", fontSize: 32, color: C.goldLight, tabularNums: 'tabular-nums' } as React.CSSProperties}>
                  {String(val).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                  {label}
                </span>
              </div>
              {i < 3 && <div key={`d${i}`} className="w-px h-8 self-center" style={{ background: 'rgba(255,255,255,0.2)' }} />}
            </>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="relative py-28 px-6 md:px-20 overflow-hidden" id="our-story">
        <div className="absolute inset-0 -z-10 opacity-10">
          <img src={data.story_bg_url} alt="" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 'clamp(32px, 5vw, 56px)', color: C.primary, marginBottom: 40 }}>
            Our Story
          </h2>
          <div className="space-y-6">
            {data.story_paragraphs.map((p, i) => (
              <p key={i} style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, lineHeight: 1.8, color: C.textMuted, fontWeight: 300 }}>
                {p}
              </p>
            ))}
          </div>
          <div style={{ marginTop: 48, fontSize: 40, color: C.gold, opacity: 0.4 }}>✿</div>
        </div>
      </section>

      {/* SCHEDULE — Horizontal scroll cards */}
      <section style={{ paddingBottom: 80, background: C.bgLow }} id="events">
        <div className="px-6 md:px-20 mb-10 flex justify-between items-end pt-20">
          <div>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, display: 'block', marginBottom: 6 }}>
              The Celebration
            </span>
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 'clamp(32px, 5vw, 52px)', color: C.primary }}>
              Schedule
            </h2>
          </div>
        </div>
        <div className="flex overflow-x-auto gap-5 px-6 md:px-20 pb-4" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
          {data.events.map((ev, i) => (
            <div key={i} className="event-card" style={{ minWidth: 300, scrollSnapAlign: 'start', flexShrink: 0 }}>
              <div style={{ background: C.white, padding: 32, borderRadius: 24, height: '100%',
                boxShadow: '0 12px 32px rgba(28,28,26,0.03)', borderTop: `4px solid ${ev.accent}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <span style={{ background: `${ev.accent}25`, color: C.primary, padding: '4px 14px', borderRadius: 9999,
                      fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      {ev.day}
                    </span>
                    <span style={{ fontFamily: "'Noto Serif', serif", color: C.gold, fontSize: 18 }}>{ev.time}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: 26, color: C.primary, marginBottom: 12 }}>{ev.title}</h3>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: C.textMuted, fontWeight: 300, lineHeight: 1.6, marginBottom: 24 }}>
                    {ev.description}
                  </p>
                </div>
                <div className="flex items-center gap-2" style={{ color: C.primary }}>
                  <span style={{ fontSize: 14 }}>📍</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {ev.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VENUE — Full bleed with glass overlay */}
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: 600 }} id="venue">
        <div className="absolute inset-0 -z-10">
          <img src={data.venue_image_url} alt={data.venue_name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(28,28,26,0.6), transparent)' }} />
        </div>
        <div className="relative z-10 px-6 md:px-20 max-w-xl text-white py-20">
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.7, display: 'block', marginBottom: 12 }}>
            The Setting
          </span>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: 20, lineHeight: 1.1 }}>
            {data.venue_name}
          </h2>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.7, opacity: 0.9, marginBottom: 32 }}>
            {data.venue_description}
          </p>
          <a href={data.venue_map_url} target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', padding: '12px 32px', background: C.white, color: C.primary,
              borderRadius: 9999, fontFamily: "'Manrope', sans-serif", fontSize: 11,
              letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none' }}
            className="hover:bg-[#95b3a1] hover:text-white transition-all">
            View Map
          </a>
        </div>
      </section>

      {/* GUEST DETAILS */}
      <section style={{ padding: '80px 24px', background: C.bg }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 48, color: C.primary, marginBottom: 12 }}>
              Guest Details
            </h2>
            <div style={{ width: 80, height: 1, background: C.goldLight, margin: '0 auto' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.guest_details.map((d, i) => (
              <div key={i} className="detail-card"
                style={{ padding: 40, borderRadius: 24, background: C.bgLow,
                  boxShadow: '0 12px 32px rgba(28,28,26,0.02)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <div style={{ fontSize: 36, marginBottom: 20 }}>{d.icon}</div>
                <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: 22, color: C.primary, marginBottom: 12 }}>
                  {d.title}
                </h3>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: C.textMuted, fontWeight: 300, lineHeight: 1.7 }}>
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="relative py-20 px-6" id="rsvp">
        <div className="absolute inset-0 -z-10">
          <img src={data.rsvp_bg_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }} />
        </div>
        <div className="relative z-10 max-w-lg mx-auto">
          <div style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(24px)', padding: '48px 40px',
            borderRadius: 40, boxShadow: '0 24px 60px rgba(28,28,26,0.08)', border: '1px solid rgba(255,255,255,0.4)' }}>
            <RSVPForm data={data} />
          </div>
        </div>
      </section>

      {/* DESKTOP FOOTER */}
      <footer className="hidden md:block py-10 text-center" style={{ background: C.bg }}>
        <div style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 22, color: `${C.primary}60`, marginBottom: 6 }}>
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: `${C.textMuted}60` }}>
          © {new Date().getFullYear()} · Handcrafted with love · Momently
        </p>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-3 pb-8 px-4"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)',
          borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 24px rgba(28,28,26,0.04)' }}>
        {[
          { href: '#our-story', icon: '📖', label: 'Story' },
          { href: '#events', icon: '📅', label: 'Events' },
          { href: '#venue', icon: '📍', label: 'Venue' },
          { href: '#rsvp', icon: '✉️', label: 'RSVP' },
        ].map(({ href, icon, label }) => (
          <a key={href} href={href}
            className="flex flex-col items-center gap-1"
            style={{ color: C.textMuted, textDecoration: 'none', fontSize: 9,
              fontFamily: "'Manrope', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
