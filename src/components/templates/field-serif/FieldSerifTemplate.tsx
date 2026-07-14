'use client';
import { useState, useEffect, useRef } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

// ─── COLORS ──────────────────────────────────────────────
const C = {
  cream:  '#FAF7F1',
  ink:    '#23241F',
  clay:   '#B7674B',
  stone:  '#E6DFD2',
  leaf:   '#2C332C',
};

// ─── TYPES ────────────────────────────────────────────────
interface ScheduleItem { time: string; title: string }
interface FaqItem { question: string; answer: string }

interface WeddingData {
  locale?: string;
  partner_name_1: string;
  partner_name_2: string;
  wedding_date: string;
  wedding_date_display?: string;
  location: string;
  slug: string;
  hero_image_url?: string;
  story_image_url?: string;
  story_bg_url?: string;
  footer_image_url?: string;
  venue_image_url?: string;
  rsvp_invite_image_url?: string;
  story_heading?: string;
  story_paragraph_1?: string;
  story_paragraph_2?: string;
  schedule?: ScheduleItem[];
  venue_name?: string;
  venue_address?: string;
  venue_description?: string;
  venue_directions_url?: string;
  dress_code_title?: string;
  dress_code_description?: string;
  dress_code_colors?: string[];
  dress_code_labels?: string[];
  faq?: FaqItem[];
  rsvp_deadline?: string;
  closing_message?: string;
}

// ─── DEMO DATA ────────────────────────────────────────────
const DEMO: WeddingData = {
  partner_name_1: 'Соломія',
  partner_name_2: 'Марко',
  wedding_date: '2026-10-10T16:00:00+03:00',
  wedding_date_display: '10 . 10 . 26',
  location: 'Львів',
  slug: 'demo',
  hero_image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=2000&q=80',
  story_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  story_bg_url: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?auto=format&fit=crop&w=1000&q=80',
  footer_image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
  venue_image_url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1000&q=80',
  rsvp_invite_image_url: 'https://images.unsplash.com/photo-1563808599481-34a342e44508?auto=format&fit=crop&w=2000&q=80',
  story_heading: 'Сім років, два міста і один собака по тому — ми збираємо всіх, кого любимо.',
  story_paragraph_1: 'Все почалося з випадкової кави на Вірменській. Потім були Київ і Львів, переїзди й повернення, пес Барні та тиха обіцянка в горах. Тепер ми хочемо сказати «так» уголос — і щоб ви були поруч.',
  schedule: [
    { time: '15:30', title: 'Збір гостей і вітальні напої' },
    { time: '16:00', title: 'Церемонія в саду' },
    { time: '17:00', title: 'Фуршет, ігристе та фотопрогулянка' },
    { time: '19:00', title: 'Святкова вечеря і тости' },
    { time: '22:00', title: 'Перший танець і танцпол до ночі' },
  ],
  venue_name: 'Едем Резорт',
  venue_address: 'с. Стрілки, Львівська область',
  venue_description: 'О 14:45 від Оперного театру вирушить трансфер для гостей. Для тих, хто своїм авто, — паркінг на території.',
  venue_directions_url: 'https://maps.google.com/?q=Edem+Resort+Lviv+region',
  dress_code_title: 'Garden formal',
  dress_code_description: 'Приглушені відтінки природи — підказка в нашій палітрі:',
  dress_code_colors: ['#7E8A72', '#B7674B', '#E5DFD2', '#2E362D'],
  dress_code_labels: ['шавлія', 'глина', 'льон', 'темний лист'],
  faq: [
    { question: 'Чи можна прийти з дітьми?', answer: 'Так, ми будемо раді малечі — на локації працюватиме дитяча кімната з аніматором протягом усього вечора.' },
    { question: 'Що подарувати?', answer: 'Найкращий подарунок — ваша присутність. Якщо хочеться більшого, будемо вдячні за внесок у скарбничку нашої весільної подорожі.' },
    { question: 'Чи буде дощовий план?', answer: 'Так. У разі негоди церемонія переїде під скляну оранжерею за двадцять кроків від саду — краса та сама, парасолі не знадобляться.' },
    { question: 'До котрої можна відповісти?', answer: 'Просимо підтвердити присутність до 10 вересня 2026. Відповідь можна змінити, відкривши сайт ще раз.' },
  ],
  rsvp_deadline: '10 вересня 2026',
  closing_message: 'з любов’ю,',
};

