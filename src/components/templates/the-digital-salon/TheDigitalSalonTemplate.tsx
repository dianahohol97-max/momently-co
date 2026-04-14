'use client';
import { useState, useEffect } from 'react';

// ─── PALETTE ──────────────────────────────────────────────
const C = {
  bg:        '#fbf9f5',
  bgLow:     '#f5f3ef',
  bgWhite:   '#ffffff',
  bgCard:    '#efeeea',
  text:      '#1b1c1a',
  textMuted: '#4f4445',
  primary:   '#735c00',
  primaryDim:'#574500',
  container: '#ffdf84',
  blush:     '#f8d8db',
  champagne: '#d3c5ad',
  outline:   '#807475',
  outlineV:  '#d2c3c4',
};

// ─── TYPES ────────────────────────────────────────────────
interface TimelineItem {
  time: string;
  title: string;
  location: string;
  icon: string;
}

interface WeddingData {
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;
  wedding_date_display: string;
  location: string;
  hero_image_url: string;
  story_image_url: string;
  story_paragraph_1: string;
  story_paragraph_2: string;
  timeline: TimelineItem[];
  venue_name: string;
  venue_address: string;
  venue_parking: boolean;
  venue_accommodation: boolean;
  venue_image_url: string;
  venue_map_url: string;
  dress_code_title: string;
  dress_code_subtitle: string;
  dress_code_colors: string[];
  dress_code_label: string;
  gifts_description: string;
  gifts_url: string;
  closing_message: string;
  rsvp_deadline: string;
  meal_options: string[];
  slug: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Isabelle',
  partner_name_2: 'Laurent',
  wedding_date: '2026-09-12T11:00:00',
  wedding_date_display: '12 SEPTEMBER 2026',
  location: 'Paris, France',
  hero_image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&q=80',
  story_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80',
  story_paragraph_1: 'It began in the quiet corners of a Parisian library, where a shared love for antiquated manuscripts sparked a conversation that hasn\'t ended. From the cobblestone streets of Montmartre to the sun-drenched vineyards of the Loire Valley, our journey has been a collection of whispered promises and grand adventures.',
  story_paragraph_2: 'We invite you to join us as we begin our most beautiful chapter yet, surrounded by the echoes of history and the warmth of your company.',
  timeline: [
    { time: '11:00 AM', title: 'Wedding Ceremony', location: 'St. Germain Chapel', icon: '⛪' },
    { time: '1:00 PM',  title: 'Welcome Toast',    location: 'The Grand Salon',    icon: '🥂' },
    { time: '3:00 PM',  title: 'Wedding Lunch',    location: 'The Orangery',       icon: '🍽️' },
    { time: '8:00 PM',  title: 'First Dance',      location: 'Ballroom',           icon: '🎵' },
    { time: '11:00 PM', title: 'Fireworks',        location: 'Terrace Gardens',    icon: '✨' },
  ],
  venue_name: 'Château des Magnolias',
  venue_address: '42 Avenue du Parc, 75008 Paris, France',
  venue_parking: true,
  venue_accommodation: true,
  venue_image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
  venue_map_url: '#',
  dress_code_title: 'Dress Code',
  dress_code_subtitle: 'Black Tie & Formal Elegance',
  dress_code_colors: ['#735c00', '#f8d8db', '#fbf9f5', '#70585b', '#d3c5ad'],
  dress_code_label: 'Soft Pinks, Gold, Neutrals, and Deep Tones',
  gifts_description: 'Your presence at our wedding is the greatest gift of all. However, should you wish to honor us with a gift, a contribution to our honeymoon fund would be most gratefully received as we dream of our first journey as husband and wife.',
  gifts_url: '#',
  closing_message: 'We can\'t wait to\ncelebrate with you',
  rsvp_deadline: 'August 1st, 2026',
  meal_options: ['Herb Roasted Beef Tenderloin', 'Pan-Seared Sea Bass', 'Wild Mushroom Risotto (Vegan)'],
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
  const [form, setForm] = useState({ name: '', email: '', attendance: 'attending', meal: '', guests: '1', dietary: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, attendance: form.attendance, dietary: form.dietary || form.meal, wedding_slug: data.slug }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: C.bgLow, border: 'none', borderRadius: 12,
    padding: '16px', fontFamily: "'Noto Serif', serif", color: C.text,
    outline: 'none', fontSize: 15,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
    color: C.textMuted, marginBottom: 8, paddingLeft: 4,
  };

