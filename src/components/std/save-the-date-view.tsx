'use client';
import { useEffect, useState } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

export interface StdTheme {
  background: string; text: string; accent: string;
  headingFont: string; bodyFont: string; accentFont?: string;
}
export interface StdData {
  slug: string; locale?: string;
  partner_name_1: string; partner_name_2: string;
  wedding_date: string; wedding_date_display?: string;
  location?: string; hero_image_url?: string | null;
  published: boolean;
}

function fontsHref(theme: StdTheme) {
  const fams = Array.from(new Set([theme.headingFont, theme.bodyFont, theme.accentFont].filter(Boolean))) as string[];
  return 'https://fonts.googleapis.com/css2?' + fams.map(f => 'family=' + f.replace(/ /g, '+') + ':ital,wght@0,400;0,500;1,400').join('&') + '&display=swap';
}

export default function SaveTheDateView({ data, theme }: { data: StdData; theme: StdTheme }) {
  const L = normalizeLocale(data.locale);
  const t = (k: string, v?: Record<string, string | number>) => tr(L, k, v);
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(Math.max(0, Math.floor((new Date(data.wedding_date).getTime() - Date.now()) / 86400000)));
  }, [data.wedding_date]);

  const photo = !!data.hero_image_url;
  const fg = photo ? '#FFFFFF' : theme.text;
  const names = data.partner_name_1 + ' & ' + data.partner_name_2;
  const dateDisplay = data.wedding_date_display ||
    new Date(data.wedding_date).toLocaleDateString(L === 'uk' ? 'uk-UA' : L, { day: 'numeric', month: 'long', year: 'numeric' });

  const gcal = () => {
    const d = new Date(data.wedding_date);
    const p = (n: number) => String(n).padStart(2, '0');
    const stamp = (x: Date) => `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
    const end = new Date(d.getTime() + 6 * 3600 * 1000);
    const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent('💍 ' + names)
      + '&dates=' + stamp(d) + '/' + stamp(end)
      + (data.location ? '&location=' + encodeURIComponent(data.location) : '')
      + '&details=' + encodeURIComponent('Save the Date · momently.co/std/' + data.slug);
    window.open(url, '_blank');
  };

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://momently.co';
  const stdUrl = siteUrl + '/std/' + data.slug;
  const shareText = t('saveTheDate') + ' — ' + names + ' · ' + dateDisplay + ' · ' + stdUrl;
  const shareTg = () => window.open('https://t.me/share/url?url=' + encodeURIComponent(stdUrl) + '&text=' + encodeURIComponent(t('saveTheDate') + ' — ' + names));
  const shareVb = () => window.open('viber://forward?text=' + encodeURIComponent(shareText));
  const shareWa = () => window.open('https://wa.me/?text=' + encodeURIComponent(shareText));

  return (
    <div className="std-root">
      <style>{`
        @import url('${fontsHref(theme)}');
        .std-root{min-height:100vh;min-height:100svh;position:relative;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;background:${theme.background};color:${fg};font-family:'${theme.bodyFont}',system-ui,sans-serif;padding:40px 20px}
        .std-root *{margin:0;box-sizing:border-box}
        .std-bg{position:absolute;inset:0}
        .std-bg img{width:100%;height:100%;object-fit:cover}
        .std-veil{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(15,17,15,.42),rgba(15,17,15,.18) 45%,rgba(15,17,15,.5))}
        .std-in{position:relative;max-width:820px}
        .std-eyebrow{font-size:12px;letter-spacing:.42em;text-transform:uppercase;font-weight:500;color:${photo ? '#fff' : theme.accent}}
        .std-names{font-family:'${theme.headingFont}',Georgia,serif;font-weight:400;font-size:clamp(44px,10.5vw,120px);line-height:1.04;margin:22px 0 18px}
        .std-names em{font-style:italic;font-size:.5em;vertical-align:.28em;opacity:.85}
        .std-date{font-size:clamp(15px,2vw,19px);letter-spacing:.3em;text-transform:uppercase;font-weight:500}
        .std-loc{margin-top:10px;font-size:13px;letter-spacing:.22em;text-transform:uppercase;opacity:.8}
        .std-count{margin-top:14px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:${photo ? '#fff' : theme.accent};opacity:.9}
        .std-rule{width:56px;height:1px;background:currentColor;opacity:.4;margin:30px auto}
        .std-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .std-btn{font-family:inherit;font-size:11px;letter-spacing:.26em;text-transform:uppercase;font-weight:500;padding:15px 26px;border:1px solid currentColor;background:transparent;color:inherit;cursor:pointer;text-decoration:none;transition:opacity .3s}
        .std-btn:hover{opacity:.75}
        .std-btn.solid{background:${photo ? '#fff' : theme.text};color:${photo ? '#1c1d1a' : theme.background};border-color:${photo ? '#fff' : theme.text}}
        .std-share{margin-top:26px;display:flex;gap:22px;justify-content:center;font-size:11px;letter-spacing:.2em;text-transform:uppercase}
        .std-share button{background:none;border:none;color:inherit;cursor:pointer;opacity:.75;border-bottom:1px solid currentColor;padding:0 0 3px;font-family:inherit;letter-spacing:inherit;font-size:inherit;text-transform:inherit}
        .std-share button:hover{opacity:1}
        .std-soon{margin-top:30px;font-size:13px;opacity:.75}
        .std-cred{position:absolute;bottom:18px;left:0;right:0;text-align:center;font-size:10px;letter-spacing:.28em;text-transform:uppercase;opacity:.5}
        .std-rv{opacity:0;transform:translateY(18px);animation:stdUp .9s cubic-bezier(.16,1,.3,1) forwards}
        @keyframes stdUp{to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.std-rv{animation:none;opacity:1;transform:none}}
      `}</style>

      {photo && <div className="std-bg"><img src={data.hero_image_url!} alt="" /></div>}
      {photo && <div className="std-veil" />}

      <div className="std-in">
        <p className="std-eyebrow std-rv">{t('saveTheDate')}</p>
        <h1 className="std-names std-rv" style={{ animationDelay: '.08s' }}>
          {data.partner_name_1}<em> &amp; </em>{data.partner_name_2}
        </h1>
        <p className="std-date std-rv" style={{ animationDelay: '.16s' }}>{dateDisplay}</p>
        {data.location && <p className="std-loc std-rv" style={{ animationDelay: '.22s' }}>{data.location}</p>}
        {days !== null && <p className="std-count std-rv" style={{ animationDelay: '.28s' }}>{t('daysTo', { n: days })}</p>}
        <div className="std-rule std-rv" style={{ animationDelay: '.34s' }} />
        <div className="std-btns std-rv" style={{ animationDelay: '.4s' }}>
          <button className="std-btn" onClick={gcal}>Google Calendar</button>
          <a className="std-btn" href={'/api/std/' + data.slug + '/calendar'}>Apple / Outlook (.ics)</a>
        </div>
        <div className="std-share std-rv" style={{ animationDelay: '.46s' }}>
          <button onClick={shareTg}>Telegram</button>
          <button onClick={shareVb}>Viber</button>
          <button onClick={shareWa}>WhatsApp</button>
        </div>
        {data.published ? (
          <div className="std-rv" style={{ animationDelay: '.52s', marginTop: 30 }}>
            <a className="std-btn solid" href={'/w/' + data.slug}>{t('stdOnSite')}</a>
          </div>
        ) : (
          <p className="std-soon std-rv" style={{ animationDelay: '.52s' }}>{t('detailsSoon')}</p>
        )}
      </div>
      <p className="std-cred">momently.co</p>
    </div>
  );
}
