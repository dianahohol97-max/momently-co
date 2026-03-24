'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const ALL_SECTIONS = [
  { id: 'hero', name: 'Hero / Names', icon: '\u2728', desc: 'Names, date, invitation text' },
  { id: 'countdown', name: 'Countdown', icon: '\u23f3', desc: 'Timer to wedding day' },
  { id: 'story', name: 'Our Story', icon: '\u2764\ufe0f', desc: 'How you met, your journey' },
  { id: 'venue', name: 'Venue', icon: '\ud83d\udccd', desc: 'Location, address, map' },
  { id: 'schedule', name: 'Schedule', icon: '\ud83d\udcc5', desc: 'Day timeline' },
  { id: 'gallery', name: 'Photo Gallery', icon: '\ud83d\uddbc\ufe0f', desc: 'Couple photos' },
  { id: 'details', name: 'Details', icon: '\ud83d\udc8d', desc: 'Dress code, gifts, notes' },
  { id: 'rsvp', name: 'RSVP Form', icon: '\u2709\ufe0f', desc: 'Guest response form' },
  { id: 'guestModules', name: 'Guest Modules', icon: '\ud83d\udcf8', desc: 'Camera, Guestbook, Booth' },
  { id: 'quote', name: 'Quote / Verse', icon: '\ud83d\udcdc', desc: 'Love quote or verse' },
  { id: 'accommodation', name: 'Accommodation', icon: '\ud83c\udfe8', desc: 'Hotel recommendations' },
  { id: 'faq', name: 'FAQ', icon: '\u2753', desc: 'Common questions' },
  { id: 'footer', name: 'Footer', icon: '\ud83d\udc9e', desc: 'Closing message' },
];

const FONT_OPTIONS = [
  'Playfair Display', 'Cormorant Garamond', 'DM Sans', 'Lora', 'Montserrat',
  'Raleway', 'Great Vibes', 'Pinyon Script', 'Libre Baskerville', 'Josefin Sans',
  'Poppins', 'Nunito', 'Crimson Text', 'EB Garamond', 'Source Serif Pro',
];

const CATEGORIES = ['classic', 'modern', 'minimal', 'romantic', 'bold', 'elegant', 'rustic', 'boho'];

interface Section { id: string; name: string; order: number; enabled: boolean; }

