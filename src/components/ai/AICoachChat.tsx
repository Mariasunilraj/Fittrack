import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Bot,
  User,
  Zap,
  HelpCircle,
  Key,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storage';

export const AICoachChat: React.FC = () => {
  const { profile, aiChatHistory, isAiThinking, sendAiMessage, clearAiChat, setCurrentView } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasApiKey = Boolean(storageService.getGeminiApiKey());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatHistory, isAiThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiThinking) return;
    const text = inputText;
    setInputText('');
    await sendAiMessage(text);
  };

  const samplePrompts = [
    'How do I build up to my first strict Pull-Up?',
    'How to hit 100g daily protein on an Indian vegetarian diet?',
    'What are the key safety cues for Taekwondo turning kicks (Dollyo Chagi)?',
    'Generate a 45-minute gym session for legs and core.'
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">FitTrack AI Coach</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Gemini AI • Vault Shield Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized for {profile.displayName} ({profile.ageBand} • {profile.experienceLevel} • {profile.foodPreference})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('settings')}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-brand-hover text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Inspect Protected API Vault"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline text-xs">Security Vault</span>
          </button>
          <button
            onClick={clearAiChat}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-brand-hover transition cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {aiChatHistory.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 text-sm ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-brand-yellow text-slate-950 font-medium rounded-tr-none'
                  : 'bg-brand-surface border border-brand-border text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              <div className="text-xs leading-relaxed whitespace-pre-line">
                {msg.content}
              </div>
              <div
                className={`text-[10px] mt-1.5 text-right font-mono ${
                  msg.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-brand-card border border-brand-border text-brand-yellow flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                {profile.displayName.charAt(0)}
              </div>
            )}
          </div>
        ))}

        {isAiThinking && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-xl bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-3.5 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-yellow animate-ping" />
              <span>FitTrack AI Coach is analyzing your training profile...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starters */}
      {aiChatHistory.length <= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-shrink-0">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendAiMessage(prompt)}
              className="p-2.5 rounded-xl bg-brand-card/90 hover:bg-brand-hover border border-brand-border text-left text-xs text-slate-300 hover:text-white transition flex items-center justify-between cursor-pointer group"
            >
              <span className="truncate pr-2">{prompt}</span>
              <ChevronRight className="w-3.5 h-3.5 text-brand-yellow group-hover:translate-x-1 transition flex-shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="flex-shrink-0 space-y-2">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask about workouts, Indian food macros, Taekwondo kicks, or recovery..."
            disabled={isAiThinking}
            className="w-full pl-4 pr-24 py-3.5 bg-brand-surface border border-brand-border rounded-2xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-yellow shadow-lg disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAiThinking}
            className="absolute right-2 py-2 px-4 bg-brand-yellow hover:bg-brand-yellowDark disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-brand-yellow/15"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>FitTrack AI is an educational assistant, not clinical advice.</span>
          </span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
