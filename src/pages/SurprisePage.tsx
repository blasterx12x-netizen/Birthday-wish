import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { PageId } from '../types';
import { FloatingBalloons } from '../components/FloatingBalloons';
import { BirthdayCake } from '../components/BirthdayCake';

interface SurprisePageProps {
  userName: string;
  onNavigate: (page: PageId) => void;
  onUnwrapCelebration: () => void;
  onCandleWish: () => void;
}

export const SurprisePage: React.FC<SurprisePageProps> = ({
  userName,
  onNavigate,
  onUnwrapCelebration,
  onCandleWish,
}) => {
  const [unwrapped, setUnwrapped] = useState(false);

  const handleUnwrap = () => {
    setUnwrapped(true);
    onUnwrapCelebration();
  };

  return (
    <main className="relative z-20 mx-auto flex min-h-[calc(100dvh-64px)] max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6">
      {unwrapped && <FloatingBalloons count={9} />}

      <AnimatePresence mode="wait">
        {!unwrapped ? (
          <motion.section
            key="closed-gift"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            {/* Interactive Luxury Gift Box */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              onClick={handleUnwrap}
              className="group relative cursor-pointer p-4"
            >
              {/* Soft radial halo */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-75"
                style={{
                  background:
                    'radial-gradient(circle, rgba(245,208,138,0.34) 0%, rgba(139,92,246,0.3) 50%, transparent 72%)',
                }}
              />

              <svg
                viewBox="0 0 220 220"
                className="relative z-10 h-52 w-52 drop-shadow-[0_24px_45px_rgba(0,0,0,0.75)] transition-transform duration-300 group-hover:scale-105 sm:h-60 sm:w-60"
              >
                <defs>
                  <linearGradient id="giftBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6D28D9" />
                    <stop offset="100%" stopColor="#2E1065" />
                  </linearGradient>
                  <linearGradient id="giftLid" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#5B21B6" />
                  </linearGradient>
                  <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FEF3C7" />
                    <stop offset="50%" stopColor="#F5D08A" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>

                {/* Shadow */}
                <ellipse cx="110" cy="196" rx="74" ry="12" fill="rgba(0,0,0,0.5)" />

                {/* Box Base */}
                <rect x="42" y="92" width="136" height="98" rx="12" fill="url(#giftBody)" stroke="rgba(245,208,138,0.45)" strokeWidth="1.5" />
                <rect x="98" y="92" width="24" height="98" fill="url(#goldRibbon)" />
                <rect x="42" y="132" width="136" height="16" fill="url(#goldRibbon)" opacity="0.88" />

                {/* Box Lid */}
                <g className="origin-bottom transition-transform duration-300 group-hover:-translate-y-2 group-hover:-rotate-2">
                  <rect x="34" y="66" width="152" height="30" rx="8" fill="url(#giftLid)" stroke="rgba(245,208,138,0.6)" strokeWidth="1.5" />
                  <rect x="98" y="66" width="24" height="30" fill="url(#goldRibbon)" />
                  {/* Bow */}
                  <path d="M110 66 C86 38, 56 44, 68 64 C76 70, 96 68, 110 66 Z" fill="url(#goldRibbon)" />
                  <path d="M110 66 C134 38, 164 44, 152 64 C144 70, 124 68, 110 66 Z" fill="url(#goldRibbon)" />
                  <circle cx="110" cy="64" r="9" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
                </g>

                {/* Subtle twinkling stars around box */}
                <circle cx="28" cy="70" r="3" fill="#FDE68A" />
                <circle cx="192" cy="84" r="2.5" fill="#F472B6" />
                <circle cx="176" cy="40" r="3" fill="#C4B5FD" />
              </svg>
            </motion.div>

            <h1 className="font-display text-balance mt-4 text-3xl font-semibold text-white sm:text-4xl">
              There&apos;s something waiting for you...
            </h1>
            <p className="font-body mt-2 max-w-md text-sm text-violet-200/75 sm:text-base">
              Wrapped with care exclusively for {userName}.
            </p>

            <motion.button
              type="button"
              onClick={handleUnwrap}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-shimmer font-ui mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full px-9 py-3.5 text-base font-semibold text-[#130821] shadow-[0_14px_40px_-8px_rgba(245,208,138,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
              style={{
                background:
                  'linear-gradient(135deg, #FEF3C7 0%, #F5D08A 50%, #F472B6 100%)',
              }}
            >
              <span>Unwrap Your Gift 🎁</span>
            </motion.button>
          </motion.section>
        ) : (
          <motion.section
            key="opened-surprise"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel-gold relative z-20 flex w-full max-w-3xl flex-col items-center rounded-[2rem] px-6 py-10 text-center sm:px-12 sm:py-12"
          >
            <p className="font-script text-3xl text-amber-300 sm:text-4xl">
              Cheers to another luminous year
            </p>

            <h1 className="font-display text-glow-gold text-balance mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              HAPPY BIRTHDAY, <span className="text-amber-200">{userName.toUpperCase()}</span>! 🎂
            </h1>

            <div className="my-7">
              <BirthdayCake onBlowOut={onCandleWish} />
            </div>

            <p className="font-body max-w-xl text-base leading-relaxed text-violet-100/90 sm:text-lg">
              Today celebrates every smile you&apos;ve sparked, every dream you&apos;re chasing, and all the unforgettable adventures still ahead of you, {userName}. May your year sparkle with warmth, serendipity, and pure joy.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onUnwrapCelebration}
                className="font-ui inline-flex min-h-[44px] items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/15 px-6 py-2.5 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-300/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
              >
                <span>Pop More Confetti 🎉</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('games')}
                className="btn-shimmer font-ui inline-flex min-h-[44px] items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold text-[#130821] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
                style={{
                  background:
                    'linear-gradient(135deg, #FDE68A 0%, #F5D08A 55%, #E8B4F8 100%)',
                }}
              >
                <span>Play Mini-Games</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('hub')}
                className="font-ui inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-violet-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Hub</span>
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
};