export default function AdminPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [tab, setTab] = useState<'sections' | 'style' | 'info'>('sections');
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'mobile'>('desktop');

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

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    const sb = createClient();
    const { data: { session } } = await sb.auth.getSession();
    await fetch('/api/admin/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session?.access_token },
      body: JSON.stringify({ id: selected.id, config_json: selected.config_json, name: selected.name, description: selected.description, category: selected.category, price_uah: selected.price_uah, thumbnail_url: selected.thumbnail_url, preview_url: selected.preview_url, hero_image_url: selected.hero_image_url, section_configs: selected.section_configs }),
    });
    setSaving(false);
    fetchTemplates();
  };

  const uploadImage = async (file: File, category: string) => {
    const sb = createClient();
    const { data: { session } } = await sb.auth.getSession();
    const fd = new FormData();
    fd.append('file', file);
    fd.append('template_id', selected?.id || '');
    fd.append('category', category);
    const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + session?.access_token }, body: fd });
    const result = await res.json();
    return result.url;
  };

  if (loading) return <div style={center}>Loading...</div>;
  if (!selected) return <TemplateList templates={templates} onSelect={setSelected} onRefresh={fetchTemplates} />;

  const sections: Section[] = selected.config_json?.sections || [];
  const colors = selected.config_json?.colors || selected.config_json?.defaultColors || {};
  const typography = selected.config_json?.typography || selected.config_json?.defaultTypography || {};
  const sectionConfigs = selected.section_configs || {};

  const updateSections = (newSections: Section[]) => {
    setSelected({ ...selected, config_json: { ...selected.config_json, sections: newSections } });
  };

  const updateColor = (key: string, val: string) => {
    const cfg = { ...selected.config_json };
    cfg.colors = { ...(cfg.colors || cfg.defaultColors || {}), [key]: val };
    if (cfg.defaultColors) cfg.defaultColors = cfg.colors;
    setSelected({ ...selected, config_json: cfg });
  };

  const updateFont = (key: string, val: string) => {
    const cfg = { ...selected.config_json };
    cfg.typography = { ...(cfg.typography || cfg.defaultTypography || {}), [key]: val };
    if (cfg.defaultTypography) cfg.defaultTypography = cfg.typography;
    setSelected({ ...selected, config_json: cfg });
  };

  const updateSectionConfig = (sectionId: string, key: string, val: any) => {
    const sc = { ...sectionConfigs, [sectionId]: { ...(sectionConfigs[sectionId] || {}), [key]: val } };
    setSelected({ ...selected, section_configs: sc });
  };

  const moveSection = (idx: number, dir: number) => {
    const s = [...sections];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= s.length) return;
    [s[idx], s[newIdx]] = [s[newIdx], s[idx]];
    s.forEach((sec, i) => { sec.order = i + 1; });
    updateSections(s);
  };

  const toggleSection = (idx: number) => {
    const s = [...sections];
    s[idx] = { ...s[idx], enabled: !s[idx].enabled };
    updateSections(s);
  };

  const addSection = (sectionDef: typeof ALL_SECTIONS[0]) => {
    if (sections.find(s => s.id === sectionDef.id)) return;
    const s = [...sections, { id: sectionDef.id, name: sectionDef.name, order: sections.length + 1, enabled: true }];
    updateSections(s);
  };

  const removeSection = (idx: number) => {
    const s = sections.filter((_, i) => i !== idx);
    s.forEach((sec, i) => { sec.order = i + 1; });
    updateSections(s);
  };

  const unusedSections = ALL_SECTIONS.filter(as => !sections.find(s => s.id === as.id));

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden' }}>
      {/* LEFT SIDEBAR - Sections & Settings */}
      <div style={{ width: 320, borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setSelected(null)} style={backBtn}>&larr; Back</button>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{selected.name}</span>
          <button onClick={save} disabled={saving} style={saveBtn}>{saving ? '...' : 'Save'}</button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a' }}>
          {(['sections', 'style', 'info'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px 0', border: 'none', backgroundColor: tab === t ? '#1a1a1a' : 'transparent', color: tab === t ? '#fff' : '#666', fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {tab === 'sections' && (
            <div>
              <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Active Sections</div>
              {sections.map((sec, idx) => {
                const def = ALL_SECTIONS.find(a => a.id === sec.id);
                return (
                  <div key={sec.id} onClick={() => setActiveSection(sec.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', backgroundColor: activeSection === sec.id ? '#1f1a14' : '#111', border: activeSection === sec.id ? '1px solid #b8956a44' : '1px solid #1a1a1a', opacity: sec.enabled ? 1 : 0.4 }}>
                    <span style={{ fontSize: 16 }}>{def?.icon || '\u25a0'}</span>
                    <span style={{ flex: 1, fontSize: 13, color: '#ddd' }}>{sec.name}</span>
                    <button onClick={e => { e.stopPropagation(); moveSection(idx, -1); }} style={iconBtn} title="Move up">{'\u2191'}</button>
                    <button onClick={e => { e.stopPropagation(); moveSection(idx, 1); }} style={iconBtn} title="Move down">{'\u2193'}</button>
                    <button onClick={e => { e.stopPropagation(); toggleSection(idx); }} style={{ ...iconBtn, color: sec.enabled ? '#4a4' : '#a44' }} title="Toggle">{sec.enabled ? '\u25c9' : '\u25cb'}</button>
                    <button onClick={e => { e.stopPropagation(); removeSection(idx); }} style={{ ...iconBtn, color: '#a44' }} title="Remove">{'\u2715'}</button>
                  </div>
                );
              })}

              {unusedSections.length > 0 && (
                <>
                  <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 12px' }}>Add Section</div>
                  {unusedSections.map(sec => (
                    <button key={sec.id} onClick={() => addSection(sec)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', backgroundColor: 'transparent', border: '1px dashed #333', color: '#888', fontSize: 13, textAlign: 'left' }}>
                      <span>{sec.icon}</span>
                      <div><div>{sec.name}</div><div style={{ fontSize: 10, color: '#555' }}>{sec.desc}</div></div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}

          {tab === 'style' && (
            <div>
              <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Colors</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                {Object.entries(colors).filter(([_k, v]: [string, unknown]) => typeof v === 'string' && (v as string).startsWith('#')).map(([key, val]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="color" value={val as string} onChange={e => updateColor(key, e.target.value)} style={{ width: 28, height: 28, border: '1px solid #333', borderRadius: 4, padding: 0, cursor: 'pointer' }} />
                    <div><div style={{ fontSize: 11, color: '#aaa' }}>{key}</div><div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>{val as string}</div></div>
                  </label>
                ))}
              </div>

              <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Typography</div>
              {['headingFont', 'bodyFont', 'accentFont'].map(key => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>{key.replace('Font', ' Font')}</label>
                  <select value={typography[key] || ''} onChange={e => updateFont(key, e.target.value)} style={selectStyle}>
                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}

          {tab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={labelStyle}>Name</label><input value={selected.name} onChange={e => setSelected({ ...selected, name: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Description</label><textarea value={selected.description || ''} onChange={e => setSelected({ ...selected, description: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} /></div>
              <div><label style={labelStyle}>Category</label>
                <select value={selected.category} onChange={e => setSelected({ ...selected, category: e.target.value })} style={selectStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Price UAH</label><input type="number" value={selected.price_uah} onChange={e => setSelected({ ...selected, price_uah: +e.target.value })} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Thumbnail</label>
                {selected.thumbnail_url && <img src={selected.thumbnail_url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                <input type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const url = await uploadImage(f, 'thumbnail'); setSelected({ ...selected, thumbnail_url: url }); } }} style={{ fontSize: 12, color: '#888' }} />
              </div>
            </div>
          )}
        </div>

        {/* Section-specific settings */}
        {activeSection && tab === 'sections' && (
          <div style={{ borderTop: '1px solid #1a1a1a', padding: 16, maxHeight: 300, overflow: 'auto' }}>
            <div style={{ fontSize: 11, color: '#b8956a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              {ALL_SECTIONS.find(s => s.id === activeSection)?.icon} {activeSection} Settings
            </div>
            <SectionSettings sectionId={activeSection} config={sectionConfigs[activeSection] || {}} onChange={(k: string, v: any) => updateSectionConfig(activeSection, k, v)} onUpload={uploadImage} templateId={selected.id} />
          </div>
        )}
      </div>

      {/* CENTER - Live Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button onClick={() => setPreviewWidth('desktop')} style={{ ...toggleBtn, backgroundColor: previewWidth === 'desktop' ? '#222' : 'transparent' }}>Desktop</button>
          <button onClick={() => setPreviewWidth('mobile')} style={{ ...toggleBtn, backgroundColor: previewWidth === 'mobile' ? '#222' : 'transparent' }}>Mobile</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: 24, backgroundColor: '#050505' }}>
          <div style={{ width: previewWidth === 'mobile' ? 375 : '100%', maxWidth: 800, border: '1px solid #1a1a1a', borderRadius: 12, overflow: 'hidden', backgroundColor: colors.background || '#FDF8F4' }}>
            <LivePreview sections={sections.filter(s => s.enabled)} colors={colors} typography={typography} sectionConfigs={sectionConfigs} activeSection={activeSection} onSelectSection={setActiveSection} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSettings({ sectionId, config, onChange, onUpload, templateId }: any) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: any, key: string) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const url = await onUpload(f, sectionId);
    onChange(key, url);
    setUploading(false);
  };

  const common = (
    <>
      <div><label style={labelStyle}>Background Color</label><input type="color" value={config.bgColor || '#ffffff'} onChange={e => onChange('bgColor', e.target.value)} style={{ width: 40, height: 28, border: '1px solid #333', borderRadius: 4 }} /></div>
      <div><label style={labelStyle}>Padding (px)</label><input type="number" value={config.padding || 80} onChange={e => onChange('padding', +e.target.value)} style={inputStyle} /></div>
    </>
  );

  if (sectionId === 'hero') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {common}
      <div><label style={labelStyle}>Background Image</label>
        {config.bgImage && <img src={config.bgImage} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 4 }} />}
        <input type="file" accept="image/*" onChange={e => handleUpload(e, 'bgImage')} style={{ fontSize: 11, color: '#888' }} />
        {uploading && <span style={{ fontSize: 10, color: '#b8956a' }}>Uploading...</span>}
      </div>
      <div><label style={labelStyle}>Overlay</label><input value={config.overlay || ''} onChange={e => onChange('overlay', e.target.value)} placeholder="rgba(0,0,0,0.3)" style={inputStyle} /></div>
      <div><label style={labelStyle}>Height</label>
        <select value={config.height || '100vh'} onChange={e => onChange('height', e.target.value)} style={selectStyle}>
          <option value="100vh">Full Screen</option><option value="80vh">80%</option><option value="60vh">60%</option><option value="auto">Auto</option>
        </select>
      </div>
      <div><label style={labelStyle}>Invitation Text</label><input value={config.invitationText || ''} onChange={e => onChange('invitationText', e.target.value)} placeholder="Default text" style={inputStyle} /></div>
    </div>
  );

  if (sectionId === 'quote') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {common}
      <div><label style={labelStyle}>Quote Text</label><textarea value={config.text || ''} onChange={e => onChange('text', e.target.value)} placeholder="Love quote..." style={{ ...inputStyle, minHeight: 60 }} /></div>
      <div><label style={labelStyle}>Author</label><input value={config.author || ''} onChange={e => onChange('author', e.target.value)} style={inputStyle} /></div>
    </div>
  );

  if (sectionId === 'gallery') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {common}
      <div><label style={labelStyle}>Layout</label>
        <select value={config.layout || 'grid'} onChange={e => onChange('layout', e.target.value)} style={selectStyle}>
          <option value="grid">Grid</option><option value="masonry">Masonry</option><option value="carousel">Carousel</option>
        </select>
      </div>
      <div><label style={labelStyle}>Columns</label><input type="number" value={config.columns || 3} onChange={e => onChange('columns', +e.target.value)} min={1} max={6} style={inputStyle} /></div>
    </div>
  );

  if (sectionId === 'story') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {common}
      <div><label style={labelStyle}>Story Text</label><textarea value={config.text || ''} onChange={e => onChange('text', e.target.value)} placeholder="How we met..." style={{ ...inputStyle, minHeight: 80 }} /></div>
      <div><label style={labelStyle}>Story Image</label>
        {config.image && <img src={config.image} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 4 }} />}
        <input type="file" accept="image/*" onChange={e => handleUpload(e, 'image')} style={{ fontSize: 11, color: '#888' }} />
      </div>
    </div>
  );

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{common}</div>;
}

function LivePreview({ sections, colors, typography, sectionConfigs, activeSection, onSelectSection }: any) {
  const c = colors;
  const t = typography;
  const sc = sectionConfigs || {};

  const sectionStyle = (id: string, extra?: any) => ({
    padding: (sc[id]?.padding || 80) + 'px 24px',
    backgroundColor: sc[id]?.bgColor || (extra?.bg ? c.surface : c.background),
    cursor: 'pointer',
    outline: activeSection === id ? '2px solid #b8956a' : '2px solid transparent',
    outlineOffset: -2,
    transition: 'outline 0.15s',
    position: 'relative' as any,
    ...extra,
  });

  const renderSection = (sec: Section) => {
    const cfg = sc[sec.id] || {};
    switch (sec.id) {
      case 'hero': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={{ ...sectionStyle(sec.id), minHeight: cfg.height || '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundImage: cfg.bgImage ? 'url(' + cfg.bgImage + ')' : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {cfg.bgImage && cfg.overlay && <div style={{ position: 'absolute', inset: 0, backgroundColor: cfg.overlay }} />}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 48, height: 1, backgroundColor: c.primary, margin: '0 auto 24px' }} />
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: cfg.bgImage ? '#fff9' : c.textMuted, marginBottom: 12 }}>{cfg.invitationText || 'Invite text'}</p>
            <h1 style={{ fontSize: 40, fontFamily: t.headingFont, color: cfg.bgImage ? '#fff' : c.text, fontWeight: 400, lineHeight: 1.2 }}>Partner 1<br /><span style={{ fontFamily: t.accentFont, color: cfg.bgImage ? '#fffc' : c.primary, fontStyle: 'italic', fontSize: 32 }}>&amp;</span><br />Partner 2</h1>
            <div style={{ width: 48, height: 1, backgroundColor: c.primary, margin: '24px auto 16px' }} />
            <p style={{ fontFamily: t.accentFont, color: cfg.bgImage ? '#fff9' : c.textMuted, fontSize: 14 }}>15 August 2026 &middot; 16:00</p>
          </div>
        </section>
      );
      case 'countdown': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id)}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: c.primary, textAlign: 'center', marginBottom: 24 }}>Until the wedding</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
            {[{ v: '142', l: 'days' }, { v: '08', l: 'hours' }, { v: '34', l: 'min' }, { v: '12', l: 'sec' }].map(i => (
              <div key={i.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontFamily: t.headingFont, color: c.text }}>{i.v}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: c.textMuted }}>{i.l}</div>
              </div>
            ))}
          </div>
        </section>
      );
      case 'venue': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id, { bg: true })}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: c.primary, marginBottom: 8 }}>Venue</p>
            <h2 style={{ fontSize: 28, fontFamily: t.headingFont, color: c.text, marginBottom: 8 }}>Grand Palace</h2>
            <p style={{ fontSize: 13, color: c.textMuted }}>123 Wedding St, Kyiv, Ukraine</p>
          </div>
        </section>
      );
      case 'schedule': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id)}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: c.primary, marginBottom: 8 }}>Program</p>
            <h2 style={{ fontSize: 28, fontFamily: t.headingFont, color: c.text }}>Schedule</h2>
          </div>
          <div style={{ maxWidth: 300, margin: '0 auto' }}>
            {[{ t: '16:00', l: 'Ceremony' }, { t: '17:30', l: 'Reception' }, { t: '19:00', l: 'Dinner' }].map(i => (
              <div key={i.l} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <span style={{ fontFamily: t.accentFont, color: c.primary, fontSize: 15, width: 48, textAlign: 'right' }}>{i.t}</span>
                <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.primary, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: c.text }}>{i.l}</span>
              </div>
            ))}
          </div>
        </section>
      );
      case 'story': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id, { bg: true })}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: c.primary, marginBottom: 8 }}>Our Story</p>
            <h2 style={{ fontSize: 28, fontFamily: t.headingFont, color: c.text, marginBottom: 16 }}>How We Met</h2>
            <p style={{ fontSize: 13, color: c.textMuted, maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>{cfg.text || 'Your love story goes here...'}</p>
            {cfg.image && <img src={cfg.image} alt="" style={{ maxWidth: 400, width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, margin: '24px auto 0', display: 'block' }} />}
          </div>
        </section>
      );
      case 'gallery': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id)}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: c.primary }}>Gallery</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (cfg.columns || 3) + ', 1fr)', gap: 8, maxWidth: 500, margin: '0 auto' }}>
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ backgroundColor: c.border, borderRadius: 8, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.textMuted, fontSize: 20 }}>{'\ud83d\uddbc\ufe0f'}</div>)}
          </div>
        </section>
      );
      case 'details': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id, { bg: true })}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontFamily: t.headingFont, color: c.text, marginBottom: 24 }}>Details</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
              {['Dress Code', 'Gifts'].map(d => (
                <div key={d}><p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: c.primary, marginBottom: 4 }}>{d}</p><p style={{ fontSize: 13, color: c.textMuted }}>Details here</p></div>
              ))}
            </div>
          </div>
        </section>
      );
      case 'rsvp': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id)}>
          <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontFamily: t.headingFont, color: c.text, marginBottom: 24 }}>RSVP</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Your name" style={{ padding: '12px 16px', border: '1px solid ' + c.border, borderRadius: 8, backgroundColor: 'transparent', color: c.text, fontSize: 13 }} readOnly />
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid ' + c.primary, backgroundColor: c.primary, color: '#fff', fontSize: 13 }}>Accept</button>
                <button style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid ' + c.border, backgroundColor: 'transparent', color: c.textMuted, fontSize: 13 }}>Decline</button>
              </div>
            </div>
          </div>
        </section>
      );
      case 'guestModules': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id, { bg: true })}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 400, margin: '0 auto' }}>
            {[{ i: '\ud83d\udcf8', l: 'Camera' }, { i: '\ud83d\udcd6', l: 'Guestbook' }, { i: '\ud83c\udfad', l: 'Booth' }].map(m => (
              <div key={m.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 24, borderRadius: 12, border: '1px solid ' + c.border, backgroundColor: c.background }}>
                <span style={{ fontSize: 24 }}>{m.i}</span>
                <span style={{ fontSize: 11, color: c.text }}>{m.l}</span>
              </div>
            ))}
          </div>
        </section>
      );
      case 'quote': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id)}>
          <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
            <p style={{ fontSize: 20, fontFamily: t.accentFont, fontStyle: 'italic', color: c.text, lineHeight: 1.8 }}>&ldquo;{cfg.text || 'Love is patient, love is kind...'}&rdquo;</p>
            {cfg.author && <p style={{ fontSize: 12, color: c.textMuted, marginTop: 12 }}>&mdash; {cfg.author}</p>}
          </div>
        </section>
      );
      case 'accommodation': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id, { bg: true })}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: c.primary, marginBottom: 8 }}>Accommodation</p>
            <h2 style={{ fontSize: 28, fontFamily: t.headingFont, color: c.text, marginBottom: 16 }}>Where to Stay</h2>
            <p style={{ fontSize: 13, color: c.textMuted }}>Hotel recommendations here</p>
          </div>
        </section>
      );
      case 'faq': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id)}>
          <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
            <h2 style={{ fontSize: 28, fontFamily: t.headingFont, color: c.text, marginBottom: 24 }}>FAQ</h2>
            <div style={{ textAlign: 'left' }}>
              {['Can I bring a plus one?', 'Is there parking?'].map(q => (
                <div key={q} style={{ borderBottom: '1px solid ' + c.border, padding: '16px 0' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{q}</p>
                  <p style={{ fontSize: 12, color: c.textMuted, marginTop: 4 }}>Answer goes here...</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
      case 'footer': return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id)}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontFamily: t.accentFont, color: c.primary }}>See you there!</p>
            <p style={{ fontSize: 11, color: c.textMuted, marginTop: 8 }}>Partner 1 &amp; Partner 2</p>
          </div>
        </section>
      );
      default: return (
        <section key={sec.id} onClick={() => onSelectSection(sec.id)} style={sectionStyle(sec.id)}>
          <p style={{ textAlign: 'center', color: c.textMuted, fontSize: 13 }}>[{sec.name}]</p>
        </section>
      );
    }
  };

  return <div>{sections.map(renderSection)}</div>;
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
        <a href="/admin" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>&larr; Dashboard</a>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New template name..." style={{ ...inputStyle, flex: 1 }} onKeyDown={e => e.key === 'Enter' && create()} />
        <button onClick={create} disabled={creating || !name} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: name ? '#b8956a' : '#333', color: name ? '#000' : '#666', cursor: name ? 'pointer' : 'default', fontSize: 13, fontWeight: 600 }}>{creating ? '...' : '+ New'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {templates.map((t: any) => (
          <div key={t.id} onClick={() => onSelect(t)} style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}>
            <div style={{ height: 140, backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {t.thumbnail_url ? <img src={t.thumbnail_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#333', fontSize: 40 }}>{'\ud83c\udfa8'}</span>}
            </div>
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{t.name}</h3>
              <p style={{ fontSize: 12, color: '#666', margin: 0 }}>{t.category} &middot; {t.price_uah} UAH &middot; {(t.config_json?.sections || []).length} sections</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles
const center: any = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui', color: '#666', backgroundColor: '#0a0a0a' };
const backBtn: any = { padding: '4px 12px', borderRadius: 6, border: '1px solid #333', backgroundColor: 'transparent', color: '#888', cursor: 'pointer', fontSize: 12 };
const saveBtn: any = { padding: '4px 16px', borderRadius: 6, border: 'none', backgroundColor: '#b8956a', color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 600 };
const iconBtn: any = { border: 'none', backgroundColor: 'transparent', color: '#666', cursor: 'pointer', fontSize: 12, padding: '2px 4px', borderRadius: 4 };
const toggleBtn: any = { border: '1px solid #333', borderRadius: 6, padding: '4px 16px', color: '#aaa', cursor: 'pointer', fontSize: 12, backgroundColor: 'transparent' };
const inputStyle: any = { backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: 6, padding: '8px 10px', color: '#fff', fontSize: 13, width: '100%', boxSizing: 'border-box' };
const selectStyle: any = { ...inputStyle, appearance: 'auto' };
const labelStyle: any = { fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4, display: 'block' };
