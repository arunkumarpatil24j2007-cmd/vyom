import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Play, Sparkles, X,
  Compass, Clock, ShieldCheck, Heart, BookOpen, Layers
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import CosmicCanvas from '@/components/vyom/cosmic/CosmicCanvas';

export default function LandingPage() {
  const navigate = useNavigate();
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FEF6EB] text-[#09132E] flex flex-col justify-between selection:bg-[#FF4B19]/20 selection:text-[#09132E] overflow-x-hidden">
      {/* ═══ Header ═══ */}
      <Navbar />

      {/* ═══ Main Hero Section ═══ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 pt-2 md:pt-4 pb-8 flex flex-col justify-center">
        {/* Top Two-Column Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column: Headline, CTAs, Trust Metrics */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 md:space-y-7 z-10">
            {/* Eyebrow */}
            <div className="space-y-0.5">
              <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#7A8294]">
                ANCIENT WISDOM.
              </p>
              <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#7A8294]">
                MODERN GUIDANCE.
              </p>
            </div>

            {/* Main Headline */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold leading-[0.98] tracking-[-0.03em] text-[#09132E]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Clarity<br />
              for your<br />
              <span className="text-[#FF4B19]">next chapter.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-sm md:text-base text-[#4A5468] max-w-md font-medium leading-relaxed">
              Personalized astrology, insights and daily guidance to help you make better decisions, every day.
            </p>

            {/* Pill CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Primary CTA: Solar Orange Pill */}
              <Link
                to="/dashboard"
                className="btn-pill-orange group"
                id="cta-get-started"
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Sparkles size={11} className="fill-white" />
                </span>
                <span>Get Started</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary CTA: Cream Glass Pill */}
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="btn-pill-cream group"
                id="cta-watch-video"
              >
                <span className="w-5 h-5 rounded-full bg-[#FF9A20]/25 flex items-center justify-center text-[#FF4B19]">
                  <Play size={10} className="fill-[#FF4B19] ml-0.5" />
                </span>
                <span>Watch Video</span>
              </button>
            </div>
          </div>

          {/* Right Column: Real-Time 3D Cosmic WebGL Scene */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            <CosmicCanvas />
          </div>
        </div>

        {/* ═══ Lower Feature Strip: 4 Cards Aligned Horizontally ═══ */}
        <div className="mt-8 md:mt-12 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Personalized Kundli */}
            <Link
              to="/kundli"
              aria-label="Personalized Kundli"
              className="group relative h-28 md:h-32 rounded-[28px] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-[#2D317D]/40 block border border-white/10"
              style={{
                backgroundImage: 'url(/assets/card_kundli.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-transparent transition-opacity" />
            </Link>

            {/* Card 2: Daily Predictions */}
            <Link
              to="/predictions"
              aria-label="Daily Predictions"
              className="group relative h-28 md:h-32 rounded-[28px] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-[#FF7A00]/40 block border border-white/10"
              style={{
                backgroundImage: 'url(/assets/card_predictions.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-transparent transition-opacity" />
            </Link>

            {/* Card 3: Karmic Insights */}
            <Link
              to="/dosha"
              aria-label="Karmic Insights"
              className="group relative h-28 md:h-32 rounded-[28px] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-[#D82232]/40 block border border-white/10"
              style={{
                backgroundImage: 'url(/assets/card_karmic.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-transparent transition-opacity" />
            </Link>

            {/* Card 4: Remedies */}
            <Link
              to="/remedies"
              aria-label="Remedies"
              className="group relative h-28 md:h-32 rounded-[28px] overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-[#08745B]/40 block border border-white/10"
              style={{
                backgroundImage: 'url(/assets/card_remedies.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-transparent transition-opacity" />
            </Link>
          </div>
        </div>
      </main>

      {/* ═══ Explanatory Video Modal ═══ */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#FAF2E8] max-w-2xl w-full rounded-[32px] p-6 md:p-8 border border-[#E8DCCB] shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center font-bold">
                  <Play size={14} className="fill-[#FF4B19] ml-0.5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-xl text-[#09132E]">Inside Vyom Sanctuary</h3>
                  <p className="text-xs text-[#7A8294]">How ancient Jyotish Shastra guides modern living</p>
                </div>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EDE3D4] text-[#09132E] flex items-center justify-center hover:bg-[#E2D4C0]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Preview Canvas */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#09132E] border border-white/10 flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-16 h-16 rounded-full bg-[#FF4B19] text-white flex items-center justify-center shadow-lg shadow-[#FF4B19]/40 mb-4 animate-pulse">
                <Play size={24} className="fill-white ml-1" />
              </div>
              <h4 className="text-lg font-bold">The Architecture of Vedic Precision</h4>
              <p className="text-xs text-white/70 max-w-md mt-1">
                Combining high-precision astronomical ephemeris (Lahiri Ayanamsha) with the foundational treatises of Brihat Parashara Hora Shastra, Phaladeepika, and Saravali.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-[#EDE3D4]/60 border border-[#E8DCCB]">
                <p className="font-bold text-[#FF4B19]">Astronomical Truth</p>
                <p className="text-[10px] text-[#7A8294]">Classical Shastra Grounded</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#EDE3D4]/60 border border-[#E8DCCB]">
                <p className="font-bold text-[#09132E]">120y Dasha</p>
                <p className="text-[10px] text-[#7A8294]">Vimshottari Timeline</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#EDE3D4]/60 border border-[#E8DCCB]">
                <p className="font-bold text-[#08745B]">36 Gunas</p>
                <p className="text-[10px] text-[#7A8294]">Ashtakoota Milan</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="btn-pill-cream !py-2 !px-4 text-xs"
              >
                Close
              </button>
              <Link
                to="/dashboard"
                onClick={() => setVideoModalOpen(false)}
                className="btn-pill-orange !py-2 !px-5 text-xs"
              >
                Launch Vyom
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
