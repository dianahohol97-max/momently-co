import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared/navbar';

export const metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl text-[#1a1a2e]">Мої весілля</h1>
              <p className="text-sm text-gray-500 mt-1">Керуйте вашими запрошеннями</p>
            </div>
            <Link href="/templates" className="bg-[#1a1a2e] text-[#faf8f4] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors">+ Нове весілля</Link>
          </div>
          <div className="mt-16 text-center py-20 border border-dashed border-[#e8e0d4] rounded-2xl">
            <p className="text-4xl mb-4">💍</p>
            <h2 className="font-serif text-xl text-[#1a1a2e]">Поки що пусто</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Створіть ваше перше цифрове весільне запрошення за кілька хвилин</p>
            <Link href="/templates" className="inline-block mt-6 bg-[#b8956a] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#a07850] transition-colors">Обрати шаблон</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
