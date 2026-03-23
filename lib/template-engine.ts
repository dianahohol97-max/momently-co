import type { TemplateConfig, TemplateColors, Wedding } from '@/types/wedding';

// Generate CSS variables from template config
export function generateCSSVariables(config: TemplateConfig): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  Object.entries(config.colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    vars[`--color-${cssKey}`] = value;
  });

  // Typography
  vars['--font-heading'] = config.typography.headingFont;
  vars['--font-body'] = config.typography.bodyFont;
  vars['--font-accent'] = config.typography.accentFont;

  // Layout
  const widths = { narrow: '680px', medium: '900px', wide: '1100px' };
  const spacings = { compact: '2rem', comfortable: '4rem', spacious: '6rem' };
  vars['--content-width'] = widths[config.layout.contentWidth];
  vars['--section-spacing'] = spacings[config.layout.spacing];

  return vars;
}

// Convert CSS variables to inline style string
export function cssVarsToStyle(vars: Record<string, string>): React.CSSProperties {
  const style: Record<string, string> = {};
  Object.entries(vars).forEach(([key, value]) => {
    style[key] = value;
  });
  return style as React.CSSProperties;
}

// Calculate countdown to wedding date
export function getCountdown(weddingDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
} {
  const target = new Date(weddingDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false,
  };
}

// Format date for display
export function formatWeddingDate(
  dateStr: string,
  locale: 'ua' | 'en' | 'ro' = 'ua'
): string {
  const date = new Date(dateStr);
  const localeMap = { ua: 'uk-UA', en: 'en-GB', ro: 'ro-RO' };

  return date.toLocaleDateString(localeMap[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Format time for display
export function formatTime(timeStr: string, locale: 'ua' | 'en' | 'ro' = 'ua'): string {
  const [hours, minutes] = timeStr.split(':');
  if (locale === 'en') {
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${minutes} ${ampm}`;
  }
  return `${hours}:${minutes}`;
}

// Generate couple display name
export function getCoupleDisplay(wedding: Wedding): string {
  switch (wedding.displayFormat) {
    case 'full-names':
      return `${wedding.partnerName1} ${wedding.partnerLastname1 || ''} & ${wedding.partnerName2} ${wedding.partnerLastname2 || ''}`.trim();
    case 'custom':
      return wedding.customDisplay || `${wedding.partnerName1} & ${wedding.partnerName2}`;
    case 'first-names':
    default:
      return `${wedding.partnerName1} & ${wedding.partnerName2}`;
  }
}

// Google Fonts URL generator
export function getGoogleFontsUrl(fonts: string[]): string {
  const families = fonts
    .filter(Boolean)
    .map((f) => f.replace(/\s+/g, '+') + ':wght@300;400;500;600;700')
    .join('&family=');
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}
