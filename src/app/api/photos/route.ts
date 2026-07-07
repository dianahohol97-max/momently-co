import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const weddingId = formData.get('wedding_id') as string;
    const guestName = formData.get('guest_name') as string;
    const caption = formData.get('caption') as string;

    if (!file || !weddingId) {
      return NextResponse.json({ error: 'Missing file or wedding_id' }, { status: 400 });
    }

    // Generate unique path
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = weddingId + '/' + Date.now() + '-' + Math.random().toString(36).substring(7) + '.' + ext;

    // Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const { data: uploadData, error: uploadErr } = await supabaseAdmin().storage
      .from('guest-photos')
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 400 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin().storage.from('guest-photos').getPublicUrl(fileName);

    // Save record to guest_photos table
    const { data: photo, error: dbErr } = await supabaseAdmin().from('guest_photos').insert({
      wedding_id: weddingId,
      guest_name: guestName || 'Гість',
      storage_path: urlData.publicUrl,
      caption: caption || null,
    }).select().single();

    if (dbErr) {
      return NextResponse.json({ error: dbErr.message }, { status: 400 });
    }

    return NextResponse.json(photo);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const weddingId = searchParams.get('wedding_id');
  if (!weddingId) return NextResponse.json({ error: 'Missing wedding_id' }, { status: 400 });

  const { data, error } = await supabaseAdmin().from('guest_photos')
    .select('*').eq('wedding_id', weddingId).eq('is_approved', true)
    .order('created_at', { ascending: false }).limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
        }
