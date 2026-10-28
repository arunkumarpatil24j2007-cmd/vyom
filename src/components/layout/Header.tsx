import { Search, Bell, Command } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  sidebarCollapsed: boolean;
}

export default function Header({ title, subtitle, sidebarCollapsed }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-[56px] px-6 transition-all duration-300"
      style={{
        background: 'rgba(9,11,18,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(41,46,64,0.3)',
      }}
    >
      <div className="flex items-center gap-3">
        {title && (
          <div>
            <h2 className="text-sm font-semibold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h2>
            {subtitle && <p className="text-xs text-text-3">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search / Command Palette */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="btn btn-ghost btn-icon rounded-full"
          aria-label="Search"
        >
          <Search size={16} />
        </button>

        {/* Command Palette Hint */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-text-3 hover:text-text-2 transition-colors"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(41,46,64,0.5)',
          }}
          onClick={() => setSearchOpen(true)}
        >
          <Command size={12} />
          <span>Search</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-text-3">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="btn btn-ghost btn-icon rounded-full relative" aria-label="Notifications">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold" />
        </button>

        {/* User Avatar */}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ml-1"
          style={{
            background: 'linear-gradient(135deg, rgba(119,121,232,0.15), rgba(119,121,232,0.05))',
            border: '1px solid rgba(119,121,232,0.2)',
            color: 'var(--color-indigo)',
          }}
        >
          DU
        </button>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <>
          <div className="overlay" onClick={() => setSearchOpen(false)} />
          <div className="dialog" style={{ maxWidth: '560px' }}>
            <div className="card-glass p-4">
              <div className="flex items-center gap-3 mb-4">
                <Search size={18} className="text-text-3" />
                <input
                  type="text"
                  placeholder="Search charts, sources, conversations..."
                  className="flex-1 bg-transparent border-none outline-none text-text text-sm placeholder:text-text-3"
                  autoFocus
                />
                <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-text-3">ESC</kbd>
              </div>
              <div className="divider mb-3" />
              <div className="space-y-1">
                <p className="text-xs text-text-3 px-2 mb-2">Quick Actions</p>
                {['Create new chart', 'Consult Astrologer', 'Browse library', 'View predictions'].map((action) => (
                  <button
                    key={action}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-2 hover:text-text hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
