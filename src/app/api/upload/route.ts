import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const field = formData.get('field') as string;

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${field}-${Date.now()}.${ext}`;
    const buffer = await file.arrayBuffer();

    const { data, error } = await supabase().storage
      .from('wedding-media')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase().storage
      .from('wedding-media')
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
