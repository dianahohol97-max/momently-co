import TemplatesClient from './templates-client';

export const metadata = { title: 'Шаблони — Momently' };

// Static template data — no DB needed
const TEMPLATES = [
  { id: '1', slug: 'cote-dazur',            name: 'Côte d\'Azur',          category: 'minimal',  display_order: 1 },
  { id: '2', slug: 'il-monografo',          name: 'Il Monografo',           category: 'bold',     display_order: 2 },
  { id: '3', slug: 'lago-doro',             name: 'Lago d\'Oro',            category: 'romantic', display_order: 3 },
  { id: '4', slug: 'the-manor',             name: 'The Manor',              category: 'elegant',  display_order: 4 },
  { id: '5', slug: 'the-modern-heirloom',   name: 'The Modern Heirloom',    category: 'classic',  display_order: 5 },
  { id: '6', slug: 'the-digital-salon',     name: 'The Digital Salon',      category: 'romantic', display_order: 6 },
  { id: '7', slug: 'the-stationery',        name: 'The Stationery',         category: 'minimal',  display_order: 7 },
  { id: '8', slug: 'evergreen',             name: 'Evergreen',              category: 'elegant',  display_order: 8 },
  { id: '9', slug: 'ethereal-conservatory', name: 'Ethereal Conservatory',  category: 'modern',   display_order: 9 },
];

export default function TemplatesPage() {
  return <TemplatesClient templates={TEMPLATES} />;
}
