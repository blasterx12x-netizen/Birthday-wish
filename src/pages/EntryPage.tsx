import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface EntryPageProps {
  initialName: string;
  onBegin: (name: string) => void;
}

export const EntryPage: React.FC<EntryPageProps> = ({ initialName, onBegin }) => {
  const [name, setName] = useState(initialName);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = name.trim();
    if (!cleaned) {
      setErrorMsg('Please enter a name so we can personalize your surprise.');
      setShake(true);
      inputRef.current?.focus();
      window.setTimeout(() => setShake(false), 450);
      return;
    }
    setErrorMsg('');
    onBegin(cleaned);
  };

  return (
    <main className="relative z-20 flex min-h-[100dvh] flex-col items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl text-center"
      >
        <p className="font-script mb-3 text-3xl text-amber-300/90 sm:text-4xl">
          The Birthday Experience
        </p>

        <h1 className="font-display text-glow-violet text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
          Someone Special Is Here...
        </h1>

        <p className="font-body mx-auto mt-4 max-w-md text-base leading-relaxed text-violet-200/80 sm:text-lg">
          But first, let&apos;s make this experience personal.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md">
          <div
            className={`relative rounded-2xl p-[1.5px] transition-shadow duration-300 ${
              shake ? 'animate-shake' : ''
            }`}
            style={{
              background:
                'linear-gradient(135deg, rgba(245,208,138,0.65), rgba(139,92,246,0.65), rgba(244,114,182,0.5))',
              boxShadow:
                '0 0 36px -6px rgba(139, 92, 246, 0.45), 0 0 24px -8px rgba(245, 208, 138, 0.3)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              maxLength={32}
              autoFocus
              aria-label="Your name"
              placeholder="Enter your name..."
              className="font-ui w-full rounded-[15px] bg-[#0f081b]/95 px-5 py-4 text-center text-lg font-medium text-white placeholder:text-violet-300/45 focus:outline-none sm:text-xl"
            />
          </div>

          {errorMsg && (
            <p role="alert" className="mt-3 text-sm font-medium text-rose-300">
              {errorMsg}
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-shimmer font-ui inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-9 py-3.5 text-base font-semibold text-[#130821] shadow-[0_12px_36px_-6px_rgba(245,208,138,0.5)] transition-shadow hover:shadow-[0_16px_46px_-4px_rgba(245,208,138,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap"
              style={{
                background:
                  'linear-gradient(135deg, #FDE68A 0%, #F5D08A 45%, #E8B4F8 100%)',
              }}
            >
              <span>Let&apos;s Begin ✨</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </main>
  );
};
