'use client';

import { useState, useRef } from 'react';

interface GuestCameraProps { wedding: any; photos: any[]; }

export function GuestCamera({ wedding, photos: initialPhotos }: GuestCameraProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [caption, setCaption] = useState('');
  const [view, setView] = useState<'upload' | 'gallery'>('upload');
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setSuccess(false);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('wedding_id', wedding.id);
      formData.append('guest_name', guestName || 'Гість');
      formData.append('caption', caption);

      try {
        const res = await fetch('/api/photos', { method: 'POST', body: formData });
        if (res.ok) {
          const photo = await res.json();
          setPhotos(prev => [photo, ...prev]);
        }
      } catch (e) { console.error(e); }
    }

    setUploading(false);
    setSuccess(true);
    setCaption('');
    if (fileRef.current) fileRef.current.value = '';
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <header className="bg-white border-b border-[#e8e0d4] px-6 py-4 text-center sticky top-0 z-50">
        <p className="font-serif text-lg text-[#1a1a2e]">{names}</p>
        <p className="text-[10px] uppercase tracking-widest text-[#b8956a] mt-0.5">Гостьова камера</p>
      </header>

      <div className="flex justify-center gap-1 bg-white border-b border-[#e8e0d4] px-6 py-2">
        {(['upload', 'gallery'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className={'px-4 py-2 text-xs uppercase tracking-widest font-medium border-b-2 ' + (view === v ? 'border-[#b8956a] text-[#1a1a2e]' : 'border-transparent text-gray-400')}>
            {v === 'upload' ? '📸 Завантажити' : '🖼 Галерея (' + photos.length + ')'}
          </button>
        ))}
      </div>

      {view === 'upload' ? (
        <div className="max-w-md mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <p className="text-4xl mb-3">📸</p>
            <h1 className="font-serif text-2xl text-[#1a1a2e]">Поділіться моментом</h1>
            <p className="text-sm text-gray-500 mt-2">Завантажте фото з весілля {names}</p>
          </div>

          <div className="space-y-4">
            <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Ваше ім'я" className="w-full px-4 py-3 border border-[#e8e0d4] rounded-lg text-sm outline-none focus:border-[#b8956a]" />

            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-[#e8e0d4] rounded-xl p-8 text-center cursor-pointer hover:border-[#b8956a] transition-colors">
              <p className="text-3xl mb-2">📷</p>
              <p className="text-sm text-gray-500">Натисніть, щоб обрати фото</p>
              <p className="text-xs text-gray-400 mt-1">або зробіть фото камерою</p>
              <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={e => handleUpload(e.target.files)} />
            </div>

            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Підпис (опціонально)" className="w-full px-4 py-3 border border-[#e8e0d4] rounded-lg text-sm outline-none focus:border-[#b8956a]" />

            {uploading && (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-2 border-[#b8956a] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-400 mt-2">Завантажуємо...</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-sm text-green-700">🎉 Фото завантажено! Дякуємо!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 py-6">
          {photos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">🖼</p>
              <p className="text-sm text-gray-400">Поки що немає фото</p>
              <button onClick={() => setView('upload')} className="mt-4 text-xs text-[#b8956a] uppercase tracking-widest">Завантажити перше</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {photos.map((p: any) => (
                <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group">
                  <img src={p.storage_path} alt={p.caption || ''} className="w-full h-full object-cover" loading="lazy" />
                  {(p.guest_name || p.caption) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.guest_name && <p className="text-[10px] text-white font-medium">{p.guest_name}</p>}
                      {p.caption && <p className="text-[10px] text-white/80">{p.caption}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="text-center py-6 border-t border-[#e8e0d4]">
        <a href={'/w/' + wedding.slug} className="text-xs text-[#b8956a] uppercase tracking-widest">← Повернутися до запрошення</a>
      </footer>
    </div>
  );
      }
