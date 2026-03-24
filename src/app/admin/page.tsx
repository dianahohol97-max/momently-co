'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTemplates = useCallback(async () => {
    const sb = createClient();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { setLoading(false); return; }
    const res = await fetch('/api/admin', { headers: { Authorization: 'Bearer ' + session.access_token } });
    if (!res.ok) { setLoading(false); return; }
    const d = await res.json();
    setTemplates(d.templates || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const saveTemplate = async (html: string, css: string) => {
    if (!selected) return;
    setSaving(true);
    const sb = createClient();
    const { data: { session } } = await sb.auth.getSession();
    await fetch('/api/admin/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session?.access_token },
      body: JSON.stringify({
        id: selected.id,
        config_json: { ...selected.config_json, editorHtml: html, editorCss: css },
      }),
    });
    setSaving(false);
    fetchTemplates();
  };

  if (loading) return <Loader />;
  if (selected) return <GrapesEditor template={selected} onBack={() => setSelected(null)} onSave={saveTemplate} saving={saving} />;
  return <TemplateList templates={templates} onSelect={setSelected} onRefresh={fetchTemplates} />;
}

function GrapesEditor({ template, onBack, onSave, saving }: any) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.21.10/css/grapes.min.css';
    document.head.appendChild(link1);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/grapesjs/0.21.10/grapes.min.js';
    script.onload = () => {
      const grapesjs = (window as any).grapesjs;
      if (!grapesjs) return;

      const colors = template.config_json?.colors || template.config_json?.defaultColors || {
        primary: '#b8956a', background: '#FDF8F4', surface: '#FFFFFF',
        text: '#3D3027', textMuted: '#8A7B6B', border: '#E8E0D4',
      };
      const fonts = template.config_json?.typography || template.config_json?.defaultTypography || {
        headingFont: 'Playfair Display', bodyFont: 'DM Sans', accentFont: 'Cormorant Garamond',
      };

      const savedHtml = template.config_json?.editorHtml;
      const savedCss = template.config_json?.editorCss;

      const defaultContent = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=${fonts.headingFont?.replace(/ /g, '+')}&family=${fonts.bodyFont?.replace(/ /g, '+')}&family=${fonts.accentFont?.replace(/ /g, '+')}&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${colors.background}; color: ${colors.text}; font-family: '${fonts.bodyFont}', sans-serif; }
  .section { padding: 80px 24px; text-align: center; }
  .section-alt { background: ${colors.surface}; }
  .heading { font-family: '${fonts.headingFont}', serif; font-weight: 400; }
  .accent { font-family: '${fonts.accentFont}', serif; color: ${colors.primary}; }
  .muted { color: ${colors.textMuted}; }
  .divider { width: 64px; height: 1px; background: ${colors.primary}; margin: 24px auto; }
  .btn { display: inline-block; padding: 14px 40px; border-radius: 8px; background: ${colors.primary}; color: #fff; font-size: 14px; text-decoration: none; border: none; cursor: pointer; }
  .btn-outline { background: transparent; border: 1px solid ${colors.border}; color: ${colors.textMuted}; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 500px; margin: 0 auto; }
  .card { padding: 32px 16px; border-radius: 12px; border: 1px solid ${colors.border}; background: ${colors.background}; text-align: center; }
  .timeline-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; max-width: 320px; margin-left: auto; margin-right: auto; }
  .timeline-time { font-family: '${fonts.accentFont}', serif; color: ${colors.primary}; font-size: 16px; width: 60px; text-align: right; }
  .timeline-dot { width: 8px; height: 8px; border-radius: 50%; background: ${colors.primary}; flex-shrink: 0; }
  .timeline-label { font-size: 14px; }
  .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 500px; margin: 0 auto; }
  .gallery-item { aspect-ratio: 1; background: ${colors.border}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: ${colors.textMuted}; }
  .rsvp-form { max-width: 400px; margin: 0 auto; }
  .rsvp-input { width: 100%; padding: 14px 18px; border: 1px solid ${colors.border}; border-radius: 8px; background: transparent; color: ${colors.text}; font-size: 14px; margin-bottom: 12px; font-family: '${fonts.bodyFont}', sans-serif; }
  .rsvp-buttons { display: flex; gap: 12px; }
  .rsvp-buttons .btn { flex: 1; text-align: center; }
</style>

