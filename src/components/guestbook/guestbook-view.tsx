'use client';

import { useState } from 'react';

interface GuestbookViewProps { wedding: any; entries: any[]; }

export function GuestbookView({ wedding, entries: initialEntries }: GuestbookViewProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const names = wedding.partner_name_1 + ' & ' + wedding.partner_name_2;

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/guestbook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wedding_id: wedding.id, guest_name: name, content_text: message }) });
      if (res.ok) {
        const entry = await res.json();
        setEntries([entry, ...entries]);
        setMessage('');
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      }
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <header className="bg-white border-b border-[#e8e0d4] px-6 py-4 text-center sticky top-0 z-50">
        <p className="font-serif text-lg text-[#1a1a2e]">{names}</p>
        <p className="text-[10px] uppercase tracking-widest text-[#b8956a] mt-0.5">Книга гостей</p>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <p className="text-4xl mb-3">📖</p>
          <h1 className="font-serif text-2xl text-[#1a1a2e]">Залиште побажання</h1>
          <p className="text-sm text-gray-500 mt-2">Напишіть кілька теплих слів для {names}</p>
        </div>

        <div className="space-y-4 mb-10">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ваше ім'я" className="w-full px-4 py-3 border border-[#e8e0d4] rounded-lg text-sm outline-none focus:border-[#b8956a]" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Ваше побажання..." rows={4} className="w-full px-4 py-3 border border-[#e8e0d4] rounded-lg text-sm outline-none focus:border-[#b8956a] resize-none" />
          <button onClick={handleSubmit} disabled={sending || !name.trim() || !message.trim()} className="w-full bg-[#1a1a2e] text-[#faf8f4] py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] disabled:opacity-50 transition-colors">
            {sending ? 'Надсилаємо...' : 'Надіслати побажання'}
          </button>
          {sent && <p className="text-center text-sm text-green-600">💌 Дякуємо за ваше побажання!</p>}
        </div>

        {entries.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Побажання ({entries.length})</p>
            <div className="space-y-4">
              {entries.map((e: any) => (
                <div key={e.id} className="bg-white rounded-xl border border-[#e8e0d4] p-5">
                  <p className="text-sm text-[#1a1a2e] leading-relaxed">{e.content_text}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs font-medium text-[#b8956a]">{e.guest_name}</p>
                    <p className="text-[10px] text-gray-400">{new Date(e.created_at).toLocaleDateString('uk-UA')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="text-center py-6 border-t border-[#e8e0d4]">
        <a href={'/w/' + wedding.slug} className="text-xs text-[#b8956a] uppercase tracking-widest">← Повернутися до запрошення</a>
      </footer>
    </div>
  );
}
