import React, { useState } from 'react';
import { WordCloudItem } from '../types';
import { ThumbsUp, ThumbsDown, MessageSquareQuote, Filter, Sparkles, Check } from 'lucide-react';

interface WordCloudCardProps {
  praises: WordCloudItem[];
  complaints: WordCloudItem[];
  onSelectKeyword?: (keyword: string) => void;
  selectedKeyword?: string | null;
}

export const WordCloudCard: React.FC<WordCloudCardProps> = ({
  praises,
  complaints,
  onSelectKeyword,
  selectedKeyword,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'praises' | 'complaints'>('all');
  const [activeItem, setActiveItem] = useState<WordCloudItem | null>(null);

  // Combine or filter items
  let displayItems: WordCloudItem[] = [];
  if (filterMode === 'all') {
    displayItems = [...praises, ...complaints];
  } else if (filterMode === 'praises') {
    displayItems = [...praises];
  } else {
    displayItems = [...complaints];
  }

  // Find maximum count for proportional font sizing
  const maxCount = Math.max(...displayItems.map((i) => i.count), 1);
  const minCount = Math.min(...displayItems.map((i) => i.count), 1);

  // Calculate font size
  const getFontSizeClass = (count: number) => {
    const ratio = (count - minCount) / Math.max(maxCount - minCount, 1);
    if (ratio > 0.75) return 'text-xl md:text-2xl font-bold';
    if (ratio > 0.45) return 'text-base md:text-lg font-semibold';
    if (ratio > 0.2) return 'text-sm font-medium';
    return 'text-xs font-normal';
  };

  return (
    <div id="word-cloud-card" className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Feedback Word Cloud: Frequent Praises & Complaints
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sized by keyword recurrence. Click any phrase to inspect customer quotes and filter reviews.
          </p>
        </div>

        {/* Filter mode pill */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Themes ({praises.length + complaints.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('praises')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filterMode === 'praises'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <ThumbsUp className="w-3 h-3 text-emerald-600" />
            <span>Praises ({praises.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('complaints')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              filterMode === 'complaints'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <ThumbsDown className="w-3 h-3 text-rose-600" />
            <span>Complaints ({complaints.length})</span>
          </button>
        </div>
      </div>

      {/* Cloud Container */}
      <div className="min-h-[200px] flex flex-wrap items-center justify-center gap-3 p-6 bg-slate-50/50 rounded-xl border border-slate-200/80">
        {displayItems.map((item) => {
          const isPraise = item.type === 'praise';
          const isSelected = selectedKeyword === item.text;
          const fontClass = getFontSizeClass(item.count);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveItem(item);
                if (onSelectKeyword) {
                  onSelectKeyword(isSelected ? '' : item.text);
                }
              }}
              onMouseEnter={() => setActiveItem(item)}
              className={`group relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${fontClass} ${
                isPraise
                  ? isSelected
                    ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-500/50 shadow-sm'
                    : 'bg-emerald-50/90 hover:bg-emerald-100/90 text-emerald-900 border-emerald-200 hover:border-emerald-300'
                  : isSelected
                  ? 'bg-rose-600 text-white border-rose-700 ring-2 ring-rose-500/50 shadow-sm'
                  : 'bg-rose-50/90 hover:bg-rose-100/90 text-rose-900 border-rose-200 hover:border-rose-300'
              }`}
            >
              <span>{item.text}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isSelected
                    ? 'bg-white/30 text-white'
                    : isPraise
                    ? 'bg-emerald-200/70 text-emerald-900'
                    : 'bg-rose-200/70 text-rose-900'
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Word Insight Inspector Banner */}
      {activeItem ? (
        <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                activeItem.type === 'praise' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {activeItem.type === 'praise' ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-900">
                  {activeItem.text}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-600">
                  {activeItem.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {activeItem.count} mentions ({activeItem.type === 'praise' ? 'Praise' : 'Complaint'})
                </span>
              </div>
              <p className="text-xs text-slate-600 italic mt-1">
                "{activeItem.exampleQuote}"
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onSelectKeyword) {
                onSelectKeyword(selectedKeyword === activeItem.text ? '' : activeItem.text);
              }
            }}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              selectedKeyword === activeItem.text
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            {selectedKeyword === activeItem.text ? 'Clear Filter' : 'Filter Reviews'}
          </button>
        </div>
      ) : (
        <div className="mt-3 text-center text-xs text-slate-400">
          Tip: Hover over or tap any theme above to inspect verbatim customer quotes.
        </div>
      )}
    </div>
  );
};
