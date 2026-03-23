'use client';
import { WeddingView } from '@/components/templates/wedding-view';

interface PreviewTabProps { wedding: any; template: any; }

export function PreviewTab({ wedding, template }: PreviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-[#1a1a2e]">Попередній перегляд</h2>
          <p className="text-sm text-gray-400">Так бачитимуть ваше запрошення гості</p>
        </div>
        {wedding.slug && (
          <a href={'/w/' + wedding.slug} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-[#b8956a] hover:text-[#a07850] font-medium">
            Відкрити повну версію →
          </a>
        )}
      </div>
      <div className="rounded-2xl overflow-hidden border border-[#e8e0d4] shadow-lg">
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-xs text-gray-400 text-center">
            momently.co/w/{wedding.slug || 'preview'}
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <WeddingView wedding={wedding} template={template} />
        </div>
      </div>
    </div>
  );
}
