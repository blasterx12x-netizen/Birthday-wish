import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { BirthdayCake } from '../components/BirthdayCake';
import { FloatingBalloons } from '../components/FloatingBalloons';

interface FinalePageProps {
  userName: string;
  onCelebrateAgain: () => void;
  onCandleWish: () => void;
  onStartFromBeginning: () => void;
}

export const FinalePage: React.FC<FinalePageProps> = ({
  userName,
  onCelebrateAgain,
  onCandleWish,
  onStartFromBeginning,
}) => {
  const [relightSignal, setRelightSignal] = useState(0);

  const handleCelebrateAgain = () => {
    setRelightSignal((s) => s + 1);
    onCelebrateAgain();
  };

  return (
    <main className="relative z-20 mx-auto flex min-h-[calc(100dvh-64px)] max-w-4xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      <FloatingBalloons count={10} />

      <motion.section
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel-gold relative z-20 flex w-full flex-col items-center rounded-[2.25rem] px-6 py-10 sm:px-12 sm:py-14"
      >
        <p className="font-script text-3xl text-amber-300 sm:text-4xl">
          The Grand Finale
        </p>

        <h1 className="font-display text-glow-gold text-balance mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          THE WORLD IS A LITTLE BRIGHTER WITH YOU IN IT,{' '}
          <span className="text-amber-200">{userName.toUpperCase()}</span>.
        </h1>

        <div className="my-8">
          <BirthdayCake
            size="lg"
            forceLitSignal={relightSignal}
            onBlowOut={onCandleWish}
          />
        </div>

        <p className="font-body max-w-xl text-base leading-relaxed text-violet-100/90 sm:text-lg">
          May this new chapter of your life be your most beautiful one yet. Keep
          creating memories, chasing dreams and enjoying every little moment.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <motion.button
            type="button"
            onClick={handleCelebrateAgain}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-shimmer font-ui inline-flex min-h-[50px] items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-pink-300 px-8 py-3 text-base font-semibold text-[#130821] shadow-[0_14px_40px_-8px_rgba(245,208,138,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
          >
            <span>Celebrate Again 🎉</span>
          </motion.button>

          <button
            type="button"
            onClick={onStartFromBeginning}
            className="font-ui inline-flex min-h-[50px] items-center gap-2 rounded-full border border-violet-300/30 bg-white/5 px-7 py-3 text-sm font-medium text-violet-100 transition-colors hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Start From Beginning</span>
          </button>
        </div>
      </motion.section>
    </main>
  );
};
