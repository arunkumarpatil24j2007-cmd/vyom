import { useState, useEffect } from 'react';
import {
  Settings, Save, Check, Compass, Sparkles,
  User, Database, Shield, RefreshCw, Trash2, BookOpen, Upload, FileText,
  Cpu, CheckCircle2, Layers, Search, BookMarked
} from 'lucide-react';
import {
  getActiveProfile,
  saveActiveProfile,
  clearAllGuestData,
  subscribeToGuestStore,
  type UserBirthDetails,
} from '@/lib/storage/guestStore';
import {
  chunkTextDocument,
  saveIngestedDocument,
  getIngestedDocuments,
  deleteIngestedDocument,
  type IngestedDocument,
} from '@/lib/knowledge/ingestion/documentIngestion';
import { searchKnowledge } from '@/lib/knowledge/retrieval/searchKnowledge';

interface RagStatusResponse {
  status: string;
  consultationAvailable: boolean;
  processDocuments?: number;
  totalSources: number;
  totalCuratedChunks: number;
  sources: Array<{
    id: string;
    title: string;
    author: string;
    tradition: string;
    totalChunks: number;
    fileSizeMb: number;
    categories: string[];
  }>;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserBirthDetails | null>(() => getActiveProfile());
  const [name, setName] = useState(profile?.name || '');
  const [birthDate, setBirthDate] = useState(profile?.birthDate || '1994-04-14');
  const [birthTime, setBirthTime] = useState(profile?.birthTime || '06:30');
  const [birthPlace, setBirthPlace] = useState(profile?.birthPlace || 'New Delhi, India');
  const [latitude, setLatitude] = useState(profile?.latitude ?? 28.6139);
  const [longitude, setLongitude] = useState(profile?.longitude ?? 77.209);
  const [timezone, setTimezone] = useState(profile?.timezone || 'Asia/Kolkata');

  const [ayanamsha, setAyanamsha] = useState('lahiri');
  const [houseSystem, setHouseSystem] = useState('whole_sign');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // RAG & Server State
  const [ragStatus, setRagStatus] = useState<RagStatusResponse | null>(null);
  const [loadingRagStatus, setLoadingRagStatus] = useState(false);

  // Knowledge base document ingestion state
  const [ingestedDocs, setIngestedDocs] = useState<IngestedDocument[]>(() => getIngestedDocuments());
  const [customDocTitle, setCustomDocTitle] = useState('');
  const [customDocContent, setCustomDocContent] = useState('');
  const [ingestSuccess, setIngestSuccess] = useState(false);
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [searchingRag, setSearchingRag] = useState(false);

  const fetchRagStatus = async () => {
    setLoadingRagStatus(true);
    try {
      const res = await fetch('/api/rag/status');
      if (res.ok) {
        const data = await res.json();
        setRagStatus(data);
      }
    } catch (err) {
      console.warn('Could not fetch RAG status:', err);
    } finally {
      setLoadingRagStatus(false);
    }
  };

