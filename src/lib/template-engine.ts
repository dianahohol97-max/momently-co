import type { TemplateConfig, Wedding } from '@/types/wedding';

export function generateCSSVariables(config: TemplateConfig): Record<string, string> {
  const vars: Record<string, string> = {};
  Object.entries(config.colors).forEach(([key, value]) => {
    vars[`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
  });
  vars['--font-heading'] = config.typography.headingFont;
  vars['--font-body'] = config.typography.bodyFont;
  vars['--font-accent'] = config.typography.accentFont;
  const widths = { narrow: '680px', medium: '900px', wide: '1100px' };
  const spacings = { compact: '2rem', comfortable: '4rem', spacious: '6rem' };
  vars['--content-width'] = widths[config.layout.contentWidth];
  vars['--section-spacing'] = spacings[config.layout.spacing];
  return vars;
}

export function getCountdown(weddingDate: string) {
  const diff = new Date(weddingDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false,
  };
}

export function formatWeddingDate(dateStr: string, locale: 'ua' | 'en' | 'ro' = 'ua'): string {
  const localeMap = { ua: 'uk-UA', en: 'en-GB', ro: 'ro-RO' };
  return new Date(dateStr).toLocaleDateString(localeMap[locale], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(timeStr: string, locale: 'ua' | 'en' | 'ro' = 'ua'): string {
  const [hours, minutes] = timeStr.split(':');
  if (locale === 'en') { const h = parseInt(hours); return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`; }
  return `${hours}:${minutes}`;
}

export function getCoupleDisplay(wedding: Wedding): string {
  switch (wedding.displayFormat) {
    case 'full-names': return `${wedding.partnerName1} ${wedding.partnerLastname1 || ''} & ${wedding.partnerName2} ${wedding.partnerLastname2 || ''}`.trim();
    case 'custom': return wedding.customDisplay || `${wedding.partnerName1} & ${wedding.partnerName2}`;
    default: return `${wedding.partnerName1} & ${wedding.partnerName2}`;
  }
}

export function getGoogleFontsUrl(fonts: string[]): string {
  const families = fonts.filter(Boolean).map(f => f.replace(/\s+/g, '+') + ':wght@300;400;500;600;700').join('&family=');
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}
