import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface PopBalloonsGameProps {
  userName: string;
  onCelebrate: () => void;
}

interface BalloonItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  highlight: string;
  isGold: boolean;
  scale: number;
}

interface PopBurst {
  id: number;
  x: number;
  y: number;
  color: string;
  points: number;
}

type GamePhase = 'MENU' | 'PLAYING' | 'FINISHED';

const COLORS = [
  { color: '#8B5CF6', highlight: '#DDD6FE' },
  { color: '#F472B6', highlight: '#FCE7F3' },
  { color: '#A855F7', highlight: '#F3E8FF' },
  { color: '#EC4899', highlight: '#FBCFE8' },
];

export const PopBalloonsGame: React.FC<PopBalloonsGameProps> = ({
  userName,
  onCelebrate,
}) => {
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [score, setScore] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [bursts, setBursts] = useState<PopBurst[]>([]);

  const balloonsRef = useRef<BalloonItem[]>([]);
  const nextIdRef = useRef(1);

  const startGame = () => {
    audioEngine.playClick();
    balloonsRef.current = [];
    setBalloons([]);
    setBursts([]);
    setScore(0);
    setPoppedCount(0);
    setTimeLeft(30);
    setPhase('PLAYING');
  };

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setPhase('FINISHED');
          audioEngine.playVictory();
          onCelebrate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [phase, onCelebrate]);

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    let rafId = 0;
    let lastTime = performance.now();
    let spawnAcc = 0.4;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      spawnAcc += dt;
      if (spawnAcc >= 0.52) {
        spawnAcc = 0;
        const isGold = Math.random() < 0.16;
        const palette = COLORS[Math.floor(Math.random() * COLORS.length)];
        balloonsRef.current.push({
          id: nextIdRef.current++,
          x: 10 + Math.random() * 80,
          y: 108,
          speed: isGold ? 34 + Math.random() * 14 : 20 + Math.random() * 16,
          color: isGold ? '#F5D08A' : palette.color,
          highlight: isGold ? '#FFFBEB' : palette.highlight,
          isGold,
          scale: isGold ? 0.92 : 0.95 + Math.random() * 0.2,
        });
      }

      const nextList: BalloonItem[] = [];
      for (const b of balloonsRef.current) {
        const ny = b.y - b.speed * dt;
        if (ny > -16) {
          nextList.push({ ...b, y: ny });
        }
      }
      balloonsRef.current = nextList;
      setBalloons([...nextList]);

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [phase]);

  const handlePop = (balloon: BalloonItem) => {
    if (phase !== 'PLAYING') return;
    audioEngine.playBalloonPop();

    const pts = balloon.isGold ? 3 : 1;
    setScore((s) => s + pts);
    setPoppedCount((c) => c + 1);

    balloonsRef.current = balloonsRef.current.filter((b) => b.id !== balloon.id);
    setBalloons([...balloonsRef.current]);

    const burstId = nextIdRef.current++;
    setBursts((prev) => [
      ...prev.slice(-8),
      { id: burstId, x: balloon.x, y: balloon.y, color: balloon.color, points: pts },
    ]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((item) => item.id !== burstId));
    }, 420);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
        <div className="flex items-center gap-5 font-ui text-sm">
          <div>
            <span className="text-violet-300/70">Score </span>
            <span className="font-semibold text-amber-200 tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-violet-300/70">Popped </span>
            <span className="font-semibold text-violet-100 tabular-nums">{poppedCount}</span>
          </div>
        </div>
        <div className="font-ui flex items-center gap-3 text-sm">
          <span className="text-violet-300/70">Time</span>
          <span
            className={`font-semibold tabular-nums ${
              timeLeft <= 5 && phase === 'PLAYING' ? 'text-rose-400' : 'text-white'
            }`}
          >
            {timeLeft}s
          </span>
        </div>
      </div>

      <div className="relative h-[380px] w-full overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-b from-[#170b2b]/90 to-[#0a0514]/95 select-none sm:h-[420px]">
        {phase === 'MENU' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 text-4xl">🎈</div>
            <h3 className="font-display text-2xl font-semibold text-white">
              Pop The Balloons
            </h3>
            <p className="font-body mt-2 max-w-sm text-sm text-violet-200/80">
              Tap or click rising balloons before they float away! Golden balloons are worth +3 points.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="btn-shimmer font-ui mt-6 inline-flex min-h-[46px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-pink-300 px-7 py-2.5 text-sm font-semibold text-[#130821] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {phase === 'FINISHED' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#090412]/80 p-6 text-center backdrop-blur-md">
            <p className="font-script text-3xl text-amber-300">Celebration Complete</p>
            <h3 className="font-display mt-1 text-3xl font-bold text-white tabular-nums">
              Final Score: {score}
            </h3>
            <p className="font-body mt-2 max-w-sm text-sm text-violet-100/85">
              You popped {poppedCount} balloons in 30 seconds, {userName}!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="btn-shimmer font-ui mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 to-pink-300 px-7 py-2.5 text-sm font-semibold text-[#130821] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}

        {/* Active Balloons */}
        {balloons.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-label={b.isGold ? 'Pop golden balloon' : 'Pop balloon'}
            onPointerDown={(e) => {
              e.stopPropagation();
              handlePop(b);
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2 touch-manipulation focus:outline-none"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: `translate(-50%, -50%) scale(${b.scale})`,
            }}
          >
            <svg
              width="58"
              height="82"
              viewBox="0 0 60 86"
              style={{
                filter: `drop-shadow(0 8px 16px ${b.color}66)`,
              }}
            >
              <path
                d="M30 62 Q27 72 31 84"
                stroke="rgba(245,208,138,0.55)"
                strokeWidth="1.4"
                fill="none"
              />
              <polygon points="27,62 33,62 30,57" fill={b.color} />
              <ellipse cx="30" cy="30" rx="23" ry="28" fill={b.color} />
              <ellipse
                cx="22"
                cy="20"
                rx="6"
                ry="10"
                transform="rotate(-22 22 20)"
                fill={b.highlight}
                opacity="0.5"
              />
            </svg>
          </button>
        ))}

        {/* Pop Burst Feedback */}
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
          >
            <div
              className="h-14 w-14 animate-ping rounded-full border-2 opacity-75"
              style={{ borderColor: burst.color }}
            />
            <span className="font-ui absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-amber-200">
              +{burst.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
