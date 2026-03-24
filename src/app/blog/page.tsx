import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { Navbar, Footer } from '@/components/shared/navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Блог — Momently Co', description: 'Поради, тренди та натхнення для вашого весілля. Все про цифрові запрошення, RSVP, гостьову камеру та планування.' };

export default async function BlogPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase.from('blog_posts').select('slug, title, excerpt, published_at, reading_time_min, tags, category_id').eq('status', 'published').order('published_at', { ascending: false });

  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b8956a] mb-3">Блог</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a2e]">Поради та натхнення</h1>
          <p className="text-gray-500 mt-4">Все про цифрові весілля, тренди та планування.</p>

          <div className="mt-12 space-y-8">
            {(!posts || posts.length === 0) ? (
              <p className="text-gray-400 text-center py-16">Скоро тут з&apos;являться статті</p>
            ) : posts.map((post: any) => (
              <Link key={post.slug} href={'/blog/' + post.slug} className="block group">
                <article className="border-b border-[#e8e0d4] pb-8">
                  <div className="flex items-center gap-3 mb-3">
                    {post.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest text-[#b8956a] font-medium">{tag}</span>
                    ))}
                    {post.reading_time_min && <span className="text-[10px] text-gray-400">{post.reading_time_min} хв читання</span>}
                  </div>
                  <h2 className="font-serif text-2xl text-[#1a1a2e] group-hover:text-[#b8956a] transition-colors">{post.title}</h2>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{post.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-4">{post.published_at ? new Date(post.published_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
