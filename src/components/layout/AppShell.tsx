import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#FEF6EB] text-[#09132E] flex flex-col selection:bg-[#FF4B19]/20 selection:text-[#09132E]">
      {/* Top Application Navbar */}
      <Navbar />

      {/* Main Workspace Page View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-4 md:py-6 animate-fade-in">
        <Outlet />
      </main>

      {/* Subtle Cosmic Brand Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#E8DCCB]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A8294] gap-2">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Vyom
          </span>
          <span>• Ancient Wisdom. Modern Guidance.</span>
        </div>
        <p className="text-[11px]">
          Calculations powered by Sidereal Ephemeris (Lahiri Ayanamsha) & Classical Jyotish Shastras.
        </p>
      </footer>
    </div>
  );
}
