'use client';
import { useState } from 'react';

interface DetailsTabProps { wedding: any; onSave: (updates: Record<string, any>) => Promise<void>; saving: boolean; }

export function DetailsTab({ wedding, onSave, saving }: DetailsTabProps) {
  const [partnerName1, setPartnerName1] = useState(wedding.partner_name_1 || '');
  const [partnerName2, setPartnerName2] = useState(wedding.partner_name_2 || '');
  const [weddingDate, setWeddingDate] = useState(wedding.wedding_date || '');
  const [ceremonyTime, setCeremonyTime] = useState(wedding.ceremony_time || '');
  const [venue, setVenue] = useState(wedding.venue_data?.ceremony || { name: '', address: '', city: '', country: 'Україна' });
  const [schedule, setSchedule] = useState(wedding.schedule_data || {});
  const [details, setDetails] = useState(wedding.details_data || {});

  const handleSave = () => {
    onSave({ partner_name_1: partnerName1, partner_name_2: partnerName2, wedding_date: weddingDate || null, ceremony_time: ceremonyTime || null, venue_data: { ceremony: venue, reception: wedding.venue_data?.reception || null }, schedule_data: schedule, details_data: details });
  };

  const Field = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
    <div className="space-y-1.5">
      <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
    </div>
  );

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Пара</h2>
        <p className="text-sm text-gray-400 mb-6">Імена на запрошенні</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Партнер 1" value={partnerName1} onChange={setPartnerName1} />
          <Field label="Партнер 2" value={partnerName2} onChange={setPartnerName2} />
        </div>
      </section>
      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Дата та час</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Дата весілля" value={weddingDate} onChange={setWeddingDate} type="date" />
          <Field label="Час церемонії" value={ceremonyTime} onChange={setCeremonyTime} type="time" />
        </div>
      </section>
      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Місце проведення</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Назва" value={venue.name} onChange={(v: string) => setVenue({...venue, name: v})} placeholder="Палац Потоцьких" />
          <Field label="Місто" value={venue.city} onChange={(v: string) => setVenue({...venue, city: v})} placeholder="Львів" />
          <div className="md:col-span-2"><Field label="Адреса" value={venue.address} onChange={(v: string) => setVenue({...venue, address: v})} placeholder="вул. Коперника, 15" /></div>
        </div>
      </section>
      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Розклад дня</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Фуршет" value={schedule.receptionTime || ''} onChange={(v: string) => setSchedule({...schedule, receptionTime: v})} type="time" />
          <Field label="Вечеря" value={schedule.dinnerTime || ''} onChange={(v: string) => setSchedule({...schedule, dinnerTime: v})} type="time" />
          <Field label="Вечірка" value={schedule.partyTime || ''} onChange={(v: string) => setSchedule({...schedule, partyTime: v})} type="time" />
        </div>
      </section>
      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Додаткова інформація</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Дрес-код" value={details.dressCode || ''} onChange={(v: string) => setDetails({...details, dressCode: v})} placeholder="Коктейльний" />
          <Field label="Хештег" value={details.hashtag || ''} onChange={(v: string) => setDetails({...details, hashtag: v})} placeholder="AnnaAndOleksandr2026" />
        </div>
      </section>
      <button onClick={handleSave} disabled={saving} className="bg-[#1a1a2e] text-[#faf8f4] px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] disabled:opacity-50">{saving ? 'Зберігаємо...' : 'Зберегти все'}</button>
    </div>
  );
}
