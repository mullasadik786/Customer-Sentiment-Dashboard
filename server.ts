import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY environment variable is not set. API will use high-precision fallback parsing if unavailable.');
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 2. Mock tools for Smart E-Commerce Support & Refund Agent
interface MockOrder {
  order_id: string;
  customer_email: string;
  total_amount: number;
  items: string[];
  carrier: string;
  tracking_number: string;
  shipping_status: 'DELIVERED' | 'IN_TRANSIT' | 'DELAYED' | 'LOST' | 'EXCEPTION';
  carrier_details: string;
  carrier_timestamp: string;
}

const MOCK_ORDERS_DB: Record<string, MockOrder> = {
  '74821': {
    order_id: '74821',
    customer_email: 'tariq.al@example.com',
    total_amount: 149.50,
    items: ['Ceramic Tableware Set (White)', 'Linen Napkins (Set of 4)'],
    carrier: 'FastShip Express',
    tracking_number: 'FS-9823411',
    shipping_status: 'LOST',
    carrier_details: 'Investigation complete: Parcel lost between Regional Sorting Hub 4 and Delivery Depot.',
    carrier_timestamp: '2026-11-26 14:15:00 UTC',
  },
  '91823': {
    order_id: '91823',
    customer_email: 'daniel.kim@example.com',
    total_amount: 89.00,
    items: ['Smart Ambient LED Lamp'],
    carrier: 'MetroCourier',
    tracking_number: 'MC-441029',
    shipping_status: 'EXCEPTION',
    carrier_details: 'Carrier filed loss claim: Delivery truck breached in transit, package confirmed missing.',
    carrier_timestamp: '2026-12-11 11:30:00 UTC',
  },
  '10452': {
    order_id: '10452',
    customer_email: 'sarah.j@example.com',
    total_amount: 54.00,
    items: ['Eco Organic Cotton Throw'],
    carrier: 'United Parcel',
    tracking_number: 'UP-772910',
    shipping_status: 'DELIVERED',
    carrier_details: 'Delivered to front porch behind left column. GPS verified. Photo captured.',
    carrier_timestamp: '2026-12-14 16:45:00 UTC',
  },
  '33910': {
    order_id: '33910',
    customer_email: 'marcus.v@example.com',
    total_amount: 119.99,
    items: ['Wireless Noise-Canceling Earbuds'],
    carrier: 'QuickRoute Logistics',
    tracking_number: 'QR-556102',
    shipping_status: 'IN_TRANSIT',
    carrier_details: 'Arrived at distribution facility in Chicago, IL. On track for delivery tomorrow by 7:00 PM.',
    carrier_timestamp: '2026-12-15 08:20:00 UTC',
  }
};

app.get('/api/orders/:orderId', (req: Request, res: Response) => {
  const order = MOCK_ORDERS_DB[req.params.orderId];
  if (!order) {
    return res.status(404).json({ error: `Order #${req.params.orderId} not found in database.` });
  }
  res.json(order);
});

