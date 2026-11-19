import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface GuessSurpriseGameProps {
  userName: string;
  onCelebrate: () => void;
}

const SURPRISE_POOL = [
  {
    badge: 'Golden Fortune',
    text: 'This year brings an unexpected adventure that turns into your favorite memory of the decade.',
  },
  {
    badge: 'VIP Compliment',
    text: 'Honestly, your energy is the kind of sunshine people hope walks into every room.',
  },
  {
    badge: 'Plot Twist',
    text: 'Warning: Excessive laughter, spontaneous celebrations, and suspiciously good luck are heading your way.',
  },
  {
    badge: 'Secret Wish',
    text: 'May every quiet wish you make tonight unfold in ways even better than you imagined.',
  },
  {
    badge: 'Birthday Superpower',
    text: 'You have officially unlocked Main Character Charm for the next 365 days—use it wisely!',
  },
  {
    badge: 'Sweet Forecast',
    text: '100% chance of cake, zero regrets, and unforgettable moments with people who adore you.',
  },
];

function pickThreeSurprises(): typeof SURPRISE_POOL {
  const copy = [...SURPRISE_POOL];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 3);
}

export const GuessSurpriseGame: React.FC<GuessSurpriseGameProps> = ({
  userName,
  onCelebrate,
}) => {
  const [roundSurprises, setRoundSurprises] = useState(() => pickThreeSurprises());
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);

  const handleSelectBox = (idx: number) => {
    if (pickedIndex !== null) return;
    setPickedIndex(idx);
    audioEngine.playGiftOpen();
    onCelebrate();
  };

  const handleNewRound = () => {
    audioEngine.playClick();
    setPickedIndex(null);
    setRoundSurprises(pickThreeSurprises());
  };

  const boxColors = [
    { body: '#6D28D9', lid: '#8B5CF6', ribbon: '#F5D08A' },
    { body: '#BE185D', lid: '#EC4899', ribbon: '#FDE68A' },
    { body: '#4338CA', lid: '#6366F1', ribbon: '#F5D08A' },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-violet-300/20 bg-gradient-to-b from-[#170b2b]/90 to-[#0a0514]/95 p-6 text-center sm:p-8">
      <div>
        <h3 className="font-display text-2xl font-semibold text-white">
          Guess The Surprise
        </h3>
        <p className="font-body mt-1 text-sm text-violet-200/80">
          Choose one of the three mystery boxes below to reveal a personalized birthday surprise, {userName}.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        {roundSurprises.map((surprise, idx) => {
          const isPicked = pickedIndex === idx;
          const isRevealedOther = pickedIndex !== null && !isPicked;
          const palette = boxColors[idx];

          return (
            <motion.button
              key={idx}
              type="button"
              onClick={() => handleSelectBox(idx)}
              disabled={pickedIndex !== null}
              whileHover={pickedIndex === null ? { y: -6, scale: 1.03 } : undefined}
              whileTap={pickedIndex === null ? { scale: 0.96 } : undefined}
              className={`relative flex min-h-[190px] flex-col items-center justify-center rounded-2xl border p-5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                isPicked
                  ? 'border-amber-300/75 bg-amber-300/15 shadow-[0_0_32px_rgba(245,208,138,0.3)]'
                  : isRevealedOther
                  ? 'border-white/10 bg-white/[0.03] opacity-55'
                  : 'cursor-pointer border-violet-300/25 bg-white/[0.04] hover:border-amber-300/50 hover:bg-white/[0.07]'
              }`}
            >
              <svg viewBox="0 0 100 100" className="mb-3 h-20 w-20">
                <rect x="20" y="42" width="60" height="44" rx="6" fill={palette.body} />
                <rect x="45" y="42" width="10" height="44" fill={palette.ribbon} />
                <g
                  style={{
                    transform: isPicked ? 'translateY(-14px) rotate(-10deg)' : 'translateY(0)',
                    transformOrigin: '50px 36px',
                    transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <rect x="16" y="30" width="68" height="14" rx="4" fill={palette.lid} />
                  <rect x="45" y="30" width="10" height="14" fill={palette.ribbon} />
                  <circle cx="50" cy="27" r="6" fill={palette.ribbon} />
                </g>
              </svg>

              <span className="font-ui text-sm font-medium text-violet-100">
                {isPicked
                  ? surprise.badge
                  : isRevealedOther
                  ? 'Unchosen Box'
                  : `Mystery Box ${idx + 1}`}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {pickedIndex !== null && (
          <motion.div
            key={pickedIndex}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-xl rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5"
          >
            <p className="font-script text-3xl text-amber-300">
              {roundSurprises[pickedIndex].badge}
            </p>
            <p className="font-body mt-2 text-base leading-relaxed text-white">
              {roundSurprises[pickedIndex].text}
            </p>

            <button
              type="button"
              onClick={handleNewRound}
              className="btn-shimmer font-ui mt-5 inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 to-pink-300 px-6 py-2 text-sm font-semibold text-[#130821] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Try Another Round</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
