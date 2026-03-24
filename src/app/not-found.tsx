import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared/navbar';

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center text-center px-6 pt-20">
        <div>
          <p className="text-6xl mb-6">💍</p>
          <h1 className="font-serif text-4xl text-[#1a1a2e] mb-3">Сторінку не знайдено</h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">Цієї сторінки не існує або запрошення ще не опубліковано.</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/" className="bg-[#1a1a2e] text-[#faf8f4] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors">На головну</Link>
            <Link href="/templates" className="border border-[#b8956a] text-[#b8956a] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#b8956a]/10 transition-colors">Шаблони</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
