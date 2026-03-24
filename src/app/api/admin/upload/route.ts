import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = ['gogolka16@gmail.com', 'dianahohol97@gmail.com'];

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'No auth' }, { status: 401 });
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const templateId = formData.get('template_id') as string;
    const category = formData.get('category') as string || 'gallery';
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = (templateId || 'general') + '/' + category + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 6) + '.' + ext;
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage.from('template-assets').upload(fileName, arrayBuffer, { contentType: file.type, upsert: false });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

    const { data: urlData } = supabase.storage.from('template-assets').getPublicUrl(fileName);
    await supabase.from('template_assets').insert({
      template_id: templateId || null, file_url: urlData.publicUrl, file_name: file.name,
      file_type: file.type.startsWith('image/svg') ? 'illustration' : 'image', category, file_size: file.size,
    });
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
      }
