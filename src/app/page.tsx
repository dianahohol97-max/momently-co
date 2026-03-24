import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared/navbar';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-14">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b8956a] font-medium mb-6">Digital Wedding Experience</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#1a1a2e] leading-[1.1] max-w-4xl">
          {"Ваше весілля,"}<br /><span className="text-[#b8956a]">красиво</span>{" в digital"}
        </h1>
        <p className="text-gray-500 mt-6 max-w-lg text-lg leading-relaxed">
          {"Запрошення. Сайт. RSVP. Гостьова камера. Один дизайн, одна панель, одна love story."}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link href="/templates" className="bg-[#1a1a2e] text-[#faf8f4] px-8 py-3.5 rounded-lg font-medium text-sm hover:bg-[#2a2a3e] transition-colors">{"Обрати шаблон"}</Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-[#b8956a] transition-colors">{"599 \u20b4 \u00b7 Без підписки"}</Link>
        </div>
      </section>
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] text-center mb-3">{"Модулі"}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a2e] text-center mb-16">{"Все для вашого весілля"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '💌', title: 'Запрошення', desc: 'Елегантне цифрове запрошення з RSVP формою, зворотнім відліком та деталями дня' },
              { icon: '🌐', title: 'Весільний сайт', desc: 'Персональний сайт з усією інформацією — місце, розклад, дрес-код, як дістатись' },
              { icon: '📸', title: 'Гостьова камера', desc: 'Гості завантажують фото прямо під час свята. Всі моменти — в одному місці' },
              { icon: '🎭', title: 'Фотобудка', desc: 'Фільтри, рамки та стікери. Весела інтерактивна камера для ваших гостей' },
              { icon: '📖', title: 'Книга гостей', desc: 'Цифрова книга побажань. Текст, фото, відео від кожного гостя' },
              { icon: '🎬', title: 'Memory Film', desc: 'Автоматичне відео зі всіх фото гостей. Готовий фільм вашого дня' },
            ].map(f => (
              <div key={f.title} className="text-center p-6">
                <p className="text-3xl mb-4">{f.icon}</p>
                <h3 className="font-serif text-lg text-[#1a1a2e] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] text-center mb-3">{"Як це працює"}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a2e] text-center mb-16">{"3 кроки до запрошення"}</h2>
          <div className="space-y-12">
            {[
              { n: '01', title: 'Оберіть шаблон', desc: 'Перегляньте колекцію дизайнів та оберіть стиль, який пасує саме вам.' },
              { n: '02', title: 'Налаштуйте деталі', desc: 'Додайте імена, дату, місце, розклад та кольори. Все редагується в реальному часі.' },
              { n: '03', title: 'Поділіться з гостями', desc: 'Надішліть через WhatsApp, Viber, Telegram або роздрукуйте QR-код.' },
            ].map(s => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="text-3xl font-serif text-[#b8956a] opacity-50 leading-none pt-1">{s.n}</div>
                <div><h3 className="font-serif text-xl text-[#1a1a2e] mb-1">{s.title}</h3><p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-[#1a1a2e] text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] mb-4">{"Готові?"}</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#faf8f4] mb-6 max-w-lg mx-auto">{"Створіть ваше весільне запрошення сьогодні"}</h2>
        <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">{"599 \u20b4 одноразово. Без підписки. UA / EN / RO."}</p>
        <Link href="/templates" className="inline-block bg-[#b8956a] text-[#faf8f4] px-8 py-3.5 rounded-lg font-medium text-sm hover:bg-[#a07850] transition-colors">{"Обрати шаблон — 599 \u20b4"}</Link>
      </section>
      <Footer />
    </main>
  );
               }
