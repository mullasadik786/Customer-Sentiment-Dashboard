export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface SentimentPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
  avgScore: number; // 0 to 100
  total: number;
  keyHighlight?: string;
}

export interface WordCloudItem {
  id: string;
  text: string;
  count: number;
  type: 'praise' | 'complaint';
  category: string;
  sentimentScore: number; // 0 to 100
  exampleQuote: string;
}

export interface ActionArea {
  id: string;
  title: string;
  priority: 'Critical' | 'High' | 'Medium';
  category: string;
  problemDescription: string;
  rootCause: string;
  recommendation: string;
  expectedImpact: string;
  kpiTarget: string;
  representativeQuotes: string[];
}

export interface ExecutiveSummary {
  headline: string;
  narrative: string;
  healthScore: number; // 0 to 100
  npsEstimate: number; // -100 to +100
  positiveRatio: number; // percentage e.g. 68
  neutralRatio: number;
  negativeRatio: number;
  top3ActionAreas: ActionArea[];
  positiveHighlights: string[];
  keyRiskFactors: string[];
}

export interface ParsedReview {
  id: string;
  date: string;
  author: string;
  rating: number; // 1 to 5
  text: string;
  sentiment: SentimentType;
  score: number; // 0 - 100
  category: string;
  flaggedIssue?: string;
}

export interface SentimentReport {
  id: string;
  title: string;
  createdAt: string;
  rawTextLength: number;
  totalReviewsAnalyzed: number;
  scenarioName?: string;
  overview: {
    healthScore: number;
    npsEstimate: number;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    averageRating: number;
  };
  timeline: SentimentPoint[];
  wordCloud: {
    praises: WordCloudItem[];
    complaints: WordCloudItem[];
  };
  executiveSummary: ExecutiveSummary;
  reviews: ParsedReview[];
}

export interface ScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageSrc: string;
  description: string;
  reviewCount: number;
  sampleText: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  thinkingMode?: boolean;
  actionTaken?: string;
}
