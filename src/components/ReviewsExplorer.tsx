import React, { useState } from 'react';
import { ParsedReview } from '../types';
import { Search, Star, Filter, AlertCircle, CheckCircle2, MinusCircle, MessageSquare } from 'lucide-react';

interface ReviewsExplorerProps {
  reviews: ParsedReview[];
  selectedKeyword?: string | null;
  onClearKeywordFilter?: () => void;
}

export const ReviewsExplorer: React.FC<ReviewsExplorerProps> = ({
  reviews,
  selectedKeyword,
  onClearKeywordFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

  const filteredReviews = reviews.filter((r) => {
    // Sentiment filter
    if (sentimentFilter !== 'all' && r.sentiment !== sentimentFilter) {
      return false;
    }

    // Keyword filter from word cloud
    if (selectedKeyword && selectedKeyword.trim() !== '') {
      const match = r.text.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
                    r.category.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
                    (r.flaggedIssue && r.flaggedIssue.toLowerCase().includes(selectedKeyword.toLowerCase()));
      if (!match) return false;
    }

    // Freeform search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const match = r.text.toLowerCase().includes(query) ||
                    r.author.toLowerCase().includes(query) ||
                    r.category.toLowerCase().includes(query) ||
                    (r.flaggedIssue && r.flaggedIssue.toLowerCase().includes(query));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div id="reviews-explorer-card" className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Customer Reviews Explorer
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-600">
              {filteredReviews.length} of {reviews.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full repository of analyzed verbatim feedback with polarity tags and issue flags
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search author, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 w-44 sm:w-56"
            />
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setSentimentFilter('all')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                sentimentFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSentimentFilter('positive')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                sentimentFilter === 'positive' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Pos
            </button>
            <button
              type="button"
              onClick={() => setSentimentFilter('neutral')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                sentimentFilter === 'neutral' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Neu
            </button>
            <button
              type="button"
              onClick={() => setSentimentFilter('negative')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                sentimentFilter === 'negative' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Neg
            </button>
          </div>
        </div>
      </div>

      {/* Active Keyword Badge */}
      {selectedKeyword && (
        <div className="mb-4 inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <span>Filtering by word cloud theme: <strong>"{selectedKeyword}"</strong></span>
          {onClearKeywordFilter && (
            <button
              type="button"
              onClick={onClearKeywordFilter}
              className="text-amber-700 hover:text-amber-900 underline font-medium"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No reviews match the selected search or sentiment filter.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const isPos = r.sentiment === 'positive';
            const isNeg = r.sentiment === 'negative';

            return (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50/90 border border-slate-200 transition-all text-xs"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900">{r.author}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{r.date}</span>

                    {/* Star rating */}
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < r.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {r.category}
                    </span>

                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full font-semibold text-[11px] border ${
                        isPos
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isNeg
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isPos ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : isNeg ? (
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                      ) : (
                        <MinusCircle className="w-3 h-3 text-slate-500" />
                      )}
                      <span>{r.sentiment} ({r.score})</span>
                    </span>
                  </div>
                </div>

                {/* Review text */}
                <p className="text-slate-700 leading-relaxed">
                  "{r.text}"
                </p>

                {/* Flagged Issue Tag */}
                {r.flaggedIssue && (
                  <div className="mt-2 inline-flex items-center space-x-1 text-[11px] text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                    <span>Identified Issue:</span>
                    <span>{r.flaggedIssue}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
