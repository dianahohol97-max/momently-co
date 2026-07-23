'use client';
import { useState, useEffect } from 'react';

// ─── PALETTE ──────────────────────────────────────────────
const C = {
  bg:        '#fbf9f5',
  bgLow:     '#f5f3ef',
  bgCard:    '#efeeea',
  text:      '#071524',
  textSub:   '#1c2a39',
  textMuted: '#44474c',
  gold:      '#735a36',
  outlineV:  '#c4c6cc',
  surface:   '#ffffff',
};

// ─── TYPES ────────────────────────────────────────────────
interface ScheduleItem {
  time: string;
  title: string;
}

interface WeddingData {
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;
  wedding_date_display: string;
  location: string;
  hero_gradient: string;
  story_image_url: string;
  story_paragraphs: string[];
  schedule: ScheduleItem[];
  venue_name: string;
  venue_address: string;
  venue_stay_description: string;
  venue_travel_description: string;
  venue_image_url: string;
  dress_code_title: string;
  dress_code_description: string;
  gifts_description: string;
  gifts_url: string;
  faq: { question: string; answer: string }[];
  closing_message: string;
  rsvp_deadline: string;
  slug: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Isabelle',
  partner_name_2: 'Laurent',
  wedding_date: '2026-09-12T11:00:00',
  wedding_date_display: '12 September 2026',
  location: 'Washington, DC',
  hero_gradient: 'linear-gradient(135deg, #a8edea 0%, #b8f5c8 20%, #c8e6c9 35%, #d4e8b0 50%, #e8d5a0 65%, #e8c4a0 80%, #d4a0c8 100%)',
  story_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80',
  story_paragraphs: [
    'It began with a chance encounter in the hallowed halls of the National Gallery. A shared glance over a Sargent portrait evolved into a quiet conversation that stretched across years of shared discovery and unwavering devotion.',
    'Our story is not one of sudden bursts, but of the slow, deliberate craft of a life built together. From the morning fogs of the Potomac to the golden dusks of autumn in the city, we have found in each other a mirror and a home.',
    'We invite you to join us as we formalize this promise, marking the next chapter of a journey that began with art and continues with love.',
  ],
  schedule: [
    { time: '11:00 AM', title: 'Wedding Ceremony' },
    { time: '1:00 PM',  title: 'Welcome Toast' },
    { time: '3:00 PM',  title: 'Wedding Lunch' },
    { time: '4:00 PM',  title: 'Cake Cutting' },
    { time: '5:00 PM',  title: 'Cocktail Hour' },
    { time: '8:00 PM',  title: 'First Dance' },
    { time: '11:00 PM', title: 'Fireworks Display' },
    { time: '12:00 AM', title: 'Buffet Dinner' },
  ],
  venue_name: 'The Mayflower Hotel',
  venue_address: '1127 Connecticut Ave NW, Washington, DC 20036',
  venue_stay_description: 'A block of rooms has been reserved for our guests at a preferred rate. Please mention the Isabelle & Laurent wedding when booking your stay.',
  venue_travel_description: 'Valet parking is available at the DeSales Street entrance. For those arriving by rail, the hotel is a three-minute walk from the Farragut North Metro Station.',
  venue_image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80',
  dress_code_title: 'Black Tie',
  dress_code_description: 'Gowns and Tuxedos are requested for this formal evening occasion.',
  gifts_description: 'Your presence at our wedding is the greatest gift of all. However, should you wish to honor us with a gift, we kindly request no flowers. A contribution to our honeymoon fund would be most appreciated as we begin our life together.',
  gifts_url: '#',
  faq: [
    { question: 'Children', answer: 'While we love your little ones, our wedding will be an adults-only celebration.' },
    { question: 'Photography', answer: 'We invite you to be fully present during our unplugged ceremony. We have professional photographers to capture the moment.' },
  ],
  closing_message: 'We can\'t wait to\ncelebrate with you',
  rsvp_deadline: 'first of August',
  slug: 'isabelle-laurent',
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
    location: `${data.venue_name}, ${data.venue_address}`,
    details: `You are invited to the wedding of ${data.partner_name_1} & ${data.partner_name_2}`,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
}

