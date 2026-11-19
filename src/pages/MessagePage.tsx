import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import type { PageId } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface MessagePageProps {
  userName: string;
  onNavigate: (page: PageId) => void;
}

export const MessagePage: React.FC<MessagePageProps> = ({
  userName,
  onNavigate,
}) => {
  const [opened, setOpened] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);

  const handleOpenLetter = () => {
    audioEngine.playEnvelopeOpen();
    setFlapOpen(true);
    window.setTimeout(() => {
      setOpened(true);
    }, 520);
  };

  const handleResetEnvelope = () => {
    audioEngine.playClick();
    setOpened(false);
    setFlapOpen(false);
  };

  return (
    <main className="relative z-20 mx-auto flex min-h-[calc(100dvh-64px)] max-w-4xl flex-col items-center justify-center px-4 py-12 sm:px-6">
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.section
            key="envelope-closed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            {/* Luxury Interactive Envelope */}
            <div
              onClick={handleOpenLetter}
              role="button"
              tabIndex={0}
              aria-label="Open birthday envelope"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenLetter();
                }
              }}
              className="group relative cursor-pointer p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-3xl"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-full blur-3xl opacity-70 transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(circle, rgba(244,114,182,0.28) 0%, rgba(139,92,246,0.28) 55%, transparent 75%)',
                }}
              />

              <div className="relative h-52 w-80 sm:h-60 sm:w-96">
                {/* Inner parchment card peeking out when flap opens */}
                <div
                  className={`absolute inset-x-4 top-3 h-40 rounded-t-xl border border-amber-200/40 bg-[#FDF8EE] transition-transform duration-500 ease-out ${
                    flapOpen ? '-translate-y-12' : 'translate-y-2'
                  }`}
                >
                  <div className="p-4 text-left">
                    <div className="h-2 w-24 rounded-full bg-amber-900/20" />
                    <div className="mt-2 h-2 w-40 rounded-full bg-amber-900/10" />
                  </div>
                </div>

                {/* Envelope Back & Pocket */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl border border-amber-300/35 bg-gradient-to-br from-[#2B144E] to-[#150928] shadow-[0_24px_50px_rgba(0,0,0,0.75)]">
                  {/* Bottom diagonal folds */}
                  <svg viewBox="0 0 384 240" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                    <path d="M0 240 L192 118 L384 240 Z" fill="#1F0E3A" stroke="rgba(245,208,138,0.2)" strokeWidth="1" />
                    <path d="M0 0 L192 126 L0 240 Z" fill="#251145" opacity="0.85" />
                    <path d="M384 0 L192 126 L384 240 Z" fill="#220F40" opacity="0.85" />
                  </svg>
                </div>

                {/* Top Flap */}
                <div
                  className="absolute inset-x-0 top-0 h-1/2 origin-top transition-transform duration-500 ease-out"
                  style={{
                    transform: flapOpen ? 'rotateX(165deg)' : 'rotateX(0deg)',
                  }}
                >
                  <svg viewBox="0 0 384 125" className="h-full w-full drop-shadow-md" preserveAspectRatio="none">
                    <path
                      d="M0 0 L384 0 L192 122 Z"
                      fill="#341860"
                      stroke="rgba(245,208,138,0.38)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Champagne Wax Seal */}
                <div
                  className={`absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/70 bg-gradient-to-br from-amber-300 via-amber-400 to-rose-400 shadow-[0_6px_22px_rgba(245,208,138,0.5)] transition-all duration-300 ${
                    flapOpen ? 'scale-0 opacity-0' : 'group-hover:scale-110'
                  }`}
                >
                  <span className="font-script text-2xl font-bold text-[#200B38]">
                    B
                  </span>
                </div>
              </div>
            </div>

            <h1 className="font-display text-balance mt-6 text-3xl font-semibold text-white sm:text-4xl">
              Someone has something to tell you...
            </h1>
            <p className="font-body mt-2 text-sm text-violet-200/75 sm:text-base">
              Sealed especially for {userName}.
            </p>

            <motion.button
              type="button"
              onClick={handleOpenLetter}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-shimmer font-ui mt-7 inline-flex min-h-[50px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-pink-300 px-8 py-3 text-base font-semibold text-[#130821] shadow-[0_14px_36px_-8px_rgba(244,114,182,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
            >
              <span>Open Your Letter 💌</span>
            </motion.button>
          </motion.section>
        ) : (
          <motion.section
            key="letter-opened"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl"
          >
            <article className="glass-panel-gold relative overflow-hidden rounded-[2rem] px-7 py-10 sm:px-12 sm:py-14">
              {/* Decorative subtle corner filigree */}
              <div
                className="pointer-events-none absolute right-6 top-6 h-16 w-16 rounded-full border border-amber-300/20"
                aria-hidden="true"
              />

              <p className="font-script text-3xl text-amber-300 sm:text-4xl">
                A Birthday Note
              </p>

              <h1 className="font-display mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Hey {userName}!
              </h1>

              <div className="font-body mt-6 space-y-4 text-base leading-relaxed text-violet-100/90 sm:text-lg sm:leading-relaxed">
                <p>
                  Today is all about you! May your life be filled with happiness,
                  unforgettable memories, endless laughter and beautiful surprises.
                </p>
                <p>
                  Keep smiling, keep shining and never stop being amazing.
                </p>
                <p>
                  You deserve all the wonderful things life has to offer.
                </p>
              </div>

              <p className="font-display text-glow-gold mt-8 text-xl font-semibold text-amber-200 sm:text-2xl">
                Once again, HAPPY BIRTHDAY! 🎂❤️
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={handleResetEnvelope}
                  className="font-ui inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-violet-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Replay Envelope</span>
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onNavigate('hub')}
                    className="font-ui inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-violet-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Hub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('unexpected')}
                    className="btn-shimmer font-ui inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-pink-300 px-6 py-2 text-sm font-semibold text-[#130821] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
                  >
                    <span>Something Unexpected</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
};
