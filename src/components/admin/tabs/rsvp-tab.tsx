'use client';
import { useMemo } from 'react';

interface RsvpTabProps { wedding: any; responses: any[]; }

const MENU_RE = /(?:меню|menu|menú|menü|meniu)\s*:\s*([^·]+)/i;

export function RsvpTab({ wedding, responses }: RsvpTabProps) {
  const stats = useMemo(() => {
    const yes = responses.filter(r => r.attendance === 'attending');
    const no = responses.filter(r => r.attendance === 'declined');
    const totalGuests = yes.reduce((n, r) => n + 1 + (r.plus_one ? 1 : 0), 0);
    const menu: Record<string, number> = {};
    for (const r of yes) {
      const m = MENU_RE.exec(r.dietary || '');
      const key = (m ? m[1] : '—').trim().toLowerCase();
      const seats = 1 + (r.plus_one ? 1 : 0);
      menu[key] = (menu[key] || 0) + seats;
    }
    return { yes: yes.length, no: no.length, totalGuests, menu };
  }, [responses]);

  const exportCsv = () => {
    const esc = (v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const rows = [
      ['Ім\u2019я', 'Статус', '+1', 'Деталі', 'Email', 'Дата відповіді'].map(esc).join(';'),
      ...responses.map(r => [
        r.name,
        r.attendance === 'attending' ? 'Так' : 'Ні',
        r.plus_one ? 'Так' : '',
        r.dietary || '',
        r.email || '',
        r.created_at ? new Date(r.created_at).toLocaleString('uk-UA') : '',
      ].map(esc).join(';')),
    ].join('\r\n');
    const blob = new Blob(['\uFEFF' + rows], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rsvp-' + (wedding.slug || 'wedding') + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-semibold text-green-700">{stats.yes}</p>
          <p className="text-xs uppercase tracking-widest text-green-700 mt-1">Прийдуть</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-semibold text-red-700">{stats.no}</p>
          <p className="text-xs uppercase tracking-widest text-red-700 mt-1">Не зможуть</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-semibold text-amber-700">{stats.totalGuests}</p>
          <p className="text-xs uppercase tracking-widest text-amber-700 mt-1">Гостей разом</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Меню (порцій)</p>
          {Object.keys(stats.menu).length === 0 ? (
            <p className="text-sm text-gray-400">—</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(stats.menu).map(([k, v]) => (
                <p key={k} className="text-sm text-gray-700 flex justify-between"><span>{k}</span><b>{v}</b></p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-sm uppercase tracking-widest text-gray-500">Відповіді з сайту — {responses.length}</h3>
        <button onClick={exportCsv} disabled={!responses.length}
          className="px-4 py-2.5 bg-[#1a1a2e] text-white text-xs uppercase tracking-widest rounded-lg disabled:opacity-40">
          Експорт CSV
        </button>
      </div>

      {responses.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center text-sm text-gray-400">
          Поки що жодної відповіді. Щойно гість заповнить RSVP на сайті — вона з&apos;явиться тут.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs uppercase tracking-widest text-gray-500">
                <th className="px-4 py-3">Ім&apos;я</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">+1</th>
                <th className="px-4 py-3">Деталі</th>
                <th className="px-4 py-3">Дата</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => (
                <tr key={r.id || i} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.name}{r.email ? <span className="block text-xs text-gray-400">{r.email}</span> : null}</td>
                  <td className="px-4 py-3">
                    <span className={'px-2 py-1 rounded-full text-xs ' + (r.attendance === 'attending' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                      {r.attendance === 'attending' ? 'Так' : 'Ні'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.plus_one ? '+1' : ''}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[320px]">{r.dietary || ''}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{r.created_at ? new Date(r.created_at).toLocaleDateString('uk-UA') : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
