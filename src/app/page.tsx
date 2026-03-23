import Link from 'next/link';
export default function HomePage() {
  return (
    <main>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f4]/90 backdrop-blur-xl border-b border-[#e8e0d4]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif font-semibold text-lg text-[#1a1a2e] tracking-wide">Momently<span className="text-[#b8956a]">.</span></Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/templates" className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#b8956a] px-3 py-2">Templates</Link>
            <Link href="/pricing" className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#b8956a] px-3 py-2">Pricing</Link>
            <Link href="/blog" className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#b8956a] px-3 py-2">Blog</Link>
            <Link href="/auth/login" className="ml-4 text-xs uppercase tracking-widest bg-[#1a1a2e] text-[#faf8f4] px-5 py-2.5 rounded-lg">Get Started</Link>
          </div>
        </div>
      </nav>
      <section className="min-h-screen flex items-center justify-center text-center px-6 pt-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] font-medium mb-6">Digital Wedding Experience</p>
          <h1 className="font-serif text-6xl md:text-7xl font-normal text-[#1a1a2e] leading-tight">Your wedding, <br/><em className="italic text-[#b8956a]">beautifully digital</em></h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed mt-6 max-w-lg mx-auto">Invitations. Website. RSVP. Guest Camera. One design, one dashboard, one love story.</p>
          <div className="w-14 h-px bg-[#b8956a] mx-auto mt-8 mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/templates" className="bg-[#1a1a2e] text-[#faf8f4] px-8 py-3.5 rounded-lg font-medium text-sm">Browse Templates</Link>
            <Link href="/auth/signup" className="border border-[#b8956a] text-[#b8956a] px-8 py-3.5 rounded-lg font-medium text-sm">Start Free</Link>
          </div>
          <p className="text-xs text-gray-400 mt-6 uppercase tracking-widest">From 299 UAH · No subscription · UA / RO / EN</p>
        </div>
      </section>
      <footer className="border-t border-[#e8e0d4] px-6 py-12 text-center">
        <p className="font-serif font-semibold text-[#1a1a2e]">Momently<span className="text-[#b8956a]">.</span></p>
        <p className="text-xs text-gray-400 mt-2">© 2026 Momently Co</p>
      </footer>
    </main>
  );
}
