import React from 'react';
import { ScenarioPreset } from '../types';
import { Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface ScenarioShowcaseProps {
  scenarios: ScenarioPreset[];
  activeScenarioId?: string;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  isAnalyzing: boolean;
}

export const ScenarioShowcase: React.FC<ScenarioShowcaseProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  isAnalyzing,
}) => {
  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Operational Scenarios & Review Batches
          </h2>
          <p className="text-xs text-slate-500">
            Select a real-world scenario to load raw customer reviews, or paste your own custom batch.
          </p>
        </div>
        <span className="text-xs text-slate-400 self-start sm:self-auto font-mono">
          3 Scenarios Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === activeScenarioId;

          return (
            <div
              key={scenario.id}
              id={`scenario-card-${scenario.id}`}
              className={`group relative flex flex-col bg-white rounded-xl border transition-all overflow-hidden ${
                isActive
                  ? 'border-slate-900 ring-1 ring-slate-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Scenario Image */}
              <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={scenario.imageSrc}
                  alt={scenario.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-xs text-slate-800 shadow-2xs">
                  {scenario.badge}
                </span>

                {isActive && (
                  <span className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500 text-white shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Loaded</span>
                  </span>
                )}

                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <p className="text-xs text-slate-200 font-mono">
                    {scenario.reviewCount} Reviews in Batch
                  </p>
                </div>
              </div>

              {/* Scenario Details */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {scenario.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {scenario.subtitle}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectScenario(scenario)}
                    disabled={isAnalyzing}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isActive ? 'Active' : 'Load'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
