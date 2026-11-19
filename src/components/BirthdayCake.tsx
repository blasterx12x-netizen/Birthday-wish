import React, { useState, useEffect } from 'react';

interface BirthdayCakeProps {
  forceLitSignal?: number;
  onBlowOut?: () => void;
  size?: 'md' | 'lg';
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  forceLitSignal = 0,
  onBlowOut,
  size = 'md',
}) => {
  const [candlesLit, setCandlesLit] = useState(true);

  useEffect(() => {
    if (forceLitSignal > 0) {
      setCandlesLit(true);
    }
  }, [forceLitSignal]);

  const handleToggleCandles = () => {
    const next = !candlesLit;
    setCandlesLit(next);
    if (!next) {
      onBlowOut?.();
    }
  };

  const candlePositions = [96, 120, 144, 168, 192];

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggleCandles}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleCandles();
          }
        }}
        aria-label={candlesLit ? 'Make a wish and blow out candles' : 'Relight birthday candles'}
        className={`group relative cursor-pointer rounded-2xl p-2 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 ${
          size === 'lg' ? 'w-[260px] sm:w-[300px]' : 'w-[220px] sm:w-[250px]'
        }`}
      >
        {/* Warm aura behind candles */}
        <div
          className={`pointer-events-none absolute left-1/2 top-4 h-28 w-44 -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-500 ${
            candlesLit ? 'opacity-90' : 'opacity-15'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(245, 208, 138, 0.45) 0%, rgba(244, 114, 182, 0.18) 55%, transparent 75%)',
          }}
        />

        <svg viewBox="0 0 288 238" className="relative z-10 w-full h-auto drop-shadow-[0_18px_36px_rgba(0,0,0,0.65)]">
          <defs>
            <linearGradient id="cakePlate" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9A7234" />
              <stop offset="30%" stopColor="#F5D08A" />
              <stop offset="70%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#9A7234" />
            </linearGradient>
            <linearGradient id="tierBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4C1D95" />
              <stop offset="100%" stopColor="#260E4D" />
            </linearGradient>
            <linearGradient id="tierTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6D28D9" />
              <stop offset="100%" stopColor="#3B0764" />
            </linearGradient>
            <linearGradient id="icingGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5D08A" />
              <stop offset="50%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#DDD6FE" />
            </linearGradient>
          </defs>

          {/* Pedestal stand */}
          <path d="M124 202 L164 202 L174 222 L114 222 Z" fill="url(#cakePlate)" opacity="0.9" />
          <ellipse cx="144" cy="224" rx="52" ry="7" fill="url(#cakePlate)" />
          <ellipse cx="144" cy="200" rx="112" ry="12" fill="url(#cakePlate)" />
          <ellipse cx="144" cy="198" rx="108" ry="9" fill="#1F1035" opacity="0.35" />

          {/* Bottom Tier */}
          <rect x="52" y="136" width="184" height="62" rx="12" fill="url(#tierBottom)" stroke="rgba(245,208,138,0.35)" strokeWidth="1.2" />
          {/* Bottom icing drips */}
          <path
            d="M52 142 C52 135, 236 135, 236 142 L236 154 C226 164, 214 150, 202 158 C190 166, 178 149, 166 158 C154 167, 142 150, 130 158 C118 166, 106 149, 94 157 C82 165, 68 150, 52 155 Z"
            fill="url(#icingGlow)"
            opacity="0.92"
          />
          {/* Gold pearls along bottom rim */}
          {Array.from({ length: 13 }).map((_, idx) => (
            <circle key={idx} cx={62 + idx * 13.6} cy={193} r={2.8} fill="#F5D08A" />
          ))}

          {/* Top Tier */}
          <rect x="78" y="84" width="132" height="54" rx="11" fill="url(#tierTop)" stroke="rgba(245,208,138,0.4)" strokeWidth="1.2" />
          {/* Top icing drips */}
          <path
            d="M78 90 C78 82, 210 82, 210 90 L210 100 C200 109, 188 97, 176 105 C164 113, 154 97, 144 106 C134 114, 122 97, 110 105 C98 112, 88 98, 78 102 Z"
            fill="#F5F3FF"
            opacity="0.95"
          />
          {/* Subtle gold ribbon band */}
          <rect x="78" y="127" width="132" height="6" fill="#F5D08A" opacity="0.82" />

          {/* Candles */}
          {candlePositions.map((cx, i) => (
            <g key={cx}>
              <rect
                x={cx - 3.5}
                y={50}
                width="7"
                height="35"
                rx="3"
                fill={i % 2 === 0 ? '#F5D08A' : '#F472B6'}
              />
              <rect
                x={cx - 3.5}
                y={57}
                width="7"
                height="4"
                fill="#FFFFFF"
                opacity="0.35"
              />
              {/* Wick */}
              <line x1={cx} y1={50} x2={cx} y2={44} stroke="#E2E8F0" strokeWidth="1.3" />

              {/* Flame or smoke wisp */}
              {candlesLit ? (
                <g className="animate-flame" style={{ animationDelay: `${i * 0.17}s` }}>
                  <ellipse cx={cx} cy={36} rx="6" ry="9" fill="#F59E0B" opacity="0.32" />
                  <path
                    d={`M${cx} 25 C${cx + 5} 32, ${cx + 5} 41, ${cx} 43 C${cx - 5} 41, ${cx - 5} 32, ${cx} 25 Z`}
                    fill="#FDE047"
                  />
                  <path
                    d={`M${cx} 31 C${cx + 2.5} 35, ${cx + 2.5} 40, ${cx} 42 C${cx - 2.5} 40, ${cx - 2.5} 35, ${cx} 31 Z`}
                    fill="#FFFBEB"
                  />
                </g>
              ) : (
                <path
                  d={`M${cx} 43 Q${cx + 3} 36 ${cx - 2} 28`}
                  stroke="rgba(226, 232, 240, 0.45)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <button
        type="button"
        onClick={handleToggleCandles}
        className="font-ui inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-4 py-1.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-300/15 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        {candlesLit ? 'Make a Wish & Blow Out Candles' : 'Relight the Candles'}
      </button>
    </div>
  );
};
