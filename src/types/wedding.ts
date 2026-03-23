// ─── Core Wedding Types ───────────────────────────────────────

export type Locale = 'ua' | 'en' | 'ro';
export type WeddingStatus = 'draft' | 'active' | 'published' | 'completed' | 'archived';
export type DisplayFormat = 'first-names' | 'full-names' | 'custom';
export type RSVPStatus = 'pending' | 'yes' | 'no' | 'maybe';
export type GuestGroup = 'family' | 'friends' | 'work' | 'other';

export interface Couple {
  partner1: { firstName: string; lastName?: string; email?: string };
  partner2: { firstName: string; lastName?: string; email?: string };
  displayFormat: DisplayFormat;
  customDisplay?: string;
  photoUrl?: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  country: string;
  mapUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface VenueData {
  ceremony: Venue;
  reception?: Venue | null;
}

export interface ScheduleData {
  receptionTime?: string | null;
  dinnerTime?: string | null;
  partyTime?: string | null;
  endTime?: string | null;
}

export interface MediaData {
  heroImage?: string | null;
  galleryImages: string[];
  backgroundVideo?: string | null;
  musicTrack?: string | null;
}

export interface DetailsData {
  dressCode?: string | null;
  giftRegistry?: string | null;
  accommodationInfo?: string | null;
  transportInfo?: string | null;
  hashtag?: string | null;
  specialNotes?: string | null;
}

export interface RSVPSettings {
  enabled: boolean;
  deadline?: string | null;
  maxGuests: number;
  mealOptions: string[];
  questions: RSVPQuestion[];
}

export interface RSVPQuestion {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[];
  required: boolean;
}

export interface Wedding {
  id: string;
  userId: string;
  partnerName1: string;
  partnerName2: string;
  partnerLastname1?: string;
  partnerLastname2?: string;
  partnerEmail1?: string;
  partnerEmail2?: string;
  displayFormat: DisplayFormat;
  customDisplay?: string;
  couplePhotoUrl?: string;
  weddingDate?: string;
  ceremonyTime?: string;
  slug: string;
  timezone: string;
  locale: Locale;
  status: WeddingStatus;
  venueData: VenueData;
  scheduleData: ScheduleData;
  mediaData: MediaData;
  detailsData: DetailsData;
  rsvpSettings: RSVPSettings;
  templateCustomizations: Record<string, any>;
  publishedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  weddingId: string;
  name: string;
  email?: string;
  phone?: string;
  guestGroup: GuestGroup;
  rsvpStatus: RSVPStatus;
  dietaryNotes?: string;
  plusOnes: number;
  guestToken: string;
  invitedAt?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface RSVPResponse {
  id: string;
  guestId: string;
  weddingId: string;
  attending: boolean;
  mealChoice?: string;
  plusOneNames?: string;
  songRequest?: string;
  message?: string;
  submittedAt: string;
}

export type TemplateCategory = 'classic' | 'modern' | 'minimal' | 'romantic' | 'bold' | 'elegant';

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface TemplateTypography {
  headingFont: string;
  bodyFont: string;
  accentFont: string;
}

export interface TemplateConfig {
  colors: TemplateColors;
  typography: TemplateTypography;
  layout: {
    heroHeight: 'full' | 'half' | 'third';
    contentWidth: 'narrow' | 'medium' | 'wide';
    spacing: 'compact' | 'comfortable' | 'spacious';
    sectionOrder: string[];
  };
  features: {
    countdown: boolean;
    parallax: boolean;
    animations: boolean;
    musicPlayer: boolean;
    guestCamera: boolean;
    photoGallery: boolean;
  };
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  configJson: TemplateConfig;
  category: TemplateCategory;
  priceUah: number;
  priceUsd: number;
  isPremium: boolean;
  isActive: boolean;
  displayOrder: number;
  purchaseCount: number;
}

export interface WizardData {
  couple: Couple;
  weddingDate?: string;
  ceremonyTime?: string;
  locale: Locale;
  venue: VenueData;
  schedule: ScheduleData;
  details: DetailsData;
  rsvpSettings: RSVPSettings;
  templateId?: string;
  templateCustomizations: Record<string, any>;
}

export const DEFAULT_WIZARD_DATA: WizardData = {
  couple: {
    partner1: { firstName: '' },
    partner2: { firstName: '' },
    displayFormat: 'first-names',
  },
  locale: 'ua',
  venue: {
    ceremony: { name: '', address: '', city: '', country: 'Україна' },
    reception: null,
  },
  schedule: { receptionTime: null, dinnerTime: null, partyTime: null, endTime: null },
  details: { dressCode: null, giftRegistry: null, accommodationInfo: null, transportInfo: null, hashtag: null, specialNotes: null },
  rsvpSettings: { enabled: true, deadline: null, maxGuests: 5, mealOptions: [], questions: [] },
  templateCustomizations: {},
};
