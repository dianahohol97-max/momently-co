import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared/navbar';

export default function HomePage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-14">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b8956a] font-medium mb-6">Digital Wedding Experience</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#1a1a2e] leading-[1.1] max-w-4xl">
          Ваше весілля,<br /><span className="text-[#b8956a]">красиво</span> в digital
        </h1>
        <p className="text-gray-500 mt-6 max-w-lg text-lg leading-relaxed">
          Запрошення. Сайт. RSVP. Гостьова камера. Один дизайн, одна панель, одна love story.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link href="/templates" className="bg-[#1a1a2e] text-[#faf8f4] px-8 py-3.5 rounded-lg font-medium text-sm hover:bg-[#2a2a3e] transition-colors">
            Обрати шаблон
          </Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-[#b8956a] transition-colors">
            599 ₴ · Без підписки
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] text-center mb-3">Модулі</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a2e] text-center mb-16">Все для вашого весілля</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '💌', title: 'Запрошення', desc: 'Елегантне цифрове запрошення з RSVP формою, зворотнім відліком та деталями дня' },
              { icon: '🌐', title: 'Весільний сайт', desc: 'Персональний сайт з усією інформацією — місце, розклад, дрес-код, як дістатись' },
