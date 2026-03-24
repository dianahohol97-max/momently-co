'use client';
import { useState, useEffect, useCallback } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/client';

const TABS = ['Dashboard', 'Templates', 'New Template'];

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    const sb = createBrowserSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { setError('Not logged in'); setLoading(false); return; }
    const res = await fetch('/api/admin', { headers: { Authorization: 'Bearer ' + session.access_token } });
    if (!res.ok) { setError('Access denied'); setLoading(false); return; }
    setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui', color: '#666' }}>Loading...</div>;
  if (error) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui', color: '#c00' }}>{error}</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>Momently Admin</h1>
          <nav style={{ display: 'flex', gap: 4 }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{
                padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                backgroundColor: tab === i ? '#b8956a' : 'transparent', color: tab === i ? '#000' : '#888',
              }}>{t}</button>
            ))}
          </nav>
        </div>
        <span style={{ fontSize: 12, color: '#555' }}>Owner Panel</span>
      </header>
      <main style={{ padding: 32 }}>
        {tab === 0 && <DashboardTab data={data} />}
        {tab === 1 && <TemplatesTab data={data} onRefresh={fetchData} />}
        {tab === 2 && <NewTemplateTab onRefresh={() => { fetchData(); setTab(1); }} />}
      </main>
    </div>
  );
}

