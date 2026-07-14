'use client';
import { useState, useEffect, useRef } from 'react';

const C = { black: '#0E0E0E', white: '#F4F2ED', line: 'rgba(244,242,237,.22)', lineD: 'rgba(14,14,14,.22)' };

interface ScheduleItem { time: string; title: string }
interface FaqItem { question: string; answer: string }
interface WeddingData {
  partner_name_1: string; partner_name_2: string;
  wedding_date: string; wedding_date_display?: string; location: string; slug: string;
  hero_image_url?: string; story_image_url?: string; story_bg_url?: string;
  footer_image_url?: string; venue_image_url?: string; rsvp_invite_image_url?: string;
  story_heading?: string; story_paragraph_1?: string; story_paragraph_2?: string;
  schedule?: ScheduleItem[];
  venue_name?: string; venue_address?: string; venue_description?: string; venue_directions_url?: string;
  dress_code_title?: string; dress_code_description?: string;
  faq?: FaqItem[]; rsvp_deadline?: string; closing_message?: string;
}

const DEMO: WeddingData = {
  partner_name_1: 'Аліса', partner_name_2: 'Данило',
  wedding_date: '2027-02-14T17:00:00+02:00', wedding_date_display: '14 . 02 . 27',
  location: 'Київ', slug: 'demo',
  hero_image_url: 'https://images.unsplash.com/photo-1563808599481-34a342e44508?auto=format&fit=crop&w=2000&q=80',
  story_image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
  story_bg_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
  footer_image_url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80',
  rsvp_invite_image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=2000&q=80',
  story_heading: 'Зима, місто і ми двоє — тепер офіційно.',
  story_paragraph_1: 'Ми познайомилися на виставці, посварилися через Ротко і помирилися за келихом просекко. Через п’ять зим Данило запитав — Аліса сказала «так» раніше, ніж він договорив.',
  schedule: [
    { time: '16:00', title: 'Збір гостей' },
    { time: '17:00', title: 'Церемонія' },
    { time: '18:00', title: 'Коктейлі та джаз' },
    { time: '20:00', title: 'Вечеря' },
    { time: '23:00', title: 'Танці до ранку' },
  ],
  venue_name: 'Хвильовий Хол', venue_address: 'вул. Набережно-Хрещатицька, Київ',
  venue_description: 'Паркінг на території. Дрес-код суворий: чорне, біле або обидва.',
  venue_directions_url: 'https://maps.google.com/?q=Kyiv+Podil',
  dress_code_title: 'Black tie', dress_code_description: 'Чорне, біле — і жодних компромісів.',
  faq: [
    { question: 'Чи можна з дітьми?', answer: 'Цей вечір — лише для дорослих. Дякуємо за розуміння.' },
    { question: 'Що подарувати?', answer: 'Ваша присутність — найкращий подарунок. Для рішучих — конверт.' },
    { question: 'До котрої відповісти?', answer: 'До 14 січня 2027. Відповідь можна змінити, відкривши сайт ще раз.' },
  ],
  rsvp_deadline: '14 січня 2027', closing_message: 'до зустрічі,',
};

