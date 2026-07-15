'use client';
import { useState } from 'react';
import { t as tr, normalizeLocale } from '@/lib/i18n';

export default function PasswordGate({ slug, locale, names }: { slug: string; locale?: string; names?: string }) {
  const L = normalizeLocale(locale);
  const t = (k: string) => tr(L, k);
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);

  const submit = async () => {
    if (!pw.trim() || busy) return;
    setBusy(true); setWrong(false);
    try {
      const res = await fetch('/api/wedding-auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password: pw }),
      });
      if (res.ok) { window.location.reload(); return; }
      setWrong(true);
    } catch { setWrong(true); }
    setBusy(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F2EA', color: '#23241F', fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        {names && <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, marginBottom: 8 }}>{names}</p>}
        <p style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 28 }}>{t('pgTitle')}</p>
        <input
          type="password" value={pw} autoFocus
          onChange={e => { setPw(e.target.value); setWrong(false); }}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          placeholder={t('pgPlaceholder')}
          style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', fontSize: 16, textAlign: 'center', background: '#fff', border: '1px solid ' + (wrong ? '#A33B2B' : 'rgba(35,36,31,.25)'), borderRadius: 0, outline: 'none', color: '#23241F' }}
        />
        {wrong && <p style={{ marginTop: 10, fontSize: 13, color: '#A33B2B' }}>{t('pgWrong')}</p>}
        <button onClick={submit} disabled={busy}
          style={{ marginTop: 18, padding: '15px 40px', background: '#23241F', color: '#F6F2EA', border: 'none', fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
          {t('pgSubmit')}
        </button>
      </div>
    </div>
  );
}
