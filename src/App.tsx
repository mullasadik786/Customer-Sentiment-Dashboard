import React, { useState } from 'react';
import { SentimentReport, ScenarioPreset } from './types';
import { SCENARIO_PRESETS, INITIAL_REPORT } from './data/sampleScenarios';
import { Navbar } from './components/Navbar';
import { ScenarioShowcase } from './components/ScenarioShowcase';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard';
import { SentimentTrendChart } from './components/SentimentTrendChart';
import { WordCloudCard } from './components/WordCloudCard';
import { ReviewsExplorer } from './components/ReviewsExplorer';
import { RawTextReviewInputModal } from './components/RawTextReviewInputModal';
import { GeminiChatbotDrawer } from './components/GeminiChatbotDrawer';
import {
  FileText,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  TrendingDown,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<SentimentReport>(INITIAL_REPORT);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('ecommerce-delivery');
  const [isPasteModalOpen, setIsPasteModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle analyzing new batch of raw reviews
  const handleAnalyzeText = async (rawText: string, scenarioTitle?: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          scenarioTitle: scenarioTitle || 'Custom Raw Reviews Batch',
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to analyze text reviews with Gemini.');
      }

      const newReport: SentimentReport = await response.json();
      setReport(newReport);
      setActiveScenarioId('custom');
      setSelectedKeyword(null);
      setIsPasteModalOpen(false);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Analysis failed. Please check your Gemini API key in Settings.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle selecting a scenario preset
  const handleSelectScenario = async (scenario: ScenarioPreset) => {
    setActiveScenarioId(scenario.id);
    setSelectedKeyword(null);
    setErrorMessage(null);

    if (scenario.id === 'ecommerce-delivery') {
      setReport(INITIAL_REPORT);
      return;
    }

    // Trigger analysis for the scenario's sample text
    await handleAnalyzeText(scenario.sampleText, scenario.title);
  };

  // Reset demo to default initial report
  const handleResetToDefault = () => {
    setReport(INITIAL_REPORT);
    setActiveScenarioId('ecommerce-delivery');
    setSelectedKeyword(null);
    setErrorMessage(null);
  };

  // Trigger copilot with specific action area
  const handleAskCopilotAboutArea = (areaTitle: string) => {
    setIsChatOpen(true);
    // User can see the chat drawer and interact with context
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 font-sans antialiased selection:bg-slate-200">
      {/* Top Navigation */}
      <Navbar
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        activeScenarioName={report.scenarioName}
        onResetToDefault={handleResetToDefault}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-800 underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero Header & Quick Paste Prompt */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Customer Sentiment Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Customer Feedback & Sentiment Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Paste raw customer reviews to instantly generate chronological sentiment trend lines, frequent complaints/praises word clouds, and AI-written executive action plans.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block font-mono">Report Generated</span>
              <span className="text-xs font-medium text-slate-700">{report.createdAt}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPasteModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Paste New Batch</span>
            </button>
          </div>
        </div>

        {/* 1. Operational Scenario Showcase with Scenario Images */}
        <ScenarioShowcase
          scenarios={SCENARIO_PRESETS}
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
          isAnalyzing={isAnalyzing}
        />

        {/* 2. AI-Written Executive Summary with Top 3 Actionable Areas */}
        <ExecutiveSummaryCard
          summary={report.executiveSummary}
          onAskCopilotAboutArea={handleAskCopilotAboutArea}
        />

        {/* 3. Sentiment Trend Line Chart Over Time */}
        <SentimentTrendChart timeline={report.timeline} />

        {/* 4. Word Cloud of Frequent Complaints & Praises */}
        <WordCloudCard
          praises={report.wordCloud.praises}
          complaints={report.wordCloud.complaints}
          selectedKeyword={selectedKeyword}
          onSelectKeyword={(keyword) => setSelectedKeyword(keyword)}
        />

        {/* 5. Verbatim Customer Reviews Explorer */}
        <ReviewsExplorer
          reviews={report.reviews}
          selectedKeyword={selectedKeyword}
          onClearKeywordFilter={() => setSelectedKeyword(null)}
        />
      </main>

      {/* Raw Text Review Input Modal */}
      <RawTextReviewInputModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onAnalyzeText={handleAnalyzeText}
        isAnalyzing={isAnalyzing}
      />

      {/* Gemini Multi-turn Chatbot Drawer (Thinking Mode + Support & Refund Agent Harness) */}
      <GeminiChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentReport={report}
      />
    </div>
  );
}
