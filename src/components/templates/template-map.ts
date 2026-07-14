// Shared registry: template slug → React component.
// Used by /w/[slug] (live weddings) and /templates/[slug]/demo (DB-less demos).
import CoteDazurTemplate from '@/components/templates/cote-dazur/CoteDazurTemplate';
import IlMonografoTemplate from '@/components/templates/il-monografo/IlMonografoTemplate';
import LagoDoroTemplate from '@/components/templates/lago-doro/LagoDoroTemplate';
import TheManorTemplate from '@/components/templates/the-manor/TheManorTemplate';
import TheModernHeirloomTemplate from '@/components/templates/the-modern-heirloom/TheModernHeirloomTemplate';
import TheDigitalSalonTemplate from '@/components/templates/the-digital-salon/TheDigitalSalonTemplate';
import TheStationeryTemplate from '@/components/templates/the-stationery/TheStationeryTemplate';
import EvergreenTemplate from '@/components/templates/evergreen/EvergreenTemplate';
import EtherealConservatoryTemplate from '@/components/templates/ethereal-conservatory/EtherealConservatoryTemplate';
import FieldSerifTemplate from '@/components/templates/field-serif/FieldSerifTemplate';
import NoirTemplate from '@/components/templates/noir/NoirTemplate';
import BotaniqueTemplate from '@/components/templates/botanique/BotaniqueTemplate';

export const TEMPLATE_MAP: Record<string, React.ComponentType<{ data?: any }>> = {
  'cote-dazur':             CoteDazurTemplate,
  'il-monografo':           IlMonografoTemplate,
  'lago-doro':              LagoDoroTemplate,
  'the-manor':              TheManorTemplate,
  'the-modern-heirloom':    TheModernHeirloomTemplate,
  'the-digital-salon':      TheDigitalSalonTemplate,
  'the-stationery':         TheStationeryTemplate,
  'evergreen':              EvergreenTemplate,
  'ethereal-conservatory':  EtherealConservatoryTemplate,
  'field-serif':            FieldSerifTemplate,
  'noir':                   NoirTemplate,
  'botanique':              BotaniqueTemplate,
};

export const TEMPLATE_NAMES: Record<string, string> = {
  'cote-dazur':             "Côte d'Azur",
  'il-monografo':           'Il Monografo',
  'lago-doro':              "Lago d'Oro",
  'the-manor':              'The Manor',
  'the-modern-heirloom':    'The Modern Heirloom',
  'the-digital-salon':      'The Digital Salon',
  'the-stationery':         'The Stationery',
  'evergreen':              'Evergreen',
  'ethereal-conservatory':  'Ethereal Conservatory',
  'field-serif':            'Field & Serif',
  'noir':                   'Noir',
  'botanique':              'Botanique',
};

export const DEFAULT_TEMPLATE = CoteDazurTemplate;
