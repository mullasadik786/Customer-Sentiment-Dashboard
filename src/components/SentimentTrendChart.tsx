import React, { useState } from 'react';
import { SentimentPoint } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Calendar, Info } from 'lucide-react';

interface SentimentTrendChartProps {
  timeline: SentimentPoint[];
}

export const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ timeline }) => {
  const [viewMode, setViewMode] = useState<'score' | 'volume'>('score');

  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
        No chronological timeline data detected in this review batch.
      </div>
    );
  }

  // Custom clean tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = timeline.find((t) => t.date === label);

      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
            <span className="font-semibold text-slate-900 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {label}
            </span>
            <span className="font-mono text-slate-500">
              {dataPoint?.total ?? 0} reviews
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
            <div className="text-slate-600">
              Sentiment Score: <span className="font-bold text-slate-900">{dataPoint?.avgScore ?? 0}/100</span>
            </div>
            <div className="text-emerald-700">
              Positive: <span className="font-bold">{dataPoint?.positive ?? 0}</span>
            </div>
            <div className="text-slate-500">
              Neutral: <span className="font-bold">{dataPoint?.neutral ?? 0}</span>
            </div>
            <div className="text-rose-700">
              Negative: <span className="font-bold">{dataPoint?.negative ?? 0}</span>
            </div>
          </div>

          {dataPoint?.keyHighlight && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-600 italic">
              "{dataPoint.keyHighlight}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="sentiment-trend-chart-card" className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Sentiment Trend Line Over Time
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tracking customer sentiment index and volume dynamics across sequential time windows
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('score')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'score'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sentiment Score (0–100)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('volume')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'volume'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review Volume (Pos vs Neg)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'score' ? (
            <LineChart data={timeline} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: '#475569' }}
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                name="Sentiment Index"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0f172a', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#0f172a' }}
              />
            </LineChart>
          ) : (
            <AreaChart data={timeline} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', color: '#475569' }}
              />
              <Area
                type="monotone"
                dataKey="positive"
                name="Positive Reviews"
                stroke="#059669"
                fill="#10b981"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="negative"
                name="Negative Reviews"
                stroke="#e11d48"
                fill="#f43f5e"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="neutral"
                name="Neutral Reviews"
                stroke="#64748b"
                fill="#94a3b8"
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart footer notes */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Calculated via time-weighted natural language polarity scoring (0 = most negative, 100 = most positive).</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          Sample Window: {timeline.length} time clusters
        </span>
      </div>
    </div>
  );
};
