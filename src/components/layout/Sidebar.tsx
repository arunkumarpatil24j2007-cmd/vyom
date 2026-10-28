import { useState } from 'react';
import {
  LayoutDashboard, PlusCircle, BarChart3, MessageSquareText,
  Compass, Clock, Heart, BookOpen, Bookmark,
  Settings, HelpCircle, User, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/app/charts', icon: BarChart3, label: 'My Charts' },
  { to: '/app/astrologer', icon: MessageSquareText, label: 'Astrologer' },
  { to: '/app/chart/chart-1', icon: Compass, label: 'Chart Analysis' },
  { to: '/app/predictions', icon: Clock, label: 'Predictions & Timing' },
  { to: '/app/compatibility', icon: Heart, label: 'Compatibility' },
  { to: '/app/library', icon: BookOpen, label: 'Astrology Library' },
  { to: '/app/insights', icon: Bookmark, label: 'Saved Insights' },
];

const bottomItems = [
  { to: '/app/settings', icon: Settings, label: 'Settings' },
  { to: '/app/help', icon: HelpCircle, label: 'Help & Docs' },
];

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(16,19,29,0.95) 0%, rgba(9,11,18,0.98) 100%)',
        borderRight: '1px solid rgba(41,46,64,0.5)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 min-h-[64px]">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(228,201,149,0.1))',
            border: '1px solid rgba(201,169,110,0.3)',
          }}>
          <Sparkles size={16} className="text-gold" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-semibold tracking-wide text-text" style={{ fontFamily: 'var(--font-heading)' }}>
              Vyom
            </h1>
            <p className="text-[10px] text-text-3 tracking-widest uppercase">Vedic Sanctuary</p>
          </div>
        )}
      </div>

      {/* New Analysis Button */}
      <div className="px-3 mb-4">
        <button
          onClick={() => navigate('/app/new-chart')}
          className={`btn btn-primary w-full ${collapsed ? 'btn-icon !w-full !h-10' : ''}`}
        >
          <PlusCircle size={16} />
          {!collapsed && <span>New Analysis</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[rgba(201,169,110,0.08)] text-gold-light'
                  : 'text-text-2 hover:text-text hover:bg-[rgba(255,255,255,0.03)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative flex-shrink-0">
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  {isActive && (
                    <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-gold" />
                  )}
                </div>
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-2 divider" />

      {/* Bottom nav */}
      <div className="px-2 space-y-0.5 pb-2">
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'text-gold-light bg-[rgba(201,169,110,0.06)]'
                  : 'text-text-3 hover:text-text-2 hover:bg-[rgba(255,255,255,0.03)]'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.5} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </div>

      {/* User Profile */}
      <div className="px-3 pb-4 pt-2">
        <button
          onClick={() => navigate('/app/settings')}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-[rgba(255,255,255,0.03)] ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(119,121,232,0.15), rgba(119,121,232,0.05))',
              border: '1px solid rgba(119,121,232,0.2)',
            }}>
            <User size={14} className="text-indigo" />
          </div>
          {!collapsed && (
            <div className="text-left animate-fade-in">
              <p className="text-xs font-medium text-text">Demo User</p>
              <p className="text-[10px] text-text-3">Free Plan</p>
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-3 hover:text-text hover:bg-surface-3 transition-all duration-200 z-50"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
