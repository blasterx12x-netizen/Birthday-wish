import React, { useEffect, useMemo, useRef, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  gold: boolean;
}

export const AmbientBackdrop: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: -200, y: -200 });
  const currentRef = useRef({ x: -200, y: -200 });

  const stars = useMemo<Star[]>(() => {
    const count = 44;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 37.3 + 11) % 100,
      y: (i * 53.7 + 7) % 100,
      size: i % 5 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
      duration: 2.6 + (i % 5) * 0.85,
      delay: (i % 7) * 0.45,
      gold: i % 4 === 0,
    }));
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (isReduced || !isFinePointer) return;

    const handleMove = (e: MouseEvent) => {
      setCursorVisible(true);
      targetRef.current = { x: e.clientX, y: e.clientY };
      const px = (e.clientX / window.innerWidth) * 100;
      const py = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x: px, y: py });
    };

    const handleLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseleave', handleLeave);

    const animateCursor = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.14;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.14;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentRef.current.x - 160}px, ${currentRef.current.y - 160}px, 0)`;
      }
      rafRef.current = window.requestAnimationFrame(animateCursor);
    };
    rafRef.current = window.requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const parallaxX = (mousePos.x - 50) * -0.25;
  const parallaxY = (mousePos.y - 50) * -0.25;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Base midnight obsidian gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, #1d0e38 0%, #0d0619 52%, #07040b 100%)',
        }}
      />

      {/* Ambient Aurora Orbs with subtle desktop parallax */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
        }}
      >
        <div
          className="animate-aurora absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.24) 0%, rgba(139, 92, 246, 0) 70%)',
          }}
        />
        <div
          className="animate-aurora absolute -right-24 top-1/4 h-[30rem] w-[30rem] rounded-full blur-3xl"
          style={{
            animationDelay: '-5s',
            background:
              'radial-gradient(circle, rgba(244, 114, 182, 0.16) 0%, rgba(244, 114, 182, 0) 70%)',
          }}
        />
        <div
          className="animate-aurora absolute bottom-[-8rem] left-1/3 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{
            animationDelay: '-9s',
            background:
              'radial-gradient(circle, rgba(245, 208, 138, 0.13) 0%, rgba(245, 208, 138, 0) 70%)',
          }}
        />
      </div>

      {/* Twinkling Starfield */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${parallaxX * 0.6}px, ${parallaxY * 0.6}px, 0)`,
        }}
      >
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.gold ? '#F5D08A' : '#E9D5FF',
              boxShadow: star.gold
                ? '0 0 8px rgba(245, 208, 138, 0.7)'
                : '0 0 6px rgba(196, 181, 253, 0.65)',
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Desktop interactive soft cursor spotlight */}
      <div
        ref={cursorRef}
        className="hidden md:block absolute left-0 top-0 h-80 w-80 rounded-full transition-opacity duration-300"
        style={{
          opacity: cursorVisible ? 1 : 0,
          background:
            'radial-gradient(circle, rgba(167, 139, 250, 0.11) 0%, rgba(245, 208, 138, 0.04) 40%, transparent 72%)',
        }}
      />
    </div>
  );
};
