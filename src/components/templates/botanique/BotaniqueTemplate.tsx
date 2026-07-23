'use client';
import { useState, useEffect, useRef } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

const C = { bg: '#F2F4EC', ink: '#252B21', leaf: '#55603F', mid: '#8B9770', tint: '#E4E9D6', line: 'rgba(37,43,33,.18)' };

interface ScheduleItem { time: string; title: string }
interface FaqItem { question: string; answer: string }
interface WeddingData {
  locale?: string;
  partner_name_1: string; partner_name_2: string;
  wedding_date: string; wedding_date_display?: string; location: string; slug: string;
  hero_image_url?: string; story_image_url?: string; story_bg_url?: string;
  footer_image_url?: string; venue_image_url?: string; rsvp_invite_image_url?: string;
  story_heading?: string; story_paragraph_1?: string; story_paragraph_2?: string;
  schedule?: ScheduleItem[];
  venue_name?: string; venue_address?: string; venue_description?: string; venue_directions_url?: string;
  dress_code_title?: string; dress_code_description?: string;
  dress_code_colors?: string[]; dress_code_labels?: string[];
  faq?: FaqItem[]; rsvp_deadline?: string; closing_message?: string;
}

const DEMO: WeddingData = {
  partner_name_1: 'Ірина', partner_name_2: 'Остап',
  wedding_date: '2027-05-22T15:00:00+03:00', wedding_date_display: '22 травня 2027',
  location: 'Карпати', slug: 'demo',
  hero_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
  story_image_url: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?auto=format&fit=crop&w=1200&q=80',
  story_bg_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80',
  footer_image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
  venue_image_url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80',
  story_heading: 'Ми зустрілися в горах — і повертаємось туди сказати «так».',
  story_paragraph_1: 'Перший похід, спільний намет під дощем і чай з чебрецем о шостій ранку. Вісім років, три вершини і один спільний дім по тому — ми запрошуємо вас туди, де все почалося.',
  schedule: [
    { time: '14:30', title: 'Збір гостей на галявині' },
    { time: '15:00', title: 'Церемонія під аркою' },
    { time: '16:00', title: 'Лимонад, тартини й фотопрогулянка' },
    { time: '18:00', title: 'Вечеря під гірляндами' },
    { time: '21:30', title: 'Перший танець і ватра' },
  ],
  venue_name: 'Полонина Веста', venue_address: 'с. Яблуниця, Івано-Франківська область',
  venue_description: 'Трансфер від Ворохти о 13:45. Тепла кофта ввечері не завадить.',
  venue_directions_url: 'https://maps.google.com/?q=Yablunytsia+Carpathians',
  dress_code_title: 'Garden casual',
  dress_code_description: 'Легкі тканини і кольори луки:',
  dress_code_colors: ['#8B9770', '#D9C9A3', '#C9A28F', '#F0EDE2'],
  dress_code_labels: ['олива', 'сіно', 'глина', 'молоко'],
  faq: [
    { question: 'Чи можна з дітьми?', answer: 'Так! Для малечі буде окрема галявина з іграми та нянею.' },
    { question: 'Що взути?', answer: 'Церемонія на траві — підбори лишіть удома, обирайте зручне.' },
    { question: 'Що подарувати?', answer: 'Ваша присутність — найкращий подарунок. За бажання — внесок у нашу мандрівку.' },
    { question: 'До котрої відповісти?', answer: 'До 22 квітня 2027. Відповідь можна змінити, відкривши сайт ще раз.' },
  ],
  rsvp_deadline: '22 квітня 2027', closing_message: 'з любов’ю,',
};

const Sprig = ({ color = C.mid }: { color?: string }) => (
  <svg width="88" height="26" viewBox="0 0 88 26" fill="none" aria-hidden="true">
    <path d="M4 20 Q 44 6 84 20" stroke={color} strokeWidth="1" />
    <path d="M22 15 q 4 -8 10 -4 q -6 5 -10 4 Z" stroke={color} strokeWidth="1" fill="none" />
    <path d="M56 12 q 6 -6 11 -1 q -6 4 -11 1 Z" stroke={color} strokeWidth="1" fill="none" />
    <circle cx="44" cy="9" r="2" fill={color} />
  </svg>
);

