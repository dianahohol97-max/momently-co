'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface PhotoBoothProps { wedding: any; }

const filters = [
  { id: 'none', label: 'Оригінал', css: '' },
  { id: 'warm', label: 'Тепло', css: 'sepia(0.3) saturate(1.3) brightness(1.05)' },
  { id: 'bw', label: 'Ч/Б', css: 'grayscale(1) contrast(1.1)' },
  { id: 'vintage', label: 'Вінтаж', css: 'sepia(0.5) contrast(0.9) brightness(1.1)' },
  { id: 'bright', label: 'Яскраво', css: 'brightness(1.2) saturate(1.4)' },
  { id: 'soft', label: 'Soft', css: 'brightness(1.1) contrast(0.9) saturate(0.8)' },
];

const frames = [
  { id: 'none', label: 'Без рамки' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'hearts', label: 'Серця' },
  { id: 'gold', label: 'Золото' },
];

export function PhotoBooth({ wedding }: PhotoBoothProps) {
  const [mode, setMode] = useState<'camera' | 'captured'>('camera');
  const [filter, setFilter] = useState('none');
  const [frame, setFrame] = useState('none');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
  const hashtag = wedding.details_data?.hashtag;

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1080 } }, audio: false });
      if (videoRef.current) { videoRef.current.srcObject = stream; setCameraReady(true); }
    } catch (e) { console.error('Camera error:', e); }
  }, [facingMode]);

  useEffect(() => { startCamera(); return () => { if (videoRef.current?.srcObject) { (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()); } }; }, [startCamera]);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 800;
    canvas.width = size; canvas.height = size;

    // Apply filter
    const f = filters.find(f => f.id === filter);
    ctx.filter = f?.css || 'none';

    // Draw video (center crop to square)
    const v = videoRef.current;
    const vw = v.videoWidth, vh = v.videoHeight;
    const s = Math.min(vw, vh);
    const sx = (vw - s) / 2, sy = (vh - s) / 2;
    if (facingMode === 'user') { ctx.translate(size, 0); ctx.scale(-1, 1); }
    ctx.drawImage(v, sx, sy, s, s, 0, 0, size, size);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'none';

    // Draw frame overlay
    if (frame === 'polaroid') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, size, 40); ctx.fillRect(0, size - 80, size, 80);
      ctx.fillRect(0, 0, 30, size); ctx.fillRect(size - 30, 0, 30, size);
      ctx.font = '20px Georgia'; ctx.fillStyle = '#b8956a'; ctx.textAlign = 'center';
      ctx.fillText(names, size / 2, size - 35);
      if (hashtag) { ctx.font = '14px sans-serif'; ctx.fillStyle = '#999'; ctx.fillText('#' + hashtag, size / 2, size - 12); }
    } else if (frame === 'hearts') {
      ctx.font = '40px serif'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
      const h = ['❤️','💕','💖','💗'];
      h.forEach((e, i) => { ctx.fillText(e, 20 + i * 50, 50); ctx.fillText(e, size - 220 + i * 50, size - 20); });
      ctx.font = '18px Georgia'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 4;
      ctx.fillText(names, size / 2, size - 30);
      ctx.shadowBlur = 0;
    } else if (frame === 'gold') {
      ctx.strokeStyle = '#C9A96E'; ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, size - 12, size - 12);
      ctx.strokeStyle = '#E8D4B8'; ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, size - 40, size - 40);
      ctx.font = '22px Georgia'; ctx.fillStyle = '#C9A96E'; ctx.textAlign = 'center';
      ctx.fillText(names, size / 2, size - 35);
    }

    setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));
    setMode('captured');
  };

  const retake = () => { setCapturedImage(null); setMode('camera'); };

  const flipCamera = () => { setFacingMode(f => f === 'user' ? 'environment' : 'user'); };

  const savePhoto = async () => {
    if (!capturedImage) return;
    setSaving(true);
    try {
      const blob = await (await fetch(capturedImage)).blob();
      const formData = new FormData();
      formData.append('file', blob, 'photobooth-' + Date.now() + '.jpg');
      formData.append('wedding_id', wedding.id);
      formData.append('guest_name', 'Photo Booth');
      formData.append('caption', frame !== 'none' ? 'Frame: ' + frame : '');
      const res = await fetch('/api/photos', { method: 'POST', body: formData });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const download = () => {
    if (!capturedImage) return;
    const a = document.createElement('a');
    a.href = capturedImage; a.download = names.replace(/\s/g, '-') + '-booth.jpg'; a.click();
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <header className="px-6 py-4 text-center border-b border-white/10">
        <p className="font-serif text-lg">{names}</p>
        <p className="text-[10px] uppercase tracking-widest text-[#b8956a] mt-0.5">Photo Booth</p>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Camera / Preview */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-black relative">
          {mode === 'camera' ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ filter: filters.find(f => f.id === filter)?.css || 'none', transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }} />
              {!cameraReady && <div className="absolute inset-0 flex items-center justify-center"><p className="text-sm text-gray-400">Завантажуємо камеру...</p></div>}
            </>
          ) : (
            capturedImage && <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {mode === 'camera' ? (
          <>
            {/* Filters */}
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Фільтр</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {filters.map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)} className={'px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ' + (filter === f.id ? 'bg-[#b8956a] text-white' : 'bg-white/10 text-gray-400')}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frames */}
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Рамка</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {frames.map(f => (
                  <button key={f.id} onClick={() => setFrame(f.id)} className={'px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ' + (frame === f.id ? 'bg-[#b8956a] text-white' : 'bg-white/10 text-gray-400')}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Capture buttons */}
            <div className="mt-6 flex items-center justify-center gap-6">
              <button onClick={flipCamera} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg">🔄</button>
              <button onClick={capture} className="w-20 h-20 rounded-full bg-[#b8956a] flex items-center justify-center border-4 border-white/30 hover:scale-105 transition-transform">
                <div className="w-14 h-14 rounded-full bg-white" />
              </button>
              <div className="w-12 h-12" />
            </div>
          </>
        ) : (
          /* After capture */
          <div className="mt-6 space-y-3">
            {saved && <p className="text-center text-sm text-green-400">✓ Збережено в галерею!</p>}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={retake} className="py-3 rounded-lg bg-white/10 text-sm font-medium">Ще раз</button>
              <button onClick={savePhoto} disabled={saving} className="py-3 rounded-lg bg-[#b8956a] text-sm font-medium disabled:opacity-50">{saving ? '...' : 'Зберегти'}</button>
              <button onClick={download} className="py-3 rounded-lg bg-white/10 text-sm font-medium">Скачати</button>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center py-6 border-t border-white/10">
        <a href={'/w/' + wedding.slug} className="text-xs text-[#b8956a] uppercase tracking-widest">← Повернутися</a>
      </footer>
    </div>
  );
}
