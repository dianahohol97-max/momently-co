import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared/navbar';

export const metadata = { title: 'Pricing — Momently Co' };

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-8 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] mb-3">Pricing</p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a2e]">Одна ціна — все включено</h1>
        <p className="text-gray-500 mt-4 max-w-md mx-auto">Без підписки. Без прихованих платежів. Одноразова оплата за повний доступ до всіх функцій.</p>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#b8956a] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bg-[#b8956a] py-1.5"><p className="text-[10px] uppercase tracking-widest text-white font-medium">Повний пакет</p></div>
            <div className="pt-6">
              <div className="flex items-baseline justify-center gap-1 mt-4">
                <span className="font-serif text-6xl text-[#1a1a2e]">299</span>
                <span className="text-lg text-gray-400">₴</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">одноразово · без підписки</p>
            </div>
            <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
              {[
                'Цифрове запрошення з RSVP',
                'Весільний сайт з усіма деталями',
                'Гостьова камера та фотобудка',
                'Книга побажань гостей',
                'Memory Film — відео зі всіх фото',
                'QR-код для друку',
                'Кастомізація кольорів та шрифтів',
                'Адмін-панель з аналітикою',
                'Шеринг через WhatsApp / Viber / Telegram',
                'Підтримка UA / EN / RO',
              ].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#b8956a]/10 flex items-center justify-center text-[#b8956a] text-[10px] flex-shrink-0">✓</div>
                  <span className="text-sm text-gray-600">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/templates" className="inline-block mt-10 bg-[#1a1a2e] text-[#faf8f4] px-10 py-3.5 rounded-lg font-medium text-sm hover:bg-[#2a2a3e] transition-colors">
              Обрати шаблон
            </Link>
          </div>

          <div className="mt-12 text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-gray-400">Часті питання</p>
            {[
              { q: 'Чи є підписка?', a: 'Ні. Ви платите один раз і отримуєте повний доступ назавжди.' },
              { q: 'Скільки гостей можна запросити?', a: 'Без обмежень. Запрошуйте скільки потрібно.' },
              { q: 'Чи можна змінити дизайн після оплати?', a: 'Так, ви можете міняти кольори, шрифти та деталі в будь-який час.' },
              { q: 'Які способи оплати?', a: 'Карта Visa/Mastercard через безпечний платіжний шлюз.' },
            ].map(faq => (
              <div key={faq.q} className="text-left bg-white rounded-xl border border-[#e8e0d4] p-5">
                <p className="text-sm font-medium text-[#1a1a2e]">{faq.q}</p>
                <p className="text-sm text-gray-500 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
               }
