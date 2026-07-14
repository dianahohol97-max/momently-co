'use client';
import { useState, useEffect, useRef } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

// ─── LE VOYAGE — destination wedding template ─────────────
const C = { paper: '#F6F1E6', ink: '#20304A', red: '#B23A2E', sky: '#8FA6BC', line: 'rgba(32,48,74,.25)' };

interface EventItem { date_time: string; title: string; location: string; description?: string }
interface FaqItem { question: string; answer: string }
interface WeddingData {
  locale?: string;
  partner_name_1: string; partner_name_2: string;
  wedding_date: string; wedding_date_display?: string; location: string; slug: string;
  hero_image_url?: string; story_image_url?: string; rsvp_invite_image_url?: string;
  story_heading?: string; story_paragraph_1?: string; story_paragraph_2?: string;
  route_cities?: string[];
  events?: EventItem[];
  venue_name?: string; venue_city?: string; venue_address?: string;
  venue_description?: string; venue_directions_url?: string;
  transport_description?: string;
  gallery_images?: string[];
  faq?: FaqItem[]; rsvp_deadline?: string; closing_message?: string;
}

const DEMO: WeddingData = {
  partner_name_1: 'Марта', partner_name_2: 'Богдан',
  wedding_date: '2026-09-14T15:30:00+02:00', wedding_date_display: '14 . 09 . 26',
  location: 'озеро Комо, Італія', slug: 'demo',
  hero_image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=2000&q=80',
  story_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  rsvp_invite_image_url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=2000&q=80',
  story_heading: 'Три міста, одна історія — і квиток в один кінець.',
  story_paragraph_1: 'Все почалося у Барселоні: випадкова зустріч у тапас-барі, яка не мала жодних шансів стати випадковою. Потім була Флоренція — і обіцянка, сказана пошепки над Арно.',
  story_paragraph_2: 'Тепер — Комо. Ми зібрали валізи, надрукували талони і залишили два місця для кожного з вас. Реєстрація на рейс відкрита.',
  route_cities: ['Барселона', 'Флоренція', 'Комо'],
  events: [
    { date_time: '13.09 · 19:00', title: 'Вітальні коктейлі', location: 'Тераса вілли Бальб’янелло', description: 'Аперитиви, жива музика і перші тости над озером.' },
    { date_time: '14.09 · 15:30', title: 'Церемонія', location: 'Сади вілли дель Бальб’янелло', description: 'Обітниці серед столітніх садів і шампанське на лоджії.' },
    { date_time: '15.09 · 11:00', title: 'Прощальний бранч', location: 'Гранд-готель Тремеццо', description: 'Просеко, випічка і неспішні прощання.' },
  ],
  venue_name: 'Вілла дель Бальб’янелло', venue_city: 'Комо',
  venue_address: 'Via Comoedia 5, Lenno, Італія',
  venue_description: 'Місце позачасової елегантності на мисі над озером — те саме, з листівок.',
  venue_directions_url: 'https://maps.google.com/?q=Villa+del+Balbianello',
  transport_description: 'Аеропорти: Мілан Мальпенса (MXP) або Бергамо (BGY). Далі — потяг Malpensa Express до Como Lago або трансфер від нашого консьєржа. У день церемонії — приватні водні таксі від Тремеццо.',
  gallery_images: [
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
  ],
  faq: [
    { question: 'Чи можна прийти з парою?', answer: 'Через камерність вілли — лише гості, названі в запрошенні. Питання — пишіть нам особисто.' },
    { question: 'Де зупинитися?', answer: 'Ми забронювали блок номерів у Гранд-готелі Тремеццо за кодом MARTA-BOHDAN. Поруч є агротуризми — надішлемо список.' },
    { question: 'Яка погода у вересні?', answer: 'Тепло вдень, свіжо ввечері біля води — легкий жакет стане в пригоді.' },
  ],
  rsvp_deadline: '1 липня 2026', closing_message: 'до зустрічі на борту,',
};

