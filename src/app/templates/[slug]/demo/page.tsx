import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { TEMPLATE_MAP, TEMPLATE_NAMES } from '@/components/templates/template-map';

export const dynamic = 'force-dynamic';

const BAR: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };

function DemoBar({ slug, name, category, priceUah }: { slug: string; name: string; category?: string; priceUah?: number }) {
  return (
    <div style={BAR}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/templates" style={{ color: '#B8956A', textDecoration: 'none', fontSize: 14, fontFamily: 'system-ui' }}>&larr; All Templates</a>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui' }}>{name}</span>
        {category && <span style={{ color: '#666', fontSize: 12, fontFamily: 'system-ui' }}>{category}</span>}
      </div>
      <a href={'/templates/' + slug} style={{ padding: '8px 24px', background: '#B8956A', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontFamily: 'system-ui' }}>
        Use This Template{priceUah ? <> &mdash; {priceUah} &#8372;</> : null}
      </a>
    </div>
  );
}

export default async function TemplateDemoPage({ params }: { params: { slug: string } }) {
  // 1) Try the DB row (may be unavailable: paused project, missing env, no row yet).
  let template: any = null;
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', params.slug)
        .single();
      template = data;
    }
  } catch {
    template = null;
  }

  const html = template?.config_json?.editorHtml || '';
  const css = template?.config_json?.editorCss || '';

  // 2) DB-backed HTML demo (original behaviour).
  if (template && html) {
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
        <DemoBar slug={params.slug} name={template.name} category={template.category} priceUah={template.price_uah} />
        <iframe
          srcDoc={fullHtml}
          style={{ width: '100%', height: '100%', border: 'none', marginTop: 48 }}
          title={template.name + ' demo'}
        />
      </div>
    );
  }

  // 3) Fallback: render the React component with its built-in demo data (works without DB).
  const TemplateComponent = TEMPLATE_MAP[params.slug];
  if (TemplateComponent) {
    const locale = cookies().get('ml_locale')?.value;
    return (
      <div>
        <DemoBar
          slug={params.slug}
          name={template?.name || TEMPLATE_NAMES[params.slug] || params.slug}
          category={template?.category}
          priceUah={template?.price_uah}
        />
        <div style={{ marginTop: 48 }}>
          <TemplateComponent data={locale ? { locale } : undefined} />
        </div>
      </div>
    );
  }

  return <div style={{ padding: 48, textAlign: 'center', fontFamily: 'system-ui' }}>Template not found</div>;
}
