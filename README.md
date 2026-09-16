# Customer Sentiment Dashboard

An AI-powered customer sentiment intelligence platform designed to ingest large batches of unformatted text reviews, extract chronological polarity trends, visualize frequent complaints and praises in an interactive word cloud, and generate an executive-ready action brief with prioritized improvements.

---

## Key Features

### 1. Batch Review Intake & Parsing
- **Flexible Ingestion:** Paste raw unformatted customer feedback, star ratings, timestamps, bulleted notes, or CSV-formatted exports up to 50,000 characters.
- **Drag-and-Drop Support:** Upload `.txt` or `.csv` files directly into the analyzer.
- **Real-Time Counters:** Instant word count, line count, and character telemetry.

### 2. Chronological Sentiment Trend Line & Volume Timeline
- **Sentiment Index Curve:** Continuous 0–100 time-series trend line tracking aggregate satisfaction across consecutive time intervals.
- **Polarity Volume Distribution:** Area chart breaking down positive, neutral, and negative review counts per time window.
- **Interactive Inspection:** Hover over any point to inspect dates, review counts, average score, and milestone qualitative highlights.

### 3. Differentiated Feedback Word Cloud
- **Visual Distinction:** Mint/emerald pills for customer praises and rose/coral pills for friction complaints.
- **Proportional Weighting:** Font scale scales dynamically based on term frequency.
- **Quote Inspector & Deep Filter:** Tap or hover over any theme to reveal verbatim customer quotes and filter the review repository down to matching records.

### 4. AI-Written Executive Action Brief
- **Strategic Synthesis:** Executive headline, narrative overview, estimated Net Promoter Score (NPS), and customer health rating.
- **Top 3 Actionable Areas for Improvement:**
  - Priority ranking (*Critical*, *High*, *Medium*)
  - Problem description & identified root cause
  - Actionable operational recommendation
  - Expected customer retention impact & target KPI metrics
  - Direct customer quote evidence
- **One-Click Export:** Copy executive brief directly to clipboard for slide decks or stakeholder emails.

### 5. Operational Scenario Presets & Photography
Pre-loaded with realistic operational datasets and high-definition lifestyle imagery:
1. **E-Commerce Logistics & Delivery Rush:** Peak shipping tracking gaps, carrier drop-off issues, and unboxing praise.
2. **Customer Support & Resolution Quality:** Agent turnaround, live chat bots, ticket escalation, and dispute workflows.
3. **Smart Tech & Hardware Unboxing:** Tactile build quality, ergonomics, firmware setup, and battery longevity.

### 6. Gemini AI Multi-Turn Copilot & Support Harness
- **Multi-Turn Thread:** Persistent conversation history with scrollable responses.
- **Dual Operating Modes:**
  - **CX Strategy Analyst:** Drills down into root causes, calculates ROI on fixes, and drafts executive memos.
  - **Smart Support & Refund Agent:** Validates mock order IDs, verifies carrier transit statuses, and triggers the **TrueForge Harness Pause State** requiring human administrator approval before initiating irreversible financial refunds.
- **High Thinking Mode:** Toggle `gemini-3.1-pro-preview` with `ThinkingLevel.HIGH` for deep analytical reasoning.
- **Speed Selector:** Fast (`gemini-3.1-flash-lite`), Balanced (`gemini-3.5-flash`), or Deep Pro Reasoning (`gemini-3.1-pro-preview`).

---

## Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Visualization:** Recharts (responsive line & area charts)
- **Icons:** Lucide React
- **Backend:** Express.js (Node.js runtime via `tsx`)
- **AI Engine:** Google GenAI SDK (`@google/genai`) with structured JSON schema outputs
- **Design System:** Accessible light theme, high-contrast typography, and zero clutter

---

## Environment Setup

1. Configure your environment variables in `.env` (or via Google AI Studio **Settings > Secrets**):

```bash
# GEMINI_API_KEY: Required for sentiment analysis and the chat copilot
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: Optional, URL where the app is hosted
APP_URL="http://localhost:3000"
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server (starts Express + Vite on port 3000):

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm start
```

---

## Deploying to Render (or Cloud Platforms)

When deploying to **Render** as a Web Service:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Google Gemini API Key
  - `PORT`: `3000`
  - `NODE_VERSION`: `20`

> **Note**: A `render.yaml` configuration is included at the root of the project to automate these settings. Additionally, a `prestart` hook is configured in `package.json` to automatically trigger `npm run build` if `dist/server.cjs` is ever missing during startup.

---

## API Endpoints

- `GET /api/health`: System health and Gemini API key status.
- `GET /api/orders/:orderId`: Mock order and shipping carrier tracking lookup.
- `POST /api/analyze-sentiment`: Ingests raw reviews text and returns structured timeline points, word cloud entities, executive summary with top 3 action areas, and parsed reviews.
- `POST /api/chat`: Multi-turn conversational copilot supporting CX Analyst and Smart Support Refund Harness modes with optional High Thinking.
