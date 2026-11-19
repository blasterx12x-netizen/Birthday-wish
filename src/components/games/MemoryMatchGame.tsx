import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface MemoryMatchGameProps {
  userName: string;
  onCelebrate: () => void;
}

interface CardItem {
  uid: number;
  pairId: string;
  label: string;
  flipped: boolean;
  matched: boolean;
}

const SYMBOLS: Array<{ pairId: string; label: string; render: () => React.ReactNode }> = [
  {
    pairId: 'cake',
    label: 'Cake',
    render: () => (
      <svg viewBox="0 0 48 48" className="h-10 w-10">
        <rect x="10" y="24" width="28" height="14" rx="3" fill="#8B5CF6" stroke="#F5D08A" strokeWidth="1.5" />
        <path d="M10 26 C15 31, 20 24, 24 28 C28 31, 33 24, 38 26 L38 24 L10 24 Z" fill="#FDE68A" />
        <rect x="22" y="13" width="4" height="11" rx="1.5" fill="#F472B6" />
        <path d="M24 6 C26.5 9, 26.5 12, 24 13 C21.5 12, 21.5 9, 24 6 Z" fill="#FDE047" />
      </svg>
    ),
  },
  {
    pairId: 'gift',
    label: 'Gift',
    render: () => (
      <svg viewBox="0 0 48 48" className="h-10 w-10">
        <rect x="11" y="20" width="26" height="18" rx="3" fill="#EC4899" stroke="#F5D08A" strokeWidth="1.5" />
        <rect x="9" y="15" width="30" height="6" rx="2" fill="#F472B6" />
        <rect x="22" y="15" width="4" height="23" fill="#F5D08A" />
        <circle cx="24" cy="14" r="3" fill="#FDE68A" />
      </svg>
    ),
  },
  {
    pairId: 'crown',
    label: 'Crown',
    render: () => (
      <svg viewBox="0 0 48 48" className="h-10 w-10">
        <path
          d="M9 33 L12 16 L20 24 L24 13 L28 24 L36 16 L39 33 Z"
          fill="#F5D08A"
          stroke="#FEF3C7"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect x="10" y="34" width="28" height="4" rx="2" fill="#D97706" />
      </svg>
    ),
  },
  {
    pairId: 'balloon',
    label: 'Balloon',
    render: () => (
      <svg viewBox="0 0 48 48" className="h-10 w-10">
        <ellipse cx="24" cy="20" rx="11" ry="13.5" fill="#A78BFA" stroke="#EDE9FE" strokeWidth="1.5" />
        <ellipse cx="20" cy="15" rx="3" ry="5" transform="rotate(-20 20 15)" fill="#FFFFFF" opacity="0.45" />
        <path d="M24 34 Q22 39 25 44" stroke="#F5D08A" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    pairId: 'toast',
    label: 'Cheers',
    render: () => (
      <svg viewBox="0 0 48 48" className="h-10 w-10">
        <path d="M14 11 H22 L20 24 C19.5 27, 16.5 27, 16 24 Z" fill="#FDE68A" opacity="0.9" />
        <path d="M26 11 H34 L32 24 C31.5 27, 28.5 27, 28 24 Z" fill="#F472B6" opacity="0.85" />
        <line x1="18" y1="27" x2="18" y2="37" stroke="#F5D08A" strokeWidth="2" />
        <line x1="30" y1="27" x2="30" y2="37" stroke="#F5D08A" strokeWidth="2" />
        <line x1="14" y1="37" x2="22" y2="37" stroke="#F5D08A" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="37" x2="34" y2="37" stroke="#F5D08A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    pairId: 'star',
    label: 'Star',
    render: () => (
      <svg viewBox="0 0 48 48" className="h-10 w-10">
        <path
          d="M24 8 L28.5 18.2 L39.5 19.5 L31.2 27.1 L33.4 38 L24 32.5 L14.6 38 L16.8 27.1 L8.5 19.5 L19.5 18.2 Z"
          fill="#F5D08A"
          stroke="#FEF3C7"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function buildDeck(): CardItem[] {
  const doubled = [...SYMBOLS, ...SYMBOLS].map((sym, idx) => ({
    uid: idx + 1,
    pairId: sym.pairId,
    label: sym.label,
    flipped: false,
    matched: false,
  }));
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  userName,
  onCelebrate,
}) => {
  const [cards, setCards] = useState<CardItem[]>(() => buildDeck());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const resetGame = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    audioEngine.playClick();
    setCards(buildDeck());
    setSelectedIds([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  const handleCardClick = (card: CardItem) => {
    if (locked || card.flipped || card.matched || won) return;
    audioEngine.playCardFlip();

    const updatedCards = cards.map((c) =>
      c.uid === card.uid ? { ...c, flipped: true } : c
    );
    setCards(updatedCards);

    const nextSelected = [...selectedIds, card.uid];
    setSelectedIds(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);

      const first = updatedCards.find((c) => c.uid === nextSelected[0]);
      const second = updatedCards.find((c) => c.uid === nextSelected[1]);

      if (first && second && first.pairId === second.pairId) {
        timerRef.current = window.setTimeout(() => {
          setCards((prev) => {
            const matchedState = prev.map((c) =>
              c.uid === first.uid || c.uid === second.uid
                ? { ...c, matched: true }
                : c
            );
            const allMatched = matchedState.every((c) => c.matched);
            if (allMatched) {
              setWon(true);
              audioEngine.playVictory();
              onCelebrate();
            } else {
              audioEngine.playHeartCatch(3);
            }
            return matchedState;
          });
          setSelectedIds([]);
          setLocked(false);
        }, 280);
      } else {
        timerRef.current = window.setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === nextSelected[0] || c.uid === nextSelected[1]
                ? { ...c, flipped: false }
                : c
            )
          );
          setSelectedIds([]);
          setLocked(false);
        }, 680);
      }
    }
  };

  const matchedPairs = cards.filter((c) => c.matched).length / 2;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
        <div className="flex items-center gap-5 font-ui text-sm">
          <div>
            <span className="text-violet-300/70">Moves </span>
            <span className="font-semibold text-amber-200 tabular-nums">{moves}</span>
          </div>
          <div>
            <span className="text-violet-300/70">Pairs </span>
            <span className="font-semibold text-violet-100 tabular-nums">
              {matchedPairs}/6
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={resetGame}
          className="font-ui inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-violet-100 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="relative rounded-3xl border border-violet-300/20 bg-gradient-to-b from-[#170b2b]/90 to-[#0a0514]/95 p-4 sm:p-6">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
          {cards.map((card) => {
            const symbol = SYMBOLS.find((s) => s.pairId === card.pairId);
            const isRevealed = card.flipped || card.matched;

            return (
              <button
                key={card.uid}
                type="button"
                onClick={() => handleCardClick(card)}
                aria-label={isRevealed ? card.label : 'Hidden memory card'}
                className="perspective-1200 group relative aspect-square w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-2xl"
              >
                <div
                  className={`preserve-3d relative h-full w-full transition-transform duration-500 ${
                    isRevealed ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Card Back */}
                  <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-2xl border border-violet-300/25 bg-gradient-to-br from-[#2b144f] to-[#140929] shadow-md transition-colors group-hover:border-amber-300/50">
                    <span className="font-script text-2xl text-amber-300/75">B</span>
                  </div>

                  {/* Card Front */}
                  <div
                    className={`backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl border p-2 ${
                      card.matched
                        ? 'border-amber-300/70 bg-amber-300/15 shadow-[0_0_22px_rgba(245,208,138,0.28)]'
                        : 'border-violet-300/40 bg-[#1f103a]'
                    }`}
                  >
                    {symbol?.render()}
                    <span className="font-ui text-[11px] font-medium text-violet-100/90">
                      {card.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {won && (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5 text-center">
            <p className="font-script text-3xl text-amber-300">Memory Mastered</p>
            <p className="font-body mt-1 text-sm text-violet-100">
              Brilliant focus, {userName}! You matched all 6 pairs in {moves} moves.
            </p>
            <button
              type="button"
              onClick={resetGame}
              className="btn-shimmer font-ui mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 to-pink-300 px-6 py-2 text-sm font-semibold text-[#130821] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