<section class="section" style="min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
  <div class="divider"></div>
  <p class="muted" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 16px;">We invite you to our wedding</p>
  <h1 class="heading" style="font-size: 56px; line-height: 1.2;">Anna</h1>
  <p class="accent" style="font-size: 36px; font-style: italic; margin: 8px 0;">&amp;</p>
  <h1 class="heading" style="font-size: 56px; line-height: 1.2;">Oleksandr</h1>
  <div class="divider"></div>
  <p class="accent" style="font-size: 16px;">15 August 2026 &middot; 16:00</p>
</section>

<section class="section">
  <p class="muted" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 32px;">Until the wedding</p>
  <div style="display: flex; justify-content: center; gap: 40px;">
    <div><div class="heading" style="font-size: 42px;">142</div><div class="muted" style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em;">days</div></div>
    <div><div class="heading" style="font-size: 42px;">08</div><div class="muted" style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em;">hours</div></div>
    <div><div class="heading" style="font-size: 42px;">34</div><div class="muted" style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em;">min</div></div>
    <div><div class="heading" style="font-size: 42px;">12</div><div class="muted" style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em;">sec</div></div>
  </div>
</section>

<section class="section section-alt">
  <p class="accent" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 8px;">Venue</p>
  <h2 class="heading" style="font-size: 32px; margin-bottom: 12px;">Grand Palace</h2>
  <p class="muted" style="font-size: 14px;">123 Wedding St, Kyiv, Ukraine</p>
</section>

<section class="section">
  <p class="accent" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 8px;">Program</p>
  <h2 class="heading" style="font-size: 32px; margin-bottom: 32px;">Schedule</h2>
  <div class="timeline-row"><span class="timeline-time">16:00</span><span class="timeline-dot"></span><span class="timeline-label">Ceremony</span></div>
  <div class="timeline-row"><span class="timeline-time">17:30</span><span class="timeline-dot"></span><span class="timeline-label">Reception</span></div>
  <div class="timeline-row"><span class="timeline-time">19:00</span><span class="timeline-dot"></span><span class="timeline-label">Dinner</span></div>
  <div class="timeline-row"><span class="timeline-time">21:00</span><span class="timeline-dot"></span><span class="timeline-label">Party</span></div>
</section>

<section class="section section-alt">
  <p class="accent" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 8px;">Gallery</p>
  <div class="gallery-grid">
    <div class="gallery-item">+</div>
    <div class="gallery-item">+</div>
    <div class="gallery-item">+</div>
    <div class="gallery-item">+</div>
    <div class="gallery-item">+</div>
    <div class="gallery-item">+</div>
  </div>
</section>

<section class="section">
  <h2 class="heading" style="font-size: 32px; margin-bottom: 32px;">Details</h2>
  <div style="display: flex; justify-content: center; gap: 48px;">
    <div><p class="accent" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 6px;">Dress Code</p><p class="muted" style="font-size: 14px;">Black Tie Optional</p></div>
    <div><p class="accent" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 6px;">Gifts</p><p class="muted" style="font-size: 14px;">Your presence is our gift</p></div>
  </div>
</section>

<section class="section section-alt">
  <h2 class="heading" style="font-size: 32px; margin-bottom: 32px;">RSVP</h2>
  <div class="rsvp-form">
    <input class="rsvp-input" placeholder="Your name" />
    <input class="rsvp-input" placeholder="Email" />
    <div class="rsvp-buttons">
      <button class="btn">Attending</button>
      <button class="btn btn-outline">Decline</button>
    </div>
  </div>
</section>

<section class="section">
  <div class="grid-3">
    <div class="card"><div style="font-size: 28px; margin-bottom: 8px;">📸</div><div style="font-size: 12px;">Camera</div></div>
    <div class="card"><div style="font-size: 28px; margin-bottom: 8px;">📖</div><div style="font-size: 12px;">Guestbook</div></div>
    <div class="card"><div style="font-size: 28px; margin-bottom: 8px;">🎭</div><div style="font-size: 12px;">Photo Booth</div></div>
  </div>
</section>

<section class="section">
  <p class="accent" style="font-size: 22px; font-style: italic;">"Love is patient, love is kind..."</p>
  <p class="muted" style="font-size: 12px; margin-top: 12px;">&mdash; 1 Corinthians 13:4</p>
</section>