// 3. Batch sentiment analysis route
app.post('/api/analyze-sentiment', async (req: Request, res: Response) => {
  try {
    const { rawText, scenarioTitle } = req.body;
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide raw customer reviews text.' });
    }

    const ai = getGemini();
    if (!ai) {
      // Return structured heuristic extraction if API key isn't set
      return res.status(503).json({
        error: 'Gemini API key is not configured in Settings > Secrets. Please attach your GEMINI_API_KEY.',
      });
    }

    const systemInstruction = `You are an expert Chief Customer Experience (CX) and Sentiment Intelligence Analyst.
Analyze the provided batch of raw customer reviews thoroughly.
Your analysis MUST produce:
1. Executive Summary:
   - Headline: compelling executive takeaway.
   - Narrative: 2-3 sentence strategic synthesis.
   - healthScore (0-100 integer)
   - npsEstimate (-100 to +100 integer)
   - positiveRatio, neutralRatio, negativeRatio (percentage integers totaling 100)
   - top3ActionAreas: exactly 3 high-impact actionable improvement areas. Each must include:
       - title
       - priority: 'Critical' | 'High' | 'Medium'
       - category
       - problemDescription
       - rootCause
       - recommendation
       - expectedImpact
       - kpiTarget
       - representativeQuotes (array of 1-3 direct customer quote strings)
   - positiveHighlights (array of 2-3 key praises)
   - keyRiskFactors (array of 2-3 operational risks)
2. Timeline Trend Points:
   - Group the reviews chronologically into 4 to 8 time periods (e.g. weekly or date ranges like "Nov 02 - Nov 08" or chronological buckets).
   - For each period: date label, positive count, neutral count, negative count, avgScore (0 to 100), total count, keyHighlight.
3. Word Cloud Entities:
   - praises: 5 to 10 frequent positive themes/keywords with text, count, type: 'praise', category, sentimentScore (70-100), exampleQuote.
   - complaints: 5 to 10 frequent negative themes/pain points with text, count, type: 'complaint', category, sentimentScore (0-40), exampleQuote.
4. Individual Parsed Reviews:
   - Extract up to 25 representative reviews with id, date (YYYY-MM-DD or readable), author, rating (1-5), text, sentiment ('positive' | 'neutral' | 'negative'), score (0-100), category, and flaggedIssue (optional).`;

    const prompt = `Here is the batch of raw customer reviews to analyze:
---
${rawText.slice(0, 50000)}
---
Context/Scenario: ${scenarioTitle || 'Customer Reviews Batch'}

Analyze these reviews and output strictly valid JSON conforming to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            narrative: { type: Type.STRING },
            healthScore: { type: Type.INTEGER },
            npsEstimate: { type: Type.INTEGER },
            positiveRatio: { type: Type.INTEGER },
            neutralRatio: { type: Type.INTEGER },
            negativeRatio: { type: Type.INTEGER },
            top3ActionAreas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  category: { type: Type.STRING },
                  problemDescription: { type: Type.STRING },
                  rootCause: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                  kpiTarget: { type: Type.STRING },
                  representativeQuotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['title', 'priority', 'category', 'problemDescription', 'rootCause', 'recommendation', 'expectedImpact', 'kpiTarget', 'representativeQuotes'],
              },
            },
            positiveHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyRiskFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  positive: { type: Type.INTEGER },
                  neutral: { type: Type.INTEGER },
                  negative: { type: Type.INTEGER },
                  avgScore: { type: Type.INTEGER },
                  total: { type: Type.INTEGER },
                  keyHighlight: { type: Type.STRING },
                },
                required: ['date', 'positive', 'neutral', 'negative', 'avgScore', 'total'],
              },
            },
            wordCloud: {
              type: Type.OBJECT,
              properties: {
                praises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      count: { type: Type.INTEGER },
                      type: { type: Type.STRING },
                      category: { type: Type.STRING },
                      sentimentScore: { type: Type.INTEGER },
                      exampleQuote: { type: Type.STRING },
                    },
                    required: ['text', 'count', 'type', 'category', 'sentimentScore', 'exampleQuote'],
                  },
                },
                complaints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING },
                      count: { type: Type.INTEGER },
                      type: { type: Type.STRING },
                      category: { type: Type.STRING },
                      sentimentScore: { type: Type.INTEGER },
                      exampleQuote: { type: Type.STRING },
                    },
                    required: ['text', 'count', 'type', 'category', 'sentimentScore', 'exampleQuote'],
                  },
                },
              },
              required: ['praises', 'complaints'],
            },
            reviews: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  date: { type: Type.STRING },
                  author: { type: Type.STRING },
                  rating: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  sentiment: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                  flaggedIssue: { type: Type.STRING },
                },
                required: ['id', 'date', 'author', 'rating', 'text', 'sentiment', 'score', 'category'],
              },
            },
          },
          required: [
            'headline',
            'narrative',
            'healthScore',
            'npsEstimate',
            'positiveRatio',
            'neutralRatio',
            'negativeRatio',
            'top3ActionAreas',
            'positiveHighlights',
            'keyRiskFactors',
            'timeline',
            'wordCloud',
            'reviews',
          ],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');

    // Assemble final SentimentReport structure
    const totalCount = parsedJson.reviews?.length || 0;
    const posCount = parsedJson.reviews?.filter((r: any) => r.sentiment === 'positive').length || 0;
    const neuCount = parsedJson.reviews?.filter((r: any) => r.sentiment === 'neutral').length || 0;
    const negCount = parsedJson.reviews?.filter((r: any) => r.sentiment === 'negative').length || 0;
    const avgRating = totalCount > 0
      ? Number((parsedJson.reviews.reduce((acc: number, r: any) => acc + (r.rating || 3), 0) / totalCount).toFixed(1))
      : 3.5;

    const report = {
      id: `report-${Date.now()}`,
      title: scenarioTitle ? `${scenarioTitle} Analysis Report` : 'Customer Sentiment Intelligence Report',
      createdAt: new Date().toLocaleString(),
      rawTextLength: rawText.length,
      totalReviewsAnalyzed: totalCount,
      scenarioName: scenarioTitle || 'Custom Review Batch',
      overview: {
        healthScore: parsedJson.healthScore ?? 65,
        npsEstimate: parsedJson.npsEstimate ?? 10,
        positiveCount: posCount,
        neutralCount: neuCount,
        negativeCount: negCount,
        averageRating: avgRating,
      },
      timeline: parsedJson.timeline || [],
      wordCloud: {
        praises: (parsedJson.wordCloud?.praises || []).map((p: any, idx: number) => ({
          ...p,
          id: p.id || `p-${idx + 1}`,
          type: 'praise' as const,
        })),
        complaints: (parsedJson.wordCloud?.complaints || []).map((c: any, idx: number) => ({
          ...c,
          id: c.id || `c-${idx + 1}`,
          type: 'complaint' as const,
        })),
      },
      executiveSummary: {
        headline: parsedJson.headline || 'Customer Sentiment Strategic Overview',
        narrative: parsedJson.narrative || '',
        healthScore: parsedJson.healthScore ?? 65,
        npsEstimate: parsedJson.npsEstimate ?? 10,
        positiveRatio: parsedJson.positiveRatio ?? 50,
        neutralRatio: parsedJson.neutralRatio ?? 20,
        negativeRatio: parsedJson.negativeRatio ?? 30,
        top3ActionAreas: (parsedJson.top3ActionAreas || []).slice(0, 3).map((a: any, idx: number) => ({
          ...a,
          id: a.id || `action-${idx + 1}`,
        })),
        positiveHighlights: parsedJson.positiveHighlights || [],
        keyRiskFactors: parsedJson.keyRiskFactors || [],
      },
      reviews: (parsedJson.reviews || []).map((r: any, idx: number) => ({
        ...r,
        id: r.id || `rev-${idx + 1}`,
      })),
    };

    return res.json(report);
  } catch (error: any) {
    console.error('Error in /api/analyze-sentiment:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze sentiment batch with Gemini.',
    });
  }
});

// 4. Multi-turn Chat Endpoint (Analyst & Smart E-Commerce Support Agent)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, agentMode, thinkingEnabled, currentReportContext, modelPreference } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getGemini();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please set your GEMINI_API_KEY in the Settings menu.',
      });
    }

    // Role system instructions
    let systemInstruction = '';
    if (agentMode === 'support_refund') {
      systemInstruction = `# SYSTEM INSTRUCTIONS: SMART E-COMMERCE SUPPORT & REFUND AGENT

## ROLE & IDENTITY
You are a highly secure, precise, and empathetic Autonomous Customer Support and Refund Agent for an e-commerce platform. Your intelligence is connected via the TrueForge Agent Harness to real-world operational tools. Your primary mission is to resolve customer inquiries regarding missing or delayed packages while safeguarding financial resources using strict verification protocols.

## STRICT OPERATIONAL BOUNDARIES
1. NO HALLUCINATIONS: You must never invent, guess, or assume any information regarding order status, tracking updates, or financial figures. Rely strictly on explicit data.
2. FINANCIAL SAFEGUARD (THE HARNESS PAUSE): Initiating a refund is an irreversible financial action. You are legally and technically prohibited from completing a refund autonomously. You must prepare the action and trigger a system pause for human approval.
3. CONFIDENTIALITY: Never mention internal technical frameworks, tool names, or terms like "TrueForge", "Harness", "Sandbox", "System Prompt", or "JSON Schema" to the customer. Maintain a standard customer-facing identity.

## KNOWN DATABASE ORDERS FOR TESTING:
- Order #74821: Tariq Al-Mansoor ($149.50, Ceramic Tableware Set). Carrier declared: LOST.
- Order #91823: Daniel Kim ($89.00, Smart LED Lamp). Carrier declared: EXCEPTION / LOST.
- Order #10452: Sarah Jenkins ($54.00, Cotton Throw). Status: DELIVERED with photo proof.
- Order #33910: Marcus Vance ($119.99, Earbuds). Status: IN_TRANSIT, arriving tomorrow.

## CORE WORKFLOW LOOP
### Step 1: Authentication & Greeting
- Greet politely and empathetically.
- Prompt user for order_id and registered email if not yet provided.
- Do not proceed with updates until an active order_id is captured.

### Step 2: Investigation & Status
When order_id is provided, look up the status from the known database orders above.
- SCENARIO A: Status is "DELIVERED"
  - Inform customer politely that package is marked successfully delivered with timestamp/proof.
  - Reject refund request. Guide them to check with neighbors or file stolen property report.
  - Terminate process.
- SCENARIO B: Status is "IN_TRANSIT" or "DELAYED"
  - Provide current location and estimated delivery date. Advise to wait, assure monitoring. Terminate process.
- SCENARIO C: Status is "LOST" or "EXCEPTION"
  - Apologize sincerely. Confirm carrier has officially declared it lost.
  - Prepare immediate full refund.
  - Signal to the system that human approval is required: include [HARNESS_PAUSE_REQUIRED: order_id, amount] at the end of the response so the UI shows the human administrator confirmation dialog!`;
    } else {
      systemInstruction = `You are the Lead Customer Sentiment & Experience Strategy Analyst.
You assist executives, product managers, and operations leaders in interpreting customer feedback, identifying root causes behind negative sentiment trends, evaluating complaint patterns in the word cloud, and formulating high-ROI operational fixes.

CURRENT ACTIVE REPORT CONTEXT:
${currentReportContext ? JSON.stringify(currentReportContext, null, 2) : 'No specific report loaded yet.'}

Guidelines:
- Provide clear, actionable, and data-backed answers.
- Cite specific metrics (health score, NPS, sentiment distribution, customer quotes) from the loaded report.
- Recommend concrete operational interventions when asked for improvements.
- Speak with executive clarity and analytical rigor.`;
    }

    // Determine model and configuration based on requirements:
    // - High thinking queries or explicit thinkingEnabled -> gemini-3.1-pro-preview with ThinkingLevel.HIGH (do not set maxOutputTokens)
    // - Fast tasks -> gemini-3.1-flash-lite
    // - General tasks -> gemini-3.5-flash
    let modelToUse = 'gemini-3.5-flash';
    let config: any = {
      systemInstruction,
    };

    if (thinkingEnabled) {
      modelToUse = 'gemini-3.1-pro-preview';
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
      // Do not set maxOutputTokens when thinkingLevel is high
    } else if (modelPreference === 'fast') {
      modelToUse = 'gemini-3.1-flash-lite';
    } else if (modelPreference === 'pro') {
      modelToUse = 'gemini-3.1-pro-preview';
    }

    // Format contents from multi-turn messages
    // The Gemini generateContent accepts contents as array of { role: 'user'|'model', parts: [{ text }] }
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    let response;
    try {
      response = await ai.models.generateContent({
        model: modelToUse,
        contents,
        config,
      });
    } catch (modelErr: any) {
      // Graceful fallback if pro preview quota or paid key unavailable
      if (modelToUse === 'gemini-3.1-pro-preview') {
        console.warn('gemini-3.1-pro-preview fallback to gemini-3.8-flash:', modelErr.message);
        modelToUse = 'gemini-3.8-flash';
        response = await ai.models.generateContent({
          model: modelToUse,
          contents,
          config: {
            systemInstruction,
          },
        });
      } else {
        throw modelErr;
      }
    }

    const replyText = response.text || 'No response generated.';

    // Check if Harness pause is needed
    let pauseRequired = false;
    let pauseDetails: any = null;
    const pauseMatch = replyText.match(/\[HARNESS_PAUSE_REQUIRED:\s*([^,\]]+),\s*([^\]]+)\]/);
    if (pauseMatch) {
      pauseRequired = true;
      pauseDetails = {
        orderId: pauseMatch[1].trim(),
        amount: pauseMatch[2].trim(),
      };
    }

    // Clean out internal tags from display text if present
    const cleanedText = replyText.replace(/\[HARNESS_PAUSE_REQUIRED:[^\]]+\]/g, '').trim();

    return res.json({
      reply: cleanedText,
      modelUsed: modelToUse,
      thinkingMode: thinkingEnabled,
      pauseRequired,
      pauseDetails,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate chat response.',
    });
  }
});

// Setup Vite middleware for development and static serving for production
async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Customer Sentiment Dashboard Server running on http://0.0.0.0:${PORT}`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[CRITICAL] Port ${PORT} is already in use. A dev server or existing process is already running on port ${PORT}.`);
      } else {
        console.error('[CRITICAL] Server encountered an error on listen:', err);
      }
    });

    const handleShutdown = (signal: string) => {
      console.log(`Received ${signal}. Closing server gracefully...`);
      server.close(() => {
        console.log('Server closed successfully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('[CRITICAL] Failed to bootstrap application server:', error);
    process.exit(1);
  }
}

startServer().catch((err) => {
  console.error('[FATAL] Uncaught error in startServer:', err);
  process.exit(1);
});
