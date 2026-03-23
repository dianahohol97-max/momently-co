'use client';

import { useState, useEffect } from 'react';
import { getCountdown, formatWeddingDate, formatTime } from '@/lib/template-engine';

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

  const names = `${wedding.partner_name_1} & ${wedding.partner_name_2}`;
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
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div className="w-16 h-px mb-8" style={{ backgroundColor: colors.primary }} />

        <p
          className="text-xs uppercase tracking-[0.35em] mb-4"
          style={{ color: colors.textMuted, fontFamily: typography.bodyFont }}
        >
          Запрошуємо вас на наше весілля
        </p>

        <h1
          className="text-6xl md:text-8xl leading-tight"
          style={{ fontFamily: typography.headingFont, color: colors.text }}
        >
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
          <p
            className="text-lg"
            style={{ fontFamily: typography.accentFont, color: colors.textMuted }}
          >
            {formatWeddingDate(wedding.wedding_date, wedding.locale || 'ua')}
          </p>
        )}

        {wedding.ceremony_time && (
          <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
            {formatTime(wedding.ceremony_time, wedding.locale || 'ua')}
          </p>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: colors.primary }}>
            <path d="M10 14l-5-5h10l-5 5z" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      </section>

      {/* Countdown Section */}
      {wedding.wedding_date && (
        <CountdownSection weddingDate={wedding.wedding_date} colors={colors} typography={typography} />
      )}

      {/* Venue Section */}
      {venue.name && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.surface }}>
          <p
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{ color: colors.primary, fontFamily: typography.bodyFont }}
          >
            Місце проведення
          </p>
          <h2
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: typography.headingFont }}
          >
            {venue.name}
          </h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {venue.address}{venue.city ? `, ${venue.city}` : ''}
          </p>
          {venue.mapUrl && (
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg border transition-colors"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              Відкрити карту
            </a>
          )}
        </section>
      )}

      {/* Schedule Section */}
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{ color: colors.primary }}
          >
            Програма дня
          </p>
          <h2
            className="text-3xl md:text-4xl mb-10"
            style={{ fontFamily: typography.headingFont }}
          >
            Розклад
          </h2>

          <div className="space-y-8">
            {wedding.ceremony_time && (
              <TimelineItem
                time={formatTime(wedding.ceremony_time, wedding.locale)}
                label="Церемонія"
                colors={colors}
                typography={typography}
              />
            )}
            {schedule.receptionTime && (
              <TimelineItem
                time={schedule.receptionTime}
                label="Фуршет"
                colors={colors}
                typography={typography}
              />
            )}
            {schedule.dinnerTime && (
              <TimelineItem
                time={schedule.dinnerTime}
                label="Вечеря"
                colors={colors}
                typography={typography}
              />
            )}
            {schedule.partyTime && (
              <TimelineItem
                time={schedule.partyTime}
                label="Вечірка"
                colors={colors}
                typography={typography}
              />
            )}
          </div>
        </div>
      </section>

      {/* Details Section */}
      {wedding.details_data && (
        <DetailsSection details={wedding.details_data} colors={colors} typography={typography} />
      )}

      {/* Footer */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: colors.surface }}>
        <p
          className="text-2xl"
          style={{ fontFamily: typography.accentFont, color: colors.primary }}
        >
          Чекаємо на вас!
        </p>
        <p className="text-xs mt-4" style={{ color: colors.textMuted }}>
          {names}
        </p>
        {wedding.details_data?.hashtag && (
          <p className="text-xs mt-2" style={{ color: colors.primary }}>
            #{wedding.details_data.hashtag}
          </p>
        )}
      </section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function CountdownSection({ weddingDate, colors, typography }: any) {
  const [countdown, setCountdown] = useState(getCountdown(weddingDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(weddingDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  if (countdown.isPast) return null;

  const items = [
    { value: countdown.days, label: 'днів' },
    { value: countdown.hours, label: 'годин' },
    { value: countdown.minutes, label: 'хвилин' },
    { value: countdown.seconds, label: 'секунд' },
  ];

  return (
    <section className="py-20 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] mb-8" style={{ color: colors.primary }}>
        До весілля залишилось
      </p>
      <div className="flex items-center justify-center gap-6 md:gap-10">
        {items.map((item) => (
          <div key={item.label}>
            <div
              className="text-4xl md:text-5xl font-light tabular-nums"
              style={{ fontFamily: typography.headingFont, color: colors.text }}
            >
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: colors.textMuted }}>
              {item.label}
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
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors.primary }} />
      <div className="text-sm text-left" style={{ color: colors.text }}>
        {label}
      </div>
    </div>
  );
}

function DetailsSection({ details, colors, typography }: any) {
  const items = [
    { label: 'Дрес-код', value: details.dressCode },
    { label: 'Подарунки', value: details.giftRegistry },
    { label: 'Проживання', value: details.accommodationInfo },
    { label: 'Транспорт', value: details.transportInfo },
    { label: 'Примітки', value: details.specialNotes },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <section className="py-20 px-6" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: colors.primary }}>
          Деталі
        </p>
        <h2 className="text-3xl mb-10" style={{ fontFamily: typography.headingFont }}>
          Корисна інформація
        </h2>

        <div className="space-y-6 text-left">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.primary }}>
                {item.label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
