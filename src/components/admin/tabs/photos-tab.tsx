'use client';

import { useState } from 'react';

interface PhotosTabProps { wedding: any; photos: any[]; }

export function PhotosTab({ wedding, photos: initialPhotos }: PhotosTabProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const handleDelete = async (photoId: string) => {
    if (!confirm('Видалити це фото?')) return;
    try {
      const res = await fetch('/api/photos/' + photoId, { method: 'DELETE' });
      if (res.ok) setPhotos(photos.filter(p => p.id !== photoId));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-[#1a1a2e]">Фото гостей</h2>
          <p className="text-sm text-gray-400 mt-1">{photos.length} фото завантажено</p>
        </div>
        <a href={'/w/' + wedding.slug + '/camera'} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-[#b8956a] font-medium hover:text-[#a07850]">
          Відкрити камеру →
        </a>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e8e0d4] rounded-xl">
          <p className="text-3xl mb-3">📸</p>
          <p className="text-sm text-gray-400">Поки що немає фото</p>
          <p className="text-xs text-gray-400 mt-1">Гості зможуть завантажити фото через гостьову камеру</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo: any) => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
              <img src={photo.storage_path} alt={photo.caption || ''} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all">
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.guest_name && <p className="text-[10px] text-white font-medium">{photo.guest_name}</p>}
                  <p className="text-[10px] text-white/60">{new Date(photo.created_at).toLocaleString('uk-UA')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => setSelectedPhoto(null)}>
          <div className="max-w-3xl max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto.storage_path} alt={selectedPhoto.caption || ''} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="mt-4 flex items-center justify-between">
              <div>
                {selectedPhoto.guest_name && <p className="text-sm text-white font-medium">{selectedPhoto.guest_name}</p>}
                {selectedPhoto.caption && <p className="text-xs text-white/60 mt-0.5">{selectedPhoto.caption}</p>}
              </div>
              <button onClick={() => { handleDelete(selectedPhoto.id); setSelectedPhoto(null); }} className="text-xs text-red-400 hover:text-red-300 uppercase tracking-widest">Видалити</button>
            </div>
            <button onClick={() => setSelectedPhoto(null)} className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">✕</button>
          </div>
        </div>
      )}
    </div>
  );
      }
