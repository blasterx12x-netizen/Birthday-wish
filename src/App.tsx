/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { PageId } from './types';
import { audioEngine } from './utils/audioEngine';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { TopNav } from './components/TopNav';
import { EntryPage } from './pages/EntryPage';
import { HubPage } from './pages/HubPage';
import { SurprisePage } from './pages/SurprisePage';
import { GamesPage } from './pages/GamesPage';
import { MessagePage } from './pages/MessagePage';
import { UnexpectedPage } from './pages/UnexpectedPage';
import { FinalePage } from './pages/FinalePage';

const STORAGE_NAME_KEY = 'birthday_exp_name';

export default function App() {
  const [userName, setUserName] = useState<string>(() => {
    try {
      return sessionStorage.getItem(STORAGE_NAME_KEY) || '';
    } catch {
      return '';
    }
  });
  const [currentPage, setCurrentPage] = useState<PageId>('entry');
  const [visitedPages, setVisitedPages] = useState<PageId[]>([]);
  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [fireworksBurstTrigger, setFireworksBurstTrigger] = useState(0);

  // Stop music cleanly on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopMusic();
    };
  }, []);

  const navigateTo = useCallback((page: PageId) => {
    audioEngine.playClick();
    setCurrentPage(page);
    setVisitedPages((prev) => (prev.includes(page) ? prev : [...prev, page]));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBegin = useCallback((enteredName: string) => {
    setUserName(enteredName);
    try {
      sessionStorage.setItem(STORAGE_NAME_KEY, enteredName);
    } catch {
      // Ignore storage failures
    }
    // Start music gracefully on explicit user interaction
    audioEngine.playGiftOpen();
    audioEngine.startMusic();
    setMusicOn(true);
    setConfettiTrigger((c) => c + 1);
    setCurrentPage('hub');
    setVisitedPages(['hub']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleMusic = useCallback(() => {
    const next = audioEngine.toggleMusic();
    setMusicOn(next);
  }, []);

  const handleToggleSfx = useCallback(() => {
    const next = !sfxOn;
    setSfxOn(next);
    audioEngine.setSfxEnabled(next);
    if (next) {
      audioEngine.playClick();
    }
  }, [sfxOn]);

  const handleTriggerConfetti = useCallback(() => {
    setConfettiTrigger((c) => c + 1);
  }, []);

  const handleUnwrapSurprise = useCallback(() => {
    audioEngine.playGiftOpen();
    setConfettiTrigger((c) => c + 1);
  }, []);

  const handleCandleWish = useCallback(() => {
    audioEngine.playVictory();
    setConfettiTrigger((c) => c + 1);
  }, []);

  const handleCelebrateAgain = useCallback(() => {
    audioEngine.playVictory();
    setFireworksBurstTrigger((c) => c + 1);
  }, []);

  const handleFireworkLaunch = useCallback(() => {
    if (currentPage === 'finale') {
      audioEngine.playFirework();
    }
  }, [currentPage]);

  const handleStartFromBeginning = useCallback(() => {
    audioEngine.playClick();
    setCurrentPage('entry');
    setVisitedPages([]);
    setUserName('');
    try {
      sessionStorage.removeItem(STORAGE_NAME_KEY);
    } catch {
      // Ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const effectiveName = userName || 'Friend';

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[#07040B] text-[#F7F3FF]">
      <AmbientBackdrop />

      <ConfettiCanvas
        confettiTrigger={confettiTrigger}
        fireworksActive={currentPage === 'finale'}
        fireworksBurstTrigger={fireworksBurstTrigger}
        onFireworkLaunch={handleFireworkLaunch}
      />

      <TopNav
        currentPage={currentPage}
        userName={effectiveName}
        musicOn={musicOn}
        sfxOn={sfxOn}
        onNavigate={navigateTo}
        onToggleMusic={handleToggleMusic}
        onToggleSfx={handleToggleSfx}
        onRestart={handleStartFromBeginning}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {currentPage === 'entry' && (
            <EntryPage initialName={userName} onBegin={handleBegin} />
          )}

          {currentPage === 'hub' && (
            <HubPage
              userName={effectiveName}
              visitedPages={visitedPages}
              onSelectPage={navigateTo}
            />
          )}

          {currentPage === 'surprise' && (
            <SurprisePage
              userName={effectiveName}
              onNavigate={navigateTo}
              onUnwrapCelebration={handleUnwrapSurprise}
              onCandleWish={handleCandleWish}
            />
          )}

          {currentPage === 'games' && (
            <GamesPage
              userName={effectiveName}
              onNavigate={navigateTo}
              onCelebrate={handleTriggerConfetti}
            />
          )}

          {currentPage === 'message' && (
            <MessagePage userName={effectiveName} onNavigate={navigateTo} />
          )}

          {currentPage === 'unexpected' && (
            <UnexpectedPage
              userName={effectiveName}
              onNavigate={navigateTo}
              onAllFlippedCelebration={handleTriggerConfetti}
            />
          )}

          {currentPage === 'finale' && (
            <FinalePage
              userName={effectiveName}
              onCelebrateAgain={handleCelebrateAgain}
              onCandleWish={handleCandleWish}
              onStartFromBeginning={handleStartFromBeginning}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
