import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Play } from 'lucide-react';
import { audioEngine } from '../../utils/audioEngine';

interface CatchHeartsGameProps {
  userName: string;
  onCelebrate: () => void;
}

interface FallingHeart {
  id: number;
  x: number; // percentage 6..94
  y: number; // percentage 0..105
  speed: number; // % per sec
  isGold: boolean;
  swayPhase: number;
}

interface FloatingPop {
  id: number;
  x: number;
  y: number;
  label: string;
  isGold: boolean;
}

type GamePhase = 'MENU' | 'PLAYING' | 'FINISHED';

export const CatchHeartsGame: React.FC<CatchHeartsGameProps> = ({
  userName,
  onCelebrate,
}) => {
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [basketX, setBasketX] = useState(50);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [pops, setPops] = useState<FloatingPop[]>([]);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const basketXRef = useRef(50);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const heartsRef = useRef<FallingHeart[]>([]);
  const nextIdRef = useRef(1);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  const startGame = () => {
    audioEngine.playClick();
    scoreRef.current = 0;
    comboRef.current = 0;
    heartsRef.current = [];
    basketXRef.current = 50;
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setBasketX(50);
    setHearts([]);
    setPops([]);
    setPhase('PLAYING');
  };

  // Countdown timer
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

  // Keyboard support
  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      keysRef.current = { left: false, right: false };
    };
  }, [phase]);

  // Main animation loop
  useEffect(() => {
    if (phase !== 'PLAYING') return;
    let rafId = 0;
    let lastTime = performance.now();
    let spawnAccumulator = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Keyboard movement
      if (keysRef.current.left) {
        basketXRef.current = Math.max(10, basketXRef.current - 72 * dt);
        setBasketX(basketXRef.current);
      }
      if (keysRef.current.right) {
        basketXRef.current = Math.min(90, basketXRef.current + 72 * dt);
        setBasketX(basketXRef.current);
      }

      // Spawn new hearts
      spawnAccumulator += dt;
      if (spawnAccumulator >= 0.48) {
        spawnAccumulator = 0;
        const isGold = Math.random() < 0.18;
        heartsRef.current.push({
          id: nextIdRef.current++,
          x: 8 + Math.random() * 84,
          y: -6,
          speed: isGold ? 42 + Math.random() * 14 : 28 + Math.random() * 18,
          isGold,
          swayPhase: Math.random() * Math.PI * 2,
        });
      }

      // Update positions & check basket collision
      const updated: FallingHeart[] = [];
      const bX = basketXRef.current;

      for (const h of heartsRef.current) {
        const nextY = h.y + h.speed * dt;
        const swayX = h.x + Math.sin(now / 360 + h.swayPhase) * 0.25;

        // Basket catch zone near bottom (y: 80..92, x within +/- 11%)
        if (nextY >= 79 && nextY <= 92 && Math.abs(swayX - bX) <= 11.5) {
          const pts = h.isGold ? 3 : 1;
          scoreRef.current += pts;
          comboRef.current += 1;
          setScore(scoreRef.current);
          setCombo(comboRef.current);
          audioEngine.playHeartCatch(comboRef.current);

          const popId = nextIdRef.current++;
          setPops((prev) => [
            ...prev.slice(-6),
            { id: popId, x: bX, y: 78, label: `+${pts}`, isGold: h.isGold },
          ]);
          window.setTimeout(() => {
            setPops((prev) => prev.filter((p) => p.id !== popId));
          }, 550);
          continue;
        }

        if (nextY > 103) {
          comboRef.current = 0;
          setCombo(0);
          continue;
        }

        updated.push({ ...h, y: nextY, x: Math.max(6, Math.min(94, swayX)) });
      }

      heartsRef.current = updated;
      setHearts([...updated]);

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [phase]);

  const updateBasketFromPointer = (clientX: number) => {
    if (!arenaRef.current || phase !== 'PLAYING') return;
    const rect = arenaRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(9, Math.min(91, pct));
    basketXRef.current = clamped;
    setBasketX(clamped);
  };

  const getRankMessage = () => {
    if (score >= 45) return `Heart-catching legend, ${userName}! Pure reflexes.`;
    if (score >= 25) return `Amazing catch streak, ${userName}! You're glowing.`;
    return `Sweet effort, ${userName}! Every single heart counts.`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
        <div className="flex items-center gap-5 font-ui text-sm">
          <div>
            <span className="text-violet-300/70">Score </span>
            <span className="font-semibold text-amber-200 tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-violet-300/70">Streak </span>
            <span className="font-semibold text-pink-300 tabular-nums">{combo}x</span>
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

      {/* Playfield */}
      <div
        ref={arenaRef}
        onPointerMove={(e) => updateBasketFromPointer(e.clientX)}
        onPointerDown={(e) => updateBasketFromPointer(e.clientX)}
        className="relative h-[380px] w-full overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-b from-[#170b2b]/90 to-[#0a0514]/95 select-none touch-none sm:h-[420px]"
      >
        {phase === 'MENU' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 text-4xl">❤️</div>
            <h3 className="font-display text-2xl font-semibold text-white">
              Catch The Hearts
            </h3>
            <p className="font-body mt-2 max-w-sm text-sm text-violet-200/80">
              Slide with your finger, mouse, or arrow keys to catch falling hearts for 30 seconds. Golden hearts give +3 points.
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
            <p className="font-script text-3xl text-amber-300">Time&apos;s Up</p>
            <h3 className="font-display mt-1 text-3xl font-bold text-white tabular-nums">
              Final Score: {score}
            </h3>
            <p className="font-body mt-2 max-w-sm text-sm text-violet-100/85">
              {getRankMessage()}
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

        {/* Falling Hearts */}
        {hearts.map((h) => (
          <div
            key={h.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
            }}
          >
            <svg
              width={h.isGold ? 34 : 28}
              height={h.isGold ? 34 : 28}
              viewBox="0 0 24 24"
              style={{
                filter: h.isGold
                  ? 'drop-shadow(0 0 10px rgba(245, 208, 138, 0.85))'
                  : 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.7))',
              }}
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={h.isGold ? '#F5D08A' : '#F472B6'}
              />
            </svg>
          </div>
        ))}

        {/* Score Popups */}
        {pops.map((p) => (
          <div
            key={p.id}
            className={`font-ui pointer-events-none absolute -translate-x-1/2 text-sm font-bold transition-transform duration-500 -translate-y-4 ${
              p.isGold ? 'text-amber-300' : 'text-pink-200'
            }`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {p.label}
          </div>
        ))}

        {/* Catcher Basket */}
        <div
          className="pointer-events-none absolute bottom-4 -translate-x-1/2"
          style={{ left: `${basketX}%` }}
        >
          <div
            className="flex h-11 w-24 items-center justify-center rounded-2xl border border-amber-300/60 bg-gradient-to-r from-violet-600/90 via-fuchsia-600/85 to-violet-600/90 shadow-[0_0_24px_rgba(244,114,182,0.45)]"
          >
            <div className="h-1.5 w-14 rounded-full bg-amber-200/80" />
          </div>
        </div>
      </div>
    </div>
  );
};
