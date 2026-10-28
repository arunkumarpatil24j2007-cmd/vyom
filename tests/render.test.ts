/**
 * Renders the real VisualAnswer component (through Vite's SSR module loader, so JSX, aliases and
 * Tailwind resolve exactly as in the app) and checks the answer-first layout.
 */
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type ViteDevServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import type { VisualAnswerResponse } from '../src/types/visualAnswer.ts';

let vite: ViteDevServer;
let VisualAnswer: (props: Record<string, unknown>) => unknown;

before(async () => {
  vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
  VisualAnswer = (await vite.ssrLoadModule('/src/components/vyom/VisualAnswer.tsx')).default;
});
after(async () => vite?.close());

const render = (answer: VisualAnswerResponse) => renderToString(createElement(VisualAnswer as never, { answer, onSelectFollowUp: () => {} }));
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');

const structured: VisualAnswerResponse = {
  summary: 'Relationships grow through patience.',
  category: 'relationship',
  blocks: [
    { type: 'markdown', content: '## Partnership grows with patience\n\nRelationships grow through patience.\n\n[analysis: marriage|mixed|tentative|w-1|f-1:challenging]' },
    { type: 'source', title: "Mantreswara's Phaladeepika", chapter: 'ADHYAYA VII · pp. 120–121', excerpt: 'A debilitated planet…' },
  ],
  followUpQuestions: ['What does my chart suggest about marriage timing?'],
  disclaimer: 'Traditional astrological interpretation for reflection.',
  reading: {
    directAnswer: { heading: 'Partnership grows with patience', text: 'Your chart suggests a **two-sided picture**: real care is needed, and real support is present.' },
    mainTakeaway: 'Patience and clear communication are the keys.',
    confidence: 'tentative', confidenceLabel: 'Tentative reading', confidenceReasons: ['Supporting and challenging indicators are closely balanced.'],
    domainLabel: 'Relationships & marriage',
    keyFindings: [
      { title: 'Partnership needs conscious effort', explanation: 'The planet linked with marriage is traditionally weak here.', inDailyLife: 'Talking through different expectations before they turn into arguments.', role: 'challenging', evidence: ['7th lord Mars debilitated'] },
      { title: 'A protective influence', explanation: 'A gentle planet sits in your partnership area.', role: 'supporting', evidence: ['Jupiter in the 7th'] },
    ],
    prediction: {
      what: 'Relationship themes become more active.', timing: [
        { start: '2028-07-21', end: '2029-05-22', period: 'Moon Mahadasha – Moon Antardasha', theme: 'Partnership themes are emphasised.', strength: 'stronger', why: ['Moon is connected'], limitations: ['Shows emphasis, not a certain event.'], isCurrent: false },
      ], timingNote: 'Based on planetary periods.',
    },
    supportingFactors: [{ plain: 'Jupiter protects the area.', technical: 'Jupiter occupies the 7th house (Scorpio)' }],
    challengingFactors: [{ plain: 'Mars is weak.', technical: '7th lord Mars in Cancer, Debilitated' }],
    mitigatingFactors: [{ plain: 'The weakness is partly offset.', technical: 'Neechabhanga — mitigated' }],
    technicalEvidence: '### Placements\n\n- Mars in Cancer (3rd house), debilitated',
    calculationNotes: ['Vedic Parashari · Sidereal · Lahiri · Whole Sign'],
    uncertainties: ['Upapada Lagna was not calculated.'],
    missingInformation: [],
  },
};

test('Structured reading renders answer-first with progressive disclosure', () => {
  const html = render(structured);
  const t = text(html);
  const pos = (s: string) => t.indexOf(s);
  const order = ['Summary', 'Partnership grows with patience', 'What this means for you', 'In everyday life:', 'What could happen', 'What to keep in mind', 'Explore the details'];
  for (const s of [...order, 'What supports it', 'What complicates it', 'What softens the challenges', 'Classical sources']) {
    assert.ok(pos(s) >= 0, `missing section: ${s}`);
  }
  order.slice(1).forEach((s, i) => assert.ok(pos(order[i]) < pos(s), `${order[i]} comes before ${s}`));
  assert.match(html, /<details/, 'technical evidence is collapsible');
  assert.match(html, /<strong[^>]*>two-sided picture<\/strong>/, 'key phrase emphasised');
  assert.match(t, /Jul 2028 – May 2029/);
  assert.ok(!t.includes('[analysis:'), 'internal signature never shown');
  assert.ok(!/\{"|"direct_answer"|factor_ids/.test(t), 'no raw JSON');
});

test('A simple answer renders without empty sections', () => {
  const simple: VisualAnswerResponse = {
    ...structured,
    blocks: [{ type: 'markdown', content: 'x' }],
    reading: { ...structured.reading!, keyFindings: [], prediction: null, supportingFactors: [], challengingFactors: [], mitigatingFactors: [], confidence: null, confidenceLabel: '' },
  };
  const t = text(render(simple));
  assert.ok(t.includes('Partnership grows with patience'));
  assert.ok(t.includes('Summary'), 'the Summary label is always shown');
  for (const s of ['What this means for you', 'What could happen', 'What to keep in mind', 'Tentative reading']) assert.ok(!t.includes(s), `unexpected section: ${s}`);
});

test('Legacy answers (saved before this change) still render', () => {
  const t = text(render({ summary: 'Old summary', category: 'general', blocks: [{ type: 'markdown', content: '### Old heading\n\nOld body' }] }));
  assert.ok(t.includes('Old summary') && t.includes('Old heading'));
});
