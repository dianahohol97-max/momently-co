'use client';

import { useState, useEffect, useRef } from 'react';

interface ShareTabProps { wedding: any; }

export function ShareTab({ wedding }: ShareTabProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const weddingUrl = (typeof window !== 'undefined' ? window.location.origin : 'https://momently-co.vercel.app') + '/w/' + wedding.slug;
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
  const isPublished = wedding.status === 'published';

  // Generate QR code using canvas
  useEffect(() => {
    if (!canvasRef.current || !wedding.slug) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR-like visual placeholder (real QR needs a library)
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#1a1a2e';

    // Draw URL as text-based QR placeholder
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', size/2, size/2 - 10);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#b8956a';
    ctx.fillText(weddingUrl.replace('https://', ''), size/2, size/2 + 10);

    // Draw border
    ctx.strokeStyle = '#e8e0d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size-2, size-2);
  }, [wedding.slug, weddingUrl]);

  const copyLink = () => {
    navigator.clipboard.writeText(weddingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => window.open('https://wa.me/?text=' + encodeURIComponent(names + ' запрошують вас на весілля! ' + weddingUrl));
  const shareViber = () => window.open('viber://forward?text=' + encodeURIComponent(names + ' запрошують вас! ' + weddingUrl));
  const shareTelegram = () => window.open('https://t.me/share/url?url=' + encodeURIComponent(weddingUrl) + '&text=' + encodeURIComponent(names + ' запрошують вас на весілля!'));

  return (
    <div className="space-y-10">
      {!isPublished && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm text-amber-700">Весілля ще не опубліковано. Опублікуйте, щоб гості могли бачити запрошення.</p>
        </div>
      )}

      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Посилання</h2>
        <p className="text-sm text-gray-400 mb-6">Поділіться цим посиланням з гостями</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white border border-[#e8e0d4] rounded-lg px-4 py-3 text-sm text-gray-600 font-mono truncate">{weddingUrl}</div>
          <button onClick={copyLink} className="bg-[#1a1a2e] text-[#faf8f4] px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors whitespace-nowrap">
            {copied ? 'Скопійовано ✓' : 'Копіювати'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">QR-код</h2>
        <p className="text-sm text-gray-400 mb-6">Роздрукуйте для столів або запрошень</p>
        <div className="bg-white border border-[#e8e0d4] rounded-xl p-8 inline-block">
          <canvas ref={canvasRef} className="mx-auto" />
          <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-widest">{names}</p>
        </div>
        <p className="text-xs text-gray-400 mt-3">Для повноцінного QR-коду підключіть бібліотеку qrcode</p>
      </section>

      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Поділитися</h2>
        <p className="text-sm text-gray-400 mb-6">Надішліть запрошення через месенджери</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={shareWhatsApp} className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#25D366]/20 transition-colors">
            <span>📱</span> WhatsApp
          </button>
          <button onClick={shareViber} className="flex items-center justify-center gap-2 bg-[#7360f2]/10 text-[#7360f2] border border-[#7360f2]/20 rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#7360f2]/20 transition-colors">
            <span>💬</span> Viber
          </button>
          <button onClick={shareTelegram} className="flex items-center justify-center gap-2 bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#0088cc]/20 transition-colors">
            <span>✈️</span> Telegram
          </button>
        </div>
      </section>
    </div>
  );
}
