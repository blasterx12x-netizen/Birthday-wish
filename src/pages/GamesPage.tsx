import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { MiniGameId, PageId } from '../types';
import { CatchHeartsGame } from '../components/games/CatchHeartsGame';
import { PopBalloonsGame } from '../components/games/PopBalloonsGame';
import { MemoryMatchGame } from '../components/games/MemoryMatchGame';
import { GuessSurpriseGame } from '../components/games/GuessSurpriseGame';
import { audioEngine } from '../utils/audioEngine';

interface GamesPageProps {
  userName: string;
  onNavigate: (page: PageId) => void;
  onCelebrate: () => void;
}

const GAME_TABS: Array<{ id: MiniGameId; label: string; emoji: string }> = [
  { id: 'catch-hearts', label: 'Catch Hearts', emoji: '❤️' },
  { id: 'pop-balloons', label: 'Pop Balloons', emoji: '🎈' },
  { id: 'memory', label: 'Memory Match', emoji: '🧠' },
  { id: 'guess-gift', label: 'Guess Surprise', emoji: '🎁' },
];

export const GamesPage: React.FC<GamesPageProps> = ({
  userName,
  onNavigate,
  onCelebrate,
}) => {
  const [activeGame, setActiveGame] = useState<MiniGameId>('catch-hearts');

  const handleSelectGame = (id: MiniGameId) => {
    audioEngine.playClick();
    setActiveGame(id);
  };

  return (
    <main className="relative z-20 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h1 className="font-display text-glow-violet text-balance text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
          Birthday Mini-Games for {userName}
        </h1>
        <p className="font-body mt-2 text-sm text-violet-200/80 sm:text-base">
          Choose any of the four games below and set your high score.
        </p>
      </motion.div>

      {/* Game Selector Tabs */}
      <div
        role="tablist"
        aria-label="Select a mini-game"
        className="mx-auto mt-7 grid max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-4"
      >
        {GAME_TABS.map((tab) => {
          const active = activeGame === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleSelectGame(tab.id)}
              className={`font-ui flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-medium transition-all whitespace-nowrap sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                active
                  ? 'border-amber-300/60 bg-amber-300/18 text-amber-100 shadow-[0_0_24px_rgba(245,208,138,0.22)]'
                  : 'border-white/10 bg-white/[0.04] text-violet-200/80 hover:border-violet-300/35 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <span aria-hidden="true">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Game Container */}
      <section className="glass-panel mt-6 rounded-[2rem] p-4 sm:p-6">
        {activeGame === 'catch-hearts' && (
          <CatchHeartsGame userName={userName} onCelebrate={onCelebrate} />
        )}
        {activeGame === 'pop-balloons' && (
          <PopBalloonsGame userName={userName} onCelebrate={onCelebrate} />
        )}
        {activeGame === 'memory' && (
          <MemoryMatchGame userName={userName} onCelebrate={onCelebrate} />
        )}
        {activeGame === 'guess-gift' && (
          <GuessSurpriseGame userName={userName} onCelebrate={onCelebrate} />
        )}
      </section>

      {/* Footer Navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate('hub')}
          className="font-ui inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-violet-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Hub</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('message')}
          className="btn-shimmer font-ui inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-pink-300 px-6 py-2.5 text-sm font-semibold text-[#130821] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
        >
          <span>Open Your Special Letter</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
};
