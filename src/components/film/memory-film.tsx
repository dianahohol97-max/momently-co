'use client';

import { useState, useRef, useCallback } from 'react';

interface MemoryFilmProps { wedding: any; photos: any[]; }

export function MemoryFilm({ wedding, photos }: MemoryFilmProps) {
  const [playing, setPlaying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
  const date = wedding.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const playSlideshow = useCallback(async () => {
    if (photos.length === 0) return;
    setPlaying(true);
    setCurrentIndex(0);
    for (let i = 0; i < photos.length; i++) {
      setCurrentIndex(i);
      setProgress(((i + 1) / photos.length) * 100);
      await new Promise(r => setTimeout(r, 3000));
    }
    setPlaying(false);
  }, [photos]);

  const generateVideo = useCallback(async () => {
    if (photos.length === 0 || !canvasRef.current) return;
    setGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      recorder.start();

      // Title slide
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 1080, 1080);
      ctx.font = '48px Georgia';
      ctx.fillStyle = '#b8956a';
      ctx.textAlign = 'center';
      ctx.fillText(names, 540, 480);
      if (date) { ctx.font = '24px sans-serif'; ctx.fillStyle = '#8a7b6b'; ctx.fillText(date, 540, 530); }
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#555';
      ctx.fillText('Memory Film', 540, 600);
      await new Promise(r => setTimeout(r, 3000));

      // Photo slides with transitions
      for (let i = 0; i < photos.length; i++) {
        setProgress(((i + 1) / photos.length) * 100);
        setCurrentIndex(i);
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = photos[i].storage_path;
          });

          // Ken Burns effect - slight zoom
          const scale = 1.0 + (i % 2 === 0 ? 0.05 : -0.05);
          const sw = Math.min(img.width, img.height);
          const sx = (img.width - sw) / 2;
          const sy = (img.height - sw) / 2;

          // Fade in
          for (let f = 0; f <= 10; f++) {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, 1080, 1080);
            ctx.globalAlpha = f / 10;
            ctx.drawImage(img, sx, sy, sw, sw, 0, 0, 1080 * scale, 1080 * scale);
            ctx.globalAlpha = 1;
            await new Promise(r => setTimeout(r, 50));
          }

          // Hold
          ctx.drawImage(img, sx, sy, sw, sw, 0, 0, 1080 * scale, 1080 * scale);

          // Caption overlay
          if (photos[i].guest_name) {
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(0, 980, 1080, 100);
            ctx.font = '18px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(photos[i].guest_name, 540, 1040);
          }
          await new Promise(r => setTimeout(r, 2500));
        } catch { continue; }
      }

      // End slide
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 1080, 1080);
      ctx.font = '36px Georgia';
      ctx.fillStyle = '#b8956a';
      ctx.textAlign = 'center';
      ctx.fillText('Дякуємо!', 540, 480);
      ctx.font = '24px Georgia';
      ctx.fillStyle = '#8a7b6b';
      ctx.fillText(names, 540, 530);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#555';
      ctx.fillText('Створено з Momently.co', 540, 600);
      await new Promise(r => setTimeout(r, 3000));

      recorder.stop();
      await new Promise(r => { recorder.onstop = r; });

      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = names.replace(/\s/g, '-') + '-memory-film.webm';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error('Video generation failed:', e); }
    finally { setGenerating(false); setProgress(0); }
  }, [photos, names, date]);

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <header className="px-6 py-4 text-center border-b border-white/10">
        <p className="font-serif text-lg">{names}</p>
        <p className="text-[10px] uppercase tracking-widest text-[#b8956a] mt-0.5">Memory Film</p>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🎬</p>
            <p className="text-gray-400">Поки немає фото для створення фільму</p>
            <p className="text-xs text-gray-500 mt-2">Завантажте фото через гостьову камеру</p>
          </div>
        ) : (
          <>
            {/* Preview */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-black relative">
              {photos[currentIndex] ? (
                <img src={photos[currentIndex].storage_path} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="font-serif text-2xl text-[#b8956a]">{names}</p>
                </div>
              )}
              {(playing || generating) && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-[#b8956a] transition-all" style={{ width: progress + '%' }} />
                </div>
              )}
              {photos[currentIndex]?.guest_name && (playing || generating) && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-black/50 px-3 py-1 rounded-full text-xs">{photos[currentIndex].guest_name}</span>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-4 text-center text-sm text-gray-400">
              {photos.length} фото · {Math.ceil(photos.length * 3 / 60)} хв
            </div>

            {/* Controls */}
            <div className="mt-6 space-y-3">
              <button onClick={playSlideshow} disabled={playing || generating} className="w-full py-3.5 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/20 disabled:opacity-50 transition-colors">
                {playing ? '▶ Відтворюється... (' + (currentIndex + 1) + '/' + photos.length + ')' : '▶ Переглянути слайдшоу'}
              </button>
              <button onClick={generateVideo} disabled={playing || generating} className="w-full py-3.5 rounded-lg bg-[#b8956a] text-sm font-medium hover:bg-[#a07850] disabled:opacity-50 transition-colors">
                {generating ? '🎬 Генеруємо відео... ' + Math.round(progress) + '%' : '🎬 Створити Memory Film (WebM)'}
              </button>
            </div>

            {/* Photo grid */}
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Фото у фільмі</p>
              <div className="grid grid-cols-4 gap-1.5">
                {photos.map((p: any, i: number) => (
                  <div key={p.id} className={'aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ' + (i === currentIndex ? 'border-[#b8956a]' : 'border-transparent')} onClick={() => setCurrentIndex(i)}>
                    <img src={p.storage_path} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="text-center py-6 border-t border-white/10">
        <a href={'/w/' + wedding.slug} className="text-xs text-[#b8956a] uppercase tracking-widest">← Повернутися</a>
      </footer>
    </div>
  );
}
