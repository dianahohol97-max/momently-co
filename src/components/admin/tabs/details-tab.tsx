'use client';
import { useState } from 'react';

interface DetailsTabProps {
  wedding: any;
  onSave: (updates: Record<string, any>) => Promise<void>;
  saving: boolean;
}

const Field = ({ label, value, onChange, type = 'text', placeholder = '', hint = '' }: any) => (
  <div className="space-y-1.5">
    <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium">{label}</label>
    {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder = '', rows = 3, hint = '' }: any) => (
  <div className="space-y-1.5">
    <label className="block text-xs uppercase tracking-widest text-gray-500 font-medium">{label}</label>
    {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-4 py-3 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a] resize-none" />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border border-[#e8e0d4] rounded-xl p-6 space-y-4 bg-white">
    <h2 className="font-serif text-lg text-[#1a1a2e]">{title}</h2>
    {children}
  </section>
);

export function DetailsTab({ wedding, onSave, saving }: DetailsTabProps) {
  const [name1, setName1] = useState(wedding.partner_name_1 || '');
  const [name2, setName2] = useState(wedding.partner_name_2 || '');
  const [weddingDate, setWeddingDate] = useState(wedding.wedding_date?.split('T')[0] || '');
  const [weddingTime, setWeddingTime] = useState(wedding.wedding_date?.split('T')[1]?.slice(0,5) || '');
  const [location, setLocation] = useState(wedding.location || '');
  const [slug, setSlug] = useState(wedding.slug || '');
  const [storyQuote, setStoryQuote] = useState(wedding.story_quote || '');
  const [storyParagraph1, setStoryParagraph1] = useState(wedding.story_paragraph_1 || '');
  const [storyParagraph2, setStoryParagraph2] = useState(wedding.story_paragraph_2 || '');
  const [storyCaption, setStoryCaption] = useState(wedding.polaroid_caption || '');
  const [venueName, setVenueName] = useState(wedding.venue_name || '');
  const [venueAddress, setVenueAddress] = useState(wedding.venue_address || '');
  const [venueDirections, setVenueDirections] = useState(wedding.venue_directions_url || '');
  const [dressCodeTitle, setDressCodeTitle] = useState(wedding.dress_code_title || '');
  const [dressCodeDesc, setDressCodeDesc] = useState(wedding.dress_code_description || '');
  const [rsvpDeadline, setRsvpDeadline] = useState(wedding.rsvp_deadline || '');
  const [giftsDesc, setGiftsDesc] = useState(wedding.gifts_description || '');
  const [giftsUrl, setGiftsUrl] = useState(wedding.gifts_url || '');
  const [itinerary, setItinerary] = useState<any[]>(wedding.itinerary_data || [{ title: '', time: '', description: '' }]);
  const [hotels, setHotels] = useState<any[]>(wedding.hotels_data || [{ name: '', description: '', url: '' }]);
  const [faq, setFaq] = useState<any[]>(wedding.faq_data || [{ question: '', answer: '' }]);

  const handleSave = () => {
    const dateTime = weddingDate && weddingTime ? `${weddingDate}T${weddingTime}:00` : weddingDate ? `${weddingDate}T12:00:00` : null;
    onSave({
      partner_name_1: name1, partner_name_2: name2,
      wedding_date: dateTime, location, slug,
      story_quote: storyQuote, story_paragraph_1: storyParagraph1, story_paragraph_2: storyParagraph2, polaroid_caption: storyCaption,
      venue_name: venueName, venue_address: venueAddress, venue_directions_url: venueDirections,
      dress_code_title: dressCodeTitle, dress_code_description: dressCodeDesc, rsvp_deadline: rsvpDeadline,
      itinerary_data: itinerary.filter(i => i.title), hotels_data: hotels.filter(h => h.name),
      faq_data: faq.filter(f => f.question), gifts_description: giftsDesc, gifts_url: giftsUrl,
    });
  };

  return (
    <div className="space-y-6">
      <Section title="👫 Пара">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Ім'я партнера 1" value={name1} onChange={setName1} placeholder="Анна" />
          <Field label="Ім'я партнера 2" value={name2} onChange={setName2} placeholder="Максим" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Дата весілля" value={weddingDate} onChange={setWeddingDate} type="date" />
          <Field label="Час церемонії" value={weddingTime} onChange={setWeddingTime} type="time" />
          <Field label="Локація" value={location} onChange={setLocation} placeholder="Kyiv, Ukraine" />
        </div>
        <Field label="URL весілля" value={slug} onChange={setSlug} placeholder="anna-maxim" hint="Посилання: momently.co/w/anna-maxim" />
      </Section>

      <Section title="💌 Наша Історія">
        <TextArea label="Цитата / головна фраза" value={storyQuote} onChange={setStoryQuote}
          placeholder='"Наша любов почалася біля моря..."' hint="Велика italic цитата (використовується в деяких шаблонах)" />
        <TextArea label="Абзац 1" value={storyParagraph1} onChange={setStoryParagraph1} rows={4} placeholder="Розкажіть вашу історію кохання..." />
        <TextArea label="Абзац 2" value={storyParagraph2} onChange={setStoryParagraph2} rows={4} placeholder="Продовження..." />
        <Field label="Підпис під фото (polaroid)" value={storyCaption} onChange={setStoryCaption} placeholder="Наше перше літо, 2022" />
      </Section>

      <Section title="📍 Місце проведення">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Назва місця" value={venueName} onChange={setVenueName} placeholder="Villa del Balbianello" />
          <Field label="Адреса" value={venueAddress} onChange={setVenueAddress} placeholder="Via Comoedia, 5, Lake Como" />
        </div>
        <Field label="Посилання Google Maps" value={venueDirections} onChange={setVenueDirections} placeholder="https://maps.google.com/..." />
      </Section>

      <Section title="🗓 Програма дня">
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3 text-[10px] uppercase tracking-widest text-gray-400">Час</div>
            <div className="col-span-4 text-[10px] uppercase tracking-widest text-gray-400">Назва</div>
            <div className="col-span-4 text-[10px] uppercase tracking-widest text-gray-400">Опис</div>
          </div>
          {itinerary.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={item.time} onChange={e => { const u=[...itinerary]; u[i]={...item,time:e.target.value}; setItinerary(u); }}
                placeholder="16:00" className="col-span-3 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
              <input value={item.title} onChange={e => { const u=[...itinerary]; u[i]={...item,title:e.target.value}; setItinerary(u); }}
                placeholder="Церемонія" className="col-span-4 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
              <input value={item.description} onChange={e => { const u=[...itinerary]; u[i]={...item,description:e.target.value}; setItinerary(u); }}
                placeholder="Опис..." className="col-span-4 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
              <button onClick={() => setItinerary(itinerary.filter((_,j)=>j!==i))} className="col-span-1 text-gray-300 hover:text-red-400 text-lg">✕</button>
            </div>
          ))}
          <button onClick={() => setItinerary([...itinerary, {title:'',time:'',description:''}])}
            className="text-xs text-[#b8956a] hover:text-[#a07850] font-medium">+ Додати пункт</button>
        </div>
      </Section>

      <Section title="🏨 Готелі для гостей">
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4 text-[10px] uppercase tracking-widest text-gray-400">Назва</div>
            <div className="col-span-4 text-[10px] uppercase tracking-widest text-gray-400">Опис</div>
            <div className="col-span-3 text-[10px] uppercase tracking-widest text-gray-400">Посилання</div>
          </div>
          {hotels.map((hotel, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={hotel.name} onChange={e => { const u=[...hotels]; u[i]={...hotel,name:e.target.value}; setHotels(u); }}
                placeholder="Назва готелю" className="col-span-4 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
              <input value={hotel.description} onChange={e => { const u=[...hotels]; u[i]={...hotel,description:e.target.value}; setHotels(u); }}
                placeholder="Короткий опис" className="col-span-4 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
              <input value={hotel.url} onChange={e => { const u=[...hotels]; u[i]={...hotel,url:e.target.value}; setHotels(u); }}
                placeholder="https://..." className="col-span-3 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
              <button onClick={() => setHotels(hotels.filter((_,j)=>j!==i))} className="col-span-1 text-gray-300 hover:text-red-400 text-lg">✕</button>
            </div>
          ))}
          <button onClick={() => setHotels([...hotels, {name:'',description:'',url:''}])}
            className="text-xs text-[#b8956a] hover:text-[#a07850] font-medium">+ Додати готель</button>
        </div>
      </Section>

      <Section title="👗 Дрес-код та RSVP">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Назва дрес-коду" value={dressCodeTitle} onChange={setDressCodeTitle} placeholder="Black Tie" />
          <Field label="RSVP дедлайн" value={rsvpDeadline} onChange={setRsvpDeadline} placeholder="1 серпня 2026" />
        </div>
        <TextArea label="Опис дрес-коду" value={dressCodeDesc} onChange={setDressCodeDesc}
          placeholder="Просимо гостей одягнутися у формальний вечірній одяг..." rows={3} />
      </Section>

      <Section title="❓ Часті запитання">
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5 text-[10px] uppercase tracking-widest text-gray-400">Запитання</div>
            <div className="col-span-6 text-[10px] uppercase tracking-widest text-gray-400">Відповідь</div>
          </div>
          {faq.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={item.question} onChange={e => { const u=[...faq]; u[i]={...item,question:e.target.value}; setFaq(u); }}
                placeholder="Запитання?" className="col-span-5 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
              <input value={item.answer} onChange={e => { const u=[...faq]; u[i]={...item,answer:e.target.value}; setFaq(u); }}
                placeholder="Відповідь..." className="col-span-6 px-3 py-2 bg-white border border-[#e8e0d4] rounded-lg text-sm focus:outline-none focus:border-[#b8956a]" />
              <button onClick={() => setFaq(faq.filter((_,j)=>j!==i))} className="col-span-1 text-gray-300 hover:text-red-400 text-lg">✕</button>
            </div>
          ))}
          <button onClick={() => setFaq([...faq, {question:'',answer:''}])}
            className="text-xs text-[#b8956a] hover:text-[#a07850] font-medium">+ Додати запитання</button>
        </div>
      </Section>

      <Section title="🎁 Подарунки">
        <TextArea label="Текст про подарунки" value={giftsDesc} onChange={setGiftsDesc}
          placeholder="Ваша присутність — найкращий подарунок..." rows={3} />
        <Field label="Посилання на реєстр / фонд" value={giftsUrl} onChange={setGiftsUrl} placeholder="https://..." />
      </Section>

      <button onClick={handleSave} disabled={saving}
        className="w-full bg-[#1a1a2e] text-[#faf8f4] py-4 rounded-xl text-sm font-medium hover:bg-[#2a2a3e] transition-colors disabled:opacity-50">
        {saving ? 'Зберігаємо...' : 'Зберегти всі деталі'}
      </button>
    </div>
  );
}
