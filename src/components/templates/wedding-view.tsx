'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCountdown, formatWeddingDate, formatTime } from '@/lib/template-engine';
import { RSVPForm } from '@/components/rsvp/rsvp-form';

interface WeddingViewProps { wedding: any; template: any; }

export function WeddingView({ wedding, template }: WeddingViewProps) {
  const config = template?.config_json || {};
  const colors = config.colors || { primary: '#b8956a', secondary: '#8B6F4E', accent: '#E8D4C4', background: '#FDF8F4', surface: '#FFFFFF', text: '#3D3027', textMuted: '#8A7B6B', border: '#E8E0D4' };
  const typography = config.typography || { headingFont: 'Playfair Display', bodyFont: 'DM Sans', accentFont: 'Cormorant Garamond' };
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
  const venue = wedding.venue_data?.ceremony || {};
  const schedule = wedding.schedule_data || {};
  const rsvpEnabled = wedding.rsvp_settings?.enabled !== false;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text, fontFamily: typography.bodyFont }}>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div className="w-16 h-px mb-8" style={{ backgroundColor: colors.primary }} />
        <p className="text-xs uppercase tracking-[0.35em] mb-4" style={{ color: colors.textMuted }}>Запрошуємо вас на наше весілля</p>
        <h1 className="text-6xl md:text-8xl leading-tight" style={{ fontFamily: typography.headingFont }}>
          {wedding.partner_name_1}<br /><span style={{ color: colors.primary, fontFamily: typography.accentFont, fontStyle: 'italic' }}>&amp;</span><br />{wedding.partner_name_2}
        </h1>
        <div className="w-16 h-px mt-8 mb-6" style={{ backgroundColor: colors.primary }} />
        {wedding.wedding_date && <p className="text-lg" style={{ fontFamily: typography.accentFont, color: colors.textMuted }}>{formatWeddingDate(wedding.wedding_date, wedding.locale || 'ua')}</p>}
        {wedding.ceremony_time && <p className="text-sm mt-1" style={{ color: colors.textMuted }}>{formatTime(wedding.ceremony_time, wedding.locale || 'ua')}</p>}
      </section>

      {wedding.wedding_date && <CountdownSection weddingDate={wedding.wedding_date} colors={colors} typography={typography} />}

      {venue.name && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.surface }}>
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: colors.primary }}>Місце проведення</p>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: typography.headingFont }}>{venue.name}</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>{venue.address}{venue.city ? ', ' + venue.city : ''}</p>
        </section>
      )}

      <section className="py-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: colors.primary }}>Програма дня</p>
          <h2 className="text-3xl md:text-4xl mb-10" style={{ fontFamily: typography.headingFont }}>Розклад</h2>
          <div className="space-y-8">
            {wedding.ceremony_time && <TL time={formatTime(wedding.ceremony_time, wedding.locale)} label="Церемонія" c={colors} t={typography} />}
            {schedule.receptionTime && <TL time={schedule.receptionTime} label="Фуршет" c={colors} t={typography} />}
            {schedule.dinnerTime && <TL time={schedule.dinnerTime} label="Вечеря" c={colors} t={typography} />}
            {schedule.partyTime && <TL time={schedule.partyTime} label="Вечірка" c={colors} t={typography} />}
          </div>
        </div>
      </section>

      {wedding.details_data && <Details d={wedding.details_data} c={colors} t={typography} />}

      {rsvpEnabled && <RSVPForm weddingId={wedding.id} colors={colors} typography={typography} />}

      {/* Guest Camera CTA */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: colors.surface }}>
        <p className="text-3xl mb-3">📸</p>
        <h2 className="text-2xl mb-2" style={{ fontFamily: typography.headingFont, color: colors.text }}>Гостьова камера</h2>
        <p className="text-sm mb-6" style={{ color: colors.textMuted }}>Завантажте фото з нашого свята!</p>
        <Link href={'/w/' + wedding.slug + '/camera'} className="inline-block px-6 py-3 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: colors.primary, color: colors.background }}>
          Відкрити камеру
        </Link>
      </section>

      <section className="py-16 px-6 text-center" style={{ backgroundColor: colors.background }}>
        <p className="text-2xl" style={{ fontFamily: typography.accentFont, color: colors.primary }}>Чекаємо на вас!</p>
        <p className="text-xs mt-4" style={{ color: colors.textMuted }}>{names}</p>
        {wedding.details_data?.hashtag && <p className="text-xs mt-2" style={{ color: colors.primary }}>#{wedding.details_data.hashtag}</p>}
      </section>
    </div>
  );
}

function CountdownSection({ weddingDate, colors, typography }: any) {
  const [cd, setCd] = useState(getCountdown(weddingDate));
  useEffect(() => { const i = setInterval(() => setCd(getCountdown(weddingDate)), 1000); return () => clearInterval(i); }, [weddingDate]);
  if (cd.isPast) return null;
  return (
    <section className="py-20 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] mb-8" style={{ color: colors.primary }}>До весілля залишилось</p>
      <div className="flex items-center justify-center gap-6 md:gap-10">
        {[{v:cd.days,l:'днів'},{v:cd.hours,l:'годин'},{v:cd.minutes,l:'хвилин'},{v:cd.seconds,l:'секунд'}].map(i=>(
          <div key={i.l}><div className="text-4xl md:text-5xl font-light tabular-nums" style={{fontFamily:typography.headingFont,color:colors.text}}>{String(i.v).padStart(2,'0')}</div><div className="text-[10px] uppercase tracking-widest mt-1" style={{color:colors.textMuted}}>{i.l}</div></div>
        ))}
      </div>
    </section>
  );
}

function TL({time,label,c,t}:any){return(<div className="flex items-center gap-6"><div className="text-lg w-16 text-right tabular-nums" style={{fontFamily:t.accentFont,color:c.primary}}>{time}</div><div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:c.primary}}/><div className="text-sm text-left" style={{color:c.text}}>{label}</div></div>);}

function Details({d,c,t}:any){
  const items=[{l:'Дрес-код',v:d.dressCode},{l:'Подарунки',v:d.giftRegistry},{l:'Проживання',v:d.accommodationInfo},{l:'Транспорт',v:d.transportInfo},{l:'Примітки',v:d.specialNotes}].filter(i=>i.v);
  if(!items.length)return null;
  return(<section className="py-20 px-6" style={{backgroundColor:c.surface}}><div className="max-w-lg mx-auto text-center"><p className="text-xs uppercase tracking-[0.25em] mb-3" style={{color:c.primary}}>Деталі</p><h2 className="text-3xl mb-10" style={{fontFamily:t.headingFont}}>Корисна інформація</h2><div className="space-y-6 text-left">{items.map(i=>(<div key={i.l}><p className="text-xs uppercase tracking-widest mb-1" style={{color:c.primary}}>{i.l}</p><p className="text-sm leading-relaxed" style={{color:c.textMuted}}>{i.v}</p></div>))}</div></div></section>);
}
