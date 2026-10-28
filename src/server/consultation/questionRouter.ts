/**
 * Question Router (DOCUMENT_07 §4, "Layer H"): classifies a user question into the canonical question
 * categories and the DOCUMENT_05 life domains, and flags high-risk requests that require the
 * DOCUMENT_10 §3.2 guardrails before any astrological interpretation.
 */

export type DomainId =
  | 'personality' | 'education' | 'career' | 'wealth' | 'marriage' | 'family_children'
  | 'health' | 'relocation' | 'spirituality' | 'transitions';

export type QuestionCategory =
  | 'Q01_full_overview' | 'Q02_lagna' | 'Q03_moon_nakshatra' | 'Q04_strengths' | 'Q05_career_fields'
  | 'Q06_dasha_meaning' | 'Q07_year_ahead' | 'Q08_transit' | 'Q09_marriage' | 'Q10_cross_tradition'
  | 'Q11_app_disagreement' | 'Q12_no_birth_time' | 'Q13_calculated_vs_interpreted' | 'Q14_high_risk'
  | 'concept_explanation' | 'dosha_remedy' | 'compatibility' | 'occult_esoteric' | 'numerology_palmistry'
  | 'source_request' | 'general_chart_question';

export type RiskFlag = 'medical' | 'death_longevity' | 'financial_speculation' | 'legal' | 'curse_black_magic' | 'fertility_pregnancy' | 'self_harm' | 'third_party_fidelity';

export interface RoutedQuestion {
  categories: QuestionCategory[];
  domains: DomainId[];
  risks: RiskFlag[];
  wantsExactDate: boolean;
  wantsCertainty: boolean;
  isPersonal: boolean;
  isFollowUp: boolean;
  requestedTradition: 'vedic' | 'western' | 'hellenistic' | 'kp' | 'jaimini' | 'bazi' | 'zwds' | null;
  mentionsBirthDataCorrection: boolean;
  needsPartnerChart: boolean;
}

const has = (q: string, re: RegExp) => re.test(q);

const DOMAIN_PATTERNS: Array<[DomainId, RegExp]> = [
  ['personality', /\b(personality|temperament|nature|character|who am i|strengths? and weakness|behaviou?r|mindset|self)\b/],
  ['education', /\b(educat\w*|stud(y|ies|ying)|exam|degree|college|universit\w*|learning|school|phd|masters)\b/],
  ['career', /\b(career|job|work|profession\w*|promotion|business|vocation|employ\w*|office|boss|10th house|tenth house|dashamsha|d10)\b/],
  ['wealth', /\b(money|wealth|financ\w*|income|savings?|rich|debt|loans?|property|invest\w*|dhana|gains?|11th house|2nd house)\b/],
  ['marriage', /\b(marriage|marry|married|spouse|wife|husband|partner|relationship|love|romance|divorce|wedding|7th house|seventh house|navamsha|d9|upapada|manglik|mangal dosha|kuja)\b/],
  ['family_children', /\b(child(ren)?|kids?|son|daughter|progeny|pregnan\w*|conceive|fertility|mother|father|parents?|siblings?|brother|sister|family|5th house)\b/],
  ['health', /\b(health|illness|disease|sick|surgery|hospital|medic\w*|symptom|pain|cancer|heart|diabet\w*|mental health|depress\w*|anxiety|longevity|maraka|ayur)\b/],
  ['relocation', /\b(abroad|foreign|relocat\w*|settle|visa|immigra\w*|travel|move to|migrat\w*|12th house)\b/],
  ['spirituality', /\b(spiritual\w*|moksha|meditat\w*|dharma|god|guru|karma|enlighten\w*|religio\w*|mantra|ketu|past life)\b/],
  ['transitions', /\b(sade ?sati|saturn return|turning point|transition|change in life|upheaval|dasha change|big change)\b/],
];

