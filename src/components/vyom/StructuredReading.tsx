import type { ReactNode } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Scale,
  Info,
  CalendarRange,
  ChevronDown,
  HelpCircle,
  Compass,
} from 'lucide-react';
import type { ReadingFactorRole, StructuredReading } from '@/types/visualAnswer';

/**
 * Answer-first rendering of a consultation: Summary → what this means for you → what could happen →
 * what to keep in mind → expandable details. Sections render only when they have content, so a
 * simple question stays simple.
 */

const ROLE_STYLE: Record<ReadingFactorRole, { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }> = {
  supporting: { label: 'Supports', color: '#08745B', bg: 'rgba(8,116,91,0.07)', Icon: CheckCircle2 },
  challenging: { label: 'Challenge', color: '#A8432F', bg: 'rgba(168,67,47,0.07)', Icon: AlertTriangle },
  mitigating: { label: 'Softens a challenge', color: '#9A6A12', bg: 'rgba(154,106,18,0.08)', Icon: ShieldCheck },
  mixed: { label: 'Mixed', color: '#4A5468', bg: 'rgba(74,84,104,0.07)', Icon: Scale },
  information: { label: 'Context', color: '#4A5468', bg: 'rgba(74,84,104,0.06)', Icon: Info },
};

const CONFIDENCE_STYLE = {
  well_supported: { color: '#08745B', note: 'Several independent chart factors agree.' },
  tentative: { color: '#9A6A12', note: 'Indicators are mixed or some information is missing.' },
  not_assessable: { color: '#7A8294', note: 'The available chart data is not enough to judge this.' },
} as const;

function formatRange(start: string, end: string): string {
  const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function Emphasis({ text }: { text: string }) {
  // Renders **bold** spans only; everything else stays plain text (no HTML injection).
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? <strong key={i} className="font-bold text-[#09132E]">{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
      )}
    </>
  );
}

