import React, { useState } from 'react';
import { ExecutiveSummary } from '../types';
import {
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  Copy,
  Check,
  TrendingUp,
  ShieldAlert,
  MessageSquareQuote,
  Target
} from 'lucide-react';

interface ExecutiveSummaryCardProps {
  summary: ExecutiveSummary;
  onAskCopilotAboutArea?: (title: string) => void;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  summary,
  onAskCopilotAboutArea,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const textToCopy = `EXECUTIVE SUMMARY: CUSTOMER SENTIMENT REPORT
${summary.headline}

${summary.narrative}

HEALTH SCORE: ${summary.healthScore}/100 | NPS ESTIMATE: ${summary.npsEstimate > 0 ? `+${summary.npsEstimate}` : summary.npsEstimate}
Positive: ${summary.positiveRatio}% | Neutral: ${summary.neutralRatio}% | Negative: ${summary.negativeRatio}%

TOP 3 ACTIONABLE AREAS FOR IMPROVEMENT:
${summary.top3ActionAreas
  .map(
    (a, idx) => `
${idx + 1}. [${a.priority.toUpperCase()}] ${a.title}
- Root Cause: ${a.rootCause}
- Recommendation: ${a.recommendation}
- Expected Impact: ${a.expectedImpact}
- Target KPI: ${a.kpiTarget}
`
  )
  .join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div id="executive-summary-card" className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 font-mono">
                AI Executive Intelligence Brief
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Actionable Synthesis
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1 tracking-tight">
              {summary.headline}
            </h2>
          </div>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors self-start lg:self-center"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Brief'}</span>
        </button>
      </div>

      {/* Strategic Narrative & Quick Metrics */}
      <div className="py-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono mb-2">
            Strategic Overview
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {summary.narrative}
          </p>

          {/* Highlights & Risk Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.positiveHighlights.slice(0, 2).map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{h}</span>
              </span>
            ))}
            {summary.keyRiskFactors.slice(0, 2).map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-800 border border-rose-100"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>{r}</span>
              </span>
            ))}
          </div>
        </div>

        {/* KPI Strip */}
        <div className="lg:col-span-4 bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 grid grid-cols-3 gap-3">
          <div className="text-center">
            <span className="text-[11px] font-medium text-slate-500 block">Health Score</span>
            <span className="text-2xl font-bold text-slate-900 block mt-0.5">
              {summary.healthScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              {summary.healthScore >= 70 ? 'Healthy' : summary.healthScore >= 50 ? 'Moderate' : 'Critical'}
            </span>
          </div>

          <div className="text-center border-x border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Est. NPS</span>
            <span className={`text-2xl font-bold block mt-0.5 ${summary.npsEstimate >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {summary.npsEstimate > 0 ? `+${summary.npsEstimate}` : summary.npsEstimate}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              Benchmark
            </span>
          </div>

          <div className="text-center">
            <span className="text-[11px] font-medium text-slate-500 block">Positive</span>
            <span className="text-2xl font-bold text-emerald-700 block mt-0.5">
              {summary.positiveRatio}%
            </span>
            <span className="text-[10px] text-rose-600 font-mono mt-0.5 block">
              {summary.negativeRatio}% Neg
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Actionable Areas for Improvement */}
      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Top 3 Actionable Areas for Improvement
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Ranked by Customer Churn & Impact Severity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.top3ActionAreas.map((area, index) => {
            const badgeClass = getPriorityBadgeColor(area.priority);

            return (
              <div
                key={area.id || index}
                id={`action-area-${index + 1}`}
                className="relative flex flex-col bg-slate-50/50 hover:bg-slate-50 rounded-xl p-4 border border-slate-200 transition-all hover:border-slate-300"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                      {area.priority}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {area.category}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-2">
                  {area.title}
                </h4>

                {/* Root cause & recommendation */}
                <div className="space-y-2 flex-1 text-xs text-slate-600 mb-3">
                  <div>
                    <span className="font-semibold text-slate-700 block">Identified Root Cause:</span>
                    <p className="mt-0.5 leading-relaxed">{area.rootCause}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Recommended Action:</span>
                    <p className="mt-0.5 leading-relaxed text-slate-800">{area.recommendation}</p>
                  </div>
                </div>

                {/* Impact & KPI Target */}
                <div className="pt-2.5 border-t border-slate-200/70 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-800 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{area.expectedImpact}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono">
                    <Target className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Target KPI: {area.kpiTarget}</span>
                  </div>

                  {/* Customer Quote */}
                  {area.representativeQuotes && area.representativeQuotes.length > 0 && (
                    <div className="mt-2 p-2 rounded bg-white border border-slate-200/80 text-[11px] text-slate-600 italic">
                      <div className="flex items-start space-x-1">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{area.representativeQuotes[0]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {onAskCopilotAboutArea && (
                  <button
                    type="button"
                    onClick={() => onAskCopilotAboutArea(area.title)}
                    className="mt-3 inline-flex items-center justify-center space-x-1 text-xs text-slate-600 hover:text-slate-900 hover:underline pt-1 self-end"
                  >
                    <span>Analyze with Copilot</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
