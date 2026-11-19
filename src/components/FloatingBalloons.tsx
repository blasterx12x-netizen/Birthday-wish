import React from 'react';

interface FloatingBalloonsProps {
  count?: number;
}

const BALLOON_STYLES = [
  { fill: '#8B5CF6', highlight: '#C4B5FD', glow: 'rgba(139,92,246,0.45)' },
  { fill: '#F5D08A', highlight: '#FEF3C7', glow: 'rgba(245,208,138,0.45)' },
  { fill: '#F472B6', highlight: '#FBCFE8', glow: 'rgba(244,114,182,0.4)' },
  { fill: '#A78BFA', highlight: '#EDE9FE', glow: 'rgba(167,139,250,0.4)' },
  { fill: '#E879F9', highlight: '#FAE8FF', glow: 'rgba(232,121,249,0.4)' },
];

export const FloatingBalloons: React.FC<FloatingBalloonsProps> = ({ count = 8 }) => {
  const balloons = Array.from({ length: count }, (_, idx) => {
    const palette = BALLOON_STYLES[idx % BALLOON_STYLES.length];
    const left = idx % 2 === 0 ? 4 + idx * 5.2 : 92 - idx * 4.8;
    const duration = 12 + (idx % 4) * 2.5;
    const delay = (idx % 5) * 1.4;
    const scale = 0.78 + (idx % 3) * 0.14;

    return {
      id: idx,
      palette,
      left: Math.max(3, Math.min(93, left)),
      duration,
      delay,
      scale,
    };
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0 opacity-0"
          style={{
            left: `${b.left}%`,
            animation: `balloonRise ${b.duration}s linear ${b.delay}s infinite`,
          }}
        >
          <svg
            width={58 * b.scale}
            height={112 * b.scale}
            viewBox="0 0 60 116"
            fill="none"
            style={{ filter: `drop-shadow(0 10px 18px ${b.palette.glow})` }}
          >
            {/* String */}
            <path
              d="M30 68 C26 80, 35 90, 29 102 C27 107, 31 112, 29 116"
              stroke="rgba(245, 208, 138, 0.5)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            {/* Knot */}
            <polygon points="27,68 33,68 30,63" fill={b.palette.fill} />
            {/* Balloon body */}
            <ellipse cx="30" cy="34" rx="23" ry="29" fill={b.palette.fill} />
            {/* Glossy rim */}
            <ellipse
              cx="22"
              cy="22"
              rx="6.5"
              ry="11"
              transform="rotate(-20 22 22)"
              fill={b.palette.highlight}
              opacity="0.45"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
