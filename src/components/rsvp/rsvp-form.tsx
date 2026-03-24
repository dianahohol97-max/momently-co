'use client';
import { useState } from 'react';

interface RSVPFormProps { weddingId: string; colors: any; typography: any; }

export function RSVPForm({ weddingId, colors, typography }: RSVPFormProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', attending: true, guests: 0, songRequest: '', message: '' });

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError("Вкажіть ваше ім'я"); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wedding_id: weddingId, ...form }) });
      if (res.ok) setStep('success');
      else { const d = await res.json(); setError(d.error || 'Помилка'); }
    } catch { setError("Помилка з'єднання"); }
    finally { setLoading(false); }
  };

  if (step === 'success') {
    return (
      <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.surface }}>
        <p className="text-4xl mb-4">{form.attending ? '🎉' : '💌'}</p>
        <h2 className="text-2xl mb-2" style={{ fontFamily: typography.headingFont, color: colors.text }}>{form.attending ? 'Дякуємо!' : 'Шкода, що не зможете'}</h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>{form.attending ? 'Ми раді, що ви будете з нами!' : 'Сподіваємось побачитись.'}</p>
      </section>
    );
  }

  const inputStyle = { border: '1px solid ' + colors.border, color: colors.text, backgroundColor: colors.background };

  return (
    <section className="py-20 px-6" style={{ backgroundColor: colors.surface }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: colors.primary }}>RSVP</p>
          <h2 className="text-3xl" style={{ fontFamily: typography.headingFont, color: colors.text }}>Підтвердіть присутність</h2>
        </div>
        <div className="space-y-5">
          <div className="flex gap-3">
            {[true, false].map(val => (
              <button key={String(val)} onClick={() => setForm({ ...form, attending: val })} className="flex-1 py-3 rounded-lg text-sm font-medium transition-all" style={{ backgroundColor: form.attending === val ? colors.primary : 'transparent', color: form.attending === val ? colors.background : colors.textMuted, border: '1px solid ' + (form.attending === val ? colors.primary : colors.border) }}>
                {val ? 'Так, буду!' : 'На жаль, ні'}
              </button>
            ))}
          </div>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ваше ім'я та прізвище" className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email (опціонально)" className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
          {form.attending && (
            <>
              <select value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value) })} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle}>
                <option value={0}>Тільки я</option><option value={1}>+1 гість</option><option value={2}>+2 гості</option><option value={3}>+3 гості</option>
              </select>
              <input value={form.songRequest} onChange={e => setForm({ ...form, songRequest: e.target.value })} placeholder="Пісня для вечірки" className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={inputStyle} />
            </>
          )}
          <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Побажання для молодят" rows={3} className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <button onClick={handleSubmit} disabled={loading} className="w-full py-3.5 rounded-lg text-sm font-medium disabled:opacity-50" style={{ backgroundColor: colors.primary, color: colors.background }}>{loading ? 'Надсилаємо...' : 'Надіслати відповідь'}</button>
        </div>
      </div>
    </section>
  );
}
