import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default async function TemplateDemoPage({ params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: template } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!template) {
    return <div style={{ padding: 48, textAlign: 'center', fontFamily: 'system-ui' }}>Template not found</div>;
  }

  const html = template.config_json?.editorHtml || '';
  const css = template.config_json?.editorCss || '';

  if (!html) {
    return <div style={{ padding: 48, textAlign: 'center', fontFamily: 'system-ui' }}>No preview available for this template</div>;
  }

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${template.name} — Momently Template Demo</title>
<style>${css}</style>
</head>
<body>${html}</body>
</html>`;

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/templates" style={{ color: '#B8956A', textDecoration: 'none', fontSize: 14, fontFamily: 'system-ui' }}>&larr; All Templates</a>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui' }}>{template.name}</span>
          <span style={{ color: '#666', fontSize: 12, fontFamily: 'system-ui' }}>{template.category}</span>
        </div>
        <a href={'/templates/' + params.slug} style={{ padding: '8px 24px', background: '#B8956A', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontFamily: 'system-ui' }}>
          Use This Template — {template.price_uah} &#8372;
        </a>
      </div>
      <iframe
        srcDoc={fullHtml}
        style={{ width: '100%', height: '100%', border: 'none', marginTop: 48 }}
        title={template.name + ' demo'}
      />
    </div>
  );
}
