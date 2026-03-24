'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCountdown, formatWeddingDate, formatTime } from '@/lib/template-engine';
import { RSVPForm } from '@/components/rsvp/rsvp-form';

interface WeddingViewProps {
  wedding: any;
  template: any;
}

export function WeddingView({ wedding, template }: WeddingViewProps) {
  const config = template?.config_json || {};
  const colors = config.colors || {
    primary: '#b8956a',
    secondary: '#8B6F4E',
    accent: '#E8D4C4',
    background: '#FDF8F4',
    surface: '#FFFFFF',
    text: '#3D3027',
    textMuted: '#8A7B6B',
    border: '#E8E0D4',
  };
  const typography = config.typography || {
    headingFont: 'Playfair Display',
    bodyFont: 'DM Sans',
    accentFont: 'Cormorant Garamond',
  };
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
  const venue = wedding.venue_data?.ceremony || {};
  const schedule = wedding.schedule_data || {};

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: typography.bodyFont,
      }}
    >
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-px mb-8" style={{ backgroundColor: colors.primary }} />
        <p className="text-xs uppercase tracking-[0.35em] mb-4" style={{ color: colors.textMuted }}>
          {String.fromCharCode(1047, 1072, 1087, 1088, 1086, 1096, 1091, 1108, 1084, 1086, 32, 1074, 1072, 1089, 32, 1085, 1072, 32, 1085, 1072, 1096, 1077, 32, 1074, 1077, 1089, 1110, 1083, 1083, 1103)}
        </p>
        <h1 className="text-6xl md:text-8xl leading-tight" style={{ fontFamily: typography.headingFont }}>
          {wedding.partner_name_1}
          <br />
          <span style={{ color: colors.primary, fontFamily: typography.accentFont, fontStyle: 'italic' }}>
            &amp;
          </span>
          <br />
          {wedding.partner_name_2}
        </h1>
        <div className="w-16 h-px mt-8 mb-6" style={{ backgroundColor: colors.primary }} />
        {wedding.wedding_date && (
          <p className="text-lg" style={{ fontFamily: typography.accentFont, color: colors.textMuted }}>
            {formatWeddingDate(wedding.wedding_date, wedding.locale || 'ua')}
          </p>
        )}
        {wedding.ceremony_time && (
          <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
            {formatTime(wedding.ceremony_time, wedding.locale || 'ua')}
          </p>
        )}
      </section>

      {wedding.wedding_date && (
        <Countdown date={wedding.wedding_date} colors={colors} typography={typography} />
      )}

      {venue.name && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.surface }}>
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: colors.primary }}>
            {String.fromCharCode(1052, 1110, 1089, 1094, 1077, 32, 1087, 1088, 1086, 1074, 1077, 1076, 1077, 1085, 1085, 1103)}
          </p>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: typography.headingFont }}>
            {venue.name}
          </h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {venue.address}
            {venue.city ? ', ' + venue.city : ''}
          </p>
        </section>
      )}

      <section className="py-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: colors.primary }}>
            {String.fromCharCode(1055, 1088, 1086, 1075, 1088, 1072, 1084, 1072, 32, 1076, 1085, 1103)}
          </p>
          <h2 className="text-3xl md:text-4xl mb-10" style={{ fontFamily: typography.headingFont }}>
            {String.fromCharCode(1056, 1086, 1079, 1082, 1083, 1072, 1076)}
          </h2>
          <div className="space-y-8">
            {wedding.ceremony_time && (
              <TimelineItem
                time={formatTime(wedding.ceremony_time, wedding.locale)}
                label={String.fromCharCode(1062, 1077, 1088, 1077, 1084, 1086, 1085, 1110, 1103)}
                colors={colors}
                typography={typography}
              />
            )}
            {schedule.receptionTime && (
              <TimelineItem
                time={schedule.receptionTime}
                label={String.fromCharCode(1060, 1091, 1088, 1096, 1077, 1090)}
                colors={colors}
                typography={typography}
              />
            )}
            {schedule.dinnerTime && (
              <TimelineItem
                time={schedule.dinnerTime}
                label={String.fromCharCode(1042, 1077, 1095, 1077, 1088, 1103)}
                colors={colors}
                typography={typography}
              />
            )}
            {schedule.partyTime && (
              <TimelineItem
                time={schedule.partyTime}
                label={String.fromCharCode(1042, 1077, 1095, 1110, 1088, 1082, 1072)}
                colors={colors}
                typography={typography}
              />
            )}
          </div>
        </div>
      </section>

      <RSVPForm weddingId={wedding.id} colors={colors} typography={typography} />

      <section className="py-16 px-6" style={{ backgroundColor: colors.surface }}>
        <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={'/w/' + wedding.slug + '/camera'}
            className="flex flex-col items-center gap-2 py-8 rounded-xl border transition-colors hover:shadow-md"
            style={{ borderColor: colors.border, backgroundColor: colors.background }}
          >
            <span className="text-3xl">{'\ud83d\udcf8'}</span>
            <span className="text-sm font-medium" style={{ color: colors.text }}>
              {String.fromCharCode(1043, 1086, 1089, 1090, 1100, 1086, 1074, 1072, 32, 1082, 1072, 1084, 1077, 1088, 1072)}
            </span>
          </Link>
          <Link
            href={'/w/' + wedding.slug + '/guestbook'}
            className="flex flex-col items-center gap-2 py-8 rounded-xl border transition-colors hover:shadow-md"
            style={{ borderColor: colors.border, backgroundColor: colors.background }}
          >
            <span className="text-3xl">{'\ud83d\udcd6'}</span>
            <span className="text-sm font-medium" style={{ color: colors.text }}>
              {String.fromCharCode(1050, 1085, 1080, 1075, 1072, 32, 1075, 1086, 1089, 1090, 1077, 1081)}
            </span>
          </Link>
          <Link
            href={'/w/' + wedding.slug + '/booth'}
            className="flex flex-col items-center gap-2 py-8 rounded-xl border transition-colors hover:shadow-md"
            style={{ borderColor: colors.border, backgroundColor: colors.background }}
          >
            <span className="text-3xl">{'\ud83c\udfad'}</span>
            <span className="text-sm font-medium" style={{ color: colors.text }}>
              {String.fromCharCode(1060, 1086, 1090, 1086, 1073, 1091, 1076, 1082, 1072)}
            </span>
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 text-center" style={{ backgroundColor: colors.background }}>
        <p className="text-2xl" style={{ fontFamily: typography.accentFont, color: colors.primary }}>
          {String.fromCharCode(1063, 1077, 1082, 1072, 1108, 1084, 1086, 32, 1085, 1072, 32, 1074, 1072, 1089, 33)}
        </p>
        <p className="text-xs mt-4" style={{ color: colors.textMuted }}>
          {names}
        </p>
      </section>
    </div>
  );
}