export default function TheModernHeirloomTemplate({ data }: { data?: Partial<WeddingData> }) {
  const d: WeddingData = { ...DEMO, ...(data || {}) };
  const L = normalizeLocale(d.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
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
    root.querySelectorAll('.rv, .lv-route').forEach(el => io.observe(el));
    let bio: IntersectionObserver | null = null;
    if (heroRef.current) {
      bio = new IntersectionObserver(es => setBarOn(!es[0].isIntersecting), { rootMargin: '-80px 0px 0px 0px' });
      bio.observe(heroRef.current);
    }
    return () => { io.disconnect(); bio?.disconnect(); };
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const dateDisplay = d.wedding_date_display ||
    new Date(d.wedding_date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\./g, ' . ');
  const cities = d.route_cities?.length ? d.route_cities : [d.location];

  return (
    <div ref={rootRef} className="lv-root">
      <style>{LV_CSS}</style>

      <div className={'lv-bar' + (barOn ? ' on' : '')}>
        <button className="lv-mono" onClick={() => go('lv-top')}>{d.partner_name_1[0]}—{d.partner_name_2[0]} · {dateDisplay.replace(/ /g, '')}</button>
        <div className="lv-links">
          <button onClick={() => go('lv-story')}>{t('navStory')}</button>
          <button onClick={() => go('lv-days')}>{t('navSchedule')}</button>
          <button onClick={() => go('lv-place')}>{t('navDetails')}</button>
        </div>
        <button className="lv-cta" onClick={() => go('lv-rsvp')}>RSVP</button>
      </div>

      <header className="lv-hero" id="lv-top" ref={heroRef}>
        <div className="lv-hero-bg">{d.hero_image_url && <img src={d.hero_image_url} alt="" />}</div>
        <div className="lv-veil" />
        <div className="lv-hero-in">
          <p className="lv-caps rv">{t('inviteCaps')}</p>
          <h1 className="rv" style={{ transitionDelay: '.1s' }}>{d.partner_name_1}<em> {t('and')} </em>{d.partner_name_2}</h1>
          <p className="lv-loc rv" style={{ transitionDelay: '.2s' }}>{d.location}</p>
          {days !== null && <p className="lv-count rv" style={{ transitionDelay: '.28s' }}>{t('daysTo', { n: days })}</p>}
        </div>
        <div className="lv-stamp rv" style={{ transitionDelay: '.4s' }} aria-hidden="true">
          <svg viewBox="0 0 140 140" width="128" height="128">
            <circle cx="70" cy="70" r="64" fill="none" stroke="#F6F1E6" strokeWidth="2" strokeDasharray="4 5" />
            <circle cx="70" cy="70" r="50" fill="none" stroke="#F6F1E6" strokeWidth="1" />
            <text x="70" y="60" textAnchor="middle" fill="#F6F1E6" fontSize="15" fontFamily="'IBM Plex Mono', monospace">{dateDisplay.replace(/ /g, '')}</text>
            <text x="70" y="84" textAnchor="middle" fill="#F6F1E6" fontSize="12" letterSpacing="2" fontFamily="'IBM Plex Mono', monospace">{(d.venue_city || d.location).toUpperCase().slice(0, 12)}</text>
          </svg>
        </div>
      </header>

      <div className="lv-routebar" aria-hidden="true">
        {cities.map((c, i) => (
          <span key={c}>{i > 0 && <i className="lv-dash" />}<b>{c}</b></span>
        ))}
      </div>

      <section className="lv-story" id="lv-story">
        <div className="lv-wrap lv-grid2">
          <figure className="lv-ph rv">
            {d.story_image_url && <img src={d.story_image_url} alt="" loading="lazy" />}
            <figcaption className="lv-phcap">{cities[0]} → {cities[cities.length - 1]}</figcaption>
          </figure>
          <div>
            <p className="lv-caps lv-red rv">{t('storyA')} {t('storyB')}</p>
            {d.story_heading && <h2 className="rv" style={{ transitionDelay: '.08s' }}>{d.story_heading}</h2>}
            {d.story_paragraph_1 && <p className="lv-body rv" style={{ transitionDelay: '.16s' }}>{d.story_paragraph_1}</p>}
            {d.story_paragraph_2 && <p className="lv-body rv" style={{ transitionDelay: '.22s' }}>{d.story_paragraph_2}</p>}
            {cities.length > 1 && (
              <svg className="lv-route" viewBox="0 0 400 70" width="100%" aria-hidden="true">
                <path className="lv-route-line" pathLength="1" d={`M12 40 ${cities.map((_, i) => `L ${12 + (376 / (cities.length - 1)) * i} 40`).join(' ')}`} />
                {cities.map((c, i) => {
                  const x = 12 + (376 / (cities.length - 1)) * i;
                  return (
                    <g key={c}>
                      <circle cx={x} cy="40" r={i === cities.length - 1 ? 6 : 4} fill={i === cities.length - 1 ? C.red : C.ink} />
                      <text x={x} y="18" textAnchor={i === 0 ? 'start' : i === cities.length - 1 ? 'end' : 'middle'} fontSize="12" fill={C.ink} fontFamily="'IBM Plex Mono', monospace">{c.toUpperCase()}</text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </div>
      </section>

      {!!d.events?.length && (
        <section className="lv-days" id="lv-days">
          <div className="lv-wrap">
            <p className="lv-caps lv-red lv-center rv">{t('weekendLabel')}</p>
            <h3 className="lv-h rv" style={{ transitionDelay: '.06s' }}>{t('scheduleTitle')}</h3>
            <div className="lv-tickets">
              {d.events.map((ev, i) => (
                <article key={i} className="lv-ticket rv" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="lv-tk-main">
                    <p className="lv-tk-no">{String(i + 1).padStart(2, '0')} / {String(d.events!.length).padStart(2, '0')}</p>
                    <h4>{ev.title}</h4>
                    <p className="lv-tk-loc">{ev.location}</p>
                    {ev.description && <p className="lv-tk-desc">{ev.description}</p>}
                  </div>
                  <div className="lv-tk-stub">
                    <p className="lv-tk-time">{ev.date_time}</p>
                    <div className="lv-barcode" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="lv-place" id="lv-place">
        <div className="lv-wrap lv-grid2">
          <div className="rv">
            <p className="lv-caps lv-red">{t('locationLabel')}</p>
            <h3>{d.venue_name}</h3>
            <p className="lv-body">{d.venue_address}{d.venue_description ? '. ' + d.venue_description : ''}</p>
            {d.venue_directions_url && d.venue_directions_url !== '#' && (
              <a className="lv-link" href={d.venue_directions_url} target="_blank" rel="noopener noreferrer">{t('routeBtn')}</a>
            )}
          </div>
          {d.transport_description && (
            <div className="rv" style={{ transitionDelay: '.1s' }}>
              <p className="lv-caps lv-red">{t('transportLabel')}</p>
              <h3>MXP → COMO</h3>
              <p className="lv-body">{d.transport_description}</p>
            </div>
          )}
        </div>
      </section>

      {!!d.gallery_images?.length && (
        <section className="lv-gal">
          <div className="lv-wrap lv-gal-grid">
            {d.gallery_images.slice(0, 3).map((src, i) => (
              <figure key={src} className="rv" style={{ transitionDelay: `${i * 0.1}s` }}>
                <img src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      )}

      {!!d.faq?.length && (
        <section className="lv-faqsec">
          <div className="lv-wrap">
            <p className="lv-caps lv-red lv-center rv">{t('usefulLabel')}</p>
            <h3 className="lv-h rv" style={{ transitionDelay: '.06s' }}>{t('faqTitle')}</h3>
            <div className="lv-faq rv" style={{ transitionDelay: '.12s' }}>
              {d.faq.map((f, i) => (
                <details key={i}><summary>{f.question}<span className="lv-pl" /></summary><div className="lv-a">{f.answer}</div></details>
              ))}
            </div>
          </div>
        </section>
      )}

      <VoyageRsvp d={d} t={t} cities={cities} dateDisplay={dateDisplay} />

      <footer className="lv-footer">
        <p className="lv-fs">{d.closing_message || ''}</p>
        <p className="lv-fn">{d.partner_name_1} {t('and')} {d.partner_name_2}</p>
        <p className="lv-cred">{t('createdOn')} <a href="https://momently.co" target="_blank" rel="noopener noreferrer">momently.co</a></p>
      </footer>
    </div>
  );
}

// ─── RSVP: guest boarding pass ────────────────────────────
function VoyageRsvp({ d, t, cities, dateDisplay }: {
  d: WeddingData; t: (k: string, v?: Record<string, string | number>) => string;
  cities: string[]; dateDisplay: string;
}) {
  const [status, setStatus] = useState<'form' | 'sending' | 'success' | 'error'>('form');
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [guests, setGuests] = useState(t('guest1'));
  const [meal, setMeal] = useState(t('menuRegular'));
  const [wish, setWish] = useState('');
  const [song, setSong] = useState('');

  const submit = async () => {
    if (!name.trim()) { setNameErr(true); return; }
    setStatus('sending');
    const dietary = [
      attending ? t('menuWord') + ': ' + meal : '',
      wish.trim() ? t('wishesWord') + ': ' + wish.trim() : '',
      song.trim() ? t('songWord') + ': ' + song.trim() : '',
    ].filter(Boolean).join(' · ') || undefined;
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          attendance: attending ? 'attending' : 'declined',
          dietary,
          plus_one: attending && guests === t('guest2'),
          wedding_slug: d.slug,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch { setStatus(d.slug === 'demo' ? 'success' : 'error'); }
  };

  const from = (cities[0] || '').toUpperCase().slice(0, 3);
  const to = (cities[cities.length - 1] || d.location).toUpperCase().slice(0, 4);

  return (
    <section className="lv-rsvpband" id="lv-rsvp">
      <div className="lv-rsvp-bg">{d.rsvp_invite_image_url && <img src={d.rsvp_invite_image_url} alt="" loading="lazy" />}</div>
      <div className="lv-veil" />
      <div className="lv-pass">
        <div className="lv-pass-head">
          <span>{t('boardingPass')}</span>
          <span className="lv-pass-route">{from} ✈ {to}</span>
        </div>

        {status === 'success' ? (
          <div className="lv-done">
            <p className="lv-done-t">{attending ? t('thanksYes', { name: name.trim() }) : t('thanksNo', { name: name.trim() })}</p>
            <p className="lv-done-s">{attending ? t('waitingFor', { guests, menu: meal }) : t('thanksNoSub')}</p>
            <div className={'lv-okstamp' + (attending ? '' : ' no')} aria-hidden="true">
              <span>{attending ? 'RSVP · OK' : 'RSVP'}</span>
              <small>{dateDisplay.replace(/ /g, '')}</small>
            </div>
          </div>
        ) : (
          <div className="lv-pass-body">
            <div className="lv-f-block">
              <label className="lv-f" htmlFor="lv-name">{t('passenger')}</label>
              <input id="lv-name" className={'lv-in' + (nameErr ? ' err' : '')} type="text" autoComplete="name"
                placeholder={t('namePlaceholder')} value={name}
                onChange={e => { setName(e.target.value); setNameErr(false); }} />
            </div>
            <div className="lv-f-block">
              <label className="lv-f">{t('presenceLabel')}</label>
              <div className="lv-chips">
                <button type="button" className={'lv-chip' + (attending ? ' on' : '')} onClick={() => setAttending(true)}>{t('yes')}</button>
                <button type="button" className={'lv-chip' + (!attending ? ' on' : '')} onClick={() => setAttending(false)}>{t('no')}</button>
              </div>
            </div>
            {attending && (
              <div className="lv-two">
                <div className="lv-f-block">
                  <label className="lv-f" htmlFor="lv-guests">{t('guestsLabel')}</label>
                  <select id="lv-guests" className="lv-in" value={guests} onChange={e => setGuests(e.target.value)}>
                    <option>{t('guest1')}</option><option>{t('guest2')}</option>
                  </select>
                </div>
                <div className="lv-f-block">
                  <label className="lv-f" htmlFor="lv-meal">{t('menuLabel')}</label>
                  <select id="lv-meal" className="lv-in" value={meal} onChange={e => setMeal(e.target.value)}>
                    <option>{t('menuRegular')}</option><option>{t('menuVeg')}</option><option>{t('menuKids')}</option>
                  </select>
                </div>
              </div>
            )}
            {attending && (
              <div className="lv-two">
                <div className="lv-f-block">
                  <label className="lv-f" htmlFor="lv-wish">{t('wishesLabel')}</label>
                  <input id="lv-wish" className="lv-in" type="text" placeholder={t('wishesPlaceholder')} value={wish} onChange={e => setWish(e.target.value)} />
                </div>
                <div className="lv-f-block">
                  <label className="lv-f" htmlFor="lv-song">{t('songLabel')}</label>
                  <input id="lv-song" className="lv-in" type="text" placeholder={t('songPlaceholder')} value={song} onChange={e => setSong(e.target.value)} />
                </div>
              </div>
            )}
            <div className="lv-send">
              <button className="lv-btn" onClick={submit} disabled={status === 'sending'}>
                {status === 'sending' ? t('sending') : t('submit')}
              </button>
              {d.rsvp_deadline && <p className="lv-note">{t('rsvpDeadline', { date: d.rsvp_deadline })}</p>}
              {status === 'error' && <p className="lv-errm">{t('errSend')}</p>}
            </div>
            <div className="lv-barcode lv-pass-code" aria-hidden="true" />
          </div>
        )}
      </div>
    </section>
  );
}

const LV_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oranienbaum&family=IBM+Plex+Mono:wght@400;500&family=Golos+Text:wght@400;500&display=swap');
.lv-root{background:${C.paper};color:${C.ink};font-family:'Golos Text',system-ui,sans-serif;font-size:17px;line-height:1.8;-webkit-font-smoothing:antialiased}
.lv-root *{margin:0;padding:0;box-sizing:border-box}
.lv-root ::selection{background:${C.red};color:#fff}
.lv-root img{display:block;max-width:100%}
.lv-root button{font-family:inherit;background:none;border:none;cursor:pointer;color:inherit}
.lv-wrap{max-width:1140px;margin:0 auto;padding:0 clamp(20px,5vw,56px)}
.lv-caps{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.26em;text-transform:uppercase;font-weight:500}
.lv-red{color:${C.red}}
.lv-center{display:block;text-align:center}
.lv-bar{position:fixed;inset:0 0 auto 0;z-index:80;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:18px;padding:16px clamp(18px,4vw,44px);color:#fff;transition:background .5s,color .5s,box-shadow .5s}
.lv-bar.on{background:${C.paper};color:${C.ink};box-shadow:0 1px 0 ${C.line}}
.lv-mono{font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:.14em}
.lv-links{display:flex;gap:clamp(14px,3vw,30px);justify-content:center}
.lv-links button{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.22em;text-transform:uppercase;opacity:.9}
.lv-cta{border:1px solid currentColor;padding:10px 22px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.24em}
@media (max-width:720px){.lv-links{display:none}}
.lv-hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;color:#fff}
.lv-hero-bg{position:absolute;inset:0;background:#2A3A50}
.lv-hero-bg img{width:100%;height:100%;object-fit:cover;transform:scale(1.06);animation:lvZoom 3s cubic-bezier(.16,1,.3,1) forwards}
@keyframes lvZoom{to{transform:scale(1)}}
.lv-veil{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(18,26,40,.45),rgba(18,26,40,.15) 42%,rgba(18,26,40,.55))}
.lv-hero-in{position:relative;padding:120px 20px}
.lv-hero h1{font-family:'Oranienbaum',Georgia,serif;font-weight:400;font-size:max(50px,10.4vw);line-height:1.02;white-space:nowrap;margin:18px 0 20px;text-shadow:0 2px 28px rgba(0,0,0,.2)}
.lv-hero h1 em{font-style:italic;font-size:.42em;vertical-align:.34em;opacity:.85}
.lv-loc{font-family:'IBM Plex Mono',monospace;font-size:14px;letter-spacing:.3em;text-transform:uppercase}
.lv-count{margin-top:12px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.24em;text-transform:uppercase;opacity:.8}
.lv-stamp{position:absolute;right:clamp(16px,6vw,72px);bottom:clamp(20px,7vh,64px);transform:rotate(9deg);opacity:.92}
@media (max-width:640px){.lv-hero h1{white-space:normal}.lv-stamp{display:none}}
.lv-routebar{display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap;padding:18px 16px;border-bottom:1px solid ${C.line};font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:.22em;text-transform:uppercase}
.lv-routebar span{display:flex;align-items:center;gap:14px}
.lv-dash{display:inline-block;width:44px;height:1px;background:none;border-top:1px dashed ${C.ink};opacity:.5}
.lv-story{padding:clamp(90px,13vh,150px) 0}
.lv-grid2{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(36px,6vw,84px);align-items:center}
.lv-ph{position:relative;background:#fff;border:1px solid ${C.line};padding:12px 12px 40px}
.lv-ph img{width:100%;aspect-ratio:3/3.6;object-fit:cover}
.lv-phcap{position:absolute;left:16px;bottom:10px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.2em;color:${C.ink};opacity:.7}
.lv-story h2{font-family:'Oranienbaum',Georgia,serif;font-weight:400;font-size:clamp(30px,4.2vw,48px);line-height:1.16;margin:16px 0 20px}
.lv-body{color:rgba(32,48,74,.85);max-width:54ch;margin-bottom:12px}
.lv-route{margin-top:26px;max-width:420px;display:block}
.lv-route-line{stroke:${C.ink};stroke-width:1.5;stroke-dasharray:1;stroke-dashoffset:1;fill:none}
.lv-route.in .lv-route-line{transition:stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1) .2s;stroke-dashoffset:0}
@media (max-width:840px){.lv-grid2{grid-template-columns:1fr}}
.lv-days{background:#fff;border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};padding:clamp(90px,13vh,150px) 0}
.lv-h{font-family:'Oranienbaum',Georgia,serif;font-weight:400;font-size:clamp(32px,4.6vw,52px);text-align:center;margin:10px 0 clamp(38px,6vh,58px)}
.lv-tickets{display:grid;gap:18px;max-width:820px;margin:0 auto}
.lv-ticket{display:grid;grid-template-columns:1fr 200px;background:${C.paper};border:1px solid ${C.ink};position:relative}
.lv-tk-main{padding:24px 28px}
.lv-tk-no{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.2em;color:${C.red};margin-bottom:8px}
.lv-ticket h4{font-family:'Oranienbaum',Georgia,serif;font-weight:400;font-size:clamp(24px,3vw,32px);line-height:1.1}
.lv-tk-loc{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.12em;margin-top:6px;color:rgba(32,48,74,.8)}
.lv-tk-desc{font-size:14px;color:rgba(32,48,74,.75);margin-top:10px;max-width:46ch}
.lv-tk-stub{border-left:1px dashed ${C.ink};padding:24px 20px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;position:relative}
.lv-tk-stub::before,.lv-tk-stub::after{content:"";position:absolute;left:-9px;width:16px;height:16px;border-radius:50%;background:#fff;border:1px solid ${C.ink}}
.lv-tk-stub::before{top:-9px;border-bottom-color:transparent}
.lv-tk-stub::after{bottom:-9px;border-top-color:transparent}
.lv-tk-time{font-family:'IBM Plex Mono',monospace;font-size:15px;letter-spacing:.1em;font-weight:500}
.lv-barcode{height:34px;background:repeating-linear-gradient(90deg,${C.ink} 0 2px,transparent 2px 5px,${C.ink} 5px 6px,transparent 6px 10px)}
@media (max-width:600px){.lv-ticket{grid-template-columns:1fr}.lv-tk-stub{border-left:none;border-top:1px dashed ${C.ink}}.lv-tk-stub::before{left:auto;top:-9px;right:24px}.lv-tk-stub::after{display:none}}
.lv-place{padding:clamp(90px,13vh,150px) 0}
.lv-place h3{font-family:'Oranienbaum',Georgia,serif;font-weight:400;font-size:clamp(28px,3.8vw,44px);margin:12px 0 12px}
.lv-link{display:inline-block;margin-top:18px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${C.ink};text-decoration:none;border-bottom:1px solid ${C.ink};padding-bottom:5px;transition:color .3s,border-color .3s}
.lv-link:hover{color:${C.red};border-color:${C.red}}
.lv-gal{padding:0 0 clamp(90px,13vh,150px)}
.lv-gal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,1.6vw,18px)}
.lv-gal figure{aspect-ratio:4/5;overflow:hidden;background:#fff;border:1px solid ${C.line};padding:10px}
.lv-gal img{width:100%;height:100%;object-fit:cover;transition:transform 1.1s cubic-bezier(.16,1,.3,1)}
.lv-gal figure:hover img{transform:scale(1.04)}
@media (max-width:640px){.lv-gal-grid{grid-template-columns:1fr 1fr}.lv-gal figure:last-child{display:none}}
.lv-faqsec{padding:0 0 clamp(90px,13vh,150px)}
.lv-faq{max-width:660px;margin:0 auto}
.lv-faq details{border-top:1px solid ${C.line}}
.lv-faq details:last-child{border-bottom:1px solid ${C.line}}
.lv-faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 0;font-family:'Oranienbaum',Georgia,serif;font-size:clamp(19px,2.5vw,24px)}
.lv-faq summary::-webkit-details-marker{display:none}
.lv-pl{position:relative;width:13px;height:13px;flex:none;transition:transform .4s}
.lv-pl::before,.lv-pl::after{content:"";position:absolute;background:${C.ink}}
.lv-pl::before{left:0;top:6px;width:13px;height:1px}
.lv-pl::after{left:6px;top:0;width:1px;height:13px}
.lv-faq details[open] .lv-pl{transform:rotate(45deg)}
.lv-a{padding:0 0 22px;color:rgba(32,48,74,.8);max-width:56ch}
.lv-rsvpband{position:relative;padding:clamp(80px,12vh,130px) 20px;overflow:hidden}
.lv-rsvp-bg{position:absolute;inset:0;background:#22324A}
.lv-rsvp-bg img{width:100%;height:100%;object-fit:cover}
.lv-pass{position:relative;background:${C.paper};max-width:680px;margin:0 auto;border:1px solid ${C.ink}}
.lv-pass-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;background:${C.ink};color:${C.paper};padding:14px 22px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.22em;text-transform:uppercase}
.lv-pass-route{color:#E8D9BF}
.lv-pass-body{padding:clamp(26px,5vw,44px)}
.lv-f-block{margin-bottom:20px}
.lv-f{display:block;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:rgba(32,48,74,.65);margin-bottom:4px}
.lv-in{width:100%;background:#fff;border:1px solid ${C.line};border-radius:0;padding:12px 12px;font:inherit;color:${C.ink};transition:border-color .3s}
.lv-in:focus{outline:none;border-color:${C.red}}
.lv-in.err{border-color:${C.red};background:#FBEFEA}
.lv-in::placeholder{color:rgba(32,48,74,.35)}
.lv-chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
.lv-chip{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;padding:13px 20px;border:1px solid ${C.line}}
.lv-chip.on{background:${C.ink};border-color:${C.ink};color:${C.paper}}
.lv-two{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media (max-width:560px){.lv-two{grid-template-columns:1fr}}
.lv-send{text-align:center;margin-top:8px}
.lv-btn{font-family:'IBM Plex Mono',monospace;font-weight:500;font-size:12px;letter-spacing:.26em;text-transform:uppercase;padding:17px 40px;background:${C.red};color:#fff;border:1px solid ${C.red};transition:background .3s,border-color .3s}
.lv-btn:hover{background:#962F25;border-color:#962F25}
.lv-btn:disabled{opacity:.6;cursor:default}
.lv-note{margin-top:12px;font-size:12px;color:rgba(32,48,74,.6)}
.lv-errm{margin-top:10px;font-size:13px;color:${C.red}}
.lv-pass-code{margin-top:22px}
.lv-done{position:relative;padding:clamp(34px,6vw,56px);text-align:center}
.lv-done-t{font-family:'Oranienbaum',Georgia,serif;font-size:clamp(26px,3.6vw,36px);line-height:1.2}
.lv-done-s{margin-top:10px;color:rgba(32,48,74,.75)}
.lv-okstamp{margin:26px auto 0;width:150px;height:150px;border:3px double ${C.red};border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:${C.red};transform:rotate(-11deg);font-family:'IBM Plex Mono',monospace;letter-spacing:.16em;animation:lvStamp .45s cubic-bezier(.2,1.6,.4,1)}
.lv-okstamp span{font-size:17px;font-weight:500}
.lv-okstamp small{font-size:11px;opacity:.85}
.lv-okstamp.no{color:${C.sky};border-color:${C.sky}}
@keyframes lvStamp{0%{transform:rotate(-11deg) scale(1.8);opacity:0}100%{transform:rotate(-11deg) scale(1);opacity:1}}
.lv-footer{background:${C.ink};color:${C.paper};text-align:center;padding:62px 20px 52px}
.lv-fs{font-family:'Oranienbaum',Georgia,serif;font-style:italic;font-size:19px;opacity:.85}
.lv-fn{font-family:'Oranienbaum',Georgia,serif;font-size:26px;letter-spacing:.06em;margin-top:8px}
.lv-cred{margin-top:26px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:rgba(246,241,230,.55)}
.lv-cred a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(246,241,230,.35);padding-bottom:3px}
.lv-root .rv{opacity:0;transform:translateY(24px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
.lv-root .rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.lv-root .rv{opacity:1;transform:none;transition:none}.lv-hero-bg img{animation:none;transform:none}.lv-route.in .lv-route-line{transition:none;stroke-dashoffset:0}.lv-okstamp{animation:none}}
`;
