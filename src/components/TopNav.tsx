import React, { useState } from 'react';
import { Volume2, VolumeX, Music, RotateCcw, Menu, X } from 'lucide-react';
import type { PageId } from '../types';

interface TopNavProps {
  currentPage: PageId;
  userName: string;
  musicOn: boolean;
  sfxOn: boolean;
  onNavigate: (page: PageId) => void;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onRestart: () => void;
}

const NAV_ITEMS: Array<{ id: PageId; label: string }> = [
  { id: 'hub', label: 'Hub' },
  { id: 'surprise', label: 'Surprise' },
  { id: 'games', label: 'Mini-Games' },
  { id: 'message', label: 'Letter' },
  { id: 'unexpected', label: 'Mystery' },
  { id: 'finale', label: 'Finale' },
];

export const TopNav: React.FC<TopNavProps> = ({
  currentPage,
  musicOn,
  sfxOn,
  onNavigate,
  onToggleMusic,
  onToggleSfx,
  onRestart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Entry page displays a clean minimal floating audio toggle bar only
  if (currentPage === 'entry') {
    return (
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={onToggleMusic}
          aria-label={musicOn ? 'Turn music off' : 'Turn music on'}
          className={`font-ui inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
            musicOn
              ? 'border-amber-300/50 bg-amber-300/15 text-amber-200 shadow-[0_0_20px_rgba(245,208,138,0.2)]'
              : 'border-violet-300/20 bg-black/45 text-violet-200/80 hover:border-violet-300/40 hover:text-white'
          }`}
        >
          <Music className="h-3.5 w-3.5" />
          <span>{musicOn ? 'Music: ON' : 'Music: OFF'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleSfx}
          aria-label={sfxOn ? 'Mute sound effects' : 'Unmute sound effects'}
          title={sfxOn ? 'Sound Effects: ON' : 'Sound Effects: Muted'}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
            sfxOn
              ? 'border-violet-300/25 bg-black/45 text-violet-100 hover:border-violet-300/50'
              : 'border-rose-400/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          {sfxOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-violet-300/12 bg-[#090510]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            onNavigate('hub');
          }}
          className="font-display text-left text-base font-semibold tracking-wide text-amber-100 transition-colors hover:text-amber-300 whitespace-nowrap shrink-0 sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded"
        >
          THE BIRTHDAY EXPERIENCE
        </button>

        {/* Zone 2: Desktop Single-Line Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`font-ui relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded ${
                  active
                    ? 'text-amber-200'
                    : 'text-violet-200/75 hover:text-white'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-amber-300 via-violet-400 to-pink-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Audio Controls & Mobile Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={musicOn ? 'Turn music off' : 'Turn music on'}
            className={`font-ui inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
              musicOn
                ? 'border-amber-300/45 bg-amber-300/15 text-amber-200 shadow-[0_0_16px_rgba(245,208,138,0.18)]'
                : 'border-violet-300/20 bg-white/5 text-violet-200/80 hover:text-white'
            }`}
          >
            <Music className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{musicOn ? 'Music ON' : 'Music OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSfx}
            aria-label={sfxOn ? 'Mute sound effects' : 'Unmute sound effects'}
            title={sfxOn ? 'Sound Effects: ON' : 'Sound Effects: Muted'}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
              sfxOn
                ? 'border-violet-300/20 bg-white/5 text-violet-100 hover:border-violet-300/40'
                : 'border-rose-400/30 bg-rose-500/15 text-rose-300'
            }`}
          >
            {sfxOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onRestart}
            title="Change Name / Start Over"
            aria-label="Start from beginning"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border border-violet-300/20 bg-white/5 px-3 text-xs font-medium text-violet-200/80 transition-colors hover:border-violet-300/40 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-violet-300/20 bg-white/5 text-violet-100 lg:hidden shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-violet-300/12 bg-[#0c0617]/95 px-4 py-3 lg:hidden">
          <div className="grid grid-cols-3 gap-2">
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`font-ui min-h-[40px] rounded-xl px-2 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-violet-500/25 text-amber-200 border border-amber-300/35'
                      : 'bg-white/5 text-violet-200/80 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onRestart();
            }}
            className="font-ui mt-2 flex w-full min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-violet-300/15 bg-white/5 text-xs font-medium text-violet-200/80 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Start From Beginning</span>
          </button>
        </div>
      )}
    </header>
  );
};