  if (status === 'success') return (
    <div className="text-center py-16">
      <div style={{ fontSize: 36, marginBottom: 16 }}>🌸</div>
      <h3 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 32, color: C.primary }}>
        Thank you
      </h3>
      <p style={{ color: C.textMuted, marginTop: 8, fontSize: 13 }}>We look forward to celebrating with you.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-10">
        <div style={{ fontSize: 32, opacity: 0.3, marginBottom: 12 }}>🌸</div>
        <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 44, color: C.primary, marginBottom: 6 }}>
          RSVP
        </h2>
        <p style={{ color: C.textMuted, fontSize: 13 }}>Kindly respond by {data.rsvp_deadline}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label style={labelStyle}>Your Name</label>
          <input style={inputStyle} placeholder="Guest Name" required
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Will you attend?</label>
          <select style={inputStyle} value={form.attendance}
            onChange={e => setForm(f => ({ ...f, attendance: e.target.value }))}>
            <option value="attending">Joyfully Accept</option>
            <option value="declined">Regretfully Decline</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input style={inputStyle} type="email" placeholder="your@email.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Meal Choice</label>
          <select style={inputStyle} value={form.meal}
            onChange={e => setForm(f => ({ ...f, meal: e.target.value }))}>
            <option value="">Select…</option>
            {data.meal_options.map((m, i) => <option key={i} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label style={labelStyle}>Dietary Requirements</label>
          <textarea style={{ ...inputStyle, resize: 'none' }} rows={3} placeholder="Please specify..."
            value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))} />
        </div>
        <div className="md:col-span-2 text-center pt-4">
          <button type="submit" disabled={status === 'loading'}
            style={{ background: C.primary, color: '#fff6ef', padding: '16px 64px',
              borderRadius: 9999, fontFamily: "'Newsreader', serif", fontStyle: 'italic',
              fontSize: 20, boxShadow: `0 8px 24px ${C.primary}20`, border: 'none', cursor: 'pointer' }}
            className="hover:opacity-80 transition-opacity disabled:opacity-40">
            {status === 'loading' ? 'Sending...' : 'Submit RSVP'}
          </button>
        </div>
        {status === 'error' && (
          <div className="md:col-span-2 text-center">
            <p style={{ color: '#ba1a1a', fontSize: 13 }}>Something went wrong. Please try again.</p>
          </div>
        )}
      </div>
    </form>
  );
}

// ─── ORNATE CORNERS ───────────────────────────────────────
function OrnateFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      {['tl', 'tr', 'bl', 'br'].map(pos => (
        <div key={pos} style={{
          position: 'absolute', width: 56, height: 56,
          top: pos.startsWith('t') ? 0 : undefined,
          bottom: pos.startsWith('b') ? 0 : undefined,
          left: pos.endsWith('l') ? 0 : undefined,
          right: pos.endsWith('r') ? 0 : undefined,
          borderTop: pos.startsWith('t') ? `2px solid ${C.primary}30` : undefined,
          borderBottom: pos.startsWith('b') ? `2px solid ${C.primary}30` : undefined,
          borderLeft: pos.endsWith('l') ? `2px solid ${C.primary}30` : undefined,
          borderRight: pos.endsWith('r') ? `2px solid ${C.primary}30` : undefined,
          borderRadius: pos === 'tl' ? '16px 0 0 0' : pos === 'tr' ? '0 16px 0 0' : pos === 'bl' ? '0 0 0 16px' : '0 0 16px 0',
          transition: 'transform 0.7s ease',
        }}
          className="group-hover:scale-110"
        />
      ))}
      {children}
    </div>
  );
}

