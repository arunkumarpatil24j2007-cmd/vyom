import React, { useState } from 'react';
import type { VisualAnswerResponse, VisualAnswerBlock } from '@/types/visualAnswer';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Compass,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Info,
  Maximize2
} from 'lucide-react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import StructuredReadingView from '@/components/vyom/StructuredReading';
import type { ChartData } from '@/types';

interface VisualAnswerProps {
  answer: VisualAnswerResponse;
  activeChart?: ChartData | null;
  onSelectFollowUp?: (question: string) => void;
  className?: string;
}

export default function VisualAnswer({
  answer,
  activeChart,
  onSelectFollowUp,
  className = '',
}: VisualAnswerProps) {
  const [copied, setCopied] = useState(false);

  const summary = answer?.summary || (answer as any)?.answer || '';
  const category = answer?.category || 'general';

  let blocks: VisualAnswerBlock[] = Array.isArray(answer?.blocks) && answer.blocks.length > 0
    ? answer.blocks
    : [
        {
          type: 'markdown' as const,
          content:
            (answer as any)?.content ||
            (answer as any)?.answer ||
            (answer as any)?.response ||
            summary ||
            'Astrological consultation synthesized from classical Shastras.',
        },
      ];

  const followUpQuestions = Array.isArray(answer?.followUpQuestions)
    ? answer.followUpQuestions
    : [];

  const disclaimer = answer?.disclaimer;
  const reading = answer?.reading;
  // Internal consistency signature carried in conversation history; never shown to users
  const stripSignature = (t: string) => t.replace(/\n*\[analysis: [^\]]*\]\s*$/, '');

  const handleCopy = () => {
    const fullText = [
      summary,
      '',
      ...blocks.map((b) => {
        if (!b) return '';
        if (typeof b === 'string') return b;
        if (b.type === 'markdown') return stripSignature(b.content || '');
        if (b.type === 'metric') return `${b.label}: ${b.value} (${b.explanation || ''})`;
        if (b.type === 'timeline') {
          const events = Array.isArray(b.events) ? b.events : [];
          return (
            `${b.title || 'Timeline'}:\n` +
            events.map((e) => `- ${e?.date || ''} ${e?.label || ''}: ${e?.description || ''}`).join('\n')
          );
        }
        if (b.type === 'source') return `Source: ${b.title || ''} by ${b.author || ''} - ${b.excerpt || ''}`;
        return (b as any).content || (b as any).text || '';
      }),
    ].join('\n\n');

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-4 rounded-3xl bg-white/80 border border-[#E8DCCB] p-5 md:p-6 shadow-sm backdrop-blur-md ${className}`}>
      {/* ── Summary & Category Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DCCB]/60">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center">
            <Sparkles size={14} />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A8294]">
            {category ? `${category} Consultation` : 'Astrological Synthesis'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2E8] border border-[#E8DCCB] text-[11px] font-semibold text-[#4A5468] hover:text-[#09132E] hover:bg-[#EDE3D4] transition-all self-start sm:self-auto"
          aria-label="Copy consultation"
        >
          {copied ? <Check size={12} className="text-[#08745B]" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* ── Answer-first structured reading ── */}
      {reading && (
        <StructuredReadingView
          reading={reading}
          renderMarkdown={(md) => <MarkdownBlock content={md} />}
          sources={blocks.some((b) => b?.type === 'source') ? (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294]">Classical sources</p>
              {blocks.filter((b) => b?.type === 'source').map((b, i) => <BlockRenderer key={i} block={b} activeChart={activeChart} />)}
            </div>
          ) : undefined}
        />
      )}

      {/* ── Executive Summary ── */}
      {!reading && summary && (
        <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#F2E5D5] text-sm md:text-[15px] font-medium leading-relaxed text-[#09132E]">
          {summary}
        </div>
      )}

      {/* ── Visual Answer Blocks ── */}
      {!reading && <div className="space-y-4">
        {blocks.map((block, idx) => (
          <BlockRenderer key={idx} block={block} activeChart={activeChart} />
        ))}
      </div>}

      {/* ── Interactive Follow-up Questions ── */}
      {followUpQuestions.length > 0 && (
        <div className="pt-3 border-t border-[#E8DCCB]/60 space-y-2">
          <p className="text-xs font-bold text-[#7A8294] uppercase tracking-wider">Ask next</p>
          <div className="flex flex-wrap gap-2">
            {followUpQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSelectFollowUp?.(q)}
                className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF2E8] hover:bg-[#EDE3D4] border border-[#E8DCCB] text-xs font-medium text-[#09132E] transition-all text-left"
              >
                <span>{q}</span>
                <ArrowRight size={12} className="text-[#7A8294] transition-transform group-hover:translate-x-0.5 group-hover:text-[#FF4B19]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Subtle Ephemeris Disclaimer ── */}
      {disclaimer && (
        <div className="text-[10px] text-[#7A8294] flex items-center gap-1.5 pt-1">
          <Info size={11} />
          <span>{disclaimer}</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Block Renderer Dispatcher
// ─────────────────────────────────────────────────────────────
function BlockRenderer({
  block,
  activeChart,
}: {
  block: any;
  activeChart?: ChartData | null;
}) {
  if (!block) return null;

  if (typeof block === 'string') {
    return <MarkdownBlock content={block} />;
  }

  switch (block.type) {
    case 'markdown':
      return <MarkdownBlock content={block.content || ''} />;

    case 'metric':
      return (
        <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294]">{block.label || 'Indicator'}</span>
            <div className="text-lg md:text-xl font-extrabold text-[#09132E] mt-0.5">{block.value ?? '—'}</div>
            {block.explanation && (
              <p className="text-xs text-[#4A5468] mt-1">{block.explanation}</p>
            )}
          </div>
          {block.trend && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                block.trend === 'positive'
                  ? 'bg-[#08745B]/10 text-[#08745B]'
                  : block.trend === 'negative'
                  ? 'bg-[#E32636]/10 text-[#E32636]'
                  : 'bg-[#FAF2E8] text-[#4A5468]'
              }`}
            >
              {block.trend === 'positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{String(block.trend).toUpperCase()}</span>
            </div>
          )}
        </div>
      );

    case 'timeline': {
      const events: any[] = Array.isArray(block.events) ? block.events : [];
      return (
        <div className="p-4 rounded-2xl bg-[#FFFBF5] border border-[#E8DCCB] space-y-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#FF4B19]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#09132E]">{block.title || 'Timeline Sequence'}</h4>
          </div>
          {events.length > 0 ? (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-[#E8DCCB]">
              {events.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 relative pl-6">
                  <div
                    className={`absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full -translate-x-1/2 border-2 border-white ${
                      ev?.status === 'current'
                        ? 'bg-[#FF4B19] ring-4 ring-[#FF4B19]/20'
                        : ev?.status === 'future'
                        ? 'bg-[#F7A928]'
                        : 'bg-[#B0B8C7]'
                    }`}
                  />
                  <div className="flex-1 bg-white p-3 rounded-xl border border-[#E8DCCB]/80 shadow-xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#09132E]">{ev?.label || `Stage ${i + 1}`}</span>
                      {ev?.date && <span className="text-[11px] font-semibold text-[#FF4B19]">{ev.date}</span>}
                    </div>
                    {ev?.description && <p className="text-xs text-[#4A5468] mt-1">{ev.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7A8294]">Sequence details mapped in consultation notes.</p>
          )}
        </div>
      );
    }

    case 'table': {
      const columns: string[] = Array.isArray(block.columns) ? block.columns : [];
      const rows: any[] = Array.isArray(block.rows) ? block.rows : [];
      return (
        <div className="rounded-2xl border border-[#E8DCCB] overflow-hidden bg-white shadow-xs">
          {block.title && (
            <div className="px-4 py-2.5 bg-[#FAF2E8] border-b border-[#E8DCCB] text-xs font-bold text-[#09132E]">
              {block.title}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF2E8]/60 text-[#7A8294] font-semibold border-b border-[#E8DCCB]/60">
                <tr>
                  {columns.map((col, i) => (
                    <th key={i} className="px-3 py-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCCB]/40">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#FFF8EF]/50 transition-colors">
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-[#09132E]">
                        {String(row?.[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    case 'astrology_chart':
      if (activeChart) {
        return (
          <div className="p-4 rounded-2xl bg-[#FFFBF5] border border-[#E8DCCB] flex flex-col items-center">
            {block.title && (
              <span className="text-xs font-bold uppercase tracking-wider text-[#09132E] mb-2">{block.title}</span>
            )}
            <div className="w-64 h-64">
              <NorthIndianChart chart={activeChart} size={256} className="w-full h-full" />
            </div>
            {block.notes && <p className="text-xs text-[#7A8294] mt-2 text-center">{block.notes}</p>}
          </div>
        );
      }
      return null;

    case 'source':
      return (
        <div className="p-4 rounded-2xl bg-[#FAF2E8]/80 border border-[#E8DCCB] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-[#08745B]" />
              <span className="text-xs font-bold text-[#09132E]">{block.title || 'Classical Treatise'}</span>
              {block.author && <span className="text-[11px] text-[#7A8294]">by {block.author}</span>}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#08745B] bg-[#08745B]/10 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} />
              <span>Verified Shastra</span>
            </div>
          </div>
          {block.chapter && (
            <p className="text-[11px] text-[#7A8294] font-medium">{block.chapter} {block.shloka ? `• ${block.shloka}` : ''}</p>
          )}
          {block.excerpt && (
            <blockquote className="text-xs italic text-[#2D3748] border-l-2 border-[#08745B] pl-3 py-0.5">
              "{block.excerpt}"
            </blockquote>
          )}
          {block.relevance && (
            <p className="text-[11px] text-[#4A5468] pt-1">
              <span className="font-semibold text-[#09132E]">Context:</span> {block.relevance}
            </p>
          )}
        </div>
      );

    case 'illustration':
      return (
        <div className="p-3 rounded-2xl bg-white border border-[#E8DCCB] flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#FAF2E8] border border-[#E8DCCB] flex items-center justify-center text-[#FF4B19]">
            <Compass size={24} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#09132E]">{block.alt || 'Jyotish Visualization'}</h5>
            {block.caption && <p className="text-xs text-[#7A8294] mt-0.5">{block.caption}</p>}
          </div>
        </div>
      );

    default: {
      // Fallback for custom or unrecognized block types (e.g. general_guidance, advice, etc.)
      const rawText =
        (block as any).content ||
        (block as any).text ||
        (block as any).description ||
        (block as any).explanation ||
        (typeof block === 'object' ? JSON.stringify(block) : String(block));

      if (rawText) {
        return (
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs">
            {block.type && typeof block.type === 'string' && block.type !== 'default' && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4B19] block mb-1">
                {block.type.replace(/_/g, ' ')}
              </span>
            )}
            <MarkdownBlock content={String(rawText)} />
          </div>
        );
      }
      return null;
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Safe Markdown Formatter without raw innerHTML
// ─────────────────────────────────────────────────────────────
function MarkdownBlock({ content }: { content: string }) {
  const contentStr = typeof content === 'string' ? content : String(content || '');
  const sections = contentStr.split(/\n\s*\n/);

  return (
    <div className="space-y-3 text-xs md:text-sm text-[#2D3748] leading-relaxed">
      {sections.map((section, secIdx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={secIdx} className="text-sm font-bold text-[#09132E] pt-1">
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={secIdx} className="text-[15px] font-extrabold text-[#09132E] pt-1">
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          );
        }

        // Check if section contains list items (lines starting with - , *, or 1. )
        const lines = trimmed.split('\n');
        const hasListItems = lines.some((l) => /^\s*[-*•]\s+/.test(l) || /^\s*\d+\.\s+/.test(l));

        if (hasListItems) {
          return (
            <div key={secIdx} className="space-y-1.5">
              {lines.map((line, lineIdx) => {
                const lineTrimmed = line.trim();
                if (!lineTrimmed) return null;

                if (/^\s*[-*•]\s+/.test(lineTrimmed)) {
                  const text = lineTrimmed.replace(/^\s*[-*•]\s+/, '');
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 pl-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B19] mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <FormattedInlineText text={text} />
                      </div>
                    </div>
                  );
                }

                if (/^\s*\d+\.\s+/.test(lineTrimmed)) {
                  const match = lineTrimmed.match(/^\s*(\d+)\.\s+(.*)/);
                  const num = match ? match[1] : `${lineIdx + 1}`;
                  const text = match ? match[2] : lineTrimmed;
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 pl-2">
                      <span className="text-[11px] font-bold text-[#FF4B19] mt-0.5 min-w-[16px]">
                        {num}.
                      </span>
                      <div className="flex-1">
                        <FormattedInlineText text={text} />
                      </div>
                    </div>
                  );
                }

                return (
                  <p key={lineIdx} className="font-medium text-[#09132E]">
                    <FormattedInlineText text={lineTrimmed} />
                  </p>
                );
              })}
            </div>
          );
        }

        // Handle inline dash-separated bullet lists like "Intro text - **Point 1**: desc - **Point 2**: desc"
        if (trimmed.includes(' - **')) {
          const [intro, ...items] = trimmed.split(/\s+-\s+\*\*/);
          return (
            <div key={secIdx} className="space-y-1.5">
              {intro && (
                <p>
                  <FormattedInlineText text={intro} />
                </p>
              )}
              {items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-2 pl-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B19] mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <FormattedInlineText text={`**${item}`} />
                  </div>
                </div>
              ))}
            </div>
          );
        }

        return (
          <p key={secIdx}>
            <FormattedInlineText text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

function FormattedInlineText({ text }: { text: string }) {
  // Support simple bold **text** parsing safely
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-bold text-[#09132E]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}
