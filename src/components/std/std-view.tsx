'use client';
import { useState, useEffect } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

export interface StdTheme {
  bg: string; text: string; accent: string;
  headingFont: string; accentFont?: string;
}

export default function StdView({
  slug, name1, name2, dateISO, dateDisplay, location, locale, theme, siteUrl,
}: {
  slug: string; name1: string; name2: string; dateISO: string; dateDisplay: string;
  location?: string; locale?: string; theme: StdTheme; siteUrl?: string | null;
}) {
  const L = normalizeLocale(locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [days, setDays] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDays(Math.max(0, Math.floor((new Date(dateISO).getTime() - Date.now()) / 86400000)));
  }, [dateISO]);

  const fonts = [theme.headingFont, theme.accentFont].filter(Boolean)
    .map(f => 'family=' + encodeURIComponent(String(f)).replace(/%20/g, '+')).join('&');

  const gcal = () => {
    const s = new Date(dateISO);
    const e = new Date(s.getTime() + 6 * 3600 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const names = name1 + ' & ' + name2;
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent('Весілля — ' + names)
      + '&dates=' + fmt(s) + '/' + fmt(e)
      + (location ? '&location=' + encodeURIComponent(location) : '');
  };

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = name1 + ' & ' + name2 + ' · ' + dateDisplay;
  const copy = () => { navigator.clipboard.writeText(pageUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="std-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?${fonts}&family=Golos+Text:wght@400;500&display=swap');
        .std-root{min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;background:${theme.bg};color:${theme.text};font-family:'Golos Text',system-ui,sans-serif;text-align:center;padding:32px 20px}
        .std-root *{margin:0;box-sizing:border-box}
        .std-in{max-width:760px;width:100%}
        .std-caps{font-size:12px;letter-spacing:.4em;text-transform:uppercase;font-weight:500;color:${theme.accent}}
        .std-names{font-family:'${theme.headingFont}',Georgia,serif;font-weight:400;font-size:clamp(44px,11vw,110px);line-height:1.05;margin:26px 0 22px}
        .std-names em{font-style:italic;font-size:.44em;vertical-align:.32em;opacity:.8}
        .std-date{font-size:clamp(15px,2vw,19px);letter-spacing:.34em;text-transform:uppercase;font-weight:500}
        .std-loc{margin-top:10px;font-size:14px;letter-spacing:.14em;opacity:.75}
        .std-count{margin-top:14px;font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:${theme.accent}}
        .std-rule{width:56px;height:1px;background:${theme.accent};opacity:.6;margin:34px auto}
        .std-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .std-btn{display:inline-block;font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:500;padding:16px 30px;border:1px solid ${theme.text};color:${theme.text};text-decoration:none;background:transparent;cursor:pointer;transition:background .3s,color .3s}
        .std-btn:hover{background:${theme.text};color:${theme.bg}}
        .std-btn.solid{background:${theme.accent};border-color:${theme.accent};color:#fff}
        .std-btn.solid:hover{opacity:.88}
        .std-coming{margin-top:26px;font-size:13px;letter-spacing:.1em;opacity:.65}
        .std-share{margin-top:38px;display:flex;gap:18px;justify-content:center;align-items:center;flex-wrap:wrap;font-size:12px;letter-spacing:.14em}
        .std-share a,.std-share button{color:${theme.text};opacity:.75;text-decoration:underline;text-underline-offset:4px;background:none;border:none;cursor:pointer;font:inherit;letter-spacing:inherit}
        .std-share a:hover,.std-share button:hover{opacity:1}
        .std-cred{margin-top:46px;font-size:10px;letter-spacing:.26em;text-transform:uppercase;opacity:.4}
        .std-cred a{color:inherit;text-decoration:none}
        .std-rv{opacity:0;transform:translateY(22px);animation:stdIn .9s cubic-bezier(.16,1,.3,1) forwards}
        @keyframes stdIn{to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.std-rv{animation:none;opacity:1;transform:none}}
      `}</style>
      <div className="std-in">
        <p className="std-caps std-rv">{t('saveTheDate')}</p>
        <h1 className="std-names std-rv" style={{ animationDelay: '.08s' }}>
          {name1}<em> {t('and')} </em>{name2}
        </h1>
        <p className="std-date std-rv" style={{ animationDelay: '.16s' }}>{dateDisplay}</p>
        {location && <p className="std-loc std-rv" style={{ animationDelay: '.22s' }}>{location}</p>}
        {days !== null && <p className="std-count std-rv" style={{ animationDelay: '.28s' }}>{t('daysTo', { n: days })}</p>}
        <div className="std-rule std-rv" style={{ animationDelay: '.34s' }} />
        <div className="std-btns std-rv" style={{ animationDelay: '.4s' }}>
          <a className="std-btn" href={gcal()} target="_blank" rel="noopener noreferrer">Google Calendar</a>
          <a className="std-btn" href={'/api/ics/' + slug}>{t('addToCalendar')}</a>
          {siteUrl && <a className="std-btn solid" href={siteUrl}>{t('stdOpenSite')}</a>}
        </div>
        {!siteUrl && <p className="std-coming std-rv" style={{ animationDelay: '.46s' }}>{t('stdComing')}</p>}
        <div className="std-share std-rv" style={{ animationDelay: '.52s' }}>
          <span style={{ opacity: 0.5 }}>{t('stdShare')}:</span>
          <a href={'https://t.me/share/url?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer">Telegram</a>
          <a href={'viber://forward?text=' + encodeURIComponent(shareText + ' ' + pageUrl)}>Viber</a>
          <a href={'https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + pageUrl)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <button onClick={copy}>{copied ? '✓' : 'URL'}</button>
        </div>
        <p className="std-cred"><a href="https://momently.co" target="_blank" rel="noopener noreferrer">momently.co</a></p>
      </div>
    </div>
  );
}
