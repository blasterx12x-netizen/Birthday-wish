import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';
import type { PageId, SurpriseCardData } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface UnexpectedPageProps {
  userName: string;
  onNavigate: (page: PageId) => void;
  onAllFlippedCelebration: () => void;
}

const COMPLIMENTS = [
  'You have a rare gift for making ordinary moments feel effortless and warm just by showing up.',
  'Your laugh is genuinely contagious, and the world is noticeably kinder with your energy in it.',
  'People remember how safe, seen, and uplifted they feel around you—that is real magic.',
  'You carry grace, curiosity, and resilience in a way that inspires everyone lucky enough to know you.',
];

const PREDICTIONS = [
  'Within the next 30 days, an unexpected piece of good news will make you grin at your phone like a movie scene.',
  'Warning: You are about to stumble into a ridiculously good meal, an unforgettable song, and a spontaneous laugh attack.',
  'Forecast for your new year: 98% chance of main-character luck, 100% chance of cake seconds.',
  'A random Tuesday this year is secretly plotting to become one of your favorite memories ever.',
];

const WISHES = [
  'May your quietest hopes find their fastest path to coming true—and surprise you with how good they feel.',
  'Here is to fearless mornings, peaceful nights, and friendships that feel like home wherever you go.',
  'May this next chapter bring you bold adventures, gentle moments, and endless reasons to celebrate yourself.',
  'May every door you knock on open warmly, and every risk you take bloom into something extraordinary.',
];

function drawThreeCards(name: string): SurpriseCardData[] {
  const c = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
  const p = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];
  const w = WISHES[Math.floor(Math.random() * WISHES.length)];

  return [
    {
      id: 'compliment',
      category: 'compliment',
      title: 'A Birthday Compliment',
      content: `${name}, ${c.charAt(0).toLowerCase()}${c.slice(1)}`,
    },
    {
      id: 'prediction',
      category: 'prediction',
      title: 'A Funny Prediction',
      content: p,
    },
    {
      id: 'wish',
      category: 'wish',
      title: 'A Secret Birthday Wish',
      content: w,
    },
  ];
}

export const UnexpectedPage: React.FC<UnexpectedPageProps> = ({
  userName,
  onNavigate,
  onAllFlippedCelebration,
}) => {
  const [cards, setCards] = useState<SurpriseCardData[]>(() => drawThreeCards(userName));
  const [flippedIds, setFlippedIds] = useState<string[]>([]);

  const handleFlip = (id: string) => {
    if (flippedIds.includes(id)) return;
    audioEngine.playCardFlip();
    const next = [...flippedIds, id];
    setFlippedIds(next);
    if (next.length === 3) {
      window.setTimeout(() => {
        audioEngine.playVictory();
        onAllFlippedCelebration();
      }, 320);
    }
  };

  const handleShuffle = () => {
    audioEngine.playClick();
    setFlippedIds([]);
    window.setTimeout(() => {
      setCards(drawThreeCards(userName));
    }, 220);
  };

  const cardNumbers = ['I', 'II', 'III'];
  const cardSubtitles = ['Tap to Reveal Compliment', 'Tap to Reveal Prediction', 'Tap to Reveal Secret Wish'];

  return (
    <main className="relative z-20 mx-auto flex min-h-[calc(100dvh-64px)] max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h1 className="font-display text-glow-gold text-balance text-3xl font-semibold text-white sm:text-5xl">
          Wait... You&apos;re Not Done Yet! 👀
        </h1>
        <p className="font-body mx-auto mt-3 max-w-lg text-sm text-violet-200/80 sm:text-base">
          Each mystery card below holds a surprise drawn just for {userName}. Tap all three to flip them over.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card, idx) => {
          const isFlipped = flippedIds.includes(card.id);
          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card.id)}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + idx * 0.08 }}
              aria-label={isFlipped ? `${card.title}: ${card.content}` : `Flip mystery card ${idx + 1}`}
              className="perspective-1200 group h-[310px] w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-3xl"
            >
              <div
                className={`preserve-3d relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Face (Unflipped Mystery Card) */}
                <div className="backface-hidden glass-panel absolute inset-0 flex flex-col items-center justify-between rounded-3xl border border-amber-300/30 p-7 text-center transition-colors group-hover:border-amber-300/65">
                  <span className="font-display text-sm tracking-widest text-amber-300/80">
                    CARD {cardNumbers[idx]}
                  </span>

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 48 48" className="h-11 w-11">
                      <path
                        d="M24 6 L28.2 19.8 L42 24 L28.2 28.2 L24 42 L19.8 28.2 L6 24 L19.8 19.8 Z"
                        fill="#F5D08A"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="font-display text-lg font-medium text-white">
                      {card.title}
                    </p>
                    <p className="font-ui mt-1 text-xs text-violet-300/75">
                      {cardSubtitles[idx]}
                    </p>
                  </div>
                </div>

                {/* Back Face (Revealed Surprise) */}
                <div className="backface-hidden rotate-y-180 glass-panel-gold absolute inset-0 flex flex-col items-center justify-between rounded-3xl p-7 text-center">
                  <span className="font-script text-3xl text-amber-300">
                    {card.title}
                  </span>

                  <p className="font-body text-sm leading-relaxed text-violet-50 sm:text-base">
                    {card.content}
                  </p>

                  <span className="font-ui text-xs font-medium text-amber-200/80">
                    Revealed for {userName}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
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
            onClick={handleShuffle}
            className="font-ui inline-flex min-h-[44px] items-center gap-2 rounded-full border border-violet-300/30 bg-violet-500/15 px-5 py-2.5 text-sm font-medium text-violet-100 transition-colors hover:bg-violet-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
          >
            <Shuffle className="h-4 w-4" />
            <span>Shuffle New Cards</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('finale')}
          className="btn-shimmer font-ui inline-flex min-h-[46px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-pink-300 px-7 py-2.5 text-sm font-semibold text-[#130821] shadow-[0_12px_30px_-8px_rgba(245,208,138,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
        >
          <span>Enter The Grand Finale</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
};