function StatCard({ label, value, sub }: any) {
  return (
    <div style={{ backgroundColor: '#111', borderRadius: 12, padding: 24, border: '1px solid #1a1a1a' }}>
      <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function DashboardTab({ data }: any) {
  const s = data.stats;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Users" value={s.totalUsers} />
        <StatCard label="Weddings" value={s.totalWeddings} sub={s.paidWeddings + ' paid'} />
        <StatCard label="Revenue" value={s.totalRevenue + ' UAH'} />
        <StatCard label="Templates" value={s.activeTemplates + ' active'} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Recent Weddings</h3>
      <div style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
              {['Names', 'Date', 'Status', 'Paid', 'Created'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.weddings.slice(0, 20).map((w: any) => (
              <tr key={w.id} style={{ borderBottom: '1px solid #0f0f0f' }}>
                <td style={{ padding: '12px 16px', color: '#fff' }}>{w.partner_name_1} & {w.partner_name_2}</td>
                <td style={{ padding: '12px 16px', color: '#888' }}>{w.wedding_date || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, backgroundColor: w.status === 'published' ? '#1a3a1a' : '#1a1a2a', color: w.status === 'published' ? '#4a4' : '#88f' }}>{w.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: w.is_paid ? '#4a4' : '#c44' }}>{w.is_paid ? 'Yes' : 'No'}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#555' }}>{new Date(w.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.weddings.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#555' }}>No weddings yet</div>}
      </div>
    </div>
  );
}

function TemplatesTab({ data, onRefresh }: any) {
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const sb = createBrowserSupabase();
    const { data: { session } } = await sb.auth.getSession();
    await fetch('/api/admin/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session?.access_token },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    onRefresh();
  };

  const toggleActive = async (t: any) => {
    const sb = createBrowserSupabase();
    const { data: { session } } = await sb.auth.getSession();
    await fetch('/api/admin/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session?.access_token },
      body: JSON.stringify({ id: t.id, is_active: !t.is_active }),
    });
    onRefresh();
  };

  if (editing) return <TemplateEditor template={editing} onSave={save} onCancel={() => setEditing(null)} onChange={setEditing} saving={saving} />;

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16 }}>All Templates ({data.templates.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {data.templates.map((t: any) => (
          <div key={t.id} style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', overflow: 'hidden' }}>
            <div style={{ height: 140, backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {t.thumbnail_url ? <img src={t.thumbnail_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                <span style={{ color: '#333', fontSize: 40 }}>&#x1F3A8;</span>}
              <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', borderRadius: 4, fontSize: 10, backgroundColor: t.is_active ? '#1a3a1a' : '#3a1a1a', color: t.is_active ? '#4a4' : '#a44' }}>
                {t.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{ padding: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{t.name}</h4>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{t.category} &middot; {t.price_uah} UAH &middot; {t.purchase_count || 0} sales</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setEditing({ ...t })} style={{ flex: 1, padding: '8px 0', borderRadius: 6, border: '1px solid #333', backgroundColor: 'transparent', color: '#ccc', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                <button onClick={() => toggleActive(t)} style={{ flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', backgroundColor: t.is_active ? '#3a1a1a' : '#1a3a1a', color: t.is_active ? '#a44' : '#4a4', cursor: 'pointer', fontSize: 12 }}>
                  {t.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplateEditor({ template, onSave, onCancel, onChange, saving }: any) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, category: string) => {
    setUploading(true);
    const sb = createBrowserSupabase();
    const { data: { session } } = await sb.auth.getSession();
    const fd = new FormData();
    fd.append('file', file);
    fd.append('template_id', template.id);
    fd.append('category', category);
    const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + session?.access_token }, body: fd });
    const result = await res.json();
    setUploading(false);
    return result.url;
  };

  const handleImageUpload = async (e: any, field: string, category: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, category);
    if (url) onChange({ ...template, [field]: url });
  };

  const handleGalleryUpload = async (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file, 'gallery');
      if (url) urls.push(url);
    }
    onChange({ ...template, gallery_images: [...(template.gallery_images || []), ...urls] });
  };

  const updateColor = (key: string, value: string) => {
    const config = { ...(template.config_json || {}) };
    config.colors = { ...(config.colors || {}), [key]: value };
    onChange({ ...template, config_json: config });
  };

  const updateFont = (key: string, value: string) => {
    const config = { ...(template.config_json || {}) };
    config.typography = { ...(config.typography || {}), [key]: value };
    onChange({ ...template, config_json: config });
  };

  const colors = template.config_json?.colors || {};
  const fonts = template.config_json?.typography || {};
  const I = { backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: 6, padding: '10px 12px', color: '#fff', fontSize: 13, width: '100%', boxSizing: 'border-box' as any };
  const L = { fontSize: 11, color: '#666', textTransform: 'uppercase' as any, letterSpacing: '0.05em', marginBottom: 6, display: 'block' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: 0 }}>Edit: {template.name}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #333', backgroundColor: 'transparent', color: '#888', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
          <button onClick={onSave} disabled={saving} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', backgroundColor: '#b8956a', color: '#000', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: '0 0 16px' }}>Basic Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={L}>Name</label><input value={template.name} onChange={e => onChange({ ...template, name: e.target.value })} style={I} /></div>
              <div><label style={L}>Description</label><textarea value={template.description || ''} onChange={e => onChange({ ...template, description: e.target.value })} style={{ ...I, minHeight: 80, resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={L}>Category</label>
                  <select value={template.category || 'modern'} onChange={e => onChange({ ...template, category: e.target.value })} style={I}>
                    {['classic', 'modern', 'minimal', 'romantic', 'bold', 'elegant', 'rustic', 'boho'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={L}>Price UAH</label><input type="number" value={template.price_uah} onChange={e => onChange({ ...template, price_uah: +e.target.value })} style={I} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={L}>Display Order</label><input type="number" value={template.display_order || 0} onChange={e => onChange({ ...template, display_order: +e.target.value })} style={I} /></div>
                <div><label style={L}>Premium?</label>
                  <select value={template.is_premium ? 'yes' : 'no'} onChange={e => onChange({ ...template, is_premium: e.target.value === 'yes' })} style={I}>
                    <option value="no">No</option><option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: '0 0 16px' }}>Typography</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={L}>Heading Font</label><input value={fonts.headingFont || ''} onChange={e => updateFont('headingFont', e.target.value)} style={I} /></div>
              <div><label style={L}>Body Font</label><input value={fonts.bodyFont || ''} onChange={e => updateFont('bodyFont', e.target.value)} style={I} /></div>
              <div><label style={L}>Accent Font</label><input value={fonts.accentFont || ''} onChange={e => updateFont('accentFont', e.target.value)} style={I} /></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: '0 0 16px' }}>Colors</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {Object.entries(colors).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="color" value={val as string} onChange={e => updateColor(key, e.target.value)} style={{ width: 32, height: 32, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: '#888' }}>{key}</div>
                    <div style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>{val as string}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: '0 0 16px' }}>Images {uploading && <span style={{ color: '#b8956a', fontSize: 11 }}>(uploading...)</span>}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={L}>Thumbnail</label>
                {template.thumbnail_url && <img src={template.thumbnail_url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 8, display: 'block' }} />}
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'thumbnail_url', 'thumbnail')} style={{ fontSize: 12, color: '#888' }} />
              </div>
              <div>
                <label style={L}>Preview Image</label>
                {template.preview_url && <img src={template.preview_url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 8, display: 'block' }} />}
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'preview_url', 'preview')} style={{ fontSize: 12, color: '#888' }} />
              </div>
              <div>
                <label style={L}>Hero Image</label>
                {template.hero_image_url && <img src={template.hero_image_url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 8, display: 'block' }} />}
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'hero_image_url', 'hero')} style={{ fontSize: 12, color: '#888' }} />
              </div>
              <div>
                <label style={L}>Gallery ({(template.gallery_images || []).length} images)</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {(template.gallery_images || []).map((url: string, i: number) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                      <button onClick={() => {
                        const imgs = [...(template.gallery_images || [])];
                        imgs.splice(i, 1);
                        onChange({ ...template, gallery_images: imgs });
                      }} style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, border: 'none', backgroundColor: '#c00', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ fontSize: 12, color: '#888' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewTemplateTab({ onRefresh }: any) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('modern');
  const [price, setPrice] = useState(599);
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!name) return;
    setCreating(true);
    const sb = createBrowserSupabase();
    const { data: { session } } = await sb.auth.getSession();
    await fetch('/api/admin/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session?.access_token },
      body: JSON.stringify({ name, description: desc, category: cat, price_uah: price, price_usd: Math.round(price / 40) }),
    });
    setCreating(false);
    setName('');
    setDesc('');
    onRefresh();
  };

  const I = { backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: 6, padding: '10px 12px', color: '#fff', fontSize: 13, width: '100%', boxSizing: 'border-box' as any };
  const L = { fontSize: 11, color: '#666', textTransform: 'uppercase' as any, letterSpacing: '0.05em', marginBottom: 6, display: 'block' };

  return (
    <div style={{ maxWidth: 500 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24 }}>Create New Template</h3>
      <div style={{ backgroundColor: '#111', borderRadius: 12, border: '1px solid #1a1a1a', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><label style={L}>Template Name *</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rose Garden" style={I} /></div>
        <div><label style={L}>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description..." style={{ ...I, minHeight: 80, resize: 'vertical' }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={L}>Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)} style={I}>
              {['classic', 'modern', 'minimal', 'romantic', 'bold', 'elegant', 'rustic', 'boho'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={L}>Price UAH</label><input type="number" value={price} onChange={e => setPrice(+e.target.value)} style={I} /></div>
        </div>
        <button onClick={create} disabled={creating || !name} style={{
          padding: '12px 0', borderRadius: 8, border: 'none', backgroundColor: name ? '#b8956a' : '#333', color: name ? '#000' : '#666',
          cursor: name ? 'pointer' : 'default', fontSize: 14, fontWeight: 600, marginTop: 8,
        }}>
          {creating ? 'Creating...' : 'Create Template'}
        </button>
        <p style={{ fontSize: 12, color: '#555', margin: 0 }}>After creating, go to Templates tab to edit colors, fonts, and upload images.</p>
      </div>
    </div>
  );
}
