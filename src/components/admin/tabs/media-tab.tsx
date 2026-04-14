'use client';
import { useState, useRef } from 'react';

interface MediaTabProps {
  wedding: any;
  onSave: (updates: Record<string, any>) => Promise<void>;
  saving: boolean;
}

interface PhotoSlot {
  key: string;
  label: string;
  hint: string;
  aspect: string;
}

const SLOTS: PhotoSlot[] = [
  { key: 'hero_bg_url',      label: 'Hero фон',          hint: 'Головне фото на весь екран',       aspect: 'aspect-video' },
  { key: 'story_image_url',  label: 'Фото — Наша Історія', hint: 'Фото пари для секції "Наша Історія"', aspect: 'aspect-[3/4]' },
  { key: 'polaroid_url',     label: 'Polaroid фото',     hint: 'Фото у стилі polaroid',            aspect: 'aspect-square' },
  { key: 'story_bg_url',     label: 'Фон — Цитата',      hint: 'Темне фото для секції з цитатою',  aspect: 'aspect-video' },
  { key: 'venue_image_url',  label: 'Фото місця',        hint: 'Фото venues / місця проведення',   aspect: 'aspect-video' },
  { key: 'venue_map_url',    label: 'Карта / Фото карти', hint: 'Скрін карти або фото дороги',     aspect: 'aspect-video' },
];

function UploadSlot({ slot, currentUrl, onUploaded }: { slot: PhotoSlot; currentUrl: string; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('field', slot.key);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        setUrlInput(data.url);
        onUploaded(data.url);
      }
    } catch (e) {
      console.error('Upload failed:', e);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSave = () => {
    setPreview(urlInput);
    onUploaded(urlInput);
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#1a1a2e]">{slot.label}</p>
          <p className="text-[11px] text-gray-400">{slot.hint}</p>
        </div>
        <button onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#b8956a] hover:text-[#a07850]">
          {showUrlInput ? 'Закрити' : 'Вставити URL'}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
          <button onClick={handleUrlSave}
            className="px-4 py-2 bg-[#b8956a] text-white rounded-lg text-xs font-medium hover:bg-[#a07850]">
            OK
          </button>
        </div>
      )}

      <div
        className={`relative ${slot.aspect} rounded-xl overflow-hidden border-2 border-dashed border-[#e8e0d4] bg-[#faf8f4] cursor-pointer hover:border-[#b8956a] transition-colors group`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        {preview ? (
          <>
            <img src={preview} alt={slot.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <p className="text-white text-xs opacity-0 group-hover:opacity-100 font-medium">Замінити фото</p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-[#b8956a] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-2xl">📷</span>
                <p className="text-xs text-gray-400">Перетягніть або натисніть</p>
              </>
            )}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#b8956a] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

export function MediaTab({ wedding, onSave, saving }: MediaTabProps) {
  const [urls, setUrls] = useState<Record<string, string>>({
    hero_bg_url:     wedding.hero_bg_url || '',
    story_image_url: wedding.story_image_url || '',
    polaroid_url:    wedding.polaroid_url || '',
    story_bg_url:    wedding.story_bg_url || '',
    venue_image_url: wedding.venue_image_url || '',
    venue_map_url:   wedding.venue_map_url || '',
  });

  const handleUploaded = (key: string, url: string) => {
    setUrls(prev => ({ ...prev, [key]: url }));
  };

  const handleSave = () => onSave(urls);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800 font-medium">📸 Фотографії шаблону</p>
        <p className="text-xs text-blue-600 mt-1">
          Завантажте власні фото або вставте посилання з Unsplash / Google Drive.
          Рекомендований розмір: мінімум 1200×800px.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SLOTS.map(slot => (
          <UploadSlot
            key={slot.key}
            slot={slot}
            currentUrl={urls[slot.key]}
            onUploaded={url => handleUploaded(slot.key, url)}
          />
        ))}
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full bg-[#1a1a2e] text-[#faf8f4] py-4 rounded-xl text-sm font-medium hover:bg-[#2a2a3e] transition-colors disabled:opacity-50">
        {saving ? 'Зберігаємо...' : 'Зберегти фотографії'}
      </button>
    </div>
  );
}
