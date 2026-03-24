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

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text, fontFamily: typography.bodyFont }}>
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

      {wedding.wedding_date && <CD d={wedding.wedding_date} c={colors} t={typography} />}

      {venue.name && (
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.surface }}>
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: colors.primary }}>Місце проведення</p>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: typography.headingFont }}>{venue.name}</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>{venue.address}{venue.city ? ', ' + venue.city : ''}</p>
