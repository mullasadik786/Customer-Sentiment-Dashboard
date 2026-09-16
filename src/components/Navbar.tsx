import React from 'react';
import { Sparkles, MessageSquareCode, FileText, BarChart3, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onOpenPasteModal: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  activeScenarioName?: string;
  onResetToDefault: () => void;
  isAnalyzing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPasteModal,
  onToggleChat,
  isChatOpen,
  activeScenarioName,
  onResetToDefault,
  isAnalyzing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Context */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                Customer Sentiment Dashboard
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Gemini Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
              {activeScenarioName ? `Active: ${activeScenarioName}` : 'Continuous Sentiment & Text Intelligence'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            id="btn-reset-scenario"
            type="button"
            onClick={onResetToDefault}
            className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            title="Reload initial scenario dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            id="btn-paste-reviews"
            type="button"
            onClick={onOpenPasteModal}
            disabled={isAnalyzing}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xs disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Paste Reviews</span>
          </button>

          <button
            id="btn-toggle-chatbot"
            type="button"
            onClick={onToggleChat}
            className={`relative inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
              isChatOpen
                ? 'bg-slate-100 text-slate-900 border-slate-300'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">AI Copilot</span>
            <span className="sm:hidden">Chat</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
