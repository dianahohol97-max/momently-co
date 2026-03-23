import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared/navbar';

export const metadata = { title: 'Pricing', description: 'Simple pricing for your digital wedding experience.' };

const plans = [
  { name: 'Free', price: '0 ₴', description: 'Ідеально для тестування', features: ['1 безкоштовний шаблон', 'Базовий RSVP', 'До 50 гостей', 'Сайт-запрошення', 'QR-код'], cta: 'Почати безкоштовно', href: '/auth/signup', highlighted: false },
  { name: 'Standard', price: '299 ₴', description: 'Все для ідеального весілля', features: ['Будь-який шаблон', 'Повна кастомізація', 'Необмежені гості', 'RSVP з меню вибору', 'Гостьова камера', 'Фотобудка', 'Гостьова книга', 'QR-код + WhatsApp/Viber', '3 мови: UA / EN / RO'], cta: 'Обрати Standard', href: '/auth/signup?plan=standard', highlighted: true },
  { name: 'Premium', price: '499 ₴', description: 'Максимум вражень', features: ['Все з Standard', 'Преміум шаблони', 'Memory Film (відео)', 'Власний домен', 'Пріоритетна підтримка', 'Аналітика відвідувань'], cta: 'Обрати Premium', href: '/auth/signup?plan=premium', highlighted: false },
];

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] font-medium mb-4">Тарифи</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1a1a2e] leading-tight">Одна ціна, без підписки</h1>
          <p className="text-lg text-gray-500 mt-4 max-w-md mx-auto">Оплатіть один раз — користуйтесь завжди.</p>
        </div>
      </section>
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-2xl p-8 border transition-all duration-300 ${plan.highlighted ? 'border-[#b8956a] bg-white shadow-lg scale-[1.02]' : 'border-[#e8e0d4] bg-white/50 hover:border-[#b8956a]/50'}`}>
              <h3 className="text-xs uppercase tracking-widest text-[#b8956a] font-medium">{plan.name}</h3>
              <div className="mt-4"><span className="font-serif text-4xl text-[#1a1a2e]">{plan.price}</span><span className="text-xs text-gray-400 ml-2">одноразово</span></div>
              <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              <div className="w-full h-px bg-[#e8e0d4] my-6" />
              <ul className="space-y-3">{plan.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-[#b8956a] mt-0.5 flex-shrink-0">✓</span>{f}</li>)}</ul>
              <Link href={plan.href} className={`block text-center mt-8 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${plan.highlighted ? 'bg-[#1a1a2e] text-[#faf8f4] hover:bg-[#2a2a3e]' : 'border border-[#b8956a] text-[#b8956a] hover:bg-[#b8956a]/10'}`}>{plan.cta}</Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
                                                                                            }