function Countdown({ date, colors, typography }: any) {
  const [cd, setCd] = useState(getCountdown(date));

  useEffect(() => {
    const i = setInterval(() => setCd(getCountdown(date)), 1000);
    return () => clearInterval(i);
  }, [date]);

  if (cd.isPast) return null;

  const items = [
    { v: cd.days, l: String.fromCharCode(1076, 1085, 1110, 1074) },
    { v: cd.hours, l: String.fromCharCode(1075, 1086, 1076, 1080, 1085) },
    { v: cd.minutes, l: String.fromCharCode(1093, 1074, 1080, 1083, 1080, 1085) },
    { v: cd.seconds, l: String.fromCharCode(1089, 1077, 1082, 1091, 1085, 1076) },
  ];

  return (
    <section className="py-20 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] mb-8" style={{ color: colors.primary }}>
        {String.fromCharCode(1044, 1086, 32, 1074, 1077, 1089, 1110, 1083, 1083, 1103, 32, 1079, 1072, 1083, 1080, 1096, 1080, 1083, 1086, 1089, 1100)}
      </p>
      <div className="flex items-center justify-center gap-6 md:gap-10">
        {items.map((i) => (
          <div key={i.l}>
            <div
              className="text-4xl md:text-5xl font-light tabular-nums"
              style={{ fontFamily: typography.headingFont, color: colors.text }}
            >
              {String(i.v).padStart(2, '0')}
            </div>
            <div
              className="text-[10px] uppercase tracking-widest mt-1"
              style={{ color: colors.textMuted }}
            >
              {i.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineItem({ time, label, colors, typography }: any) {
  return (
    <div className="flex items-center gap-6">
      <div
        className="text-lg w-16 text-right tabular-nums"
        style={{ fontFamily: typography.accentFont, color: colors.primary }}
      >
        {time}
      </div>
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: colors.primary }}
      />
      <div className="text-sm text-left" style={{ color: colors.text }}>
        {label}
      </div>
    </div>
  );
}
