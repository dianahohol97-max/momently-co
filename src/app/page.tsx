'use client';
import Link from 'next/link';

const templates = [
  { name: 'Golden Elegance', slug: 'golden-hour', cat: 'Cream & Gold', bg: '#FAF7F2', text: '#2C2420', accent: '#B8956A', names: 'Olivia & Noah', font: 'Cormorant Garamond' },
  { name: 'Old Money', slug: 'midnight-elegance', cat: 'Dark Luxe', bg: '#0F0F0F', text: '#F5F0E8', accent: '#B8956A', names: 'Olivia & Noah', font: 'Playfair Display' },
  { name: 'Burgundy Romance', slug: 'botanical-garden', cat: 'Wine & Rose', bg: '#1A0F10', text: '#F2E8E0', accent: '#C4786E', names: 'Olivia & Noah', font: 'Playfair Display' },
  { name: 'Lavender Dream', slug: 'lavender-dream', cat: 'Soft Pastel', bg: '#F8F4F9', text: '#3A2E3E', accent: '#9B7BA8', names: 'Olivia & Noah', font: 'Cormorant Garamond' },
  { name: 'Cream Elegance', slug: 'modern-minimal', cat: 'UA Classic', bg: '#FAF7F2', text: '#2C2420', accent: '#B8956A', names: 'Вікторія & Андрій', font: 'Cormorant Garamond' },
  { name: 'Emerald Garden', slug: 'emerald-garden', cat: 'Nature Green', bg: '#F5F8F2', text: '#2D3A2D', accent: '#5B7F5B', names: 'Вікторія & Андрій', font: 'Cormorant Garamond' },
  { name: 'Noir Gold', slug: 'noir-gold', cat: 'Black & Gold', bg: '#0A0A0A', text: '#F0ECE0', accent: '#C9A84C', names: 'Olivia & Noah', font: 'Playfair Display' },
];