// ─── MAIN TEMPLATE ────────────────────────────────────────
export default function TheDigitalSalonTemplate({ data = DEMO }: { data?: WeddingData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const countdown = useCountdown(data.wedding_date);
  const initials = `${data.partner_name_1[0]}&${data.partner_name_2[0]}`;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');
        .font-headline { font-family: 'Newsreader', serif; }
        .font-body     { font-family: 'Noto Serif', serif; }
        ::-webkit-scrollbar { width: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* NAV */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-8 py-4"
        style={{ background: `${C.bg}CC`, backdropFilter: 'blur(20px)', boxShadow: `0 2px 20px ${C.primary}08` }}>
        <div style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 22, color: C.primary, letterSpacing: '0.03em' }}>
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {[['#home', 'Home'], ['#story', 'Our Story'], ['#timeline', 'Timeline'], ['#rsvp', 'RSVP']].map(([href, label], i) => (
            <a key={href} href={href}
              style={{ color: i === 0 ? C.primary : `${C.primary}80`, fontSize: 13,
                borderBottom: i === 0 ? `1px solid ${C.primary}` : undefined, paddingBottom: i === 0 ? 2 : undefined }}
              className="hover:opacity-100 transition-opacity">
              {label}
            </a>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}
          style={{ color: C.primary, fontSize: 22 }}>☰</button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full flex flex-col py-6 px-8 gap-5 md:hidden"
            style={{ background: C.bg, borderBottom: `1px solid ${C.outlineV}40` }}>
            {[['#home','Home'],['#story','Our Story'],['#timeline','Timeline'],['#rsvp','RSVP']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ color: C.primary, fontSize: 13, letterSpacing: '0.1em' }}>
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden" id="home"
        style={{ background: C.bg }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none -z-10">
          <img src={data.hero_image_url} alt="" className="w-full h-full object-cover" />
        </div>
        {/* Decorative blurred circle */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none -z-10"
          style={{ background: C.blush, opacity: 0.3, filter: 'blur(60px)' }} />

        <div className="relative z-10 w-full max-w-2xl mx-auto text-center py-12 fade-up">
          <OrnateFrame>
            <div style={{ padding: '48px 40px', border: `1px solid ${C.primary}10`, borderRadius: 20,
              background: `${C.bgWhite}60`, backdropFilter: 'blur(12px)',
              boxShadow: `0 20px 60px ${C.primary}08` }}>
              <p style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', color: `${C.primary}80`,
                fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
                The Wedding of
              </p>
              <h1 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic',
                fontSize: 'clamp(52px, 10vw, 88px)', color: C.primary, lineHeight: 1.05, marginBottom: 8 }}>
                {data.partner_name_1}<br />
                <span style={{ fontSize: '0.5em', display: 'block', margin: '4px 0' }}>&</span>
                {data.partner_name_2}
              </h1>
              <div style={{ width: 80, height: 1, background: `${C.primary}25`, margin: '20px auto' }} />
              <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', color: C.textMuted, fontSize: 18, marginBottom: 6 }}>
                are getting married
              </p>
              <p style={{ fontFamily: "'Newsreader', serif", fontSize: 24, color: C.primary, letterSpacing: '0.15em' }}>
                {data.wedding_date_display}
              </p>
            </div>
          </OrnateFrame>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a href="#rsvp"
              style={{ background: C.primary, color: '#fff6ef', padding: '16px 48px', borderRadius: 9999,
                fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 20,
                boxShadow: `0 8px 24px ${C.primary}20`, textDecoration: 'none' }}
              className="hover:opacity-80 transition-all duration-500 hover:-translate-y-0.5">
              Save the Date
            </a>
            <button onClick={() => addToCalendar(data)}
              style={{ border: `1px solid ${C.primary}30`, color: C.primary, padding: '16px 28px', borderRadius: 9999,
                fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent' }}
              className="flex items-center gap-2 justify-center hover:border-current hover:opacity-80 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </button>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '80px 24px', background: C.bgLow }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 md:gap-14 p-10"
            style={{ background: C.bgWhite, border: `1px solid ${C.primary}08`, borderRadius: 20,
              boxShadow: `0 20px 60px ${C.primary}06` }}>
            {[
              { val: countdown.days,    label: 'Days' },
              { val: countdown.hours,   label: 'Hours' },
              { val: countdown.minutes, label: 'Mins' },
              { val: countdown.seconds, label: 'Secs' },
            ].map(({ val, label }, i) => (
              <>
                <div key={label} className="flex flex-col items-center">
                  <span style={{ fontFamily: "'Newsreader', serif", fontSize: 56, color: C.primary, lineHeight: 1, tabularNums: 'tabular-nums' } as React.CSSProperties}>
                    {String(val).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.textMuted, marginTop: 6 }}>
                    {label}
                  </span>
                </div>
                {i < 3 && <div key={`d${i}`} className="hidden md:block w-px h-14 self-center" style={{ background: `${C.primary}12` }} />}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section style={{ padding: '100px 40px', background: C.bg, overflow: 'hidden' }} id="story">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Image with frame */}
            <div className="relative order-2 md:order-1">
              <div style={{ padding: 16, border: `1px solid ${C.primary}20`, borderRadius: 20, background: C.bgWhite,
                boxShadow: `0 24px 60px ${C.primary}10` }}>
                <img src={data.story_image_url} alt="The couple"
                  className="w-full object-cover" style={{ height: 480, borderRadius: 12 }} />
              </div>
              {/* Decorative floating circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full -z-10"
                style={{ background: C.container, opacity: 0.2, filter: 'blur(40px)' }} />
            </div>

            {/* Text */}
            <div className="order-1 md:order-2 space-y-6">
              <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 48, color: C.primary }}>
                Our Story
              </h2>
              <div style={{ width: 64, height: 3, background: `${C.primary}25`, borderRadius: 2 }} />
              <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 17, lineHeight: 1.8, color: C.textMuted }}>
                <span style={{ fontFamily: "'Newsreader', serif", fontSize: 60, float: 'left', lineHeight: 0.8, marginRight: 8, color: C.primary, fontStyle: 'italic' }}>
                  {data.story_paragraph_1[0]}
                </span>
                {data.story_paragraph_1.slice(1)}
              </p>
              <p style={{ fontFamily: "'Noto Serif', serif", fontSize: 16, lineHeight: 1.8, color: C.textMuted }}>
                {data.story_paragraph_2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ padding: '100px 40px', background: C.bgLow }} id="timeline">
        <div className="max-w-2xl mx-auto">
          <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 48, color: C.primary, textAlign: 'center', marginBottom: 64 }}>
            The Wedding Day
          </h2>
          <div className="relative space-y-12">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 hidden md:block"
              style={{ width: 1, background: `${C.primary}12`, transform: 'translateX(-50%)' }} />

            {data.timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className="flex flex-col md:flex-row items-center gap-6 md:gap-0">
                  <div className={`md:w-1/2 ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:order-3'}`}>
                    {isLeft ? (
                      <>
                        <h3 style={{ fontFamily: "'Newsreader', serif", fontSize: 24, color: C.primary }}>{item.title}</h3>
                        <p style={{ fontStyle: 'italic', color: C.textMuted, marginTop: 4 }}>{item.location}</p>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${C.primary}70` }}>{item.time}</span>
                    )}
                  </div>

                  {/* Circle */}
                  <div className="relative z-10 flex items-center justify-center md:order-2 flex-shrink-0"
                    style={{ width: 48, height: 48, background: C.bgWhite, border: `2px solid ${C.primary}20`,
                      borderRadius: 9999, boxShadow: `0 4px 16px ${C.primary}10` }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                  </div>

                  <div className={`md:w-1/2 ${isLeft ? 'md:pl-10 md:order-3' : 'md:pr-10 md:text-right'}`}>
                    {isLeft ? (
                      <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${C.primary}70` }}>{item.time}</span>
                    ) : (
                      <>
                        <h3 style={{ fontFamily: "'Newsreader', serif", fontSize: 24, color: C.primary }}>{item.title}</h3>
                        <p style={{ fontStyle: 'italic', color: C.textMuted, marginTop: 4 }}>{item.location}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '100px 40px', background: C.bg }} id="rsvp">
        <div className="max-w-3xl mx-auto">
          <div style={{ background: C.bgWhite, padding: '48px 40px', borderRadius: 24,
            border: `1px solid ${C.primary}10`, boxShadow: `0 24px 60px ${C.primary}08` }}>
            <RSVPForm data={data} />
          </div>
        </div>
      </section>

      {/* DRESS CODE */}
      <section style={{ padding: '80px 40px', background: C.bgLow }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 40, color: C.primary, marginBottom: 12 }}>
            {data.dress_code_title}
          </h2>
          <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 20, color: C.textMuted, marginBottom: 32 }}>
            {data.dress_code_subtitle}
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-8">
            {data.dress_code_colors.map((color, i) => (
              <div key={i} style={{ width: 72, height: 72, borderRadius: 9999, background: color,
                border: `4px solid ${C.bgWhite}`, boxShadow: `0 4px 16px rgba(0,0,0,0.1)` }} />
            ))}
          </div>
          <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.textMuted }}>
            {data.dress_code_label}
          </p>
        </div>
      </section>

      {/* VENUE */}
      <section style={{ padding: '100px 40px', background: C.bg }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 48, color: C.primary }}>
                The Venue
              </h2>
              <div style={{ padding: 32, background: C.bgLow, borderRadius: 16, border: `1px solid ${C.primary}10` }}>
                <h3 style={{ fontFamily: "'Newsreader', serif", fontSize: 28, color: C.primary, marginBottom: 12 }}>
                  {data.venue_name}
                </h3>
                <p style={{ color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>{data.venue_address}</p>
                <div className="space-y-3">
                  {data.venue_parking && (
                    <div className="flex items-center gap-3" style={{ color: C.primary }}>
                      <span>🚗</span>
                      <span style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 14 }}>Secure valet parking available</span>
                    </div>
                  )}
                  {data.venue_accommodation && (
                    <div className="flex items-center gap-3" style={{ color: C.primary }}>
                      <span>🏨</span>
                      <span style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 14 }}>Accommodation bookings available</span>
                    </div>
                  )}
                </div>
                <a href={data.venue_map_url} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-block', marginTop: 20, padding: '10px 24px', border: `1px solid ${C.primary}30`,
                    color: C.primary, borderRadius: 9999, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
                  className="hover:bg-primary hover:text-white transition-all duration-500">
                  View Map
                </a>
              </div>
            </div>
            <div style={{ height: 400, borderRadius: 20, overflow: 'hidden', boxShadow: `0 24px 60px ${C.primary}12`, position: 'relative' }}>
              <img src={data.venue_image_url} alt={data.venue_name} className="w-full h-full object-cover" />
              <div style={{ position: 'absolute', inset: 0, background: `${C.primary}10`, mixBlendMode: 'overlay' }} />
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRY */}
      <section style={{ padding: '100px 40px', background: C.bgLow, position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div style={{ fontSize: 36, color: C.primary, opacity: 0.4, marginBottom: 16 }}>🎁</div>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 48, color: C.primary, marginBottom: 20 }}>
            Registry
          </h2>
          <p style={{ color: C.textMuted, fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
            {data.gifts_description}
          </p>
          <a href={data.gifts_url}
            style={{ display: 'inline-block', padding: '16px 48px', border: `1px solid ${C.primary}`,
              color: C.primary, borderRadius: 9999, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 20,
              textDecoration: 'none', transition: 'all 0.5s' }}
            className="hover:bg-primary hover:text-white">
            Honeymoon Fund
          </a>
        </div>
      </section>

      {/* CLOSING */}
      <section style={{ padding: '120px 40px', background: C.bgWhite, textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ fontSize: 48, color: C.primary, opacity: 0.2, marginBottom: 40 }}>∞</div>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic',
            fontSize: 'clamp(40px, 7vw, 80px)', color: C.primary, lineHeight: 1.2, whiteSpace: 'pre-line' }}>
            {data.closing_message}
          </h2>
          <div className="flex justify-center items-center gap-4 mt-16" style={{ color: `${C.primary}40` }}>
            <div style={{ width: 80, height: 1, background: 'currentColor' }} />
            <span style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 24 }}>
              {initials}
            </span>
            <div style={{ width: 80, height: 1, background: 'currentColor' }} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.bgLow, padding: '48px 40px', textAlign: 'center' }}
        className="flex flex-col items-center gap-5">
        <div style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 20, color: C.primary }}>
          {data.partner_name_1} & {data.partner_name_2}
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {[['#rsvp','RSVP Now'], ['#timeline','Timeline'], ['#venue','Venue']].map(([href, label]) => (
            <a key={href} href={href}
              style={{ color: C.primary, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                textDecoration: 'none' }}
              className="hover:opacity-60 transition-opacity">
              {label}
            </a>
          ))}
        </div>
        <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: `${C.primary}60`, marginTop: 8 }}>
          With love, {data.partner_name_1} & {data.partner_name_2} © 2026 · Momently
        </p>
      </footer>
    </div>
  );
}
