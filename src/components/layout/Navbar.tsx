import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, User, Settings } from 'lucide-react';
import { getActiveProfile, subscribeToGuestStore, type UserBirthDetails } from '@/lib/storage/guestStore';
import BirthDetailsModal from '@/components/vyom/BirthDetailsModal';

interface NavbarProps {
  isApp?: boolean;
}

export default function Navbar({ isApp }: NavbarProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [birthModalOpen, setBirthModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserBirthDetails | null>(() => getActiveProfile());

  useEffect(() => {
    const unsubscribe = subscribeToGuestStore(() => {
      setActiveProfile(getActiveProfile());
    });
    return unsubscribe;
  }, []);

  // Universal Navigation Items — used consistently across every single page (landing and internal)
  const navItems = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Kundli', href: '/kundli' },
    { label: 'Astrologer', href: '/astrologer' },
    { label: 'Predictions', href: '/predictions' },
    { label: 'Compatibility', href: '/compatibility' },
    { label: 'Panchang', href: '/panchang' },
    { label: 'Muhurat', href: '/muhurat' },
    { label: 'Dosha', href: '/dosha' },
    { label: 'Remedies', href: '/remedies' },
    { label: 'Reports', href: '/reports' },
  ];

  return (
    <>
      <header className="relative z-50 w-full px-6 md:px-12 py-5 max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group text-decoration-none shrink-0">
          <span
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#09132E] group-hover:text-[#FF4B19] transition-colors"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Vyom
          </span>
        </Link>

        {/* Center: Universal Navigation Pills (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[#FAF2E8]/90 border border-[#E8DCCB] backdrop-blur-md shadow-xs">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#EDE3D4] text-[#09132E] shadow-xs'
                    : 'text-[#4A5468] hover:text-[#09132E] hover:bg-[#F2E5D5]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Universal User Session / Profile Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBirthModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF2E8] border border-[#E8DCCB] text-xs font-semibold text-[#09132E] hover:bg-[#EDE3D4] transition-all cursor-pointer"
              title="View / Enter Birth Chart Details"
            >
              <div className="w-6 h-6 rounded-full bg-[#09132E] text-white flex items-center justify-center text-[10px]">
                {activeProfile ? <User size={12} /> : <Sparkles size={12} className="text-[#F7A928]" />}
              </div>
              <span className="hidden sm:inline">
                {activeProfile ? activeProfile.name : 'Enter Birth Details'}
              </span>
            </button>
            <Link
              to="/settings"
              className={`p-2 rounded-full border transition-all ${
                location.pathname === '/settings'
                  ? 'bg-[#EDE3D4] border-[#D4C4B0] text-[#09132E]'
                  : 'bg-[#FAF2E8] border-[#E8DCCB] text-[#4A5468] hover:text-[#09132E] hover:bg-[#EDE3D4]'
              }`}
              title="Settings & Ephemeris"
            >
              <Settings size={15} />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-[#FAF2E8] border border-[#E8DCCB] text-[#09132E] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-6 right-6 mt-2 p-4 rounded-3xl bg-[#FAF2E8]/98 border border-[#E8DCCB] shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-1.5 animate-fade-in">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href === '/dashboard' && location.pathname === '/');
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                    isActive ? 'bg-[#EDE3D4] text-[#09132E]' : 'text-[#4A5468] hover:bg-[#EDE3D4]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#E8DCCB] mt-1 flex flex-col gap-2">
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-2xl text-sm font-semibold text-[#09132E] hover:bg-[#EDE3D4] transition-colors flex items-center gap-2"
              >
                <Settings size={15} />
                <span>Settings & Ephemeris</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <BirthDetailsModal
        isOpen={birthModalOpen}
        onClose={() => setBirthModalOpen(false)}
        onProfileUpdated={() => {
          setActiveProfile(getActiveProfile());
        }}
      />
    </>
  );
}