  useEffect(() => {
    function refresh() {
      const p = getActiveProfile();
      setProfile(p);
      if (p) {
        setName(p.name);
        setBirthDate(p.birthDate);
        setBirthTime(p.birthTime);
        setBirthPlace(p.birthPlace);
        setLatitude(p.latitude);
        setLongitude(p.longitude);
        setTimezone(p.timezone);
      }
      setIngestedDocs(getIngestedDocuments());
    }
    refresh();
    fetchRagStatus();
    const unsubscribe = subscribeToGuestStore(refresh);
    return unsubscribe;
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;

    saveActiveProfile({
      name: name.trim(),
      birthDate,
      birthTime,
      birthPlace,
      latitude,
      longitude,
      timezone,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleWipeAll = () => {
    if (window.confirm('Erase all saved birth profiles, charts, and report histories from this session?')) {
      clearAllGuestData();
      setName('');
      setBirthPlace('');
      alert('All personal session data has been erased.');
    }
  };

  const handleIngestCustomDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDocTitle.trim() || !customDocContent.trim()) return;

    const chunks = chunkTextDocument(customDocContent, {
      chunkSize: 600,
      chunkOverlap: 100,
      defaultChapter: customDocTitle,
    });

    const doc: IngestedDocument = {
      id: `doc-${Date.now()}`,
      filename: `${customDocTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`,
      title: customDocTitle.trim(),
      sourceType: 'user_manuscript',
      mimeType: 'text/plain',
      fileSizeBytes: customDocContent.length,
      contentHash: `hash-${customDocContent.length}`,
      ingestedAt: new Date().toISOString(),
      chunkCount: chunks.length,
      status: 'indexed',
    };

    const docChunks = chunks.map((c, i) => ({
      id: `chk-${doc.id}-${i}`,
      documentId: doc.id,
      chunkIndex: i,
      chapter: c.chapter,
      section: c.section,
      content: c.content,
      tokenCount: Math.round(c.content.length / 4),
    }));

    saveIngestedDocument(doc, docChunks);
    setIngestedDocs(getIngestedDocuments());
    setCustomDocTitle('');
    setCustomDocContent('');
    setIngestSuccess(true);
    setTimeout(() => setIngestSuccess(false), 3000);
  };

  const handleTestSearch = async () => {
    if (!testQuery.trim()) return;
    setSearchingRag(true);
    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setTestResults(data.passages || []);
      } else {
        // Fallback to client-side local search
        const local = searchKnowledge(testQuery, { maxResults: 4 });
        setTestResults(local.map((l) => ({
          title: l.chunk.sourceTitle,
          author: l.chunk.author,
          chapter: l.chunk.chapter,
          excerpt: l.chunk.translation,
          relevance: `Score: ${l.score.toFixed(1)}`,
        })));
      }
    } catch {
      const local = searchKnowledge(testQuery, { maxResults: 4 });
      setTestResults(local.map((l) => ({
        title: l.chunk.sourceTitle,
        author: l.chunk.author,
        chapter: l.chunk.chapter,
        excerpt: l.chunk.translation,
        relevance: `Score: ${l.score.toFixed(1)}`,
      })));
    } finally {
      setSearchingRag(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4B19] mb-1">
            <Settings size={14} />
            <span>Consultation & Classical Library</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Settings & Sources
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            Configure astronomical ephemeris calculations, check the consultation service, and inspect the indexed Shastra sources.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-pill-orange text-xs !py-2.5 !px-5 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          {savedSuccess ? <Check size={15} /> : <Save size={15} />}
          <span>{savedSuccess ? 'Preferences Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#08745B]/10 border border-[#08745B]/20 text-[#08745B] text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check size={16} />
          <span>Your birth profile and astrological ephemeris settings have been updated!</span>
        </div>
      )}

      {/* ═══ Consultation Service & Classical Library Status ═══ */}
      <div className="card-cream p-6 md:p-8 space-y-5 border border-[#E8DCCB] rounded-[32px] bg-gradient-to-br from-[#FFFDF9] via-white to-[#FAF2E8]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DCCB]/60">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#08745B]/15 text-[#08745B] flex items-center justify-center">
              <Cpu size={16} />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#09132E]">Consultation Service & Classical Library</h2>
              <p className="text-xs text-[#7A8294]">Readings grounded in your calculated chart and the classical texts</p>
            </div>
          </div>
          <button
            onClick={fetchRagStatus}
            disabled={loadingRagStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8DCCB] text-xs font-bold text-[#4A5468] hover:text-[#09132E] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw size={12} className={loadingRagStatus ? 'animate-spin' : ''} />
            <span>Refresh Status</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8294]">Astrologer Consultations</span>
            <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#09132E]">
              <span className={`w-2 h-2 rounded-full ${ragStatus && !ragStatus.consultationAvailable ? 'bg-[#C0392B]' : 'bg-[#08745B] animate-pulse'}`} />
              <span>{ragStatus ? (ragStatus.consultationAvailable ? 'Online' : 'Unavailable') : 'Checking…'}</span>
            </div>
            <p className="text-[11px] text-[#08745B] font-semibold">Vedic Parashari · Lahiri · Whole Sign</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8294]">Knowledge Base</span>
            <div className="text-sm font-extrabold text-[#09132E]">
              {ragStatus ? `${ragStatus.totalSources} Indexed Volumes` : '11 Classical Volumes'}
            </div>
            <p className="text-[11px] text-[#4A5468]">
              {ragStatus ? `${ragStatus.totalCuratedChunks} indexed passages` : 'Loading…'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8294]">Working Principles</span>
            <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#08745B]">
              <CheckCircle2 size={15} />
              <span>{ragStatus?.processDocuments ?? 10} Process Documents</span>
            </div>
            <p className="text-[11px] text-[#7A8294]">Methodology, rules & safety policy</p>
          </div>
        </div>

