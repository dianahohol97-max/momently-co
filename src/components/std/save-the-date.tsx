'use client';
import { useState, useEffect } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

export interface StdProps {
  slug: string; locale?: string;
  partner_name_1: string; partner_name_2: string;
  wedding_date: string; location?: string;
  published: boolean;
  colors: { background: string; text: string; primary: string };
  headingFont: string;
}

function pad(n: number) { return String(n).padStart(2, '0'); }
function icsDate(d: Date) {
  return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00';
}

export default function SaveTheDate(p: StdProps) {
  const L = normalizeLocale(p.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(Math.max(0, Math.floor((new Date(p.wedding_date).getTime() - Date.now()) / 86400000)));
  }, [p.wedding_date]);

  const names = p.partner_name_1 + ' & ' + p.partner_name_2;
  const d = new Date(p.wedding_date);
  const dateHuman = d.toLocaleDateString(L === 'uk' ? 'uk-UA' : L, { day: 'numeric', month: 'long', year: 'numeric' });
  const start = icsDate(d);
  const end = icsDate(new Date(d.getTime() + 6 * 3600 * 1000));
  const summary = t('stdEvent', { names });
  const siteUrl = (typeof window !== 'undefined' ? window.location.origin : 'https://momently.co') + '/w/' + p.slug;

  const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(summary)
    + '&dates=' + start + '/' + end
    + (p.location ? '&location=' + encodeURIComponent(p.location) : '')
    + '&details=' + encodeURIComponent(siteUrl);

  const downloadIcs = () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Momently//SaveTheDate//UK', 'BEGIN:VEVENT',
      'UID:' + p.slug + '@momently.co', 'DTSTAMP:' + icsDate(new Date()) + 'Z',
      'DTSTART:' + start, 'DTEND:' + end,
      'SUMMARY:' + summary.replace(/,/g, '\\,'),
      p.location ? 'LOCATION:' + p.location.replace(/,/g, '\\,') : '',
      'URL:' + siteUrl, 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'save-the-date-' + p.slug + '.ics';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const shareText = t('stdShareText', { names, date: dateHuman });
  const stdUrl = typeof window !== 'undefined' ? window.location.href : '';
  const C = p.colors;

  return (
    <div className="std-root" style={{ background: C.background, color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${p.headingFont.replace(/ /g, '+')}&family=Golos+Text:wght@400;500&display=swap');
        .std-root{min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Golos Text',system-ui,sans-serif;padding:24px;position:relative}
        .std-frame{position:absolute;inset:14px;border:1px solid ${C.primary};opacity:.5;pointer-events:none}
        .std-in{max-width:760px;position:relative}
        .std-caps{font-size:12px;letter-spacing:.42em;text-transform:uppercase;font-weight:500;color:${C.primary}}
        .std-names{font-family:'${p.headingFont}',Georgia,serif;font-weight:400;font-size:clamp(44px,11vw,110px);line-height:1.04;margin:22px 0}
        .std-date{font-size:clamp(15px,2.2vw,19px);letter-spacing:.28em;text-transform:uppercase;font-weight:500}
        .std-loc{margin-top:8px;font-size:14px;opacity:.75}
        .std-count{margin-top:14px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:${C.primary};font-weight:500}
        .std-rule{width:56px;height:1px;background:${C.primary};margin:30px auto;opacity:.7}
        .std-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .std-btn{font-family:inherit;font-weight:500;font-size:11px;letter-spacing:.24em;text-transform:uppercase;padding:16px 28px;border:1px solid ${C.text};background:transparent;color:${C.text};cursor:pointer;text-decoration:none;display:inline-block;transition:background .3s,color .3s}
        .std-btn:hover{background:${C.text};color:${C.background}}
        .std-btn.fill{background:${C.primary};border-color:${C.primary};color:${C.background}}
        .std-share{margin-top:26px;display:flex;gap:20px;justify-content:center;font-size:12px;letter-spacing:.14em;text-transform:uppercase}
        .std-share a{color:${C.text};opacity:.7;text-decoration:none;border-bottom:1px solid ${C.primary};padding-bottom:3px}
        .std-share a:hover{opacity:1}
        .std-soon{margin-top:30px;font-size:13px;opacity:.65}
        .std-site{margin-top:30px}
        .std-cred{position:absolute;bottom:22px;left:0;right:0;font-size:10px;letter-spacing:.26em;text-transform:uppercase;opacity:.4}
        .std-rv{opacity:0;transform:translateY(18px);animation:stdIn .9s cubic-bezier(.16,1,.3,1) forwards}
        @keyframes stdIn{to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.std-rv{animation:none;opacity:1;transform:none}}
      `}</style>
      <span className="std-frame" aria-hidden="true" />
      <div className="std-in">
        <p className="std-caps std-rv">Save the Date</p>
        <h1 className="std-names std-rv" style={{ animationDelay: '.1s' }}>{p.partner_name_1}<br />&amp; {p.partner_name_2}</h1>
        <p className="std-date std-rv" style={{ animationDelay: '.2s' }}>{dateHuman}</p>
        {p.location && <p className="std-loc std-rv" style={{ animationDelay: '.26s' }}>{p.location}</p>}
        {days !== null && <p className="std-count std-rv" style={{ animationDelay: '.32s' }}>{t('daysTo', { n: days })}</p>}
        <div className="std-rule std-rv" style={{ animationDelay: '.4s' }} />
        <div className="std-btns std-rv" style={{ animationDelay: '.48s' }}>
          <a className="std-btn fill" href={googleUrl} target="_blank" rel="noopener noreferrer">{t('stdGoogle')}</a>
          <button className="std-btn" onClick={downloadIcs}>{t('stdIcs')}</button>
        </div>
        <div className="std-share std-rv" style={{ animationDelay: '.56s' }}>
          <a href={'https://t.me/share/url?url=' + encodeURIComponent(stdUrl) + '&text=' + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer">Telegram</a>
          <a href={'viber://forward?text=' + encodeURIComponent(shareText + ' ' + stdUrl)}>Viber</a>
          <a href={'https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + stdUrl)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
        {p.published
          ? <div className="std-site std-rv" style={{ animationDelay: '.64s' }}><a className="std-btn" href={'/w/' + p.slug}>{t('stdSite')}</a></div>
          : <p className="std-soon std-rv" style={{ animationDelay: '.64s' }}>{t('stdSoon')}</p>}
      </div>
      <p className="std-cred">momently.co</p>
    </div>
  );
}