// ─── COMPONENT ────────────────────────────────────────────
export default function FieldSerifTemplate({ data }: { data?: Partial<WeddingData> }) {
  const d: WeddingData = { ...DEMO, ...(data || {}) };
  const L = normalizeLocale(d.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [barOn, setBarOn] = useState(false);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const t = new Date(d.wedding_date).getTime() - Date.now();
    setDays(Math.max(0, Math.floor(t / 86400000)));
  }, [d.wedding_date]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.14 }
    );
    root.querySelectorAll('.rv').forEach((el) => io.observe(el));
    let barIo: IntersectionObserver | null = null;
    if (heroRef.current) {
      barIo = new IntersectionObserver((es) => setBarOn(!es[0].isIntersecting), { rootMargin: '-80px 0px 0px 0px' });
      barIo.observe(heroRef.current);
    }
    return () => { io.disconnect(); barIo?.disconnect(); };
  }, []);

  const trio = [d.story_bg_url, d.footer_image_url, d.venue_image_url].filter(Boolean) as string[];
  const dateDisplay = d.wedding_date_display ||
    new Date(d.wedding_date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\./g, ' . ');

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={rootRef} className="fs-root">
      <style>{FS_CSS}</style>

      <div className={'fs-topbar' + (barOn ? ' on' : '')}>
        <div className="fs-links">
          <button onClick={() => go('fs-story')}>Історія</button>
          <button onClick={() => go('fs-day')}>Розклад</button>
          <button onClick={() => go('fs-place')}>Деталі</button>
          <button onClick={() => go('fs-faq')}>Питання</button>
        </div>
        <button className="fs-mono" onClick={() => go('fs-top')}>
          {d.partner_name_1[0]} &amp; {d.partner_name_2[0]} · {dateDisplay.replace(/ /g, '')}
        </button>
        <button className="fs-rsvp-btn" onClick={() => go('fs-rsvp')}>RSVP</button>
      </div>

      <header className="fs-hero" id="fs-top" ref={heroRef}>
        <div className="fs-hero-bg">
          {d.hero_image_url && <img src={d.hero_image_url} alt="" />}
        </div>
        <div className="fs-veil" />
        <div className="fs-hero-inner">
          <p className="fs-script rv">{t('heroScript')}</p>
          <h1 className="rv" style={{ transitionDelay: '.1s' }}>
            {d.partner_name_1} <span className="fs-amp">&amp;</span> {d.partner_name_2}
          </h1>
          <p className="fs-date rv" style={{ transitionDelay: '.2s' }}>
            {dateDisplay}&nbsp;&nbsp;·&nbsp;&nbsp;{d.location}
          </p>
          {days !== null && (
            <p className="fs-count rv" style={{ transitionDelay: '.3s' }}>{t('daysTo', { n: days })}</p>
          )}
        </div>
        <span className="fs-down" aria-hidden="true" />
      </header>

      <section className="fs-bignames">
        <span className="fs-caps rv">{t('inviteCaps')}</span>
        <h2 className="rv" style={{ transitionDelay: '.1s' }}>
          {d.partner_name_1} <span className="fs-amp">та</span> {d.partner_name_2}
        </h2>
      </section>

      <section className="fs-story" id="fs-story">
        <div className="fs-wrap fs-story-grid">
          <div className="fs-arch rv">
            {d.story_image_url && <img src={d.story_image_url} alt="" loading="lazy" />}
          </div>
          <div>
            <p className="fs-lbl rv">{t('storyA')} <em>{t('storyB')}</em></p>
            {d.story_heading && <h3 className="rv" style={{ transitionDelay: '.08s' }}>{d.story_heading}</h3>}
            {d.story_paragraph_1 && <p className="fs-body rv" style={{ transitionDelay: '.16s' }}>{d.story_paragraph_1}</p>}
            {d.story_paragraph_2 && <p className="fs-body rv" style={{ transitionDelay: '.22s' }}>{d.story_paragraph_2}</p>}
          </div>
        </div>
      </section>

      {trio.length >= 2 && (
        <section className="fs-trio">
          <div className="fs-wrap fs-trio-grid">
            {trio.slice(0, 3).map((src, i) => (
              <figure key={src} className="rv" style={{ transitionDelay: `${i * 0.1}s` }}>
                <img src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      )}

      {!!d.schedule?.length && (
        <section className="fs-day" id="fs-day">
          <div className="fs-wrap">
            <span className="fs-caps fs-center rv">{d.location}</span>
            <h3 className="fs-h rv" style={{ transitionDelay: '.06s' }}>{t('scheduleTitle')}</h3>
            <div className="fs-daylist">
              {d.schedule.map((s, i) => (
                <div key={i} className="fs-dayrow rv" style={{ transitionDelay: `${i * 0.05}s` }}>
                  <span className="fs-t">{s.time}</span>
                  <span className="fs-e">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="fs-details" id="fs-place">
        <div className="fs-wrap fs-det-grid">
          {d.venue_name && (
            <div className="rv">
              <span className="fs-caps">{t('locationLabel')}</span>
              <h3>{d.venue_name}</h3>
              <p className="fs-body">
                {d.venue_address}{d.venue_description ? '. ' + d.venue_description : ''}
              </p>
              {d.venue_directions_url && d.venue_directions_url !== '#' && (
                <a className="fs-linku" href={d.venue_directions_url} target="_blank" rel="noopener noreferrer">
                  {t('routeBtn')}
                </a>
              )}
            </div>
          )}
          {d.dress_code_title && (
            <div className="rv" style={{ transitionDelay: '.12s' }}>
              <span className="fs-caps">{t('dressLabel')}</span>
              <h3>{d.dress_code_title}</h3>
              {d.dress_code_description && <p className="fs-body">{d.dress_code_description}</p>}
              {!!d.dress_code_colors?.length && (
                <div className="fs-sw">
                  {d.dress_code_colors.map((c, i) => (
                    <span key={i}>
                      <i style={{ background: c }} />
                      {d.dress_code_labels?.[i] && <small>{d.dress_code_labels[i]}</small>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {!!d.faq?.length && (
        <section className="fs-faqsec" id="fs-faq">
          <div className="fs-wrap">
            <span className="fs-caps fs-center rv">{t('usefulLabel')}</span>
            <h3 className="fs-h rv" style={{ transitionDelay: '.06s' }}>{t('faqTitle')}</h3>
            <div className="fs-faq rv" style={{ transitionDelay: '.12s' }}>
              {d.faq.map((f, i) => (
                <details key={i}>
                  <summary>{f.question}<span className="fs-pl" /></summary>
                  <div className="fs-a">{f.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <RsvpSection d={d} />

      <footer className="fs-footer">
        <p className="fs-script2">{d.closing_message || 'з любов’ю,'}</p>
        <p className="fs-fnames">{d.partner_name_1} та {d.partner_name_2}</p>
        <p className="fs-cred">
          {t('createdOn')} <a href="https://momently.co" target="_blank" rel="noopener noreferrer">momently.co</a>
        </p>
      </footer>
    </div>
  );
}

// ─── RSVP ─────────────────────────────────────────────────
function RsvpSection({ d }: { d: WeddingData }) {
  const L = normalizeLocale(d.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [status, setStatus] = useState<'form' | 'sending' | 'success' | 'error'>('form');
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState('');
  const [nameErr, setNameErr] = useState(false);
  const [guests, setGuests] = useState(tr(normalizeLocale(d.locale), 'guest1'));
  const [meal, setMeal] = useState(tr(normalizeLocale(d.locale), 'menuRegular'));
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch {
      setStatus(d.slug === 'demo' ? 'success' : 'error');
    }
  };

  return (
    <section className="fs-rsvpband" id="fs-rsvp">
      <div className="fs-rsvp-bg">
        {d.rsvp_invite_image_url && <img src={d.rsvp_invite_image_url} alt="" loading="lazy" />}
      </div>
      <div className="fs-veil" />
      <div className="fs-card">
        <span className="fs-caps fs-center">rsvp</span>
        <h2>{t('rsvpTitle')}</h2>
        {d.rsvp_deadline && <p className="fs-dl">{t('rsvpDeadline', { date: d.rsvp_deadline })}</p>}

        {status === 'success' ? (
          <div className="fs-done">
            <p className="fs-done-t">{attending ? t('thanksYes', { name: name.trim() }) : t('thanksNo', { name: name.trim() })}</p>
            <p className="fs-done-s">
              {attending
                ? t('waitingFor', { guests, menu: meal })
                : t('thanksNoSub')}
            </p>
          </div>
        ) : (
          <div>
            <label className="fs-f" htmlFor="fs-name">{t('nameLabel')}</label>
            <input
              id="fs-name"
              className={'fs-in' + (nameErr ? ' err' : '')}
              type="text"
              autoComplete="name"
              placeholder={t('namePlaceholder')}
              value={name}
              onChange={(e) => { setName(e.target.value); setNameErr(false); }}
            />

            <label className="fs-f">{t('presenceLabel')}</label>
            <div className="fs-chips">
              <button type="button" className={'fs-chip' + (attending ? ' on' : '')} onClick={() => setAttending(true)}>{t('yes')}</button>
              <button type="button" className={'fs-chip' + (!attending ? ' on' : '')} onClick={() => setAttending(false)}>{t('no')}</button>
            </div>

            {attending && (
              <div>
                <div className="fs-two">
                  <div>
                    <label className="fs-f" htmlFor="fs-guests">{t('guestsLabel')}</label>
                    <select id="fs-guests" className="fs-in" value={guests} onChange={(e) => setGuests(e.target.value)}>
                      <option>{t('guest1')}</option>
                      <option>{t('guest2')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="fs-f" htmlFor="fs-meal">{t('menuLabel')}</label>
                    <select id="fs-meal" className="fs-in" value={meal} onChange={(e) => setMeal(e.target.value)}>
                      <option>{t('menuRegular')}</option>
                      <option>{t('menuVeg')}</option>
                      <option>{t('menuKids')}</option>
                    </select>
                  </div>
                </div>
                <label className="fs-f" htmlFor="fs-wish">{t('wishesLabel')}</label>
                <input id="fs-wish" className="fs-in" type="text" placeholder={t('wishesPlaceholder')} value={wish} onChange={(e) => setWish(e.target.value)} />
                <label className="fs-f" htmlFor="fs-song">{t('songLabel')}</label>
                <input id="fs-song" className="fs-in" type="text" placeholder={t('songPlaceholder')} value={song} onChange={(e) => setSong(e.target.value)} />
              </div>
            )}

            <div className="fs-send">
              <button className="fs-btn" onClick={submit} disabled={status === 'sending'}>
                {status === 'sending' ? t('sending') : t('submit')}
              </button>
            </div>
            {status === 'error' && <p className="fs-errmsg">{t('errSend')}</p>}
            <p className="fs-note">{t('changeNote', { date: d.rsvp_deadline || '' })}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── CSS ──────────────────────────────────────────────────
const FS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Bad+Script&family=Golos+Text:wght@400;500&display=swap');
.fs-root{background:${C.cream};color:${C.ink};font-family:'Golos Text',system-ui,sans-serif;font-size:17px;line-height:1.8;-webkit-font-smoothing:antialiased}
.fs-root *{margin:0;padding:0;box-sizing:border-box}
.fs-root ::selection{background:${C.clay};color:#fff}
.fs-root img{display:block;max-width:100%}
.fs-root button{font-family:inherit;background:none;border:none;cursor:pointer;color:inherit}
.fs-wrap{max-width:1200px;margin:0 auto;padding:0 clamp(20px,5vw,56px)}
.fs-caps{font-size:11px;letter-spacing:.32em;text-transform:uppercase;font-weight:500;color:${C.clay}}
.fs-center{display:block;text-align:center}
.fs-topbar{position:fixed;inset:0 0 auto 0;z-index:80;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:18px clamp(18px,4vw,44px);gap:16px;color:#fff;transition:background .5s,color .5s,box-shadow .5s}
.fs-links{display:flex;gap:clamp(14px,2.6vw,30px)}
.fs-links button{font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:500;opacity:.92}
.fs-mono{font-family:'Playfair Display',serif;font-size:17px;letter-spacing:.14em;text-align:center;white-space:nowrap}
.fs-rsvp-btn{justify-self:end;background:#fff;color:${C.ink};font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;padding:13px 26px;transition:opacity .3s}
.fs-rsvp-btn:hover{opacity:.85}
.fs-topbar.on{background:${C.cream};color:${C.ink};box-shadow:0 1px 0 ${C.stone}}
.fs-topbar.on .fs-rsvp-btn{background:${C.ink};color:${C.cream}}
@media (max-width:820px){.fs-topbar{grid-template-columns:auto 1fr auto}.fs-links{display:none}.fs-mono{text-align:left}}
.fs-hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;color:#fff}
.fs-hero-bg{position:absolute;inset:0;background:#3A4438}
.fs-hero-bg img{width:100%;height:100%;object-fit:cover;transform:scale(1.07);animation:fsZoom 3.2s cubic-bezier(.16,1,.3,1) forwards}
@keyframes fsZoom{to{transform:scale(1)}}
.fs-veil{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(20,22,18,.35),rgba(20,22,18,.14) 40%,rgba(20,22,18,.46))}
.fs-hero-inner{position:relative;padding:110px 20px 90px}
.fs-script{font-family:'Bad Script',cursive;font-size:clamp(22px,3.4vw,30px);opacity:.95}
.fs-hero h1{font-family:'Playfair Display',serif;font-weight:500;font-size:max(52px,10.6vw);line-height:1.04;margin:14px 0 20px;white-space:nowrap;text-shadow:0 2px 30px rgba(0,0,0,.18)}
.fs-amp{font-style:italic;font-weight:400}
.fs-date{font-size:clamp(13px,1.6vw,16px);letter-spacing:.5em;text-transform:uppercase;font-weight:500}
.fs-count{margin-top:16px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;opacity:.85}
.fs-down{position:absolute;bottom:30px;left:50%;width:1px;height:52px;background:#fff;opacity:.6;transform-origin:top;animation:fsDrop 2.6s cubic-bezier(.16,1,.3,1) infinite}
@keyframes fsDrop{0%{transform:translateX(-50%) scaleY(0)}55%{transform:translateX(-50%) scaleY(1)}100%{transform:translateX(-50%) scaleY(1);opacity:0}}
.fs-bignames{padding:clamp(80px,13vh,140px) 20px clamp(60px,9vh,100px);text-align:center;overflow:hidden}
.fs-bignames .fs-caps{display:block;margin-bottom:18px}
.fs-bignames h2{font-family:'Playfair Display',serif;font-weight:500;color:${C.clay};font-size:max(44px,9.6vw);line-height:1;white-space:nowrap;letter-spacing:.01em}
.fs-story{padding:clamp(30px,6vh,70px) 0 clamp(90px,13vh,140px)}
.fs-story-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,84px);align-items:center}
.fs-arch{width:min(100%,440px);margin:0 auto;aspect-ratio:3/4.1;overflow:hidden;border-radius:999px 999px 0 0;background:${C.stone}}
.fs-arch img{width:100%;height:100%;object-fit:cover}
.fs-lbl{font-size:13px;letter-spacing:.28em;text-transform:uppercase;font-weight:500}
.fs-lbl em{font-family:'Bad Script',cursive;font-style:normal;text-transform:none;letter-spacing:.02em;font-size:30px;color:${C.clay};margin-left:8px;vertical-align:-4px}
.fs-story h3{font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(30px,3.6vw,44px);line-height:1.22;margin:18px 0 22px}
.fs-body{color:rgba(35,36,31,.8);max-width:52ch;margin-bottom:12px}
.fs-trio{padding:0 0 clamp(90px,13vh,140px)}
.fs-trio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,1.6vw,18px)}
.fs-trio figure{aspect-ratio:4/5;overflow:hidden;background:${C.stone}}
.fs-trio img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.16,1,.3,1)}
.fs-trio figure:hover img{transform:scale(1.04)}
.fs-day{background:#fff;border-top:1px solid ${C.stone};border-bottom:1px solid ${C.stone};padding:clamp(90px,13vh,140px) 0}
.fs-h{font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(32px,4.4vw,50px);text-align:center;margin:10px 0 clamp(36px,6vh,56px)}
.fs-daylist{max-width:680px;margin:0 auto}
.fs-dayrow{display:flex;align-items:baseline;gap:clamp(24px,5vw,60px);padding:22px 0;border-top:1px solid ${C.stone}}
.fs-dayrow:last-child{border-bottom:1px solid ${C.stone}}
.fs-t{font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(24px,3.4vw,34px);min-width:3em}
.fs-e{font-size:16px;color:rgba(35,36,31,.85)}
.fs-details{padding:clamp(90px,13vh,140px) 0}
.fs-det-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,84px);max-width:1000px;margin:0 auto}
.fs-details h3{font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(30px,4vw,46px);margin:12px 0 10px}
.fs-linku{display:inline-block;margin-top:20px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:${C.ink};text-decoration:none;border-bottom:1px solid ${C.ink};padding-bottom:5px;transition:color .3s,border-color .3s}
.fs-linku:hover{color:${C.clay};border-color:${C.clay}}
.fs-sw{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:24px;max-width:360px}
.fs-sw i{display:block;height:84px}
.fs-sw small{display:block;margin-top:7px;font-size:12px;color:rgba(35,36,31,.65)}
.fs-faqsec{padding:0 0 clamp(90px,13vh,140px)}
.fs-faq{max-width:660px;margin:0 auto}
.fs-faq details{border-top:1px solid ${C.stone}}
.fs-faq details:last-child{border-bottom:1px solid ${C.stone}}
.fs-faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 0;font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(18px,2.4vw,22px)}
.fs-faq summary::-webkit-details-marker{display:none}
.fs-pl{position:relative;width:14px;height:14px;flex:none;transition:transform .4s}
.fs-pl::before,.fs-pl::after{content:"";position:absolute;background:${C.ink}}
.fs-pl::before{left:0;top:6px;width:14px;height:1px}
.fs-pl::after{left:6px;top:0;width:1px;height:14px}
.fs-faq details[open] .fs-pl{transform:rotate(45deg)}
.fs-a{padding:0 0 24px;color:rgba(35,36,31,.8);max-width:56ch}
.fs-rsvpband{position:relative;padding:clamp(80px,12vh,130px) 20px;overflow:hidden}
.fs-rsvp-bg{position:absolute;inset:0;background:${C.leaf}}
.fs-rsvp-bg img{width:100%;height:100%;object-fit:cover}
.fs-card{position:relative;background:${C.cream};max-width:640px;margin:0 auto;padding:clamp(40px,6vw,68px) clamp(24px,6vw,60px)}
.fs-card h2{font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(32px,4.6vw,48px);text-align:center;line-height:1.12;margin-top:8px}
.fs-dl{text-align:center;margin:12px 0 clamp(30px,4vh,42px);font-size:14px;color:rgba(35,36,31,.7)}
.fs-f{display:block;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:rgba(35,36,31,.6);margin:24px 0 2px}
.fs-in{width:100%;background:transparent;border:0;border-bottom:1px solid rgba(35,36,31,.3);border-radius:0;padding:12px 2px;font:inherit;color:${C.ink};transition:border-color .35s}
.fs-in:focus{outline:none;border-bottom-color:${C.clay}}
.fs-in.err{border-bottom-color:#A33B2B}
.fs-in::placeholder{color:rgba(35,36,31,.35)}
.fs-two{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.fs-chips{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}
.fs-chip{font-weight:500;font-size:11px;letter-spacing:.26em;text-transform:uppercase;padding:14px 24px;border:1px solid rgba(35,36,31,.35);color:${C.ink};transition:all .3s}
.fs-chip.on{background:${C.ink};border-color:${C.ink};color:${C.cream}}
.fs-send{margin-top:38px;text-align:center}
.fs-btn{font-weight:500;font-size:11px;letter-spacing:.3em;text-transform:uppercase;padding:18px 40px;border:1px solid ${C.ink};background:${C.ink};color:${C.cream};transition:background .4s,border-color .4s}
.fs-btn:hover{background:${C.clay};border-color:${C.clay}}
.fs-btn:disabled{opacity:.6;cursor:default}
.fs-errmsg{margin-top:14px;text-align:center;font-size:13px;color:#A33B2B}
.fs-note{margin-top:14px;text-align:center;font-size:13px;color:rgba(35,36,31,.55)}
.fs-done{text-align:center;padding:10px 0 6px}
.fs-done-t{font-family:'Playfair Display',serif;font-weight:500;font-size:clamp(26px,3.6vw,36px);line-height:1.2}
.fs-done-s{margin-top:10px;color:rgba(35,36,31,.75)}
.fs-footer{background:${C.ink};color:${C.cream};text-align:center;padding:64px 20px 54px}
.fs-script2{font-family:'Bad Script',cursive;font-size:26px;color:#D9C9BE}
.fs-fnames{font-family:'Playfair Display',serif;font-weight:500;font-size:22px;letter-spacing:.06em;margin-top:8px}
.fs-cred{margin-top:26px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;font-weight:500;color:rgba(250,247,241,.5)}
.fs-cred a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(250,247,241,.35);padding-bottom:3px}
.fs-root .rv{opacity:0;transform:translateY(26px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
.fs-root .rv.in{opacity:1;transform:none}
@media (max-width:860px){.fs-story-grid{grid-template-columns:1fr}}
@media (max-width:820px){.fs-det-grid{grid-template-columns:1fr}.fs-two{grid-template-columns:1fr}}
@media (max-width:640px){.fs-hero h1{white-space:normal}.fs-bignames h2{white-space:normal;line-height:1.12}.fs-trio-grid{grid-template-columns:1fr 1fr}.fs-trio figure:last-child{display:none}}
@media (prefers-reduced-motion:reduce){.fs-root .rv{opacity:1;transform:none;transition:none}.fs-hero-bg img{animation:none;transform:none}.fs-down{animation:none}}
`;