export default function BotaniqueTemplate({ data }: { data?: Partial<WeddingData> }) {
  const d: WeddingData = { ...DEMO, ...(data || {}) };
  const L = normalizeLocale(d.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const rootRef = useRef<HTMLDivElement>(null);
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
    return () => io.disconnect();
  }, []);

  const trio = [d.story_bg_url, d.venue_image_url, d.footer_image_url].filter(Boolean) as string[];
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={rootRef} className="bq-root">
      <style>{BQ_CSS}</style>

      <div className="bq-bar">
        <button className="bq-mono" onClick={() => go('bq-top')}>{d.partner_name_1[0]} · {d.partner_name_2[0]}</button>
        <div className="bq-links">
          <button onClick={() => go('bq-story')}>{t('navStory')}</button>
          <button onClick={() => go('bq-day')}>{t('navSchedule')}</button>
          <button onClick={() => go('bq-place')}>{t('navDetails')}</button>
          <button onClick={() => go('bq-rsvp')}>RSVP</button>
        </div>
      </div>

      <header className="bq-hero" id="bq-top">
        <Sprig />
        <p className="bq-script rv">{t('heroScript')}</p>
        <h1 className="rv" style={{ transitionDelay: '.08s' }}>{d.partner_name_1}</h1>
        <p className="bq-and rv" style={{ transitionDelay: '.14s' }}>{t('and')}</p>
        <h1 className="rv" style={{ transitionDelay: '.2s' }}>{d.partner_name_2}</h1>
        <div className="bq-arch rv" style={{ transitionDelay: '.3s' }}>
          {d.hero_image_url && <img src={d.hero_image_url} alt="" />}
        </div>
        <p className="bq-date rv" style={{ transitionDelay: '.4s' }}>{d.wedding_date_display} · {d.location}</p>
        {days !== null && <p className="bq-count rv" style={{ transitionDelay: '.48s' }}>{t('daysTo', { n: days })}</p>}
        <button className="bq-btn rv" style={{ transitionDelay: '.56s' }} onClick={() => go('bq-rsvp')}>{t('rsvpBtn')}</button>
      </header>

      <section className="bq-story" id="bq-story">
        <div className="bq-wrap bq-grid2">
          <figure className="bq-oval rv">
            {d.story_image_url && <img src={d.story_image_url} alt="" loading="lazy" />}
          </figure>
          <div>
            <p className="bq-lbl rv">{t('storyA')} {t('storyB')}</p>
            {d.story_heading && <h2 className="rv" style={{ transitionDelay: '.08s' }}>{d.story_heading}</h2>}
            {d.story_paragraph_1 && <p className="bq-body rv" style={{ transitionDelay: '.16s' }}>{d.story_paragraph_1}</p>}
            {d.story_paragraph_2 && <p className="bq-body rv" style={{ transitionDelay: '.22s' }}>{d.story_paragraph_2}</p>}
          </div>
        </div>
      </section>

      {!!d.schedule?.length && (
        <section className="bq-day" id="bq-day">
          <div className="bq-wrap">
            <div className="bq-card rv">
              <Sprig color="#C9D2B4" />
              <h3>{t('scheduleTitle')}</h3>
              {d.schedule.map((s, i) => (
                <div key={i} className="bq-row">
                  <span className="bq-t">{s.time}</span>
                  <span className="bq-dots" />
                  <span className="bq-e">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {trio.length >= 2 && (
        <section className="bq-trio">
          <div className="bq-wrap bq-trio-grid">
            {trio.slice(0, 3).map((src, i) => (
              <figure key={src} className="rv" style={{ transitionDelay: `${i * 0.1}s` }}>
                <img src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="bq-details" id="bq-place">
        <div className="bq-wrap bq-grid2">
          {d.venue_name && (
            <div className="rv">
              <p className="bq-lbl">{t('locationLabel')}</p>
              <h3>{d.venue_name}</h3>
              <p className="bq-body">{d.venue_address}{d.venue_description ? '. ' + d.venue_description : ''}</p>
              {d.venue_directions_url && (
                <a className="bq-link" href={d.venue_directions_url} target="_blank" rel="noopener noreferrer">{t('routeBtn')}</a>
              )}
            </div>
          )}
          {d.dress_code_title && (
            <div className="rv" style={{ transitionDelay: '.1s' }}>
              <p className="bq-lbl">{t('dressLabel')}</p>
              <h3>{d.dress_code_title}</h3>
              {d.dress_code_description && <p className="bq-body">{d.dress_code_description}</p>}
              {!!d.dress_code_colors?.length && (
                <div className="bq-sw">
                  {d.dress_code_colors.map((c, i) => (
                    <span key={i}><i style={{ background: c }} />{d.dress_code_labels?.[i] && <small>{d.dress_code_labels[i]}</small>}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {!!d.faq?.length && (
        <section className="bq-faq-sec">
          <div className="bq-wrap">
            <p className="bq-lbl bq-center rv">{t('faqTitle')}</p>
            <div className="bq-faq rv">
              {d.faq.map((f, i) => (
                <details key={i}><summary>{f.question}<span className="bq-pl" /></summary><div className="bq-a">{f.answer}</div></details>
              ))}
            </div>
          </div>
        </section>
      )}

      <BotaniqueRsvp d={d} />

      <footer className="bq-footer">
        <Sprig color="#C9D2B4" />
        <p className="bq-fs">{d.closing_message || 'з любов’ю,'}</p>
        <p className="bq-fn">{d.partner_name_1} та {d.partner_name_2}</p>
        <p className="bq-cred">{t('createdOn')} <a href="https://momently.co" target="_blank" rel="noopener noreferrer">momently.co</a></p>
      </footer>
    </div>
  );
}

function BotaniqueRsvp({ d }: { d: WeddingData }) {
  const L = normalizeLocale(d.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [status, setStatus] = useState<'form' | 'sending' | 'success' | 'error'>('form');
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [guests, setGuests] = useState(tr(normalizeLocale(d.locale), 'guest1'));
  const [meal, setMeal] = useState(tr(normalizeLocale(d.locale), 'menuRegular'));
  const [wish, setWish] = useState('');

  const submit = async () => {
    if (!name.trim()) { setNameErr(true); return; }
    setStatus('sending');
    const dietary = [
      attending ? t('menuWord') + ': ' + meal : '',
      wish.trim() ? t('wishesWord') + ': ' + wish.trim() : '',
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

  return (
    <section className="bq-rsvp" id="bq-rsvp">
      <div className="bq-rsvp-card">
        <Sprig />
        <h2>{t('rsvpTitle')}</h2>
        {d.rsvp_deadline && <p className="bq-dl">{t('rsvpDeadline', { date: d.rsvp_deadline })}</p>}
        {status === 'success' ? (
          <div className="bq-done">
            <p className="bq-done-t">{attending ? t('thanksYes', { name: name.trim() }) : t('thanksNo', { name: name.trim() })}</p>
            <p className="bq-done-s">{attending ? t('waitingFor', { guests, menu: meal }) : t('thanksNoSub')}</p>
          </div>
        ) : (
          <div>
            <label className="bq-f" htmlFor="bq-name">{t('nameLabel')}</label>
            <input id="bq-name" className={'bq-in' + (nameErr ? ' err' : '')} type="text" placeholder={t('namePlaceholder')}
              value={name} onChange={e => { setName(e.target.value); setNameErr(false); }} />
            <label className="bq-f">{t('presenceLabel')}</label>
            <div className="bq-chips">
              <button type="button" className={'bq-chip' + (attending ? ' on' : '')} onClick={() => setAttending(true)}>{t('yes')}</button>
              <button type="button" className={'bq-chip' + (!attending ? ' on' : '')} onClick={() => setAttending(false)}>{t('no')}</button>
            </div>
            {attending && (
              <div>
                <div className="bq-two">
                  <div>
                    <label className="bq-f" htmlFor="bq-guests">{t('guestsLabel')}</label>
                    <select id="bq-guests" className="bq-in" value={guests} onChange={e => setGuests(e.target.value)}>
                      <option>{t('guest1')}</option><option>{t('guest2')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="bq-f" htmlFor="bq-meal">{t('menuLabel')}</label>
                    <select id="bq-meal" className="bq-in" value={meal} onChange={e => setMeal(e.target.value)}>
                      <option>{t('menuRegular')}</option><option>{t('menuVeg')}</option><option>{t('menuKids')}</option>
                    </select>
                  </div>
                </div>
                <label className="bq-f" htmlFor="bq-wish">{t('wishesLabel')}</label>
                <input id="bq-wish" className="bq-in" type="text" placeholder={t('wishesPlaceholder')} value={wish} onChange={e => setWish(e.target.value)} />
              </div>
            )}
            <div className="bq-send"><button className="bq-btn" onClick={submit} disabled={status === 'sending'}>
              {status === 'sending' ? t('sending') : t('submit')}
            </button></div>
            {status === 'error' && <p className="bq-err">{t('errSend')}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

const BQ_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Marck+Script&family=Golos+Text:wght@400;500&display=swap');
.bq-root{background:${C.bg};color:${C.ink};font-family:'Golos Text',system-ui,sans-serif;font-size:17px;line-height:1.8;-webkit-font-smoothing:antialiased}
.bq-root *{margin:0;padding:0;box-sizing:border-box}
.bq-root ::selection{background:${C.leaf};color:#fff}
.bq-root img{display:block;max-width:100%}
.bq-root button{font-family:inherit;background:none;border:none;cursor:pointer;color:inherit}
.bq-wrap{max-width:1120px;margin:0 auto;padding:0 clamp(20px,5vw,56px)}
.bq-lbl{font-size:11px;letter-spacing:.32em;text-transform:uppercase;font-weight:500;color:${C.leaf};margin-bottom:14px}
.bq-center{text-align:center}
.bq-bar{position:sticky;top:0;z-index:80;display:flex;justify-content:space-between;align-items:center;padding:16px clamp(18px,4vw,44px);background:rgba(242,244,236,.9);backdrop-filter:blur(10px);border-bottom:1px solid ${C.line}}
.bq-mono{font-family:'Cormorant Garamond',serif;font-size:20px;color:${C.leaf}}
.bq-links{display:flex;gap:clamp(14px,3vw,30px)}
.bq-links button{font-size:11px;letter-spacing:.24em;text-transform:uppercase;font-weight:500;opacity:.8}
.bq-hero{text-align:center;padding:clamp(60px,9vh,100px) 20px clamp(70px,11vh,110px)}
.bq-script{font-family:'Marck Script',cursive;font-size:clamp(22px,3.2vw,30px);color:${C.leaf};margin:18px 0 6px}
.bq-hero h1{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:max(48px,8.6vw);line-height:1}
.bq-and{font-family:'Marck Script',cursive;font-size:clamp(24px,3.4vw,34px);color:${C.mid};margin:6px 0}
.bq-arch{width:min(78vw,420px);aspect-ratio:3/4;margin:clamp(28px,5vh,44px) auto;overflow:hidden;border-radius:999px 999px 12px 12px;border:1px solid ${C.line};padding:10px;background:#fff}
.bq-arch img{width:100%;height:100%;object-fit:cover;border-radius:999px 999px 8px 8px}
.bq-date{font-size:13px;letter-spacing:.3em;text-transform:uppercase;font-weight:500}
.bq-count{margin-top:10px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:${C.leaf};font-weight:500}
.bq-btn{margin-top:26px;font-weight:500;font-size:11px;letter-spacing:.28em;text-transform:uppercase;padding:17px 38px;background:${C.leaf};color:#fff;border:1px solid ${C.leaf};border-radius:999px;transition:background .35s}
.bq-btn:hover{background:${C.ink};border-color:${C.ink}}
.bq-btn:disabled{opacity:.6;cursor:default}
.bq-story{padding:clamp(80px,12vh,130px) 0}
.bq-grid2{display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(36px,6vw,80px);align-items:center}
.bq-oval{width:min(100%,400px);aspect-ratio:3/4;overflow:hidden;border-radius:50%/38%;margin:0 auto;background:${C.tint}}
.bq-oval img{width:100%;height:100%;object-fit:cover}
.bq-story h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(28px,3.8vw,42px);line-height:1.25;margin-bottom:20px}
.bq-body{color:rgba(37,43,33,.82);max-width:52ch;margin-bottom:12px}
@media (max-width:820px){.bq-grid2{grid-template-columns:1fr}}
.bq-day{padding:0 0 clamp(80px,12vh,130px)}
.bq-card{max-width:640px;margin:0 auto;background:#fff;border:1px solid ${C.line};border-radius:24px;padding:clamp(34px,6vw,56px);text-align:center}
.bq-card h3{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(28px,4vw,38px);margin:12px 0 26px}
.bq-row{display:flex;align-items:baseline;gap:14px;padding:13px 0;text-align:left}
.bq-t{font-family:'Cormorant Garamond',serif;font-size:22px;color:${C.leaf};min-width:3em}
.bq-dots{flex:1;border-bottom:1px dotted ${C.line};transform:translateY(-4px)}
.bq-e{font-size:15px;max-width:60%}
.bq-trio{padding:0 0 clamp(80px,12vh,130px)}
.bq-trio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,2vw,20px)}
.bq-trio figure{aspect-ratio:3/4;overflow:hidden;border-radius:999px 999px 10px 10px;background:${C.tint}}
.bq-trio img{width:100%;height:100%;object-fit:cover;transition:transform 1.1s cubic-bezier(.16,1,.3,1)}
.bq-trio figure:hover img{transform:scale(1.05)}
@media (max-width:640px){.bq-trio-grid{grid-template-columns:1fr 1fr}.bq-trio figure:last-child{display:none}}
.bq-details{padding:0 0 clamp(80px,12vh,130px)}
.bq-details h3{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(28px,4vw,42px);margin-bottom:12px}
.bq-link{display:inline-block;margin-top:18px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:${C.leaf};text-decoration:none;border-bottom:1px solid ${C.leaf};padding-bottom:5px}
.bq-sw{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:22px;max-width:340px}
.bq-sw i{display:block;height:64px;border-radius:999px;border:1px solid ${C.line}}
.bq-sw small{display:block;margin-top:6px;font-size:12px;color:rgba(37,43,33,.65);text-align:center}
.bq-faq-sec{padding:0 0 clamp(80px,12vh,130px)}
.bq-faq{max-width:640px;margin:20px auto 0}
.bq-faq details{border-top:1px solid ${C.line}}
.bq-faq details:last-child{border-bottom:1px solid ${C.line}}
.bq-faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:20px 0;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(19px,2.5vw,23px)}
.bq-faq summary::-webkit-details-marker{display:none}
.bq-pl{position:relative;width:13px;height:13px;flex:none;transition:transform .4s}
.bq-pl::before,.bq-pl::after{content:"";position:absolute;background:${C.leaf}}
.bq-pl::before{left:0;top:6px;width:13px;height:1px}
.bq-pl::after{left:6px;top:0;width:1px;height:13px}
.bq-faq details[open] .bq-pl{transform:rotate(45deg)}
.bq-a{padding:0 0 22px;color:rgba(37,43,33,.8);max-width:56ch}
.bq-rsvp{background:${C.leaf};padding:clamp(70px,11vh,110px) 20px}
.bq-rsvp-card{background:${C.bg};max-width:620px;margin:0 auto;border-radius:24px;padding:clamp(36px,6vw,60px);text-align:center}
.bq-rsvp-card h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(30px,4.4vw,44px);margin-top:10px}
.bq-dl{margin:10px 0 30px;font-size:14px;color:rgba(37,43,33,.7)}
.bq-f{display:block;text-align:left;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:rgba(37,43,33,.6);margin:22px 0 2px}
.bq-in{width:100%;background:#fff;border:1px solid ${C.line};border-radius:12px;padding:13px 14px;font:inherit;color:${C.ink};transition:border-color .3s}
.bq-in:focus{outline:none;border-color:${C.leaf}}
.bq-in.err{border-color:#A33B2B}
.bq-in::placeholder{color:rgba(37,43,33,.35)}
.bq-chips{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;justify-content:center}
.bq-chip{font-weight:500;font-size:11px;letter-spacing:.24em;text-transform:uppercase;padding:14px 24px;border:1px solid ${C.line};border-radius:999px;transition:all .3s}
.bq-chip.on{background:${C.leaf};border-color:${C.leaf};color:#fff}
.bq-two{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media (max-width:560px){.bq-two{grid-template-columns:1fr}}
.bq-send{margin-top:32px}
.bq-err{margin-top:14px;font-size:13px;color:#A33B2B}
.bq-done-t{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:clamp(26px,3.6vw,36px)}
.bq-done-s{margin-top:10px;color:rgba(37,43,33,.75)}
.bq-footer{background:${C.ink};color:${C.bg};text-align:center;padding:60px 20px 52px}
.bq-fs{font-family:'Marck Script',cursive;font-size:26px;color:#C9D2B4;margin-top:14px}
.bq-fn{font-family:'Cormorant Garamond',serif;font-size:24px;letter-spacing:.06em;margin-top:6px}
.bq-cred{margin-top:24px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:rgba(242,244,236,.5)}
.bq-cred a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(242,244,236,.35);padding-bottom:3px}
.bq-root .rv{opacity:0;transform:translateY(24px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
.bq-root .rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.bq-root .rv{opacity:1;transform:none;transition:none}}
`;
