import React, { useState } from 'react';
import { X, UploadCloud, Sparkles, FileText, Trash2, ArrowRight } from 'lucide-react';
import { SCENARIO_PRESETS } from '../data/sampleScenarios';

interface RawTextReviewInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeText: (rawText: string, scenarioName?: string) => Promise<void>;
  isAnalyzing: boolean;
}

export const RawTextReviewInputModal: React.FC<RawTextReviewInputModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeText,
  isAnalyzing,
}) => {
  const [text, setText] = useState('');
  const [batchTitle, setBatchTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setText(content);
        if (!batchTitle) {
          setBatchTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isAnalyzing) return;
    await onAnalyzeText(text, batchTitle || 'Custom Batch');
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.trim() ? text.split('\n').filter(Boolean).length : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Paste Raw Customer Reviews Batch
              </h3>
              <p className="text-xs text-slate-500">
                Paste any text format — dates, ratings, bulleted notes, or CSV exports
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Optional Title input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
              Batch or Product Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Q4 Holiday Logistics or Mobile App 2.0"
              value={batchTitle}
              onChange={(e) => setBatchTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Preset Sample Selectors */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 font-mono uppercase">
                Quick Sample Batches
              </span>
              <span className="text-[11px] text-slate-400">Click to autofill sample reviews</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SCENARIO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setText(p.sampleText);
                    setBatchTitle(p.title);
                  }}
                  className="px-3 py-2 text-left rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-xs"
                >
                  <span className="font-semibold text-slate-900 block truncate">{p.title}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{p.reviewCount} reviews</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area & Drag-Drop */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 transition-all ${
              dragOver ? 'border-slate-900 bg-slate-50' : 'border-slate-200 focus-within:border-slate-400'
            }`}
          >
            <textarea
              id="raw-reviews-textarea"
              rows={10}
              placeholder="Paste raw reviews here...&#10;&#10;Examples:&#10;[2026-11-02] Maya (5/5): Ordered on Tuesday, arrived Thursday morning in pristine condition! Love the eco-friendly packaging.&#10;[2026-11-25] Tariq (1/5): Tracking said delivered but nothing was on porch. Support was unhelpful.&#10;[2026-12-04] Kevin (1/5): 2-day delivery took 6 days. Zero tracking scans."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 text-xs font-mono text-slate-800 bg-transparent resize-y focus:outline-none placeholder:text-slate-400"
            />

            {/* Bottom bar inside textarea box */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center space-x-3">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{lineCount} entries</span>
                <span>•</span>
                <span>{text.length} chars</span>
              </div>

              {text.length > 0 && (
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="text-slate-400 hover:text-rose-600 flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Upload file fallback */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <label className="inline-flex items-center space-x-1.5 cursor-pointer text-slate-700 hover:text-slate-900 font-medium">
              <UploadCloud className="w-4 h-4 text-slate-500" />
              <span>Upload .txt or .csv file</span>
              <input
                type="file"
                accept=".txt,.csv,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
            <span className="text-[11px] text-slate-400">
              Supports UTF-8 text batches up to 50,000 characters
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isAnalyzing}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim() || isAnalyzing}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAnalyzing ? 'Analyzing with Gemini...' : 'Generate Visual Report'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
