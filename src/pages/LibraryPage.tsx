import { useState } from 'react';
import {
  BookOpen, Search, Filter, Sparkles, Star, ChevronRight,
  Database, Bookmark, FileText, Check, ExternalLink, Sun,
  Layers, Compass, Award, Tag
} from 'lucide-react';
import { demoCategories, demoSources } from '@/data/demo';

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('texts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSourceModal, setActiveSourceModal] = useState<any | null>(null);

  const texts = [
    {
      title: 'Brihat Parashara Hora Shastra',
      author: 'Maharishi Parashara',
      date: 'c. 1500 BCE / Classical Antiquity',
      chapters: 97,
      verses: 3842,
      description: 'The foundational and supreme authority on Vedic Horoscopy (Hora Shastra), covering planetary natures, bhavas, shadbala, dasha systems, and yogas.',
      status: 'Verified Classical Shastra',
    },
    {
      title: 'Phaladeepika',
      author: 'Mantreshwara',
      date: '13th Century CE',
      chapters: 28,
      verses: 865,
      description: 'Remarkable classical treatise renowned for its pragmatic predictive techniques, bhavaphala, transits, and planetary dignity assessments.',
      status: 'Verified Classical Shastra',
    },
    {
      title: 'Jataka Parijata',
      author: 'Vaidyanatha Dikshita',
      date: '15th Century CE',
      chapters: 18,
      verses: 1760,
      description: 'Extensive compendium synthesizing Parashara and Jaimini principles, with deep insights into longevity, Raja Yogas, and Kalachakra Dasha.',
      status: 'Verified Classical Shastra',
    },
    {
      title: 'Saravali',
      author: 'Kalyanavarma',
      date: '8th Century CE',
      chapters: 45,
      verses: 2500,
      description: 'Monumental work written by the King of Vyaghrapada, providing encyclopedic descriptions of planetary positions in signs and houses.',
      status: 'Verified Classical Shastra',
    },
    {
      title: 'Uttara Kalamrita',
      author: 'Kalidasa',
      date: '17th Century CE',
      chapters: 8,
      verses: 420,
      description: 'Concise yet profound poetic masterpiece defining planetary karakattwas (significations), Rahu-Ketu nature, and nuanced sub-period outcomes.',
      status: 'Verified Classical Shastra',
    },
  ];

  const yogas = [
    {
      name: 'Gajakesari Yoga',
      nameHi: 'गजकेसरी योग',
      formation: 'Jupiter in Kendra (1st, 4th, 7th, 10th) from Moon',
      effect: 'Bestows noble reputation, intellectual prowess, wisdom, lasting renown, and triumph over adversaries.',
      text: 'BPHS Ch. 35, Sloka 3-4',
    },
    {
      name: 'Budhaditya Yoga',
      nameHi: 'बुधादित्य योग',
      formation: 'Sun and Mercury conjunct in a auspicious bhava without combust affliction',
      effect: 'Bestows sharp intellect, communicative eloquence, administrative acumen, and academic honor.',
      text: 'Phaladeepika Ch. 6, Sloka 12',
    },
    {
      name: 'Ruchaka Yoga (Pancha Mahapurusha)',
      nameHi: 'रुचक योग',
      formation: 'Mars in Aries, Scorpio, or Capricorn in a Kendra',
      effect: 'Commands executive courage, physical vitality, martial capability, and high leadership standing.',
      text: 'Saravali Ch. 37, Sloka 5',
    },
    {
      name: 'Viparita Raja Yoga (Harsha, Sarala, Vimala)',
      nameHi: 'विपरीत राजयोग',
      formation: 'Lords of dusthanas (6th, 8th, 12th) situated exclusively in dusthanas',
      effect: 'Rise to fortune and pre-eminence through unexpected turns of events, turning crisis into breakthrough.',
      text: 'Uttara Kalamrita Section IV',
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gold uppercase mb-1">
            <BookOpen size={14} />
            <span>Jyotish Vidya Repository</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
            Astrology Knowledge Base & Classical Texts
          </h1>
          <p className="text-sm text-text-3 mt-1">
            Browse foundational Sanskrit shastras, planetary rules, and the classical treatises powering astrological interpretations
          </p>
        </div>

        {/* Shastra Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 border border-border text-xs text-text-3">
          <Database size={14} className="text-gold" />
          <span>Classical Shastra Corpus: <strong className="text-gold">1,420 Passages</strong></span>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {demoCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gold/15 text-gold border border-gold/40 shadow-sm'
                : 'bg-surface-2/80 text-text-3 hover:text-text hover:bg-surface-3 border border-border/60'
            }`}
          >
            <span>{cat.name}</span>
            <span className="text-[10px] opacity-70">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Classical Texts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <BookOpen size={18} className="text-gold" />
            <span>Core Sanskrit Shastras</span>
          </h2>
          <span className="text-xs text-text-3">Canonical Authority</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {texts.map((text) => (
            <div
              key={text.title}
              className="glass-card rounded-2xl p-5 border border-border hover:border-gold/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base text-text">{text.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    Canonical
                  </span>
                </div>

                <p className="text-xs text-gold font-medium mb-1">{text.author} • {text.date}</p>
                <p className="text-xs text-text-3 mb-4 leading-relaxed line-clamp-3">
                  {text.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 bg-surface-2/60 rounded-xl border border-border/50 mb-4">
                  <div>
                    <span className="text-text-3 block text-[10px]">Chapters</span>
                    <span className="font-bold text-text">{text.chapters}</span>
                  </div>
                  <div>
                    <span className="text-text-3 block text-[10px]">Indexed Slokas</span>
                    <span className="font-bold text-gold">{text.verses}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[10px] text-text-3 flex items-center gap-1">
                  <Database size={10} className="text-emerald-400" />
                  <span>Authentic Shastra Active</span>
                </span>
                <button
                  onClick={() => setActiveSourceModal(demoSources[0])}
                  className="text-gold hover:underline flex items-center gap-1"
                >
                  <span>Sample Passage</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Planetary Combinations (Yogas) */}
      <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <Star size={18} className="text-gold" />
              <span>Key Astrological Combinations (Yogas)</span>
            </h3>
            <p className="text-xs text-text-3 mt-0.5">
              Classical rule definitions applied during chart automated verification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {yogas.map((yoga) => (
            <div
              key={yoga.name}
              className="p-4 rounded-xl bg-surface-2/60 border border-border/80 space-y-2 hover:border-gold/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-text text-sm flex items-center gap-2">
                  <span>{yoga.name}</span>
                  <span className="text-xs text-gold font-normal font-sans">({yoga.nameHi})</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-3 text-text-3 border border-border">
                  {yoga.text}
                </span>
              </div>

              <div className="text-xs text-indigo font-medium">
                Rule: {yoga.formation}
              </div>

              <p className="text-xs text-text-3 leading-relaxed">
                {yoga.effect}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Passage Modal / Drawer */}
      {activeSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-lg w-full rounded-2xl p-6 border border-gold/40 space-y-4 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold tracking-wider">Classical Source Passage</span>
                <h3 className="text-lg font-bold text-text">{activeSourceModal.title}</h3>
                <p className="text-xs text-text-3">{activeSourceModal.author} • {activeSourceModal.chapter}</p>
              </div>
              <button
                onClick={() => setActiveSourceModal(null)}
                className="text-text-3 hover:text-text p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-surface-2/90 rounded-xl p-4 border border-border text-xs text-text-2 leading-relaxed italic">
              "{activeSourceModal.passage}"
            </div>

            <div className="flex items-center justify-between text-xs text-text-3 pt-2">
              <span>Category: {activeSourceModal.category}</span>
              <button
                onClick={() => setActiveSourceModal(null)}
                className="btn btn-primary !py-1.5 !px-3 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