export function routeQuestion(question: string, history: Array<{ role: string; content: string }> = []): RoutedQuestion {
  const q = question.toLowerCase();
  const categories = new Set<QuestionCategory>();
  const domains = new Set<DomainId>();
  const risks = new Set<RiskFlag>();

  for (const [domain, re] of DOMAIN_PATTERNS) if (has(q, re)) domains.add(domain);

  // ─── High-risk detection (Q14; DOCUMENT_10 §3.2) ───
  if (has(q, /\b(chest pain|symptom|diagnos\w*|cancer|tumou?r|icu|hospitali[sz]ed|medication|medicine|treatment|surgery|blood pressure|insulin|chemo\w*|disease|illness|stop (taking|my) (meds|medicine|medication))\b/)) risks.add('medical');
  if (has(q, /\b(when will i die|when will (he|she|they|my \w+) die|death|die\b|dying|lifespan|how long will (i|he|she|they) live|survive|longevity|maraka)\b/)) risks.add('death_longevity');
  if (has(q, /\b(stocks?|shares?|crypto\w*|bitcoin|lottery|gambl\w*|betting|trading|forex|which coin|invest (in|all)|intraday)\b/)) risks.add('financial_speculation');
  if (has(q, /\b(lawsuit|court case|litigation|legal case|should i sue|custody|criminal case)\b/)) risks.add('legal');
  if (has(q, /\b(curse[ds]?|black magic|abhichara|witchcraft|evil eye|nazar|jadu|tona|hex(ed)?|possess(ed|ion)|someone did magic|spell on me|bewitch\w*)\b/)) risks.add('curse_black_magic');
  if (has(q, /\b(pregnan\w*|conceive|fertility|infertil\w*|miscarriage|ivf|boy or (a )?girl|gender of (the|my) baby)\b/)) risks.add('fertility_pregnancy');
  if (has(q, /\b(kill myself|suicid\w*|end my life|self[- ]harm|want to die|no reason to live)\b/)) risks.add('self_harm');
  if (has(q, /\b(cheating on me|is (he|she|my \w+) cheating|unfaithful|affair|faithful to me|loyal to me)\b/)) risks.add('third_party_fidelity');
  if (risks.size) categories.add('Q14_high_risk');

  // ─── Canonical categories (DOCUMENT_07 §4) ───
  if (has(q, /\b(birth chart|kundli|horoscope|full reading|overview|tell me about my chart|what does my chart say|complete reading|natal chart)\b/)) categories.add('Q01_full_overview');
  if (has(q, /\b(lagna|ascendant|rising sign)\b/)) categories.add('Q02_lagna');
  if (has(q, /\b(moon sign|rashi|nakshatra|birth star|janma)\b/)) categories.add('Q03_moon_nakshatra');
  if (has(q, /\b(strongest|strong planets?|weak planets?|strength|yogas?|best placement|exalted|debilitated)\b/)) categories.add('Q04_strengths');
  if (domains.has('career') && has(q, /\b(field|suit|fit|path|which|what kind|direction|choose|should i)\b/)) categories.add('Q05_career_fields');
  if (has(q, /\b(dasha|mahadasha|antardasha|bhukti|planetary period|current period)\b/)) categories.add('Q06_dasha_meaning');
  if (has(q, /\b(next year|this year|coming year|next \d+ months|year ahead|upcoming|20\d\d|future|forecast|next few months)\b/)) categories.add('Q07_year_ahead');
  if (has(q, /\b(transit|gochara|sade ?sati|dhaiya|saturn return|jupiter transit|rahu transit)\b/)) categories.add('Q08_transit');
  if (domains.has('marriage')) categories.add('Q09_marriage');
  if (has(q, /\b(western|tropical|hellenistic|kp|krishnamurti|jaimini|bazi|chinese|zi wei|different (school|tradition|system)s?|schools? of)\b/)) categories.add('Q10_cross_tradition');
  if (has(q, /\b(another app|other app|different app|another astrologer|other astrologer|why .*disagree|different (sign|result|lagna))\b/)) categories.add('Q11_app_disagreement');
  if (has(q, /\b(don'?t know (my )?(birth )?time|unknown (birth )?time|no birth time|without (a |an |my )?(exact )?(birth )?time)\b/)) categories.add('Q12_no_birth_time');
  if (has(q, /\b(calculated|interpreted|scientific|evidence|proof|does astrology work|real or|accurate)\b/)) categories.add('Q13_calculated_vs_interpreted');
  if (has(q, /\b(what is|what are|explain|meaning of|define|difference between|how does .* work)\b/) && !has(q, /\b(my|me|i)\b/)) categories.add('concept_explanation');
  if (has(q, /\b(dosha|remed\w*|upaya|gemstone|mantra|puja|kala ?sarpa|kaal ?sarp|pitru)\b/)) categories.add('dosha_remedy');
  if (has(q, /\b(compatib\w*|match(ing)?|guna|ashtakoota|kundli milan|synastry|our charts)\b/)) categories.add('compatibility');
  if (has(q, /\b(magic|occult|astral|kabbal\w*|hermetic|tantra|sorcery|esoteric|eliphas|levi|hartmann|alchemy|ritual magic)\b/)) categories.add('occult_esoteric');
  if (has(q, /\b(numerolog\w*|mulank|bhagyank|palm\w*|hastarekha|life line|heart line|head line)\b/)) categories.add('numerology_palmistry');
  if (has(q, /\b(source|reference|which book|cite|citation|shloka|verse|chapter|where (is|does) it say|according to (bphs|parashara|phaladeepika|saravali|brihat|jataka))\b/)) categories.add('source_request');
  if (categories.size === 0) categories.add('general_chart_question');

  const isPersonal = has(q, /\b(my|me|i|mine|am i|will i)\b/);
  const isFollowUp = history.length > 0 && (q.split(/\s+/).length <= 8 || has(q, /^(and|what about|how about|also|then|so|but|why|ok|okay)\b/) || has(q, /\b(that|this|it|those|same)\b/));

  let requestedTradition: RoutedQuestion['requestedTradition'] = null;
  if (has(q, /\b(western|tropical)\b/)) requestedTradition = 'western';
  else if (has(q, /\bhellenistic\b/)) requestedTradition = 'hellenistic';
  else if (has(q, /\b(kp|krishnamurti)\b/)) requestedTradition = 'kp';
  else if (has(q, /\bjaimini\b/)) requestedTradition = 'jaimini';
  else if (has(q, /\bbazi|four pillars\b/)) requestedTradition = 'bazi';
  else if (has(q, /\bzi wei\b/)) requestedTradition = 'zwds';
  else if (has(q, /\b(vedic|jyotish|parashari|sidereal)\b/)) requestedTradition = 'vedic';

  return {
    categories: [...categories],
    domains: [...domains],
    risks: [...risks],
    wantsExactDate: has(q, /\b(exact date|which date|what date|on which day|exact day|exact month|which month|when exactly|what day|precise date)\b/),
    wantsCertainty: has(q, /\b(guarantee\w*|definitely|for sure|100 ?%|certain(ly)?|will i ever|confirm (that|my)|promise)\b/),
    isPersonal,
    isFollowUp,
    requestedTradition,
    mentionsBirthDataCorrection: has(q, /\b(actually (i was )?born|wrong (birth )?(time|date|place)|correct(ed|ion)? (my )?(birth )?(time|date|place)|my birth time is|i was born at|born at \d|born on \d|time was actually)\b/),
    needsPartnerChart: categories.has('compatibility') && !has(q, /\b(in general|what is|explain)\b/),
  };
}
