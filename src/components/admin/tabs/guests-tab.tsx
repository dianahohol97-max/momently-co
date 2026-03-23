'use client';
import { useState } from 'react';

interface GuestsTabProps { wedding: any; guests: any[]; rsvpResponses: any[]; }
const groupLabels: Record<string, string> = { family: 'Родина', friends: 'Друзі', work: 'Робота', other: 'Інше' };
const statusColors: Record<string, string> = { yes: 'bg-green-100 text-green-700', no: 'bg-red-100 text-red-700', pending: 'bg-amber-100 text-amber-700', maybe: 'bg-blue-100 text-blue-700' };
const statusLabels: Record<string, string> = { yes: 'Так', no: 'Ні', pending: 'Очікує', maybe: 'Можливо' };

export function GuestsTab({ wedding, guests: initialGuests, rsvpResponses }: GuestsTabProps) {
  const [guests, setGuests] = useState(initialGuests);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGroup, setNewGroup] = useState('friends');
  const [adding, setAdding] = useState(false);
  const stats = { total: guests.length, yes: guests.filter(g => g.rsvp_status === 'yes').length, no: guests.filter(g => g.rsvp_status === 'no').length, pending: guests.filter(g => g.rsvp_status === 'pending').length };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/guests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wedding_id: wedding.id, name: newName, email: newEmail || null, guest_group: newGroup }) });
      if (res.ok) { const guest = await res.json(); setGuests([...guests, guest]); setNewName(''); setNewEmail(''); setShowAdd(false); }
    } catch (e) { console.error(e); } finally { setAdding(false); }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        {[{ label: 'Всього', value: stats.total, color: 'text-[#1a1a2e]' }, { label: 'Підтвердили', value: stats.yes, color: 'text-green-600' }, { label: 'Відмовились', value: stats.no, color: 'text-red-500' }, { label: 'Очікують', value: stats.pending, color: 'text-amber-500' }].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#e8e0d4] p-4 text-center">
            <div className={'font-serif text-3xl ' + s.color}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-[#1a1a2e]">Список гостей</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="text-xs uppercase tracking-widest text-[#b8956a] font-medium">{showAdd ? 'Скасувати' : '+ Додати гостя'}</button>
      </div>
      {showAdd && (
        <div className="bg-white rounded-xl border border-[#e8e0d4] p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ім'я гостя" className="px-4 py-3 border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" className="px-4 py-3 border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
            <select value={newGroup} onChange={e => setNewGroup(e.target.value)} className="px-4 py-3 border border-[#e8e0d4] rounded-lg text-sm"><option value="family">Родина</option><option value="friends">Друзі</option><option value="work">Робота</option><option value="other">Інше</option></select>
          </div>
          <button onClick={handleAdd} disabled={adding || !newName.trim()} className="bg-[#1a1a2e] text-[#faf8f4] px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">{adding ? 'Додаємо...' : 'Додати'}</button>
        </div>
      )}
      {guests.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e8e0d4] rounded-xl"><p className="text-3xl mb-3">👥</p><p className="text-sm text-gray-400">Поки немає гостей</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8e0d4] overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[#e8e0d4]"><th className="text-left text-[10px] uppercase tracking-widest text-gray-400 font-medium px-4 py-3">Ім&apos;я</th><th className="text-left text-[10px] uppercase tracking-widest text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Група</th><th className="text-left text-[10px] uppercase tracking-widest text-gray-400 font-medium px-4 py-3">RSVP</th></tr></thead>
            <tbody>{guests.map((g: any) => (
              <tr key={g.id} className="border-b border-[#e8e0d4] last:border-0 hover:bg-[#faf8f4]">
                <td className="px-4 py-3"><div className="text-sm text-[#1a1a2e] font-medium">{g.name}</div>{g.email && <div className="text-xs text-gray-400">{g.email}</div>}</td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs text-gray-500">{groupLabels[g.guest_group] || g.guest_group}</span></td>
                <td className="px-4 py-3"><span className={'inline-block text-[10px] uppercase tracking-wider font-medium px-2 py-1 rounded-full ' + (statusColors[g.rsvp_status] || 'bg-gray-100 text-gray-500')}>{statusLabels[g.rsvp_status] || g.rsvp_status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
