/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CelestialSky } from './components/CelestialSky';
import { InteractiveEnvelopeLetter } from './components/InteractiveEnvelopeLetter';
import { AudioPlayer, AudioPlayerHandle } from './components/AudioPlayer';
import { LETTER_CONFIG } from './letterConfig';

export default function App() {
  const config = LETTER_CONFIG;
  const [viewState, setViewState] = useState<'closed' | 'opening' | 'opened' | 'closing'>('closed');
  const [reducedMotion, setReducedMotion] = useState(false);
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  // Detect user prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleOpenLetter = () => {
    if (viewState !== 'closed') return;

    // Start the music right away, inside the click, so the browser allows sound
    audioPlayerRef.current?.play();

    if (reducedMotion) {
      setViewState('opened');
      return;
    }

    setViewState('opening');

    // Guide smooth scroll to the letter as it unfolds
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);

    // Phase 1 (~800ms): flap opens & paper peeks out. Then the letter slides up.
    setTimeout(() => {
      setViewState('opened');
    }, 800);
  };

  const handleCloseToEnvelope = () => {
    if (viewState !== 'opened') return;

    if (reducedMotion) {
      setViewState('closed');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    setViewState('closing');

    // Smoothly scroll back to the envelope
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Let the paper retract into the envelope and flap close
    setTimeout(() => {
      setViewState('closed');
    }, 750);
  };

  return (
    <div className="min-h-screen bg-[#0B1019] text-[#F4EFE7] relative flex flex-col justify-between selection:bg-[#AAA0C8]/30 selection:text-[#F4EFE7]">
      {/* Night Sky: Soft crescent moon & sparse subtle stars */}
      <CelestialSky reducedMotion={reducedMotion} />

      {/* Optional Sound Player - Only rendered if musicUrl is set, starts when the letter is opened */}
      <AudioPlayer ref={audioPlayerRef} musicUrl={config.musicUrl} />

      {/* Main Experience: Interactive Envelope & Letter */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 py-10 sm:py-16">
        <InteractiveEnvelopeLetter
          config={config}
          isOpen={viewState === 'opened'}
          isOpening={viewState === 'opening'}
          isClosing={viewState === 'closing'}
          onOpen={handleOpenLetter}
          onClose={handleCloseToEnvelope}
          reducedMotion={reducedMotion}
        />
      </main>

      {/* Discreet Footer */}
      <footer className="relative z-10 w-full py-6 px-6 text-center text-xs text-[#7A7299]/70 max-w-4xl mx-auto">
        <span className="font-serif italic text-[11px] tracking-wider">
          Сарны гэрэлд
        </span>
      </footer>
    </div>
  );
}
