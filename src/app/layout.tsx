import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from 'next/font/google';
import '@/styles/globals.css';
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-display', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-body', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin', 'cyrillic'], weight: ['300', '400', '500', '600'], variable: '--font-accent', display: 'swap' });
export const metadata: Metadata = {
  title: { default: 'Momently Co — Digital Wedding Experience Platform', template: '%s | Momently Co' },
  description: 'Create your wedding invitation, website, and guest experience in one place.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://momently.co'),
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#faf8f4] antialiased">{children}</body>
    </html>
  );
}
