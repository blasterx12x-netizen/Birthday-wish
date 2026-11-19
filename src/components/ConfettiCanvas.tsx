import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  rotation: number;
  vr: number;
  shape: 'rect' | 'circle' | 'spark';
}

interface ConfettiCanvasProps {
  confettiTrigger?: number;
  fireworksActive?: boolean;
  fireworksBurstTrigger?: number;
  onFireworkLaunch?: () => void;
}

const PALETTE = [
  '#F5D08A', // Champagne gold
  '#A78BFA', // Soft lavender
  '#8B5CF6', // Electric violet
  '#F472B6', // Rose pink
  '#FDE68A', // Warm gold
  '#EDE9FE', // Ivory lavender
];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({
  confettiTrigger = 0,
  fireworksActive = false,
  fireworksBurstTrigger = 0,
  onFireworkLaunch,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const onFireworkRef = useRef(onFireworkLaunch);
  onFireworkRef.current = onFireworkLaunch;

  const spawnConfettiBurst = (width: number, height: number, count = 110) => {
    const cx = width * 0.5;
    const cy = height * 0.42;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 11;
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        size: 5 + Math.random() * 6,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        alpha: 1,
        decay: 0.006 + Math.random() * 0.006,
        gravity: 0.16,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.22,
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
      });
    }
  };

  const spawnFirework = (width: number, height: number) => {
    const fx = width * (0.16 + Math.random() * 0.68);
    const fy = height * (0.14 + Math.random() * 0.34);
    const primaryColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const secondaryColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const count = 56;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15;
      const speed = 2.2 + Math.random() * 5.2;
      particlesRef.current.push({
        x: fx,
        y: fy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.2 + Math.random() * 2.4,
        color: i % 2 === 0 ? primaryColor : secondaryColor,
        alpha: 1,
        decay: 0.014 + Math.random() * 0.01,
        gravity: 0.055,
        rotation: 0,
        vr: 0,
        shape: 'spark',
      });
    }
    onFireworkRef.current?.();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rotation += p.vr;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > h + 40) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        } else if (p.shape === 'spark') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Cap total particles for smooth mobile performance
      if (list.length > 420) {
        list.splice(0, list.length - 420);
      }

      rafRef.current = window.requestAnimationFrame(render);
    };

    rafRef.current = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (confettiTrigger > 0) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      spawnConfettiBurst(window.innerWidth, window.innerHeight, reduced ? 28 : 115);
    }
  }, [confettiTrigger]);

  useEffect(() => {
    if (!fireworksActive) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Initial celebratory salvo
    const t1 = window.setTimeout(() => spawnFirework(window.innerWidth, window.innerHeight), 200);
    const t2 = window.setTimeout(() => spawnFirework(window.innerWidth, window.innerHeight), 680);
    const interval = window.setInterval(() => {
      spawnFirework(window.innerWidth, window.innerHeight);
    }, 1500);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearInterval(interval);
    };
  }, [fireworksActive]);

  useEffect(() => {
    if (fireworksBurstTrigger > 0) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      spawnConfettiBurst(window.innerWidth, window.innerHeight, reduced ? 30 : 120);
      if (!reduced) {
        spawnFirework(window.innerWidth, window.innerHeight);
        window.setTimeout(() => spawnFirework(window.innerWidth, window.innerHeight), 260);
        window.setTimeout(() => spawnFirework(window.innerWidth, window.innerHeight), 560);
      }
    }
  }, [fireworksBurstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    />
  );
};
