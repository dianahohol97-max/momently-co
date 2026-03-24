'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface CreateWeddingButtonProps {
  templateId: string;
  templateSlug: string;
  className?: string;
  children: React.ReactNode;
}

export function CreateWeddingButton({ templateId, templateSlug, className, children }: CreateWeddingButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCreate = async () => {
    setLoading(true);

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login?next=/templates/' + templateSlug);
      return;
    }

    try {
      const res = await fetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: templateId }),
      });

      if (res.ok) {
        const wedding = await res.json();
        router.push('/dashboard/' + wedding.id);
      } else {
        const err = await res.json();
        alert(err.error || 'Помилка створення весілля');
      }
    } catch (e) {
      alert('Помилка зʼєднання');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className={className}
    >
      {loading ? 'Створюємо...' : children}
    </button>
  );
}
