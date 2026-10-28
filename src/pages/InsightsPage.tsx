import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, Search, Plus, Filter, Tag, Trash2, Copy,
  Download, Sparkles, BookOpen, FileText, Check, Share2
} from 'lucide-react';
import { demoInsights, demoSources } from '@/data/demo';
import type { SavedInsight } from '@/types';

export default function InsightsPage() {
  const [insights, setInsights] = useState<SavedInsight[]>(demoInsights);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newNoteOpen, setNewNoteOpen] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredInsights = insights.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCreateNote = () => {
    if (!newNoteTitle || !newNoteContent) return;
    const newInsight: SavedInsight = {
      id: `insight-${Date.now()}`,
      type: 'note',
      title: newNoteTitle,
      content: newNoteContent,
      tags: ['personal', 'observation'],
      createdAt: new Date().toISOString(),
    };
    setInsights([newInsight, ...insights]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteOpen(false);
  };

  const handleDelete = (id: string) => {
    setInsights(insights.filter(i => i.id !== id));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(insights, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'jyotish_saved_insights.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gold uppercase mb-1">
            <Bookmark size={14} />
            <span>Curated Journal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
            Saved Insights & Notes
          </h1>
          <p className="text-sm text-text-3 mt-1">
            Bookmarked consultations, classical shastra citations, and personal astrological journals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="btn btn-secondary text-xs sm:text-sm flex items-center gap-2"
          >
            <Download size={14} />
            <span>Export All</span>
          </button>
          <button
            onClick={() => setNewNoteOpen(true)}
            className="btn btn-primary text-xs sm:text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search saved notes, tags, passages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 py-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'ai_response', label: 'Consultations' },
            { id: 'source_passage', label: 'Classical Passages' },
            { id: 'note', label: 'Personal Notes' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === f.id
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'bg-surface-2 text-text-3 hover:text-text hover:bg-surface-3'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* New Note Inline Modal */}
      {newNoteOpen && (
        <div className="glass-card rounded-2xl p-6 border border-gold/40 space-y-4 animate-fade-in bg-surface-2/90">
          <h3 className="font-bold text-base text-text">Create Astrological Observation</h3>
          <input
            type="text"
            placeholder="Title (e.g., Transit of Saturn over Ascendant Lord)"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="input-field w-full text-sm py-2 px-3"
          />
          <textarea
            placeholder="Write your observation, chart notes, or event correlations..."
            rows={4}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="input-field w-full text-sm p-3"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setNewNoteOpen(false)}
              className="btn btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNote}
              className="btn btn-primary text-xs"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInsights.map((item) => {
          const isAI = item.type === 'ai_response';
          const isSource = item.type === 'source_passage';
          const isNote = item.type === 'note';

          return (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-5 border border-border hover:border-gold/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header type badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isAI
                        ? 'bg-gold/15 text-gold border border-gold/30'
                        : isSource
                        ? 'bg-indigo/15 text-indigo border border-indigo/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isAI && <Sparkles size={11} />}
                    {isSource && <BookOpen size={11} />}
                    {isNote && <FileText size={11} />}
                    <span className="capitalize">{item.type.replace('_', ' ')}</span>
                  </span>

                  <span className="text-[10px] text-text-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-text mb-2">{item.title}</h3>

                <p className="text-xs text-text-2 leading-relaxed mb-4 line-clamp-4">
                  {item.content}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] bg-surface-2 text-text-3 border border-border/80"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-text-3">
                  {item.chartId ? 'Linked to Native Chart' : 'General Topic'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item.id, item.content)}
                    className="p-1.5 rounded-lg hover:bg-surface-2 text-text-3 hover:text-text transition-colors"
                    title="Copy content"
                  >
                    {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-text-3 hover:text-rose-400 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
