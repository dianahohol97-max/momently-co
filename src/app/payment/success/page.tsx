import Link from 'next/link';
import { Navbar, Footer } from '@/components/shared/navbar';

interface Props { searchParams: { wedding_id?: string } }

export default function PaymentSuccessPage({ searchParams }: Props) {
  const weddingId = searchParams.wedding_id;

  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center text-center px-6 pt-14">
        <div>
          <p className="text-5xl mb-6">🎉</p>
          <h1 className="font-serif text-4xl text-[#1a1a2e] mb-3">Оплата успішна!</h1>
          <p className="text-gray-500 max-w-sm mx-auto">Дякуємо за покупку! Тепер ви можете опублікувати запрошення та поділитися ним з гостями.</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            {weddingId ? (
              <Link href={'/dashboard/' + weddingId} className="bg-[#1a1a2e] text-[#faf8f4] px-8 py-3 rounded-lg font-medium text-sm hover:bg-[#2a2a3e] transition-colors">Перейти до весілля</Link>
            ) : (
              <Link href="/dashboard" className="bg-[#1a1a2e] text-[#faf8f4] px-8 py-3 rounded-lg font-medium text-sm hover:bg-[#2a2a3e] transition-colors">Мої весілля</Link>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
