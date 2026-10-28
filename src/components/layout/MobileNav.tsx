import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquareText, Compass, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import {
  PlusCircle, BarChart3, Clock, Heart, Bookmark,
  Settings, HelpCircle, User, Sparkles
} from 'lucide-react';

const bottomNavItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/app/astrologer', icon: MessageSquareText, label: 'Astrologer' },
  { to: '/app/chart/chart-1', icon: Compass, label: 'Chart' },
  { to: '/app/library', icon: BookOpen, label: 'Library' },
];

const drawerItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Overview' },
  { to: '/app/charts', icon: BarChart3, label: 'My Charts' },
  { to: '/app/astrologer', icon: MessageSquareText, label: 'Astrologer' },
  { to: '/app/chart/chart-1', icon: Compass, label: 'Chart Analysis' },
  { to: '/app/predictions', icon: Clock, label: 'Predictions' },
  { to: '/app/compatibility', icon: Heart, label: 'Compatibility' },
  { to: '/app/library', icon: BookOpen, label: 'Library' },
  { to: '/app/insights', icon: Bookmark, label: 'Saved Insights' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
  { to: '/app/help', icon: HelpCircle, label: 'Help' },
];

export default function MobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-4"
        style={{
          background: 'rgba(9,11,18,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(41,46,64,0.4)',
        }}
      >
        {bottomNavItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-gold' : 'text-text-3'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-text-3"
        >
          <Menu size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="overlay" onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed top-0 right-0 h-full w-[280px] z-[60] p-4 animate-slide-in-right"
            style={{
              background: 'linear-gradient(180deg, rgba(16,19,29,0.98) 0%, rgba(9,11,18,1) 100%)',
              borderLeft: '1px solid rgba(41,46,64,0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-gold" />
                <span className="text-sm font-semibold text-text">Vyom</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="btn btn-ghost btn-icon rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              {drawerItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-[rgba(201,169,110,0.08)] text-gold-light'
                        : 'text-text-2 hover:bg-[rgba(255,255,255,0.03)]'
                    }`
                  }
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
