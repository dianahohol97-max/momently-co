'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DesignTab } from './tabs/design-tab';
import { GuestsTab } from './tabs/guests-tab';
import { DetailsTab } from './tabs/details-tab';
import { PreviewTab } from './tabs/preview-tab';
import { ShareTab } from './tabs/share-tab';
import { PhotosTab } from './tabs/photos-tab';

interface AdminPanelProps { wedding: any; template: any; guests: any[]; rsvpResponses: any[]; allTemplates: any[]; photos?: any[]; }

const tabs = [
  { id: 'design', label: 'Дизайн', icon: '🎨' },
  { id: 'details', label: 'Деталі', icon: '📋' },
  { id: 'guests', label: 'Гості', icon: '👥' },
  { id: 'photos', label: 'Фото', icon: '📸' },
  { id: 'share', label: 'Поділитися', icon: '🔗' },
  { id: 'preview', label: 'Перегляд', icon: '👁' },
];

export function AdminPanel({ wedding, template, guests, rsvpResponses, allTemplates, photos = [] }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('design');
  const [weddingData, setWeddingData] = useState(wedding);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const names = weddingData.partner_name_1 + ' & ' + weddingData.partner_name_2;
  const isPublished = weddingData.status === 'published';

  const handleSave = async (updates: Record<string, any>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/weddings/' + weddingData.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
      if (res.ok) { const updated = await res.json(); setWeddingData(updated); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } catch (e) { console.error('Save failed:', e); } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <header className="bg-white border-b border-[#e8e0d4] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-[#1a1a2e] transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5"/></svg>
          </Link>
          <div>
            <h1 className="font-serif text-lg text-[#1a1a2e]">{names}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={'inline-block w-1.5 h-1.5 rounded-full ' + (isPublished ? 'bg-green-500' : 'bg-amber-400')} />
              <span className="text-[10px] uppercase tracking-widest text-gray-400">{isPublished ? 'Опубліковано' : 'Чернетка'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-green-600">Збережено ✓</span>}
          {weddingData.slug && <Link href={'/w/' + weddingData.slug} target="_blank" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#b8956a] transition-colors hidden md:block">/w/{weddingData.slug}</Link>}
          <button onClick={() => handleSave({ status: isPublished ? 'draft' : 'published' })} className={'text-xs uppercase tracking-widest px-4 py-2 rounded-lg font-medium transition-colors ' + (isPublished ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-[#1a1a2e] text-[#faf8f4] hover:bg-[#2a2a3e]')}>
            {isPublished ? 'Зняти' : 'Опублікувати'}
          </button>
        </div>
      </header>
      <div className="border-b border-[#e8e0d4] bg-white px-6 overflow-x-auto">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={'px-4 py-3 text-xs uppercase tracking-widest font-medium border-b-2 whitespace-nowrap ' + (activeTab === tab.id ? 'border-[#b8956a] text-[#1a1a2e]' : 'border-transparent text-gray-400')}>
              <span className="mr-1.5">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'design' && <DesignTab wedding={weddingData} template={template} allTemplates={allTemplates} onSave={handleSave} saving={saving} />}
        {activeTab === 'details' && <DetailsTab wedding={weddingData} onSave={handleSave} saving={saving} />}
        {activeTab === 'guests' && <GuestsTab wedding={weddingData} guests={guests} rsvpResponses={rsvpResponses} />}
        {activeTab === 'photos' && <PhotosTab wedding={weddingData} photos={photos} />}
        {activeTab === 'share' && <ShareTab wedding={weddingData} />}
        {activeTab === 'preview' && <PreviewTab wedding={weddingData} template={template} />}
      </div>
    </div>
  );
}
