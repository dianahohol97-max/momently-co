'use client';
import { useState } from 'react';

interface DesignTabProps { wedding: any; template: any; allTemplates: any[]; onSave: (updates: Record<string, any>) => Promise<void>; saving: boolean; }

const defaultColors = { primary: '#b8956a', secondary: '#8B6F4E', accent: '#E8D4C4', background: '#FDF8F4', surface: '#FFFFFF', text: '#3D3027', textMuted: '#8A7B6B', border: '#E8E0D4' };
const colorLabels: Record<string, string> = { primary: 'Основний', secondary: 'Додатковий', accent: 'Акцент', background: 'Фон', surface: 'Поверхня', text: 'Текст', textMuted: 'Текст (м\'який)', border: 'Рамка' };

export function DesignTab({ wedding, template, allTemplates, onSave, saving }: DesignTabProps) {
  const [colors, setColors] = useState(wedding.template_customizations?.colors || template?.config_json?.colors || defaultColors);
  const [selectedTemplateId, setSelectedTemplateId] = useState(template?.id || '');

  const handleColorChange = (key: string, value: string) => setColors({ ...colors, [key]: value });
  const handleSaveColors = () => onSave({ template_customizations: { ...wedding.template_customizations, colors } });

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Шаблон</h2>
        <p className="text-sm text-gray-400 mb-6">Оберіть базовий шаблон для вашого запрошення</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allTemplates.map((t: any) => {
            const tColors = t.config_json?.colors || {};
            const isSelected = t.id === selectedTemplateId;
            return (
              <button key={t.id} onClick={() => setSelectedTemplateId(t.id)} className={`text-left rounded-xl border-2 p-4 transition-all ${isSelected ? 'border-[#b8956a] shadow-md' : 'border-[#e8e0d4] hover:border-[#b8956a]/50'}`}>
                <div className="aspect-[3/4] rounded-lg mb-3 flex items-center justify-center" style={{ backgroundColor: tColors.background || '#fdf8f4' }}>
                  <span className="text-2xl font-serif" style={{ color: tColors.primary || '#b8956a' }}>A & O</span>
                </div>
                <p className="text-sm font-medium text-[#1a1a2e]">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.category}</p>
              </button>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Кольори</h2>
        <p className="text-sm text-gray-400 mb-6">Налаштуйте кольорову палітру</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-medium">{colorLabels[key] || key}</label>
              <div className="flex items-center gap-2 bg-white border border-[#e8e0d4] rounded-lg p-2">
                <input type="color" value={value as string} onChange={e => handleColorChange(key, e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer" />
                <input type="text" value={value as string} onChange={e => handleColorChange(key, e.target.value)} className="flex-1 text-xs font-mono text-gray-600 bg-transparent outline-none" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSaveColors} disabled={saving} className="mt-6 bg-[#1a1a2e] text-[#faf8f4] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a3e] transition-colors disabled:opacity-50">{saving ? 'Зберігаємо...' : 'Зберегти кольори'}</button>
      </section>
      <section>
        <h2 className="font-serif text-xl text-[#1a1a2e] mb-1">Попередній перегляд палітри</h2>
        <div className="rounded-xl p-8 mt-4 text-center" style={{ backgroundColor: colors.background, color: colors.text }}>
          <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: colors.textMuted }}>Запрошуємо вас</p>
          <h3 className="font-serif text-3xl" style={{ color: colors.text }}>{wedding.partner_name_1} <span style={{ color: colors.primary }}>&amp;</span> {wedding.partner_name_2}</h3>
          <div className="w-12 h-px mx-auto mt-4 mb-4" style={{ backgroundColor: colors.primary }} />
          <p className="text-sm" style={{ color: colors.textMuted }}>15 серпня 2026</p>
          <div className="mt-6 flex justify-center gap-3">
            <span className="px-4 py-2 rounded-lg text-xs" style={{ backgroundColor: colors.primary, color: colors.background }}>RSVP</span>
            <span className="px-4 py-2 rounded-lg text-xs border" style={{ borderColor: colors.border, color: colors.text }}>Деталі</span>
          </div>
        </div>
      </section>
    </div>
  );
}