// ─── RSVP FORM ────────────────────────────────────────────
function RSVPForm({ data }: { data: WeddingData }) {
  const [form, setForm] = useState({ name: '', email: '', attendance: 'attending', guests: '1', dietary: '', song: '', shuttle: false });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, attendance: form.attendance, dietary: form.dietary, wedding_slug: data.slug }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent',
    borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    borderBottom: `1px solid ${C.outlineV}50`,
    padding: '12px 0', fontFamily: "'Newsreader', serif", fontSize: 20,
    color: C.text, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
    color: C.textMuted, opacity: 0.6, marginBottom: 4,
    fontFamily: "'Work Sans', sans-serif",
  };

  if (status === 'success') return (
    <div className="text-center py-16 space-y-6">
      <h3 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 32, color: C.text }}>
        Thank you.
      </h3>
      <div style={{ width: 80, height: 1, background: C.gold, margin: '0 auto' }} />
      <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold }}>
        I & L
      </p>
    </div>
  );

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      <div className="text-center space-y-3 mb-12">
        <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 40, color: C.text }}>RSVP</h2>
        <p style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 18, opacity: 0.7, color: C.text }}>
          Please respond by the {data.rsvp_deadline}
        </p>
      </div>

      <div>
        <label style={labelStyle}>Full Name</label>
        <input style={inputStyle} placeholder="M. & Mme. Guest" required
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>

      <div>
        <label style={labelStyle}>Email Address</label>
        <input style={inputStyle} type="email" placeholder="your@email.com"
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label style={labelStyle}>Attendance</label>
          <select style={{ ...inputStyle, appearance: 'none' }}
            value={form.attendance} onChange={e => setForm(f => ({ ...f, attendance: e.target.value }))}>
            <option value="attending">Joyfully Accepts</option>
            <option value="declined">Regretfully Declines</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Number of Guests</label>
          <input style={inputStyle} type="number" min="1" max="10"
            value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-4">
        <label style={labelStyle}>Transportation & Dietary</label>
        <label className="flex items-center gap-4 cursor-pointer">
          <input type="checkbox" checked={form.shuttle}
            onChange={e => setForm(f => ({ ...f, shuttle: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: C.text }}
          />
          <span style={{ fontFamily: "'Newsreader', serif", fontSize: 14, color: C.text }}>Require Shuttle Service</span>
        </label>
        <input style={{ ...inputStyle, fontSize: 16 }}
          placeholder="Dietary notes or allergies"
          value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))} />
      </div>

      <div>
        <label style={labelStyle}>Song Request</label>
        <input style={{ ...inputStyle, fontSize: 16 }}
          placeholder="The song that gets you on the floor"
          value={form.song} onChange={e => setForm(f => ({ ...f, song: e.target.value }))} />
      </div>

      <div className="flex justify-center pt-6">
        <button type="submit" disabled={status === 'loading'}
          style={{ background: C.text, color: '#ffffff', padding: '20px 80px',
            fontFamily: "'Work Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
            border: 'none', cursor: 'pointer', transition: 'background 0.5s' }}
          className="hover:bg-[#735a36] disabled:opacity-40">
          {status === 'loading' ? 'Sending...' : 'Submit Response'}
        </button>
      </div>
      {status === 'error' && (
        <p style={{ color: '#ba1a1a', textAlign: 'center', fontSize: 13 }}>Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function TheStationeryTemplate({ data = DEMO }: { data?: WeddingData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown(data.wedding_date);
  const initials = `${data.partner_name_1[0]} & ${data.partner_name_2[0]}`;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,300;0,400;0,700;1,300&family=Newsreader:ital,wght@0,300;0,400;1,400&family=Work+Sans:wght@300;400;500&display=swap');
        .font-headline { font-family: 'Noto Serif', serif; }
        .font-body     { font-family: 'Newsreader', serif; }
        .font-label    { font-family: 'Work Sans', sans-serif; }
        ::-webkit-scrollbar { width: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* NAV */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-5"
        style={{ background: `${C.bg}F0`, backdropFilter: 'blur(16px)' }}>
        <button onClick={() => setMenuOpen(o => !o)}
          style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.textSub, background: 'none', border: 'none', cursor: 'pointer' }}>
          {menuOpen ? '' : ''}
        </button>
        <div style={{ fontFamily: "'Noto Serif', serif", fontSize: 18, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 300, color: C.textSub }}>
          {initials}
        </div>
        <a href="#rsvp"
          style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.textSub, textDecoration: 'none' }}
          className="hover:opacity-50 transition-opacity">
          RSVP
        </a>

        {/* Drawer */}
        {menuOpen && (
          <div className="absolute top-full left-0 h-screen w-72 flex flex-col gap-6 p-12"
            style={{ background: C.bg, boxShadow: `0 0 40px rgba(7,21,36,0.04)` }}>
            <div style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 24, color: C.gold }}>
              {data.partner_name_1} & {data.partner_name_2}
            </div>
            {[['#the-wedding','The Wedding'],['#our-story','Our Story'],['#details','The Details'],['#registry','Registry'],['#rsvp','RSVP']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Noto Serif', serif", fontSize: 16, color: C.textSub, textDecoration: 'none', padding: '8px 0', borderBottom: `0.5px solid ${C.outlineV}30` }}
                className="hover:text-[#735a36] transition-colors hover:tracking-widest duration-500">
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden" id="the-wedding">
        {/* Aurora/holographic gradient overlay */}
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: data.hero_gradient }} />
        <div className="absolute inset-0 -z-10" style={{ background: `${C.bg}20` }} />

        <div className="max-w-3xl mx-auto space-y-8 fade-up">
          <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold }}>
            A Joyous Celebration
          </span>
          <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: 'clamp(48px, 9vw, 96px)', fontWeight: 300, letterSpacing: '-0.02em', color: C.text, lineHeight: 1 }}>
            {data.partner_name_1} <span style={{ fontStyle: 'italic', color: C.gold }}>&</span> {data.partner_name_2}
          </h1>
          <p style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 22, color: `${C.textSub}CC` }}>
            are getting married
          </p>
          <div className="space-y-1">
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text }}>
              {data.wedding_date_display}
            </p>
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.text, opacity: 0.6 }}>
              {data.location}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a href="#rsvp"
              style={{ background: C.text, color: '#ffffff', padding: '20px 48px',
                fontFamily: "'Work Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'background 0.5s' }}
              className="hover:bg-[#735a36]">
              RSVP
            </a>
            <button onClick={() => addToCalendar(data)}
              style={{ border: `1px solid ${C.text}30`, color: C.text, padding: '20px 28px',
                fontFamily: "'Work Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'transparent', cursor: 'pointer' }}
              className="flex items-center gap-2 justify-center hover:border-current transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '64px 40px', borderTop: `1px solid ${C.outlineV}20`, borderBottom: `1px solid ${C.outlineV}20` }}>
        <div className="max-w-2xl mx-auto flex justify-between text-center">
          {[
            { val: countdown.days,    label: 'Days' },
            { val: countdown.hours,   label: 'Hours' },
            { val: countdown.minutes, label: 'Minutes' },
            { val: countdown.seconds, label: 'Seconds' },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span style={{ fontFamily: "'Noto Serif', serif", fontSize: 28, letterSpacing: '0.1em', color: C.text, tabularNums: 'tabular-nums' } as React.CSSProperties}>
                {String(val).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5, color: C.text }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section style={{ padding: '80px 40px', background: C.bgLow }} id="our-story">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
            <img src={data.story_image_url} alt="The couple"
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(1) brightness(0.95)', transition: 'transform 0.7s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
          <div className="space-y-7 pr-4">
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 40, color: C.gold }}>
              The Beginning
            </h2>
            <div className="space-y-5">
              {data.story_paragraphs.map((p, i) => (
                <p key={i} style={{ fontFamily: "'Newsreader', serif", fontSize: 17, lineHeight: 1.8, color: `${C.text}E8` }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE — Ledger style */}
      <section style={{ padding: '80px 40px' }} id="details">
        <div className="max-w-2xl mx-auto">
          <h2 style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase',
            color: C.gold, textAlign: 'center', marginBottom: 56 }}>
            The Schedule of Events
          </h2>
          <div className="space-y-0">
            {data.schedule.map((item, i) => (
              <div key={i} className="flex justify-between items-baseline"
                style={{ borderBottom: `1px solid ${C.outlineV}20`, paddingBottom: 14, paddingTop: i === 0 ? 0 : 14 }}>
                <span style={{ fontFamily: "'Noto Serif', serif", fontSize: 20, color: C.text }}>{item.title}</span>
                <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', opacity: 0.6, color: C.text }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VENUE */}
      <section style={{ padding: '80px 40px', background: `${C.bgCard}50` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 32, color: C.text, marginBottom: 8 }}>
              {data.venue_name}
            </h2>
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7, color: C.text }}>
              {data.venue_address}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 1, background: `${C.outlineV}20` }}>
            <div style={{ background: C.bg, padding: 48 }} className="space-y-4">
              <h3 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 22, color: C.gold }}>
                Where to Stay
              </h3>
              <p style={{ fontFamily: "'Newsreader', serif", fontSize: 15, lineHeight: 1.8, color: `${C.text}CC` }}>
                {data.venue_stay_description}
              </p>
            </div>
            <div style={{ background: C.bg, padding: 48 }} className="space-y-4">
              <h3 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 22, color: C.gold }}>
                How to Reach
              </h3>
              <p style={{ fontFamily: "'Newsreader', serif", fontSize: 15, lineHeight: 1.8, color: `${C.text}CC` }}>
                {data.venue_travel_description}
              </p>
            </div>
          </div>
          <div style={{ aspectRatio: '16/5', overflow: 'hidden', marginTop: 2 }}>
            <img src={data.venue_image_url} alt={data.venue_name}
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(0.8) opacity(0.85)' }} />
          </div>
        </div>
      </section>

      {/* DRESS CODE */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div className="max-w-xl mx-auto space-y-4">
          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: C.gold }}>
            Dress Code
          </p>
          <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: 40, color: C.text }}>
            {data.dress_code_title}
          </h3>
          <p style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 18, opacity: 0.8, color: C.text }}>
            {data.dress_code_description}
          </p>
        </div>
      </section>

      {/* REGISTRY */}
      <section style={{ padding: '80px 40px', background: C.bgLow, textAlign: 'center' }} id="registry">
        <div className="max-w-xl mx-auto space-y-6">
          <div style={{ fontSize: 32, color: C.gold, opacity: 0.6 }}></div>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: 36, color: C.text }}>Registry</h2>
          <p style={{ fontFamily: "'Newsreader', serif", fontSize: 17, lineHeight: 1.8, color: `${C.text}CC` }}>
            {data.gifts_description}
          </p>
          <div className="pt-4">
            <a href={data.gifts_url}
              style={{ display: 'inline-block', border: `1px solid ${C.text}`, color: C.text, padding: '16px 40px',
                fontFamily: "'Work Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'all 0.5s' }}
              className="hover:bg-[#071524] hover:text-white">
              Honeymoon Fund
            </a>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '80px 40px' }} id="rsvp">
        <div className="max-w-xl mx-auto">
          <RSVPForm data={data} />
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 40px', background: C.bgLow }}>
        <div className="max-w-xl mx-auto space-y-10">
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 32, color: C.text, textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          {data.faq.map((item, i) => (
            <div key={i} className="space-y-2">
              <h4 style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold }}>
                {item.question}
              </h4>
              <p style={{ fontFamily: "'Newsreader', serif", fontSize: 17, lineHeight: 1.8, opacity: 0.8, color: C.text }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section style={{ padding: '120px 40px', textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(36px, 6vw, 64px)', color: C.text, lineHeight: 1.3, whiteSpace: 'pre-line' }}>
            {data.closing_message}
          </h2>
          <div style={{ width: 80, height: 1, background: C.gold, margin: '0 auto' }} />
          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold }}>
            {data.partner_name_1[0]} <span style={{ margin: '0 8px' }}>&</span> {data.partner_name_2[0]}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bgLow, padding: '56px 40px', borderTop: `0.2px solid ${C.textSub}10` }}
        className="flex flex-col items-center gap-5 text-center">
        <div className="flex gap-8">
          {['Privacy', 'Contact'].map(label => (
            <a key={label} href="#"
              style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                color: C.textSub, opacity: 0.6, textDecoration: 'none' }}
              className="hover:opacity-100 transition-opacity">
              {label}
            </a>
          ))}
        </div>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.textSub }}>
          2026 {data.partner_name_1} & {data.partner_name_2} · Crafted with Momently
        </p>
      </footer>
    </div>
  );
}
