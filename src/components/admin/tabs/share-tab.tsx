'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface ShareTabProps { wedding: any; }

export function ShareTab({ wedding }: ShareTabProps) {
  const [copied, setCopied] = useState(false);
  const [pwEnabled, setPwEnabled] = useState(!!wedding.guest_password);
  const [pw, setPw] = useState(wedding.guest_password || '');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const savePassword = async () => {
    setPwSaving(true); setPwSaved(false);
    try {
      const res = await fetch('/api/weddings/' + wedding.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guest_password: pwEnabled && pw.trim() ? pw.trim() : null }) });
      if (res.ok) { setPwSaved(true); setTimeout(() => setPwSaved(false), 2500); }
    } finally { setPwSaving(false); }
  };
  const qrRef = useRef<HTMLDivElement>(null);
  const weddingUrl = (typeof window !== 'undefined' ? window.location.origin : 'https://momently-co.vercel.app') + '/w/' + wedding.slug;
  const cameraUrl = weddingUrl + '/camera';
  const stdUrl = (typeof window !== 'undefined' ? window.location.origin : 'https://momently-co.vercel.app') + '/std/' + wedding.slug;
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;
  const isPublished = wedding.status === 'published';

  // Generate QR locally (print-quality, no third-party service)
  useEffect(() => {
    if (!qrRef.current || !wedding.slug) return;
    QRCode.toDataURL(weddingUrl, { width: 600, margin: 2, color: { dark: '#1a1a2e', light: '#ffffff' } }).then((url: string) => {
      if (!qrRef.current) return;
      qrRef.current.innerHTML = '<img src="' + url + '" alt="QR Code" width="200" height="200" style="border-radius:8px" /><br/><a href="' + url + '" download="momently-qr-' + wedding.slug + '.png" style="display:inline-block;margin-top:8px;font-size:12px;color:#b8956a;text-decoration:underline">Завантажити PNG для друку</a>';
    });
  }, [wedding.slug, weddingUrl]);

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
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

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-medium text-[#1a1a2e]">Save the Date</h3>
        <p className="text-xs text-gray-400 mt-1">Односторінкове оголошення дати у стилі вашого шаблону. Працює ще до публікації сайту — надішліть гостям першим.</p>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <code className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">{stdUrl}</code>
          <button onClick={() => copyLink(stdUrl)} className="px-4 py-2.5 bg-[#1a1a2e] text-white text-xs uppercase tracking-widest rounded-lg">{copied ? 'Скопійовано' : 'Копіювати'}</button>
          <a href={stdUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#b8956a] underline">Відкрити</a>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-medium text-[#1a1a2e]">Захист паролем</h3>
            <p className="text-xs text-gray-400 mt-1">Гості побачать сайт лише після введення пароля із запрошення.</p>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={pwEnabled} onChange={e => setPwEnabled(e.target.checked)} className="w-4 h-4 accent-[#b8956a]" />
            <span className="text-sm text-gray-600">{pwEnabled ? 'Увімкнено' : 'Вимкнено'}</span>
          </label>
        </div>
        {pwEnabled && (
          <input value={pw} onChange={e => setPw(e.target.value)} placeholder="Напр.: kohannya2026"
            className="mt-4 w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#b8956a]" />
        )}
        <div className="mt-4 flex items-center gap-3">
          <button onClick={savePassword} disabled={pwSaving || (pwEnabled && !pw.trim())}
            className="px-4 py-2.5 bg-[#1a1a2e] text-white text-xs uppercase tracking-widest rounded-lg disabled:opacity-40">
            {pwSaving ? 'Зберігаємо…' : 'Зберегти'}
          </button>
          {pwSaved && <span className="text-xs text-green-600">Збережено</span>}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Посилання на запрошення</h2>
        <p className="text-sm text-gray-400 mb-4">Основне посилання для гостей</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white border border-[#e8e0d4] rounded-lg px-4 py-3 text-sm text-gray-600 font-mono truncate">{weddingUrl}</div>
          <button onClick={() => copyLink(weddingUrl)} className="bg-[#1a1a2e] text-[#faf8f4] px-5 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors whitespace-nowrap">
            {copied ? 'Скопійовано ✓' : 'Копіювати'}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 bg-white border border-[#e8e0d4] rounded-lg px-4 py-3 text-sm text-gray-600 font-mono truncate">{cameraUrl}</div>
          <button onClick={() => copyLink(cameraUrl)} className="border border-[#e8e0d4] text-gray-600 px-5 py-3 rounded-lg text-sm font-medium hover:border-[#b8956a] transition-colors whitespace-nowrap">📸 Камера</button>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">QR-код</h2>
        <p className="text-sm text-gray-400 mb-4">Роздрукуйте для столів або запрошень</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e8e0d4] rounded-xl p-6 text-center">
            <div ref={qrRef} className="flex justify-center mb-3" />
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{names}</p>
            <p className="text-[10px] text-gray-400 mt-1">Запрошення</p>
          </div>
          <div className="bg-white border border-[#e8e0d4] rounded-xl p-6 text-center">
            <img src={'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(cameraUrl) + '&bgcolor=ffffff&color=b8956a&margin=10'} alt="Camera QR" width="200" height="200" className="mx-auto rounded-lg" />
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-3">{names}</p>
            <p className="text-[10px] text-[#b8956a] mt-1">📸 Гостьова камера</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Поділитися</h2>
        <p className="text-sm text-gray-400 mb-4">Надішліть запрошення через месенджери</p>
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

      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Embed код</h2>
        <p className="text-sm text-gray-400 mb-4">Вставте на інший сайт</p>
        <div className="bg-gray-900 rounded-lg p-4">
          <code className="text-xs text-green-400 break-all">{'<iframe src="' + weddingUrl + '" width="100%" height="800" frameborder="0"></iframe>'}</code>
        </div>
      </section>
    </div>
  );
                                          }
