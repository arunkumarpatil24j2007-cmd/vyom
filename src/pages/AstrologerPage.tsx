import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send, RotateCcw, Sparkles, Compass,
  BookOpen, ShieldCheck, Loader2, ArrowRight, Info, AlertTriangle,
  MessageSquare, Copy, Check, Clock, ChevronRight
} from 'lucide-react';
import VisualAnswer from '@/components/vyom/VisualAnswer';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import BirthDetailsModal from '@/components/vyom/BirthDetailsModal';
import {
  getActiveProfile,
  subscribeToGuestStore,
  saveGeneratedReport,
  getSavedReports,
  type UserBirthDetails,
} from '@/lib/storage/guestStore';
import { runAstrologyWorkflow, describeBirthDetails } from '@/lib/astrology/orchestration/runAstrologyWorkflow';
import { calculateNatalChart } from '@/lib/astrology/calculations/chartEngine';
import type { ChartData, SavedReport } from '@/types';
import type { VisualAnswerResponse } from '@/types/visualAnswer';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  visualAnswer?: VisualAnswerResponse;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  'What career path aligns best with my 10th house and Lagna lord?',
  'How does my current Vimshottari Mahadasha influence my financial growth?',
  'Are there any Kuja or Sade Sati afflictions, and what are classical remedies?',
  'What are the strongest planetary yogas active in my birth chart?',
];

