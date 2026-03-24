import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { Navbar, Footer } from '@/components/shared/navbar';
import type { Metadata } from 'next';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('blog_posts').select('title, seo_title, seo_description, excerpt').eq('slug', params.slug).eq('status', 'published').single();
  if (!data) return { title: 'Not Found' };
  return { title: (data.seo_title || data.title) + ' — Momently Blog', description: data.seo_description || data.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createServerSupabase();
  const { data: post } = await supabase.from('blog_posts').select('*, blog_authors(name)').eq('slug', params.slug).eq('status', 'published').single();
  if (!post) notFound();

  // Increment view count
  await supabase.from('blog_posts').update({ view_count: (post.view_count || 0) + 1 }).eq('id', post.id);

  return (
    <main>
      <Navbar />
      <article className="pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#b8956a] transition-colors">← Блог</Link>
          <div className="mt-8 mb-6 flex items-center gap-3">
            {post.tags?.slice(0, 3).map((tag: string) => (
              <span key={tag} className="text-[10px] uppercase tracking-widest text-[#b8956a] font-medium bg-[#b8956a]/10 px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#1a1a2e] leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            {post.blog_authors?.name && <span>{post.blog_authors.name}</span>}
            {post.published_at && <span>{new Date(post.published_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
            {post.reading_time_min && <span>{post.reading_time_min} хв читання</span>}
          </div>
          <div className="w-16 h-px bg-[#b8956a] mt-8 mb-10" />
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.body_html || '' }} style={{ color: '#3D3027' }} />
          <div className="mt-16 pt-8 border-t border-[#e8e0d4] text-center">
            <p className="text-sm text-gray-500">Готові створити своє запрошення?</p>
            <Link href="/templates" className="inline-block mt-4 bg-[#1a1a2e] text-[#faf8f4] px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors">Обрати шаблон — 599 ₴</Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
