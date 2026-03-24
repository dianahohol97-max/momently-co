import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared/navbar';

export const metadata = { title: 'Pricing — Momently Co' };

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] mb-3">Pricing</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a2e]">Одна ціна — все включено</h1>
          <p className="text-gray-500 mt-4 max-w-md mx-auto">Без підписки. Без прихованих платежів. Одноразова оплата за повний пакет.</p>
        </div>

        <div className="max-w-lg mx-auto mt-16">
          <div className="bg-white rounded-2xl border-2 border-[#b8956a] p-8 md:p-10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b8956a] text-white text-[10px] uppercase tracking-widest px-4 py-1 rounded-full">Повний пакет</div>
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-serif text-5xl text-[#1a1a2e]">599</span>
                <span className="text-gray-500">₴</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">одноразово · назавжди ваше</p>
            </div>
            <div className="space-y-3 mb-8">
              {[
                'Цифрове запрошення з кастомізацією',
                'Персональний весільний сайт',
                'RSVP форма з аналітикою',
                'Гостьова камера',
                'Фотобудка з фільтрами',
                'Книга гостей',
                'Memory Film — відео з фото гостей',
                'Поділитися через WhatsApp, Viber, Telegram',
                'QR-код для друку',
                'Необмежена кількість гостей',
                'Підтримка UA / EN / RO',
              ].map(f => (
                <div key={f} className="flex items-start gap-3">
                  <span className="text-[#b8956a] mt-0.5">✓</span>
                  <span className="text-sm text-gray-600">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/templates" className="block w-full bg-[#1a1a2e] text-[#faf8f4] text-center px-6 py-3.5 rounded-lg font-medium text-sm hover:bg-[#2a2a3e] transition-colors">
              Обрати шаблон
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-20">
          <h2 className="font-serif text-2xl text-[#1a1a2e] text-center mb-10">Часті питання</h2>
          <div className="space-y-6">
            {[
              { q: 'Чи потрібна підписка?', a: 'Ні. Ви платите один раз — і запрошення ваше назавжди. Без щомісячних платежів.' },
              { q: 'Скільки гостей можна додати?', a: 'Необмежено. Без додаткової оплати за кожного гостя.' },
              { q: 'Чи можна змінити дизайн після оплати?', a: 'Так. Ви можете змінювати кольори, шрифти, тексти та деталі в будь-який час.' },
              { q: 'Як довго буде доступне запрошення?', a: 'Мінімум 1 рік після дати весілля. Ми збережемо ваші спогади.' },
              { q: 'Чи є повернення коштів?', a: 'Так, протягом 14 днів після покупки, якщо весілля ще не опубліковано.' },
            ].map(faq => (
              <div key={faq.q} className="border-b border-[#e8e0d4] pb-6">
                <h3 className="font-medium text-[#1a1a2e] text-sm">{faq.q}</h3>
                <p className="text-sm text-gray-500 mt-2">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
        }