export default function AstrologerPage() {
  const [profile, setProfile] = useState<UserBirthDetails | null>(() => getActiveProfile());
  const [chart, setChart] = useState<ChartData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<string>('');
  const [birthModalOpen, setBirthModalOpen] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => getSavedReports());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Birth details the conversation's earlier answers were based on (to detect corrections)
  const [consultedDetails, setConsultedDetails] = useState<string | null>(null);
  const [consultedProfile, setConsultedProfile] = useState<UserBirthDetails | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function refreshData() {
      const current = getActiveProfile();
      setProfile(current);
      setSavedReports(getSavedReports());

      if (current) {
        try {
          const calc = calculateNatalChart({
            name: current.name,
            birthDate: current.birthDate,
            birthTime: current.birthTimePrecision === 'unknown' ? '' : current.birthTime,
            birthTimePrecision: current.birthTimePrecision,
            birthPlace: current.birthPlace,
            latitude: current.latitude,
            longitude: current.longitude,
            timezone: current.timezone,
          });
          setChart(calc);
        } catch (e) {
          console.error('Error pre-computing chart:', e);
        }
      } else {
        setChart(null);
      }
    }

    refreshData();
    const unsubscribe = subscribeToGuestStore(refreshData);
    return unsubscribe;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    if (!profile) {
      setBirthModalOpen(true);
      return;
    }

    setErrorNotice(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      setPipelineStatus('Aligning planetary longitudes with Lahiri Ayanamsha...');
      await new Promise((r) => setTimeout(r, 250));

      setPipelineStatus('Consulting sacred Jyotish treatises...');
      await new Promise((r) => setTimeout(r, 250));

      setPipelineStatus('Synthesizing astrological insights & remedies...');

      // Send the full text of earlier answers so follow-up questions keep their context
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.role === 'user'
          ? (m.content || '')
          : [
              m.visualAnswer?.summary || '',
              ...(m.visualAnswer?.blocks || [])
                .filter((b) => b.type === 'markdown')
                .map((b) => (b as { content: string }).content),
            ].filter(Boolean).join('\n\n'),
      }));

      const currentDetails = describeBirthDetails(profile);
      const result = await runAstrologyWorkflow({
        profile,
        question: text.trim(),
        conversationHistory: historyPayload,
        birthDetailsChanged: messages.length > 0 && consultedDetails && consultedDetails !== currentDetails
          ? { previous: consultedDetails, current: currentDetails, previousProfile: consultedProfile ?? undefined }
          : null,
      });
      setConsultedDetails(currentDetails);
      setConsultedProfile(profile);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        visualAnswer: result.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Automatically persist report in guestStore
      const savedReport: SavedReport = {
        id: `rep-${Date.now()}`,
        title: text.trim(),
        date: new Date().toISOString().split('T')[0],
        category: (result.answer.category as SavedReport['category']) || 'general',
        chartName: profile.name,
        summary: result.answer.summary,
        chartData: result.chart,
      };
      saveGeneratedReport(savedReport);
      setSavedReports(getSavedReports());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Astrology consultation error:', msg);
      if (msg.includes('status') || msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Server error')) {
        setErrorNotice('Consultation is momentarily experiencing high demand. Please try asking again shortly.');
      } else {
        setErrorNotice(msg);
      }
    } finally {
      setLoading(false);
      setPipelineStatus('');
    }
  };

  const handleReset = () => {
    setMessages([]);
    setConsultedDetails(null);
    setConsultedProfile(null);
    setErrorNotice(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* ═══ Header Banner ═══ */}
      <div className="card-navy p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#FF4B19]/20 text-[#FF9A20] border border-[#FF4B19]/30">
            <Sparkles size={13} className="text-[#FF4B19]" />
            <span>Vedic Astrological Wisdom • Classical Shastras</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Vedic Astrologer
          </h1>
          <p className="text-xs md:text-sm text-white/70 max-w-xl">
            {profile
              ? `Personalized consultation for ${profile.name} (${chart?.ascendant.rashiName || chart?.ascendant.sign || ''} Lagna, ${typeof chart?.moonSign === 'object' ? (chart.moonSign.rashiName || chart.moonSign.sign) : (chart?.moonSign || '')} Moon).`
              : 'Grounded astrological interpretations derived from your birth chart and classical Jyotish treatises.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={handleReset}
            className="btn-pill-navy-glass text-xs !py-2 !px-4 flex items-center gap-1.5 cursor-pointer"
            title="Start new consultation"
          >
            <RotateCcw size={14} />
            <span>New Session</span>
          </button>
          <button
            onClick={() => setBirthModalOpen(true)}
            className="btn-pill-orange text-xs !py-2 !px-4 flex items-center gap-1.5 cursor-pointer"
          >
            <Compass size={14} />
            <span>{profile ? 'Edit Profile' : 'Enter Details'}</span>
          </button>
        </div>
      </div>

      {/* ═══ Missing Birth Profile Notice ═══ */}
      {!profile && (
        <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center shrink-0">
              <Compass size={16} />
            </span>
            <div>
              <span className="font-bold text-[#09132E] block">Birth details required for chart calculation</span>
              <span className="text-[#7A8294]">Vyom never invents birth charts. Enter your details to begin your consultation.</span>
            </div>
          </div>
          <button
            onClick={() => setBirthModalOpen(true)}
            className="btn-pill-orange !py-2 !px-4 text-xs shrink-0 cursor-pointer"
          >
            Enter Birth Details
          </button>
        </div>
      )}

      {/* ═══ Main Two-Column Layout (Sidebar + Chat Area) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Session History & Prompts */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="card-cream p-5 rounded-[28px] border border-[#E8DCCB] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#09132E]">
                <MessageSquare size={15} className="text-[#FF4B19]" />
                <span>Recent Consultations</span>
              </div>
              <button
                onClick={handleReset}
                className="text-[11px] font-bold text-[#FF4B19] hover:underline cursor-pointer"
              >
                + New
              </button>
            </div>

            {savedReports.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {savedReports.slice(0, 5).map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => handleSend(rep.title)}
                    className="w-full text-left p-3 rounded-2xl bg-white border border-[#E8DCCB]/80 hover:border-[#FF4B19] hover:shadow-2xs transition-all text-xs group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold uppercase text-[#FF4B19] block mb-0.5">
                      {rep.category}
                    </span>
                    <h5 className="font-bold text-[#09132E] line-clamp-1 group-hover:text-[#FF4B19] transition-colors">
                      {rep.title}
                    </h5>
                    <span className="text-[10px] text-[#7A8294] block mt-1">{rep.date}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A8294] py-2">
                Your consultation reports will automatically save here as you ask questions.
              </p>
            )}

            <div className="pt-2 border-t border-[#E8DCCB]/60">
              <Link
                to="/reports"
                className="text-xs font-bold text-[#09132E] hover:text-[#FF4B19] flex items-center justify-between"
              >
                <span>View Full Reports Dossier</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Chat Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Conversation Thread */}
          <div className="space-y-6 min-h-[320px]">
            {/* Welcome / Empty State */}
            {messages.length === 0 && (
              <div className="card-cream p-6 md:p-8 rounded-[32px] border border-[#E8DCCB] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF4B19] uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Ask anything about your life path & chart</span>
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-[#09132E]">
                  What cosmic guidance do you seek today?
                </h3>
                <p className="text-xs md:text-sm text-[#4A5468] leading-relaxed max-w-2xl">
                  Select one of the inquiries below or compose your own. Vyom evaluates your exact sidereal planetary placements and cross-references them with Maharishi Parashara's classical shastras.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {DEFAULT_SUGGESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="p-3.5 rounded-2xl bg-white border border-[#E8DCCB] text-left text-xs font-medium text-[#09132E] hover:border-[#FF4B19] hover:bg-[#FFF8EF] transition-all group flex items-start justify-between gap-2 cursor-pointer shadow-xs"
                    >
                      <span>{q}</span>
                      <ArrowRight size={13} className="text-[#7A8294] group-hover:text-[#FF4B19] transition-transform group-hover:translate-x-0.5 shrink-0 mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2 animate-fade-in">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-2xl px-5 py-3.5 rounded-3xl bg-[#09132E] text-white text-xs md:text-sm font-medium shadow-md">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="w-full relative group">
                      {/* Copy Action button */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.visualAnswer?.summary || msg.content || '')}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 hover:bg-white border border-[#E8DCCB] text-[#7A8294] hover:text-[#09132E] transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xs z-10"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? <Check size={13} className="text-[#08745B]" /> : <Copy size={13} />}
                      </button>

                      {msg.visualAnswer ? (
                        <ErrorBoundary
                          fallbackTitle="Astrological Synthesis Notice"
                          onReset={() => handleReset()}
                        >
                          <VisualAnswer
                            answer={msg.visualAnswer}
                            activeChart={chart}
                            onSelectFollowUp={(q) => handleSend(q)}
                          />
                        </ErrorBoundary>
                      ) : (
                        <div className="p-4 rounded-3xl bg-white border border-[#E8DCCB] text-xs text-[#09132E]">
                          {msg.content}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Pipeline State */}
            {loading && (
              <div className="p-5 rounded-3xl bg-white/90 border border-[#E8DCCB] shadow-sm flex items-center gap-3 animate-pulse">
                <Loader2 size={18} className="animate-spin text-[#FF4B19]" />
                <div className="text-xs font-semibold text-[#09132E]">
                  <span>{pipelineStatus || 'Contemplating your chart and sacred shastras...'}</span>
                </div>
              </div>
            )}

            {/* Error Notice */}
            {errorNotice && (
              <div className="p-4 rounded-2xl bg-[#E32636]/10 border border-[#E32636]/30 flex items-center gap-3 text-xs text-[#E32636]">
                <AlertTriangle size={16} className="shrink-0" />
                <div className="flex-1">
                  <span className="font-bold block">Consultation Error:</span>
                  <span>{errorNotice}</span>
                </div>
                <button
                  onClick={() => handleSend()}
                  className="px-3 py-1 rounded-full bg-[#E32636] text-white font-bold text-[10px] cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ═══ Composer Input ═══ */}
          <div className="sticky bottom-4 z-20 pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2 rounded-full bg-[#FAF2E8]/95 border border-[#E8DCCB] shadow-xl backdrop-blur-xl flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  profile
                    ? `Ask Vyom about your chart (e.g. "What does my 10th house say about my career?")`
                    : 'Enter your birth details first to consult...'
                }
                disabled={loading}
                className="flex-1 px-5 py-2.5 bg-transparent text-xs md:text-sm text-[#09132E] placeholder:text-[#7A8294] focus:outline-hidden font-medium"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-full bg-[#FF4B19] text-white flex items-center justify-center hover:bg-[#E03A0F] disabled:opacity-50 disabled:hover:bg-[#FF4B19] transition-all cursor-pointer shadow-md shrink-0"
                aria-label="Send inquiry"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Birth Profile Modal */}
      <BirthDetailsModal
        isOpen={birthModalOpen}
        onClose={() => setBirthModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </div>
  );
}
