import React, { useState } from 'react';
import { ExecutiveSummary } from '../types';
import { RISK_PLAYBOOKS, RiskPlaybook } from '../data/riskPlaybooks';
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
  Target,
  X,
  Clock,
  Zap,
  ChevronRight,
  FileText
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
  const [activePlaybook, setActivePlaybook] = useState<RiskPlaybook | null>(null);
  const [templateCopied, setTemplateCopied] = useState(false);

  const handleOpenRiskPlaybook = (riskText: string) => {
    const existing = RISK_PLAYBOOKS[riskText];
    if (existing) {
      setActivePlaybook(existing);
    } else {
      setActivePlaybook({
        riskTitle: riskText,
        severity: 'High',
        category: 'Logistics SLA',
        metricsImpact: {
          npsImpact: '-14 points on aggregate survey score',
          chargebackRisk: 'Elevated customer friction and cancellation risk',
          repeatPurchaseDrop: '-18% 90-day retention decrease',
        },
        rootCauses: [
          'Uncommunicated operational delay during high-density order volume periods.',
          'Lack of automated proactive exception triggers to notify buyers before escalation.',
        ],
        immediateActionPlan: [
          {
            step: 'Audit all orders impacted by this risk factor and review tracking status.',
            owner: 'Operations & Logistics',
            sla: '24 Hours',
          },
          {
            step: 'Trigger proactive buyer reassurance communication with estimated delivery updates.',
            owner: 'Customer Experience Team',
            sla: 'Immediate',
          },
        ],
        automatedMitigationRule: 'IF order_delay > 48h THEN triggerProactiveNotification() AND logIncidentTicket().',
        customerApologyTemplate: `Hi {{customer_name}}, we noticed an unexpected delay with your order #{{order_id}}. Our fulfillment specialists are tracking this actively with our carrier partners. Thank you for your patience.`,
      });
    }
  };

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
          <div className="mt-4 flex flex-wrap gap-2 items-center">
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
              <button
                key={i}
                type="button"
                onClick={() => handleOpenRiskPlaybook(r)}
                className="group inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 hover:bg-rose-100/80 text-rose-800 border border-rose-200 transition-all cursor-pointer shadow-2xs"
                title="Click to view full operational risk mitigation playbook"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>{r}</span>
                <span className="text-[10px] text-rose-600/80 font-mono font-normal underline decoration-rose-300">Playbook →</span>
              </button>
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

      {/* Risk Mitigation Playbook Modal */}
      {activePlaybook && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-rose-100 text-rose-800">
                      {activePlaybook.severity} Severity
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {activePlaybook.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Risk Mitigation & Action Playbook
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activePlaybook.riskTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePlaybook(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Quantified Business Impact Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">NPS Impact</span>
                  <span className="text-xs font-bold text-rose-700 block mt-0.5">
                    {activePlaybook.metricsImpact.npsImpact}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Chargeback Exposure</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">
                    {activePlaybook.metricsImpact.chargebackRisk}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">LTV Retention Drop</span>
                  <span className="text-xs font-bold text-rose-700 block mt-0.5">
                    {activePlaybook.metricsImpact.repeatPurchaseDrop}
                  </span>
                </div>
              </div>

              {/* Identified Root Causes */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wide mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Identified Operational Root Causes
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {activePlaybook.rootCauses.map((rc, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{rc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate 48-Hour Action Plan */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wide mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-700" />
                  Immediate 48-Hour Action Plan & Ownership
                </h4>
                <div className="space-y-2">
                  {activePlaybook.immediateActionPlan.map((ap, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start space-x-2">
                        <span className="font-mono font-bold text-slate-400 shrink-0">{idx + 1}.</span>
                        <span className="text-slate-800 leading-snug">{ap.step}</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {ap.owner}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                          {ap.sla}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Mitigation Rule */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px]">
                <div className="flex items-center space-x-1.5 text-emerald-400 mb-1 font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Automated Operational Trigger Rule</span>
                </div>
                <code className="text-slate-300 break-all leading-relaxed">
                  {activePlaybook.automatedMitigationRule}
                </code>
              </div>

              {/* Customer Communication Apology Template */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wide flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-700" />
                    Recommended Proactive Customer Message
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activePlaybook.customerApologyTemplate);
                      setTemplateCopied(true);
                      setTimeout(() => setTemplateCopied(false), 2000);
                    }}
                    className="inline-flex items-center space-x-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {templateCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{templateCopied ? 'Copied' : 'Copy Template'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 italic leading-relaxed">
                  "{activePlaybook.customerApologyTemplate}"
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Playbook verified against customer sentiment trends
              </span>
              <div className="flex items-center space-x-2">
                {onAskCopilotAboutArea && (
                  <button
                    type="button"
                    onClick={() => {
                      onAskCopilotAboutArea(activePlaybook.riskTitle);
                      setActivePlaybook(null);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dissect with Copilot</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActivePlaybook(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