<section class="section section-alt">
  <p class="accent" style="font-size: 24px;">See you there!</p>
  <p class="muted" style="font-size: 12px; margin-top: 8px;">Anna &amp; Oleksandr</p>
</section>`;

      const editor = grapesjs.init({
        container: containerRef.current,
        height: '100%',
        width: 'auto',
        storageManager: false,
        panels: { defaults: [] },
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Mobile', width: '375px', widthMedia: '480px' },
          ],
        },
        canvas: {
          styles: [
            'https://fonts.googleapis.com/css2?family=' + (fonts.headingFont || 'Playfair+Display').replace(/ /g, '+') +
            '&family=' + (fonts.bodyFont || 'DM+Sans').replace(/ /g, '+') +
            '&family=' + (fonts.accentFont || 'Cormorant+Garamond').replace(/ /g, '+') + '&display=swap',
          ],
        },
        blockManager: {
          appendTo: '#blocks-panel',
          blocks: [
            { id: 'section', label: '📦 Section', content: '<section class="section"><h2 class="heading" style="font-size: 32px;">New Section</h2><p class="muted" style="margin-top: 12px;">Content here...</p></section>', category: 'Layout' },
            { id: 'section-alt', label: '📦 Section (Alt)', content: '<section class="section section-alt"><h2 class="heading" style="font-size: 32px;">New Section</h2><p class="muted" style="margin-top: 12px;">Content here...</p></section>', category: 'Layout' },
            { id: 'heading', label: '🔤 Heading', content: '<h2 class="heading" style="font-size: 32px;">Heading Text</h2>', category: 'Text' },
            { id: 'paragraph', label: '📝 Paragraph', content: '<p style="font-size: 15px; line-height: 1.8;">Your text here...</p>', category: 'Text' },
            { id: 'accent-text', label: '✨ Accent Text', content: '<p class="accent" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">Label text</p>', category: 'Text' },
            { id: 'quote', label: '💬 Quote', content: '<blockquote class="accent" style="font-size: 22px; font-style: italic; padding: 40px 24px; text-align: center;">"Your quote here..."</blockquote>', category: 'Text' },
            { id: 'divider', label: '➖ Divider', content: '<div class="divider"></div>', category: 'Elements' },
            { id: 'button', label: '🔘 Button', content: '<a class="btn">Click Me</a>', category: 'Elements' },
            { id: 'button-outline', label: '⭕ Button Outline', content: '<a class="btn btn-outline">Click Me</a>', category: 'Elements' },
            { id: 'image', label: '🖼️ Image', content: { type: 'image' }, category: 'Media' },
            { id: 'timeline', label: '⏰ Timeline Row', content: '<div class="timeline-row"><span class="timeline-time">00:00</span><span class="timeline-dot"></span><span class="timeline-label">Event</span></div>', category: 'Wedding' },
            { id: 'card', label: '🃏 Card', content: '<div class="card"><div style="font-size: 28px; margin-bottom: 8px;">✨</div><div style="font-size: 12px;">Label</div></div>', category: 'Wedding' },
            { id: 'grid-3', label: '🔲 3-Col Grid', content: '<div class="grid-3"><div class="card">1</div><div class="card">2</div><div class="card">3</div></div>', category: 'Layout' },
            { id: 'gallery', label: '📸 Gallery Grid', content: '<div class="gallery-grid"><div class="gallery-item">+</div><div class="gallery-item">+</div><div class="gallery-item">+</div></div>', category: 'Wedding' },
            { id: 'rsvp', label: '✉️ RSVP Form', content: '<div class="rsvp-form"><input class="rsvp-input" placeholder="Your name" /><div class="rsvp-buttons"><button class="btn">Accept</button><button class="btn btn-outline">Decline</button></div></div>', category: 'Wedding' },
          ],
        },
        styleManager: {
          appendTo: '#styles-panel',
          sectors: [
            { name: 'Dimension', open: true, properties: ['width', 'min-height', 'padding', 'margin'] },
            { name: 'Typography', open: true, properties: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-transform', 'font-style'] },
            { name: 'Background', open: false, properties: ['background-color', 'background-image', 'background-size', 'background-position'] },
            { name: 'Border', open: false, properties: ['border-radius', 'border'] },
            { name: 'Flex', open: false, properties: ['display', 'flex-direction', 'justify-content', 'align-items', 'gap'] },
          ],
        },
        layerManager: { appendTo: '#layers-panel' },
      });

      if (savedHtml && savedCss) {
        editor.setComponents(savedHtml);
        editor.setStyle(savedCss);
      } else {
        editor.setComponents(defaultContent);
      }

      editorRef.current = editor;
      setReady(true);
    };
    document.head.appendChild(script);

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [template]);

  const handleSave = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    onSave(html, css);
  };

  const switchDevice = (device: string) => {
    if (editorRef.current) editorRef.current.setDevice(device);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1a1a1a', color: '#e0e0e0', fontFamily: 'system-ui' }}>
      {/* Left Panel */}
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', borderRight: '1px solid #333', backgroundColor: '#222' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #444', backgroundColor: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: 12 }}>&larr; Back</button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{template.name}</span>
          <button onClick={handleSave} disabled={saving} style={{ padding: '4px 14px', borderRadius: 6, border: 'none', backgroundColor: '#b8956a', color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>{saving ? '...' : 'Save'}</button>
        </div>
        <LeftTabs />
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '6px 16px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#222' }}>
          <button onClick={() => switchDevice('Desktop')} style={devBtn}>Desktop</button>
          <button onClick={() => switchDevice('Mobile')} style={devBtn}>Mobile</button>
        </div>
        <div ref={containerRef} style={{ flex: 1 }} />
      </div>

      {/* Right Panel */}
      <div style={{ width: 260, borderLeft: '1px solid #333', backgroundColor: '#222', overflow: 'auto' }}>
        <div id="styles-panel" />
      </div>
    </div>
  );
}

function LeftTabs() {
  const [tab, setTab] = useState<'blocks' | 'layers'>('blocks');
  return (
    <>
      <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
        <button onClick={() => setTab('blocks')} style={{ flex: 1, padding: '8px 0', border: 'none', backgroundColor: tab === 'blocks' ? '#333' : 'transparent', color: tab === 'blocks' ? '#fff' : '#888', fontSize: 12, cursor: 'pointer' }}>Blocks</button>
        <button onClick={() => setTab('layers')} style={{ flex: 1, padding: '8px 0', border: 'none', backgroundColor: tab === 'layers' ? '#333' : 'transparent', color: tab === 'layers' ? '#fff' : '#888', fontSize: 12, cursor: 'pointer' }}>Layers</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', display: tab === 'blocks' ? 'block' : 'none' }}>
        <div id="blocks-panel" />
      </div>
      <div style={{ flex: 1, overflow: 'auto', display: tab === 'layers' ? 'block' : 'none' }}>
        <div id="layers-panel" />
      </div>
    </>
  );
}

function TemplateList({ templates, onSelect, onRefresh }: any) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const create = async () => {
    if (!name) return;
    setCreating(true);
    const sb = createClient();
    const { data: { session } } = await sb.auth.getSession();
    const res = await fetch('/api/admin/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session?.access_token },
      body: JSON.stringify({ name, category: 'modern', price_uah: 599, price_usd: 15 }),
    });
    const tpl = await res.json();
    setCreating(false);
    setName('');
    onRefresh();
    if (tpl.id) onSelect(tpl);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', fontFamily: 'system-ui', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Template Builder</h1>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New template name..." style={inp} onKeyDown={e => e.key === 'Enter' && create()} />
        <button onClick={create} disabled={creating || !name} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: name ? '#b8956a' : '#333', color: name ? '#000' : '#666', cursor: name ? 'pointer' : 'default', fontSize: 13, fontWeight: 600 }}>{creating ? '...' : '+ New'}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {templates.map((t: any) => (
          <div key={t.id} onClick={() => onSelect(t)} style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: 140, backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {t.thumbnail_url ? <img src={t.thumbnail_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#333', fontSize: 40 }}>🎨</span>}
            </div>
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{t.name}</h3>
              <p style={{ fontSize: 12, color: '#666', margin: 0 }}>{t.category} · {t.price_uah} UAH</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Loader() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui', color: '#666', backgroundColor: '#0a0a0a' }}>Loading...</div>;
}

const devBtn: any = { border: '1px solid #444', borderRadius: 6, padding: '4px 16px', color: '#aaa', cursor: 'pointer', fontSize: 12, backgroundColor: 'transparent' };
const inp: any = { backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, flex: 1 };