export default function StructuredReadingView({
  reading,
  renderMarkdown,
  sources,
}: {
  reading: StructuredReading;
  renderMarkdown: (markdown: string) => ReactNode;
  sources?: ReactNode;
}) {
  const conf = reading.confidence ? CONFIDENCE_STYLE[reading.confidence] : null;
  const hasFactors = reading.supportingFactors.length + reading.challengingFactors.length + reading.mitigatingFactors.length > 0;
  const prediction = reading.prediction;

  return (
    <div className="space-y-5">
      {/* ── Component A: Summary (plain language, no astrological terms) ── */}
      <section aria-label="Summary" className="p-5 rounded-2xl bg-[#FFF8EF] border border-[#F2E5D5] space-y-2.5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#7A8294] uppercase tracking-wider">
          <span className="text-[#FF4B19] font-extrabold">Summary</span>
          {reading.domainLabel && <span>· {reading.domainLabel}</span>}
          {conf && (
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal font-semibold" style={{ color: conf.color }} title={conf.note}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: conf.color }} />
              {reading.confidenceLabel}
            </span>
          )}
        </div>
        <h3 className="text-lg md:text-xl font-extrabold text-[#09132E] leading-snug" style={{ fontFamily: 'var(--font-heading)' }}>
          {reading.directAnswer.heading}
        </h3>
        <p className="text-sm md:text-[15px] leading-relaxed text-[#2D3748]">
          <Emphasis text={reading.directAnswer.text} />
        </p>
        {reading.mainTakeaway && (
          <p className="text-sm font-bold text-[#09132E] border-l-2 border-[#FF4B19] pl-3">{reading.mainTakeaway}</p>
        )}
      </section>

      {/* ── What would improve this reading ── */}
      {reading.missingInformation.length > 0 && (
        <div className="flex gap-2.5 p-3.5 rounded-2xl bg-white border border-[#E8DCCB] text-xs text-[#4A5468]">
          <HelpCircle size={15} className="text-[#9A6A12] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#09132E] mb-0.5">This reading is preliminary</p>
            <ul className="space-y-0.5">
              {reading.missingInformation.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* ── Component B: key findings ── */}
      {reading.keyFindings.length > 0 && (
        <section aria-label="What this means for you" className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A8294]">What this means for you</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reading.keyFindings.map((f, i) => {
              const style = ROLE_STYLE[f.role] || ROLE_STYLE.information;
              const Icon = style.Icon;
              return (
                <article key={i} className="p-4 rounded-2xl bg-white border border-[#E8DCCB] border-l-[3px] space-y-1.5" style={{ borderLeftColor: style.color }}>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: style.color }}>
                    <Icon size={13} aria-hidden />
                    <span>{style.label}</span>
                  </div>
                  <h5 className="text-sm font-bold text-[#09132E] leading-snug">{f.title}</h5>
                  <p className="text-[13px] leading-relaxed text-[#2D3748]"><Emphasis text={f.explanation} /></p>
                  {f.inDailyLife && <p className="text-[13px] leading-relaxed text-[#2D3748]"><span className="font-semibold">In everyday life: </span>{f.inDailyLife}</p>}
                  {f.relevance && <p className="text-xs text-[#4A5468]"><span className="font-semibold">Why it matters: </span>{f.relevance}</p>}
                  {f.qualification && <p className="text-xs text-[#7A8294] italic">{f.qualification}</p>}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Component C: outlook & timeline ── */}
      {prediction && (
        <section aria-label="What could happen" className="p-4 md:p-5 rounded-2xl bg-white border border-[#E8DCCB] space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-extrabold text-[#09132E]">
            <Compass size={15} className="text-[#FF4B19]" aria-hidden /> What could happen
          </h4>
          <dl className="grid gap-2.5 text-[13px] leading-relaxed text-[#2D3748]">
            <div><dt className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294]">What may develop</dt><dd><Emphasis text={prediction.what} /></dd></div>
            {prediction.why && <div><dt className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294]">Why this appears in your chart</dt><dd>{prediction.why}</dd></div>}
            {prediction.influences && <div><dt className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294]">What could influence it</dt><dd>{prediction.influences}</dd></div>}
            {prediction.meaning && <div><dt className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294]">What this means for you</dt><dd>{prediction.meaning}</dd></div>}
          </dl>
          {prediction.timing.length > 0 ? (
            <div className="pt-1">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7A8294] mb-2">
                <CalendarRange size={13} aria-hidden /> Periods when this theme is emphasised
              </p>
              <ol className="relative border-l border-[#E8DCCB] ml-1.5 space-y-3">
                {prediction.timing.map((t, i) => (
                  <li key={i} className="pl-4 relative">
                    <span className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${t.isCurrent ? 'bg-[#FF4B19] border-[#FF4B19]' : 'bg-white border-[#C9B79E]'}`} aria-hidden />
                    <p className="text-[13px] font-bold text-[#09132E]">
                      {formatRange(t.start, t.end)}
                      {t.isCurrent && <span className="ml-2 text-[11px] font-semibold text-[#FF4B19]">Now</span>}
                      {t.strength === 'stronger' && <span className="ml-2 text-[11px] font-semibold text-[#4A5468]">Stronger emphasis</span>}
                    </p>
                    <p className="text-xs text-[#4A5468]">{t.theme}</p>
                    <p className="text-[11px] text-[#7A8294]">{t.period} · {t.why.join('; ')}</p>
                  </li>
                ))}
              </ol>
              <p className="text-[11px] text-[#7A8294] mt-2">{prediction.timing[0].limitations[0]}</p>
            </div>
          ) : (
            <p className="text-xs text-[#7A8294]">{prediction.timingNote}</p>
          )}
        </section>
      )}

      {/* ── Component D: supporting vs challenging ── */}
      {hasFactors && (
        <section aria-label="What to keep in mind" className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A8294]">What to keep in mind</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FactorList title="What supports it" items={reading.supportingFactors.map((f) => f.plain)} role="supporting" />
            <div className="space-y-3">
              <FactorList title="What complicates it" items={reading.challengingFactors.map((f) => f.plain)} role="challenging" />
              {reading.mitigatingFactors.length > 0 && <FactorList title="What softens the challenges" items={reading.mitigatingFactors.map((f) => f.plain)} role="mitigating" />}
            </div>
          </div>
        </section>
      )}

      {/* ── Component E: technical evidence ── */}
      <details className="group rounded-2xl border border-[#E8DCCB] bg-white">
        <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none text-sm font-bold text-[#09132E]">
          <span>Explore the details <span className="font-normal text-[#7A8294]">— why this interpretation?</span></span>
          <ChevronDown size={16} className="text-[#7A8294] transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="px-4 pb-4 space-y-4 border-t border-[#E8DCCB]/70 pt-3">
          {reading.technicalEvidence && renderMarkdown(reading.technicalEvidence)}
          {hasFactors && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294]">Factors evaluated</p>
              <ul className="space-y-1 text-xs text-[#2D3748]">
                {[...reading.supportingFactors.map((f) => ['supporting', f.technical]), ...reading.challengingFactors.map((f) => ['challenging', f.technical]), ...reading.mitigatingFactors.map((f) => ['mitigating', f.technical])].map(([role, t], i) => (
                  <li key={i} className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: ROLE_STYLE[role as ReadingFactorRole].color }} />{t}</li>
                ))}
              </ul>
            </div>
          )}
          {reading.confidence && reading.confidenceReasons.length > 0 && (
            <div className="text-xs text-[#4A5468]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294] mb-1">About the confidence level</p>
              <p>{reading.confidenceReasons.join(' ')} Confidence describes how consistent the astrological evidence is, not a probability that an event will occur.</p>
            </div>
          )}
          {reading.uncertainties.length > 0 && (
            <div className="text-xs text-[#4A5468]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A8294] mb-1">Limitations</p>
              <ul className="list-disc pl-4 space-y-0.5">{reading.uncertainties.map((u, i) => <li key={i}>{u}</li>)}</ul>
            </div>
          )}
          {sources}
          {reading.calculationNotes.length > 0 && (
            <p className="text-[11px] text-[#7A8294]">{reading.calculationNotes.join(' · ')}</p>
          )}
        </div>
      </details>
    </div>
  );
}

function FactorList({ title, items, role }: { title: string; items: string[]; role: ReadingFactorRole }) {
  if (!items.length) return null;
  const style = ROLE_STYLE[role];
  return (
    <div className="p-4 rounded-2xl border border-[#E8DCCB]" style={{ background: style.bg }}>
      <p className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: style.color }}>
        <style.Icon size={13} aria-hidden /> {title}
      </p>
      <ul className="space-y-1.5 text-[13px] leading-relaxed text-[#2D3748]">
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