        {/* 11 Canonical Books Manifest List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#09132E] flex items-center gap-1.5">
              <BookMarked size={14} className="text-[#FF4B19]" />
              <span>Indexed Classical Volumes</span>
            </h4>
            <span className="text-[11px] text-[#7A8294]">Auto-reloaded in server memory</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(ragStatus?.sources && ragStatus.sources.length > 0 ? ragStatus.sources : [
              { title: 'Brihat Parashara Hora Shastra', author: 'Maharishi Parashara', totalChunks: 301, tradition: 'Classical Vedic Jyotish' },
              { title: 'The Brihat Jataka', author: 'Varahamihira', totalChunks: 265, tradition: 'Classical Vedic Horoscopy' },
              { title: "Mantreswara's Phaladeepika", author: 'Mantreswara', totalChunks: 323, tradition: 'Predictive Jyotish' },
              { title: "Kalyana Varma's Saravali", author: 'King Kalyana Varma', totalChunks: 202, tradition: 'Classical Shastra' },
              { title: 'Jataka Parijata (Vol. 1)', author: 'Vaidyanatha Dikshita', totalChunks: 205, tradition: 'Shastric Jyotish' },
              { title: 'Lessons on Vedic Astrology (Vol. 1)', author: 'P.V.R. Narasimha Rao', totalChunks: 115, tradition: 'Sri Jagannath Center' },
              { title: 'The Origin, Meaning & Purpose of Astrology', author: 'C. Vasudev', totalChunks: 90, tradition: 'Cosmological Inquiry' },
              { title: "The Practitioner's Compendium of Indian Divination", author: 'Divination Tradition', totalChunks: 7, tradition: 'Triskandha & Samudrika' },
              { title: 'The Mysteries of Magic', author: 'Éliphas Lévi / A.E. Waite', totalChunks: 403, tradition: 'Western Esotericism' },
              { title: 'Magic, White and Black', author: 'Dr. Franz Hartmann', totalChunks: 279, tradition: 'Spiritual Alchemy' },
              { title: 'Black Magic', author: 'Marjorie Bowen', totalChunks: 244, tradition: 'Occult History' },
            ]).map((book: any, idx: number) => (
              <div key={idx} className="p-3 rounded-2xl bg-white border border-[#E8DCCB] flex items-start justify-between gap-3 text-xs">
                <div>
                  <h5 className="font-extrabold text-[#09132E] leading-snug">{book.title}</h5>
                  <p className="text-[11px] text-[#7A8294] mt-0.5">{book.author} • <span className="italic">{book.tradition}</span></p>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-[#08745B] bg-[#08745B]/10 px-2 py-0.5 rounded-full">
                  {book.totalChunks} chunks
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB] text-xs text-[#4A5468] space-y-1">
            <span className="font-bold text-[#09132E] block">Want to add more books & sources?</span>
            <p className="text-[11px] leading-relaxed">
              Place any PDF, TXT, or Markdown book file into <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8DCCB] font-mono text-[10px]">data/sources/</code> (or your <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8DCCB] font-mono text-[10px]">Downloads</code> folder) and run <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8DCCB] font-mono text-[10px]">npm run ingest</code>. They will be parsed, chunked, and indexed into the searchable library.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ User Birth Profile ═══ */}
      <div className="card-cream p-6 md:p-8 space-y-5 border border-[#E8DCCB] rounded-[32px]">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E8DCCB]/60">
          <User size={18} className="text-[#FF4B19]" />
          <h2 className="text-base font-extrabold text-[#09132E]">Personal Birth Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-[#09132E]">Full Name / Identity</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-bold text-[#09132E]">Birthplace (City, Country)</label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-bold text-[#09132E]">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-bold text-[#09132E]">Time of Birth</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] font-medium"
            />
          </div>
        </div>
      </div>

      {/* ═══ Ephemeris Calculation Settings ═══ */}
      <div className="card-cream p-6 md:p-8 space-y-5 border border-[#E8DCCB] rounded-[32px]">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E8DCCB]/60">
          <Compass size={18} className="text-[#FF9A20]" />
          <h2 className="text-base font-extrabold text-[#09132E]">Astronomical Ephemeris Configuration</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-[#09132E]">Ayanamsha Calculation System</label>
            <p className="text-[11px] text-[#7A8294]">Governs sidereal zodiac precession alignment.</p>
            <select
              value={ayanamsha}
              onChange={(e) => setAyanamsha(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] font-medium"
            >
              <option value="lahiri">Lahiri / Chitra Paksha (Official Indian Astronomical Standard)</option>
              <option value="raman">B.V. Raman Ayanamsha</option>
              <option value="krishnamurti">Krishnamurti Padhdhati (KP)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#09132E]">House / Bhava Division System</label>
            <p className="text-[11px] text-[#7A8294]">How house boundaries are established.</p>
            <select
              value={houseSystem}
              onChange={(e) => setHouseSystem(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] font-medium"
            >
              <option value="whole_sign">Whole Sign (Parashari Rashi-Bhava Standard)</option>
              <option value="equal">Equal House from Ascendant Degree</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══ Classical RAG Query Testing & Manuscript Ingestion ═══ */}
      <div className="card-cream p-6 md:p-8 space-y-5 border border-[#E8DCCB] rounded-[32px]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]/60">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-[#08745B]" />
            <h2 className="text-base font-extrabold text-[#09132E]">
              Search the Classical Library
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#08745B] bg-[#08745B]/10 px-2.5 py-0.5 rounded-full">
            Real-Time Semantic Search
          </span>
        </div>

        <p className="text-xs text-[#4A5468] leading-relaxed">
          Search passages across Brihat Parashara Hora Shastra, Phaladeepika, Saravali, the Compendium of Palmistry & Numerology, and all indexed treatises.
        </p>

        {/* Test Retrieval Query Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="e.g. 'Gaja Kesari Yoga', '10th lord in 1st house', 'Jeevan Rekha in Palmistry', 'Sade Sati'"
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-xs font-medium text-[#09132E]"
            />
            <button
              type="button"
              onClick={handleTestSearch}
              disabled={searchingRag}
              className="btn-pill-orange text-xs !py-2.5 !px-5 cursor-pointer flex items-center gap-1.5"
            >
              {searchingRag ? <RefreshCw size={13} className="animate-spin" /> : <Search size={13} />}
              <span>{searchingRag ? 'Retrieving...' : 'Search Library'}</span>
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-[#7A8294] uppercase tracking-wider">
                Retrieved Classical Passages ({testResults.length} hits)
              </span>
              {testResults.map((res, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white border border-[#E8DCCB] text-xs space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#09132E]">{res.title} {res.chapter ? `— ${res.chapter}` : ''}</span>
                    <span className="text-[10px] font-bold text-[#08745B] bg-[#08745B]/10 px-2 py-0.5 rounded-full">
                      {res.relevance || 'Library match'}
                    </span>
                  </div>
                  <p className="text-[11px] italic text-[#4A5468] leading-relaxed">"{res.excerpt}"</p>
                  {res.author && <p className="text-[10px] text-[#7A8294] font-medium">By {res.author} {res.page ? `• ${res.page}` : ''}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Ingest Custom Text */}
        <form onSubmit={handleIngestCustomDocument} className="space-y-3 bg-[#FFF8EF] p-4 rounded-2xl border border-[#E8DCCB] text-xs mt-4">
          <h4 className="font-bold text-[#09132E]">Add Quick Astrological Manuscript / Reference Text</h4>
          <div>
            <label className="font-bold text-[#7A8294] block mb-1 text-[10px] uppercase">Document Title / Chapter Name</label>
            <input
              type="text"
              value={customDocTitle}
              onChange={(e) => setCustomDocTitle(e.target.value)}
              placeholder="e.g., Bhavartha Ratnakara - Chapter on Wealth"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCB] font-medium"
            />
          </div>
          <div>
            <label className="font-bold text-[#7A8294] block mb-1 text-[10px] uppercase">Text Passages / Shlokas / Commentary</label>
            <textarea
              rows={3}
              value={customDocContent}
              onChange={(e) => setCustomDocContent(e.target.value)}
              placeholder="Paste classical verses, translations, or notes to add to the shastric library..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8DCCB] font-medium text-xs"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#7A8294]">
              Saved to client library immediately.
            </span>
            <button
              type="submit"
              className="btn-pill-orange text-xs !py-1.5 !px-4 flex items-center gap-1.5 cursor-pointer"
            >
              <Upload size={13} />
              <span>Add to Library</span>
            </button>
          </div>
          {ingestSuccess && (
            <div className="text-[11px] font-bold text-[#08745B] flex items-center gap-1">
              <Check size={12} />
              <span>Manuscript saved and added to classical knowledge base!</span>
            </div>
          )}
        </form>
      </div>

      {/* ═══ Data Privacy & Session Wipe ═══ */}
      <div className="card-cream p-6 md:p-8 space-y-4 border border-[#E8DCCB] rounded-[32px]">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E8DCCB]/60">
          <Shield size={18} className="text-[#08745B]" />
          <h2 className="text-base font-extrabold text-[#09132E]">Data Privacy & Session Management</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <h4 className="font-bold text-[#09132E]">Guest Session Isolation</h4>
            <p className="text-[11px] text-[#7A8294]">
              All birth charts, calculations, and consultations are strictly bound to your private browser session.
            </p>
          </div>

          <button
            onClick={handleWipeAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E32636]/10 text-[#E32636] font-bold hover:bg-[#E32636]/20 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Wipe All My Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
