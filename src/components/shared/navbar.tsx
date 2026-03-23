'use client';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f4]/90 backdrop-blur-xl border-b border-[#e8e0d4]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif font-semibold text-lg text-[#1a1a2e] tracking-wide">Momently<span className="text-[#b8956a]">.</span></Link>
        <div className="hidden md:flex items-center gap-1">
          <Link href="/templates" className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#b8956a] px-3 py-2 transition-colors">Templates</Link>
          <Link href="/pricing" className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#b8956a] px-3 py-2 transition-colors">Pricing</Link>
          <Link href="/blog" className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#b8956a] px-3 py-2 transition-colors">Blog</Link>
          <Link href="/auth/login" className="ml-4 text-xs uppercase tracking-widest bg-[#1a1a2e] text-[#faf8f4] px-5 py-2.5 rounded-lg hover:bg-[#2a2a3e] transition-colors">Get Started</Link>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[#1a1a2e]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">{isOpen ? <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" /> : <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" />}</svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#faf8f4] border-b border-[#e8e0d4] px-6 py-4 space-y-3">
          <Link href="/templates" className="block text-sm text-gray-600 hover:text-[#b8956a]" onClick={() => setIsOpen(false)}>Templates</Link>
          <Link href="/pricing" className="block text-sm text-gray-600 hover:text-[#b8956a]" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link href="/auth/login" className="block text-sm font-medium text-[#b8956a]" onClick={() => setIsOpen(false)}>Get Started</Link>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#e8e0d4] px-6 py-12 text-center">
      <p className="font-serif font-semibold text-[#1a1a2e]">Momently<span className="text-[#b8956a]">.</span></p>
      <p className="text-xs text-gray-400 mt-2">&copy; 2026 Momently Co</p>
    </footer>
  );
            }