export default function NoirTemplate({ data }: { data?: Partial<WeddingData> }) {
  const d: WeddingData = { ...DEMO, ...(data || {}) };
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [barOn, setBarOn] = useState(false);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(Math.max(0, Math.floor((new Date(d.wedding_date).getTime() - Date.now()) / 86400000)));
  }, [d.wedding_date]);

  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.14 });
    root.querySelectorAll('.rv').forEach(el => io.observe(el));
    let bio: IntersectionObserver | null = null;
    if (heroRef.current) {
      bio = new IntersectionObserver(es => setBarOn(!es[0].isIntersecting), { rootMargin: '-80px 0px 0px 0px' });
      bio.observe(heroRef.current);
    }
    return () => { io.disconnect(); bio?.disconnect(); };
  }, []);

  const dateDisplay = d.wedding_date_display ||
    new Date(d.wedding_date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\./g, ' . ');
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={rootRef} className="nr-root">
      <style>{NR_CSS}</style>

      <div className={'nr-bar' + (barOn ? ' on' : '')}>
        <button className="nr-mono" onClick={() => go('nr-top')}>{d.partner_name_1[0]}—{d.partner_name_2[0]}</button>
        <div className="nr-links">
          <button onClick={() => go('nr-story')}>Історія</button>
          <button onClick={() => go('nr-day')}>Вечір</button>
          <button onClick={() => go('nr-place')}>Деталі</button>
        </div>
        <button className="nr-cta" onClick={() => go('nr-rsvp')}>RSVP</button>
      </div>

      <header className="nr-hero" id="nr-top" ref={heroRef}>
        <div className="nr-hero-bg">{d.hero_image_url && <img src={d.hero_image_url} alt="" />}</div>
        <div className="nr-veil" />
        <div className="nr-hero-in">
          <p className="nr-eyebrow rv">запрошення на весілля</p>
          <h1 className="rv" style={{ transitionDelay: '.1s' }}>{d.partner_name_1}<span>×</span>{d.partner_name_2}</h1>
          <p className="nr-date rv" style={{ transitionDelay: '.2s' }}>{dateDisplay} — {d.location}</p>
          {days !== null && <p className="nr-count rv" style={{ transitionDelay: '.3s' }}>{days} днів до вечора</p>}
        </div>
      </header>

      <div className="nr-marquee" aria-hidden="true">
        <div className="nr-marq-in">
          {[0, 1].map(k => (
            <span key={k}>{d.partner_name_1} та {d.partner_name_2} — {dateDisplay} — {d.location} — </span>
          ))}
        </div>
      </div>

      <section className="nr-story" id="nr-story">
        <div className="nr-wrap nr-grid2">
          <div>
            <p className="nr-eyebrow rv">наша історія</p>
            {d.story_heading && <h2 className="rv" style={{ transitionDelay: '.08s' }}>{d.story_heading}</h2>}
            {d.story_paragraph_1 && <p className="nr-body rv" style={{ transitionDelay: '.16s' }}>{d.story_paragraph_1}</p>}
            {d.story_paragraph_2 && <p className="nr-body rv" style={{ transitionDelay: '.22s' }}>{d.story_paragraph_2}</p>}
          </div>
          <figure className="nr-ph rv" style={{ transitionDelay: '.1s' }}>
            {d.story_image_url && <img src={d.story_image_url} alt="" loading="lazy" />}
          </figure>
        </div>
      </section>

      {!!d.schedule?.length && (
        <section className="nr-day" id="nr-day">
          <div className="nr-wrap">
            <p className="nr-eyebrow rv">розклад вечора</p>
            <div className="nr-daylist">
              {d.schedule.map((s, i) => (
                <div key={i} className="nr-row rv" style={{ transitionDelay: `${i * 0.05}s` }}>
                  <span className="nr-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="nr-t">{s.time}</span>
                  <span className="nr-e">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="nr-details" id="nr-place">
        <div className="nr-wrap nr-grid2">
          {d.venue_name && (
            <div className="rv">
              <p className="nr-eyebrow">локація</p>
              <h3>{d.venue_name}</h3>
              <p className="nr-body">{d.venue_address}{d.venue_description ? '. ' + d.venue_description : ''}</p>
              {d.venue_directions_url && (
                <a className="nr-link" href={d.venue_directions_url} target="_blank" rel="noopener noreferrer">маршрут</a>
              )}
            </div>
          )}
          {d.dress_code_title && (
            <div className="rv" style={{ transitionDelay: '.1s' }}>
              <p className="nr-eyebrow">дрес-код</p>
              <h3>{d.dress_code_title}</h3>
              {d.dress_code_description && <p className="nr-body">{d.dress_code_description}</p>}
              <div className="nr-bw"><i style={{ background: '#0E0E0E' }} /><i style={{ background: '#F4F2ED', border: '1px solid ' + C.lineD }} /></div>
            </div>
          )}
        </div>
      </section>

      {!!d.faq?.length && (
        <section className="nr-faq-sec">
          <div className="nr-wrap">
            <p className="nr-eyebrow rv">питання</p>
            <div className="nr-faq rv">
              {d.faq.map((f, i) => (
                <details key={i}><summary>{f.question}<span className="nr-pl" /></summary><div className="nr-a">{f.answer}</div></details>
              ))}
            </div>
          </div>
        </section>
      )}

      <NoirRsvp d={d} />

      <footer className="nr-footer">
        <p className="nr-fs">{d.closing_message || 'до зустрічі,'}</p>
        <p className="nr-fn">{d.partner_name_1} та {d.partner_name_2}</p>
        <p className="nr-cred">створено на <a href="https://momently.co" target="_blank" rel="noopener noreferrer">momently.co</a></p>
      </footer>
    </div>
  );
}

function NoirRsvp({ d }: { d: WeddingData }) {
  const [status, setStatus] = useState<'form' | 'sending' | 'success' | 'error'>('form');
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [guests, setGuests] = useState('1 гість');
  const [wish, setWish] = useState('');

  const submit = async () => {
    if (!name.trim()) { setNameErr(true); return; }
    setStatus('sending');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          attendance: attending ? 'attending' : 'declined',
          dietary: wish.trim() || undefined,
          plus_one: attending && guests === '2 гості',
          wedding_slug: d.slug,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch { setStatus(d.slug === 'demo' ? 'success' : 'error'); }
  };

  return (
    <section className="nr-rsvp" id="nr-rsvp">
      <div className="nr-wrap nr-rsvp-in">
        <p className="nr-eyebrow">rsvp</p>
        <h2>Будете з нами?</h2>
        {d.rsvp_deadline && <p className="nr-dl">Відповідь — до {d.rsvp_deadline}.</p>}
        {status === 'success' ? (
          <div className="nr-done">
            <p className="nr-done-t">{attending ? `Дякуємо, ${name.trim()}.` : `Дякуємо за відповідь, ${name.trim()}.`}</p>
            <p className="nr-done-s">{attending ? 'Чекаємо на вас. Буде красиво.' : 'Шкода — але ви будете з нами подумки.'}</p>
          </div>
        ) : (
          <div className="nr-form">
            <label className="nr-f" htmlFor="nr-name">Ім’я та прізвище</label>
            <input id="nr-name" className={'nr-in' + (nameErr ? ' err' : '')} type="text" placeholder="Оксана Коваль"
              value={name} onChange={e => { setName(e.target.value); setNameErr(false); }} />
            <label className="nr-f">Присутність</label>
            <div className="nr-chips">
              <button type="button" className={'nr-chip' + (attending ? ' on' : '')} onClick={() => setAttending(true)}>Так, буду</button>
              <button type="button" className={'nr-chip' + (!attending ? ' on' : '')} onClick={() => setAttending(false)}>На жаль, ні</button>
            </div>
            {attending && (
              <div className="nr-two">
                <div>
                  <label className="nr-f" htmlFor="nr-guests">Гостей</label>
                  <select id="nr-guests" className="nr-in" value={guests} onChange={e => setGuests(e.target.value)}>
                    <option>1 гість</option><option>2 гості</option>
                  </select>
                </div>
                <div>
                  <label className="nr-f" htmlFor="nr-wish">Побажання</label>
                  <input id="nr-wish" className="nr-in" type="text" placeholder="без горіхів" value={wish} onChange={e => setWish(e.target.value)} />
                </div>
              </div>
            )}
            <button className="nr-send" onClick={submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Надсилаємо…' : 'Надіслати відповідь'}
            </button>
            {status === 'error' && <p className="nr-err">Не вдалося надіслати — спробуйте ще раз.</p>}
          </div>
        )}
      </div>
    </section>
  );
}

const NR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Prata&family=Golos+Text:wght@400;500&display=swap');
.nr-root{background:${C.black};color:${C.white};font-family:'Golos Text',system-ui,sans-serif;font-size:17px;line-height:1.8;-webkit-font-smoothing:antialiased}
.nr-root *{margin:0;padding:0;box-sizing:border-box}
.nr-root ::selection{background:${C.white};color:${C.black}}
.nr-root img{display:block;max-width:100%}
.nr-root button{font-family:inherit;background:none;border:none;cursor:pointer;color:inherit}
.nr-wrap{max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,56px)}
.nr-eyebrow{font-size:11px;letter-spacing:.34em;text-transform:uppercase;font-weight:500;opacity:.6;margin-bottom:18px}
.nr-bar{position:fixed;inset:0 0 auto 0;z-index:80;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:20px;padding:18px clamp(18px,4vw,44px);color:#fff;transition:background .5s,color .5s}
.nr-bar.on{background:${C.black};box-shadow:0 1px 0 ${C.line}}
.nr-mono{font-family:'Prata',serif;font-size:18px;letter-spacing:.1em}
.nr-links{display:flex;gap:clamp(14px,3vw,32px);justify-content:center}
.nr-links button{font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;opacity:.85}
.nr-cta{border:1px solid #fff;padding:11px 24px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;transition:background .3s,color .3s}
.nr-cta:hover{background:#fff;color:${C.black}}
@media (max-width:720px){.nr-links{display:none}}
.nr-hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden}
.nr-hero-bg{position:absolute;inset:0;background:#1a1a1a}
.nr-hero-bg img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.06);transform:scale(1.06);animation:nrZoom 3s cubic-bezier(.16,1,.3,1) forwards}
@keyframes nrZoom{to{transform:scale(1)}}
.nr-veil{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,10,.5),rgba(10,10,10,.2) 45%,rgba(10,10,10,.62))}
.nr-hero-in{position:relative;padding:120px 20px}
.nr-hero h1{font-family:'Prata',serif;font-weight:400;font-size:max(46px,9.4vw);line-height:1.05;white-space:nowrap;color:#fff}
.nr-hero h1 span{display:inline-block;margin:0 .18em;font-size:.42em;vertical-align:.42em;opacity:.75}
.nr-date{margin-top:22px;font-size:13px;letter-spacing:.5em;text-transform:uppercase;font-weight:500}
.nr-count{margin-top:12px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;opacity:.65}
@media (max-width:640px){.nr-hero h1{white-space:normal}}
.nr-marquee{overflow:hidden;border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};padding:16px 0}
.nr-marq-in{display:flex;width:max-content;animation:nrMarq 30s linear infinite;font-family:'Prata',serif;font-size:clamp(18px,2.6vw,26px);white-space:nowrap;opacity:.85}
@keyframes nrMarq{to{transform:translateX(-50%)}}
.nr-story{padding:clamp(90px,14vh,150px) 0}
.nr-grid2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,84px);align-items:center}
.nr-story h2{font-family:'Prata',serif;font-weight:400;font-size:clamp(28px,3.8vw,44px);line-height:1.25;margin-bottom:22px}
.nr-body{opacity:.82;max-width:52ch;margin-bottom:12px}
.nr-ph{aspect-ratio:3/4;overflow:hidden;background:#1a1a1a}
.nr-ph img{width:100%;height:100%;object-fit:cover;filter:grayscale(1);transition:filter .9s cubic-bezier(.16,1,.3,1)}
.nr-ph:hover img{filter:grayscale(0)}
@media (max-width:820px){.nr-grid2{grid-template-columns:1fr}}
.nr-day{background:${C.white};color:${C.black};padding:clamp(90px,14vh,150px) 0}
.nr-day .nr-eyebrow{opacity:.5}
.nr-daylist{max-width:760px}
.nr-row{display:flex;align-items:baseline;gap:clamp(20px,4vw,48px);padding:24px 0;border-top:1px solid ${C.lineD}}
.nr-row:last-child{border-bottom:1px solid ${C.lineD}}
.nr-n{font-size:11px;letter-spacing:.2em;opacity:.45;min-width:2em}
.nr-t{font-family:'Prata',serif;font-size:clamp(26px,4vw,40px);min-width:2.9em}
.nr-e{font-size:16px;opacity:.85}
.nr-details{padding:clamp(90px,14vh,150px) 0;border-top:1px solid ${C.line}}
.nr-details h3{font-family:'Prata',serif;font-weight:400;font-size:clamp(28px,4vw,44px);margin-bottom:14px}
.nr-link{display:inline-block;margin-top:18px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;font-weight:500;color:${C.white};text-decoration:none;border-bottom:1px solid ${C.white};padding-bottom:5px}
.nr-bw{display:flex;gap:12px;margin-top:22px}
.nr-bw i{width:56px;height:56px;border-radius:50%}
.nr-faq-sec{padding:0 0 clamp(90px,14vh,150px)}
.nr-faq{max-width:640px}
.nr-faq details{border-top:1px solid ${C.line}}
.nr-faq details:last-child{border-bottom:1px solid ${C.line}}
.nr-faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 0;font-family:'Prata',serif;font-size:clamp(17px,2.3vw,21px)}
.nr-faq summary::-webkit-details-marker{display:none}
.nr-pl{position:relative;width:13px;height:13px;flex:none;transition:transform .4s}
.nr-pl::before,.nr-pl::after{content:"";position:absolute;background:${C.white}}
.nr-pl::before{left:0;top:6px;width:13px;height:1px}
.nr-pl::after{left:6px;top:0;width:1px;height:13px}
.nr-faq details[open] .nr-pl{transform:rotate(45deg)}
.nr-a{padding:0 0 22px;opacity:.8;max-width:56ch}
.nr-rsvp{background:${C.white};color:${C.black};padding:clamp(90px,14vh,150px) 0}
.nr-rsvp-in{max-width:640px}
.nr-rsvp .nr-eyebrow{opacity:.5}
.nr-rsvp h2{font-family:'Prata',serif;font-weight:400;font-size:clamp(32px,5vw,52px)}
.nr-dl{margin:12px 0 34px;font-size:14px;opacity:.65}
.nr-f{display:block;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;opacity:.55;margin:24px 0 2px}
.nr-in{width:100%;background:transparent;border:0;border-bottom:1px solid ${C.lineD};border-radius:0;padding:12px 2px;font:inherit;color:${C.black};transition:border-color .35s}
.nr-in:focus{outline:none;border-bottom-color:${C.black}}
.nr-in.err{border-bottom-color:#A33B2B}
.nr-in::placeholder{color:rgba(14,14,14,.35)}
.nr-chips{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}
.nr-chip{font-weight:500;font-size:11px;letter-spacing:.26em;text-transform:uppercase;padding:14px 24px;border:1px solid ${C.lineD};transition:all .3s}
.nr-chip.on{background:${C.black};border-color:${C.black};color:${C.white}}
.nr-two{display:grid;grid-template-columns:1fr 1fr;gap:26px}
@media (max-width:640px){.nr-two{grid-template-columns:1fr}}
.nr-send{margin-top:38px;font-weight:500;font-size:11px;letter-spacing:.3em;text-transform:uppercase;padding:18px 42px;background:${C.black};color:${C.white};border:1px solid ${C.black};transition:opacity .3s}
.nr-send:hover{opacity:.85}
.nr-send:disabled{opacity:.5;cursor:default}
.nr-err{margin-top:14px;font-size:13px;color:#A33B2B}
.nr-done-t{font-family:'Prata',serif;font-size:clamp(24px,3.4vw,34px)}
.nr-done-s{margin-top:10px;opacity:.75}
.nr-footer{text-align:center;padding:70px 20px 56px;border-top:1px solid ${C.line}}
.nr-fs{font-family:'Prata',serif;font-style:italic;font-size:18px;opacity:.7}
.nr-fn{font-family:'Prata',serif;font-size:24px;letter-spacing:.08em;margin-top:8px}
.nr-cred{margin-top:26px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;opacity:.45}
.nr-cred a{color:inherit;text-decoration:none;border-bottom:1px solid ${C.line};padding-bottom:3px}
.nr-root .rv{opacity:0;transform:translateY(24px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
.nr-root .rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.nr-root .rv{opacity:1;transform:none;transition:none}.nr-hero-bg img{animation:none;transform:none}.nr-marq-in{animation:none}}
`;
