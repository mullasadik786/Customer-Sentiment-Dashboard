import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SentimentReport } from '../types';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Brain,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface GeminiChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentReport: SentimentReport | null;
}

export const GeminiChatbotDrawer: React.FC<GeminiChatbotDrawerProps> = ({
  isOpen,
  onClose,
  currentReport,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Hello! I am your AI Sentiment & Customer Experience Copilot. I can dissect root causes for negative sentiment trends, evaluate word cloud praise/complaint patterns, or act as your Smart E-Commerce Support & Refund Agent with real-time order verification. How can I assist you today?`,
      timestamp: 'Just now',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [agentMode, setAgentMode] = useState<'analyst' | 'support_refund'>('analyst');
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [modelPreference, setModelPreference] = useState<'fast' | 'balanced' | 'pro'>('balanced');

  // TrueForge Harness Pause State for human approval
  const [harnessPause, setHarnessPause] = useState<{
    active: boolean;
    orderId: string;
    amount: string;
    pendingMessageId?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          agentMode,
          thinkingEnabled,
          modelPreference: modelPreference === 'fast' ? 'fast' : modelPreference === 'pro' ? 'pro' : 'standard',
          currentReportContext: currentReport
            ? {
                title: currentReport.title,
                healthScore: currentReport.overview.healthScore,
                npsEstimate: currentReport.overview.npsEstimate,
                positiveCount: currentReport.overview.positiveCount,
                negativeCount: currentReport.overview.negativeCount,
                topActionAreas: currentReport.executiveSummary.top3ActionAreas.map((a) => ({
                  title: a.title,
                  priority: a.priority,
                  rootCause: a.rootCause,
                  recommendation: a.recommendation,
                })),
                topComplaints: currentReport.wordCloud.complaints.map((c) => `${c.text} (${c.count})`),
                topPraises: currentReport.wordCloud.praises.map((p) => `${p.text} (${p.count})`),
              }
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to contact Gemini.');
      }

      const data = await response.json();

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
        thinkingMode: data.thinkingMode,
      };

      setMessages((prev) => [...prev, modelMessage]);

      // Check if TrueForge Harness Pause State was triggered
      if (data.pauseRequired && data.pauseDetails) {
        setHarnessPause({
          active: true,
          orderId: data.pauseDetails.orderId,
          amount: data.pauseDetails.amount,
          pendingMessageId: modelMessage.id,
        });
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Error: ${err.message || 'Could not communicate with Gemini API. Ensure GEMINI_API_KEY is configured.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'system',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleHarnessAction = async (decision: 'approve' | 'reject') => {
    if (!harnessPause) return;

    const actionText =
      decision === 'approve'
        ? `[Human Administrator: APPROVED] Please proceed with refund for Order #${harnessPause.orderId} of ${harnessPause.amount}.`
        : `[Human Administrator: REJECTED] The automatic refund for Order #${harnessPause.orderId} was declined by supervisor. Route to manual review.`;

    setHarnessPause(null);
    await handleSendMessage(actionText);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `Conversation reset. Current mode: ${agentMode === 'analyst' ? 'CX Strategy Analyst' : 'Smart Support & Refund Agent'}. How can I assist?`,
        timestamp: 'Just now',
        modelUsed: modelPreference === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash',
      },
    ]);
    setHarnessPause(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-semibold text-slate-900">
                Gemini Copilot
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-200 text-slate-700">
                {thinkingEnabled ? 'Thinking High' : modelPreference.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {agentMode === 'analyst'
                ? 'Chief Customer Experience & Sentiment Analyst'
                : 'Smart E-Commerce Support & Refund Harness'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role & Model Controls Strip */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Role Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setAgentMode('analyst')}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              agentMode === 'analyst'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CX Analyst
          </button>
          <button
            type="button"
            onClick={() => setAgentMode('support_refund')}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              agentMode === 'support_refund'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Support & Refund Agent
          </button>
        </div>

        {/* High Thinking Toggle */}
        <button
          type="button"
          onClick={() => setThinkingEnabled(!thinkingEnabled)}
          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
            thinkingEnabled
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          title="Enable gemini-3.1-pro-preview with ThinkingLevel.HIGH for deep reasoning"
        >
          <Brain className={`w-3.5 h-3.5 ${thinkingEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Thinking Mode</span>
        </button>
      </div>

      {/* Quick Model Selector (Lite, Balanced, Pro) */}
      <div className="px-4 py-1.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" />
          Model:
        </span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              setModelPreference('fast');
              setThinkingEnabled(false);
            }}
            className={`hover:underline ${modelPreference === 'fast' && !thinkingEnabled ? 'font-bold text-slate-900' : 'text-slate-400'}`}
          >
            3.1-flash-lite
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setModelPreference('balanced');
              setThinkingEnabled(false);
            }}
            className={`hover:underline ${modelPreference === 'balanced' && !thinkingEnabled ? 'font-bold text-slate-900' : 'text-slate-400'}`}
          >
            3.5-flash
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setModelPreference('pro');
              setThinkingEnabled(true);
            }}
            className={`hover:underline ${modelPreference === 'pro' || thinkingEnabled ? 'font-bold text-emerald-700' : 'text-slate-400'}`}
          >
            3.1-pro (thinking)
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';

          return (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser ? 'bg-slate-900 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[85%] space-y-1`}>
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-100/90 text-slate-800 rounded-tl-xs border border-slate-200/60'
                  }`}
                >
                  {m.content}
                </div>

                <div className={`flex items-center space-x-2 text-[10px] text-slate-400 font-mono ${isUser ? 'justify-end' : ''}`}>
                  <span>{m.timestamp}</span>
                  {m.modelUsed && <span>• {m.modelUsed}</span>}
                  {m.thinkingMode && (
                    <span className="text-emerald-600 font-semibold">• High Thinking</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-100 p-3 rounded-xl rounded-tl-xs text-xs text-slate-500 flex items-center space-x-2 border border-slate-200/60">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>
                {thinkingEnabled
                  ? 'Reasoning deeply with gemini-3.1-pro-preview...'
                  : 'Analyzing with Gemini...'}
              </span>
            </div>
          </div>
        )}

        {/* TrueForge Harness Pause Card (Refund Approval Guard) */}
        {harnessPause && harnessPause.active && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 shadow-sm space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>TrueForge Operational Harness Pause State</span>
            </div>
            <p className="text-xs text-amber-800 leading-snug">
              An irreversible financial action has been staged: <strong>Full refund of {harnessPause.amount} for Order #{harnessPause.orderId}</strong>. Autonomous execution is paused. Human administrator authorization is required.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => handleHarnessAction('approve')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve Refund</span>
              </button>
              <button
                type="button"
                onClick={() => handleHarnessAction('reject')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Reject & Escalate</span>
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts pills */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5">
        {agentMode === 'analyst' ? (
          <>
            <button
              type="button"
              onClick={() => handleSendMessage('What caused the drop in sentiment during late November?')}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 transition-colors"
            >
              Why did late Nov sentiment drop?
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Draft an executive memo for the logistics director based on top 3 actionable areas.')}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 transition-colors"
            >
              Draft Executive Memo
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleSendMessage('Hi, my package #74821 never arrived! Registered email is tariq.al@example.com.')}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 transition-colors"
            >
              Test Lost Order #74821
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Where is my order #33910? Email is marcus.v@example.com.')}
              className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 transition-colors"
            >
              Check In-Transit #33910
            </button>
          </>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder={
            agentMode === 'analyst'
              ? 'Ask anything about reviews, trends, or root causes...'
              : 'Enter message or order ID inquiry...'
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSending}
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
