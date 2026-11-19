import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { PageId } from '../types';

interface HubPageProps {
  userName: string;
  visitedPages: PageId[];
  onSelectPage: (page: PageId) => void;
}

interface HubCardConfig {
  id: PageId;
  title: string;
  description: string;
  accent: string;
  glow: string;
  illustration: React.ReactNode;
}

const TiltCard: React.FC<{
  card: HubCardConfig;
  visited: boolean;
  index: number;
  onClick: () => void;
}> = ({ card, visited, index, onClick }) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 11;
    const rx = (0.5 - py) * 11;
    setTilt({ rx, ry, active: true });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, active: false });
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.97 }}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
        transition: tilt.active
          ? 'transform 0.08s ease-out, box-shadow 0.25s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
        boxShadow: tilt.active
          ? `0 24px 54px -14px rgba(0,0,0,0.85), 0 0 36px -6px ${card.glow}`
          : '0 18px 42px -16px rgba(0,0,0,0.75)',
      }}
      className="glass-panel group relative flex w-full flex-col items-start justify-between overflow-hidden rounded-3xl p-6 text-left transition-colors hover:border-amber-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:p-7"
    >
      {/* Soft top-right radial sheen */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-35 blur-2xl transition-opacity duration-300 group-hover:opacity-65"
        style={{ background: card.accent }}
        aria-hidden="true"
      />

      {/* Custom Illustrated Icon Stage */}
      <div className="relative z-10 mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-transform duration-300 group-hover:scale-105">
        {card.illustration}
      </div>

      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            {card.title}
          </h2>
        </div>
        <p className="font-body mt-2 text-sm leading-relaxed text-violet-200/75">
          {card.description}
        </p>

        <div className="font-ui mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-medium">
          <span className={visited ? 'text-amber-200/90' : 'text-violet-300/70'}>
            {visited ? 'Explored' : 'Tap to open'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-200 transition-transform duration-200 group-hover:translate-x-1">
            <span>Enter</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export const HubPage: React.FC<HubPageProps> = ({
  userName,
  visitedPages,
  onSelectPage,
}) => {
  const cards: HubCardConfig[] = [
    {
      id: 'surprise',
      title: '🎁 Open Your Surprise',
      description:
        'A keepsake gift box waiting just for you, packed with confetti, balloons, and glowing candles.',
      accent: 'radial-gradient(circle, rgba(245,208,138,0.5), transparent 70%)',
      glow: 'rgba(245, 208, 138, 0.35)',
      illustration: (
        <svg viewBox="0 0 64 64" className="h-12 w-12 animate-float-slow">
          <rect x="12" y="26" width="40" height="28" rx="5" fill="#6D28D9" stroke="#F5D08A" strokeWidth="1.8" />
          <rect x="9" y="19" width="46" height="9" rx="3" fill="#8B5CF6" stroke="#F5D08A" strokeWidth="1.8" />
          <rect x="29" y="19" width="6" height="35" fill="#F5D08A" />
          <path d="M32 19 C26 11, 18 13, 22 19 Z" fill="#FDE68A" />
          <path d="M32 19 C38 11, 46 13, 42 19 Z" fill="#F5D08A" />
        </svg>
      ),
    },
    {
      id: 'games',
      title: '🎮 Play Some Games',
      description:
        'Four interactive birthday mini-games: catch falling hearts, pop balloons, match cards, and guess the gift.',
      accent: 'radial-gradient(circle, rgba(139,92,246,0.55), transparent 70%)',
      glow: 'rgba(139, 92, 246, 0.4)',
      illustration: (
        <svg viewBox="0 0 64 64" className="h-12 w-12 animate-float-slow" style={{ animationDelay: '-1.5s' }}>
          <rect x="8" y="20" width="48" height="28" rx="14" fill="#3B0764" stroke="#C4B5FD" strokeWidth="1.8" />
          <path d="M22 29 V39 M17 34 H27" stroke="#F5D08A" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="43" cy="30" r="2.6" fill="#F472B6" />
          <circle cx="48" cy="35" r="2.6" fill="#F5D08A" />
          <circle cx="38" cy="35" r="2.6" fill="#A78BFA" />
        </svg>
      ),
    },
    {
      id: 'message',
      title: '💌 A Special Message',
      description:
        'Break the champagne wax seal and unfold a heartfelt birthday letter written in your honor.',
      accent: 'radial-gradient(circle, rgba(244,114,182,0.5), transparent 70%)',
      glow: 'rgba(244, 114, 182, 0.35)',
      illustration: (
        <svg viewBox="0 0 64 64" className="h-12 w-12 animate-float-slow" style={{ animationDelay: '-3s' }}>
          <rect x="9" y="17" width="46" height="32" rx="5" fill="#2E1065" stroke="#FBCFE8" strokeWidth="1.8" />
          <path d="M10 19 L32 36 L54 19" stroke="#F5D08A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="32" cy="35" r="6" fill="#F472B6" />
          <path d="M32 38 C29.5 36, 29 33.5, 30.8 32.5 C31.7 32, 32 33, 32 33 C32 33, 32.3 32, 33.2 32.5 C35 33.5, 34.5 36, 32 38 Z" fill="#FFF1F2" />
        </svg>
      ),
    },
    {
      id: 'unexpected',
      title: '✨ Something Unexpected',
      description:
        'Three golden mystery cards holding a compliment, a playful prediction, and a secret birthday wish.',
      accent: 'radial-gradient(circle, rgba(196,181,253,0.48), transparent 70%)',
      glow: 'rgba(196, 181, 253, 0.38)',
      illustration: (
        <svg viewBox="0 0 64 64" className="h-12 w-12 animate-float-slow" style={{ animationDelay: '-4.2s' }}>
          <rect x="17" y="11" width="30" height="42" rx="5" fill="#1E1B4B" stroke="#F5D08A" strokeWidth="1.8" />
          <path
            d="M32 20 L34.6 27.4 L42 30 L34.6 32.6 L32 40 L29.4 32.6 L22 30 L29.4 27.4 Z"
            fill="#F5D08A"
          />
          <circle cx="23" cy="18" r="1.4" fill="#C4B5FD" />
          <circle cx="41" cy="45" r="1.4" fill="#F472B6" />
        </svg>
      ),
    },
  ];

  return (
    <main className="relative z-20 mx-auto flex min-h-[calc(100dvh-64px)] max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <h1 className="font-display text-glow-gold text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Hey, <span className="text-amber-200">{userName}</span>! 👀
        </h1>
        <p className="font-body mt-3 text-base text-violet-200/80 sm:text-lg">
          We&apos;ve prepared something special for you.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {cards.map((card, index) => (
          <TiltCard
            key={card.id}
            card={card}
            index={index}
            visited={visitedPages.includes(card.id)}
            onClick={() => onSelectPage(card.id)}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-10 flex flex-col items-center justify-center gap-3 text-center"
      >
        <p className="font-body text-xs text-violet-300/65">
          {visitedPages.length >= 3
            ? 'Ready for the grand celebration?'
            : 'Explore each card above, or skip ahead whenever you are ready.'}
        </p>
        <button
          type="button"
          onClick={() => onSelectPage('finale')}
          className="btn-shimmer font-ui inline-flex min-h-[44px] items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/12 px-7 py-2.5 text-sm font-medium text-amber-100 transition-all hover:bg-amber-300/22 hover:border-amber-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
        >
          <span>Continue to The Grand Finale</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </main>
  );
};