function IPhoneFrame({ t }: { t: typeof templates[0] }) {
  return (
    <div style={{ position: 'relative', width: 220, flexShrink: 0 }}>
      {/* iPhone outer shell */}
      <div style={{ background: '#1a1a1a', borderRadius: 32, padding: '12px 8px', boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)' }}>
        {/* Notch */}
        <div style={{ width: 80, height: 20, background: '#1a1a1a', borderRadius: '0 0 16px 16px', margin: '0 auto 4px', position: 'relative', zIndex: 2 }} />
        {/* Screen */}
        <div style={{ background: t.bg, borderRadius: 20, overflow: 'hidden', height: 380 }}>
          {/* Mini template preview */}
          <div style={{ padding: '40px 16px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ width: 32, height: 1, background: t.accent, marginBottom: 16 }} />
            <p style={{ fontSize: 6, textTransform: 'uppercase', letterSpacing: '0.3em', color: t.accent, marginBottom: 8 }}>We invite you</p>
            <h3 style={{ fontFamily: "'" + t.font + "', serif", fontSize: 22, fontWeight: 300, color: t.text, lineHeight: 1.2 }}>
              {t.names.split(' & ')[0]}
            </h3>
            <p style={{ fontFamily: "'" + t.font + "', serif", fontSize: 16, fontStyle: 'italic', color: t.accent, margin: '4px 0' }}>&amp;</p>
            <h3 style={{ fontFamily: "'" + t.font + "', serif", fontSize: 22, fontWeight: 300, color: t.text, lineHeight: 1.2 }}>
              {t.names.split(' & ')[1]}
            </h3>
            <div style={{ width: 32, height: 1, background: t.accent, margin: '16px 0 12px' }} />
            <p style={{ fontSize: 7, color: t.accent, fontFamily: "'" + t.font + "', serif" }}>12.09.2026</p>
            {/* Mini sections preview */}
            <div style={{ marginTop: 20, width: '100%' }}>
              <div style={{ height: 1, width: 1, background: t.accent, margin: '0 auto 12px', opacity: 0.3 }} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                {['142', '08', '34'].map((n, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'" + t.font + "', serif", fontSize: 14, color: t.text }}>{n}</div>
                    <div style={{ fontSize: 5, textTransform: 'uppercase', letterSpacing: '0.1em', color: t.accent }}>{['days', 'hrs', 'min'][i]}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 4 }}>
                {[t.bg, t.accent, t.text].map((c, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: c, border: '1px solid ' + t.accent + '33' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ width: 60, height: 4, background: '#333', borderRadius: 2, margin: '8px auto 4px' }} />
      </div>
      {/* Template name below */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: '#2C2420', fontFamily: "'Cormorant Garamond', serif" }}>{t.name}</h4>
        <p style={{ fontSize: 11, color: '#8A7B6B', marginTop: 2 }}>{t.cat}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#2C2420', background: '#FDFAF6' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', border: '1px solid #E8DDD4', opacity: 0.4 }} />
        <div style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: '50%', border: '1px solid #E8DDD4', opacity: 0.3 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B8956A', marginBottom: 24 }}>Momently</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, lineHeight: 1.15, color: '#2C2420', maxWidth: 700, margin: '0 auto' }}>
            Digital Wedding<br />
            <span style={{ fontStyle: 'italic', color: '#B8956A' }}>Invitations</span>
          </h1>
          <p style={{ fontSize: 15, color: '#8A7B6B', marginTop: 24, maxWidth: 480, margin: '24px auto 0', lineHeight: 1.8 }}>
            Beautiful digital invitations with countdown, RSVP, guest camera, photo booth and more. All in one link.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}>
            <Link href="/templates" style={{ padding: '16px 40px', background: '#B8956A', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em' }}>
              Browse Templates
            </Link>
            <Link href="/pricing" style={{ padding: '16px 40px', border: '1px solid #D4C5B0', color: '#2C2420', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              Pricing
            </Link>
          </div>
          <p style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#B8956A', marginTop: 16 }}>599 &#8372;</p>
        </div>
      </section>

      {/* Templates Carousel in iPhone Frames */}
      <section style={{ padding: '80px 0', background: '#F5F0EA' }}>
        <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 24px' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B8956A', marginBottom: 12 }}>Our Collection</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#2C2420' }}>Wedding Templates</h2>
        </div>
        <div style={{ display: 'flex', gap: 32, overflow: 'auto', padding: '0 48px 32px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {templates.map(t => (
            <Link key={t.slug} href={'/templates/' + t.slug} style={{ textDecoration: 'none', color: 'inherit', scrollSnapAlign: 'center' }}>
              <IPhoneFrame t={t} />
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B8956A', marginBottom: 12 }}>Everything You Need</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#2C2420', marginBottom: 60 }}>6 Modules in One</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: '\u2709\ufe0f', title: 'Digital Invitation', desc: 'Beautiful personalized wedding page with countdown, venue, timeline and all details' },
            { icon: '\ud83d\udcf8', title: 'Guest Camera', desc: 'Guests upload photos directly to your gallery during the celebration' },
            { icon: '\ud83c\udfad', title: 'Photo Booth', desc: '6 filters, 4 frames — fun photos for your guests with instant download' },
            { icon: '\ud83d\udcd6', title: 'Guestbook', desc: 'Digital wishes from your guests — save them forever' },
            { icon: '\u2709\ufe0f', title: 'RSVP System', desc: 'Guests confirm attendance online. Track responses in your dashboard' },
            { icon: '\ud83c\udfac', title: 'Memory Film', desc: 'Auto-generated slideshow from guest photos — a beautiful keepsake' },
          ].map((f, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 16, border: '1px solid #E8E0D4', background: '#FDFAF6', textAlign: 'left' }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#8A7B6B', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '100px 24px', background: '#F5F0EA', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B8956A', marginBottom: 12 }}>Simple Process</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#2C2420', marginBottom: 60 }}>3 Easy Steps</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', maxWidth: 800, margin: '0 auto' }}>
          {[
            { n: '01', t: 'Choose Template', d: 'Pick from our collection of beautiful designs' },
            { n: '02', t: 'Customize', d: 'Add your names, date, venue, photos and details' },
            { n: '03', t: 'Share', d: 'Send a link to your guests via any messenger' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', maxWidth: 200 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: '#B8956A', marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.t}</h3>
              <p style={{ fontSize: 13, color: '#8A7B6B', lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ width: 48, height: 1, background: '#B8956A', margin: '0 auto 32px' }} />
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: '#2C2420', marginBottom: 16 }}>
          Ready to Create<br /><span style={{ fontStyle: 'italic', color: '#B8956A' }}>Your Invitation?</span>
        </h2>
        <p style={{ fontSize: 14, color: '#8A7B6B', marginBottom: 32 }}>All 6 modules included. One price. Unlimited guests.</p>
        <Link href="/templates" style={{ display: 'inline-block', padding: '18px 48px', background: '#B8956A', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500, letterSpacing: '0.05em' }}>
          Get Started — 599 &#8372;
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '48px 24px', borderTop: '1px solid #E8E0D4', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#B8956A' }}>Momently</p>
        <p style={{ fontSize: 12, color: '#8A7B6B', marginTop: 8 }}>Digital Wedding Experience Platform</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <Link href="/templates" style={{ fontSize: 12, color: '#8A7B6B', textDecoration: 'none' }}>Templates</Link>
          <Link href="/pricing" style={{ fontSize: 12, color: '#8A7B6B', textDecoration: 'none' }}>Pricing</Link>
          <Link href="/blog" style={{ fontSize: 12, color: '#8A7B6B', textDecoration: 'none' }}>Blog</Link>
        </div>
      </footer>
    </div>
  );
}
