'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '@/lib/store';
import AudioToggle from '@/components/overlay/AudioToggle';
import IdlePrompt from '@/components/overlay/IdlePrompt';

/**
 * ArrivalLayer (Tier 1)
 *
 * Implements the first 3 seconds of the experience:
 * - Pure #000000 background
 * - Dim point of light pulsing at 60 bpm (4px circle with expanding glow)
 * - Stillness detection (1.5s no mousemove)
 * - Text reveal sequence:
 *   1. "This portfolio is a working AI. It will introduce me to you. It will also notice you."
 *   2. "Say something — or scroll if you'd rather watch."
 *   3. Text input (underline only, 320px max width on desktop)
 * - Audio toggle button (32px circle, bottom-right)
 * - Idle soft prompt after 12s (gray-500, italic)
 * - Transitions: scroll → Tier 2 (Cinematic), input submit → Tier 3 (Conversation)
 *
 * See SECTION 2, TIER 1 in spec
 */

export default function ArrivalLayer() {
  const [textRevealed, setTextRevealed] = useState(false);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const stillnessTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setSceneState = useStore((state) => state.setSceneState);
  const setVisitorType = useStore((state) => state.setVisitorType);

  // Stillness detection: wait 1.5s without mousemove to trigger text reveal
  useEffect(() => {
    const handleMouseMove = () => {
      // Reset any pending stillness timer
      if (stillnessTimerRef.current) {
        clearTimeout(stillnessTimerRef.current);
      }

      // If text already revealed, don't reset
      if (textRevealed) return;

      // Set timer for 1.5 seconds of stillness
      stillnessTimerRef.current = setTimeout(() => {
        setTextRevealed(true);
      }, 1500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (stillnessTimerRef.current) clearTimeout(stillnessTimerRef.current);
    };
  }, [textRevealed]);

  // Idle prompt: appears after 12 seconds on Tier 1 with no scroll/input
  useEffect(() => {
    if (!textRevealed) return;

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setShowIdlePrompt(true);
      }, 12000);
    };

    resetIdleTimer();

    // Reset timer if user interacts
    const handleInteraction = () => {
      setShowIdlePrompt(false);
      resetIdleTimer();
    };

    window.addEventListener('scroll', handleInteraction);
    inputRef.current?.addEventListener('input', handleInteraction);

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      inputRef.current?.removeEventListener('input', handleInteraction);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [textRevealed]);

  // Handle scroll transition to Tier 2
  const handleScroll = () => {
    setSceneState('cinematic');
  };

  // Handle input submission to Tier 3
  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputRef.current?.value || '';
    if (message.trim()) {
      setVisitorType('curious', 0.5);
      setSceneState('conversation');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
      <style>{`
        @keyframes dimPointPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 80px rgba(255, 255, 255, 0.8);
          }
        }
        .dim-point {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: white;
          animation: dimPointPulse 1s ease-in-out infinite;
        }
      `}</style>

      {/* Dim Point Animation */}
      <motion.div
        className="dim-point"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Text Reveal Section */}
      {textRevealed && (
        <motion.div
          className="absolute flex flex-col items-center gap-8"
          style={{ top: '50%', transform: 'translateY(80px)' }}
        >
          {/* Main Text */}
          <motion.p
            className="text-lg text-white text-center max-w-xl font-normal tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            This portfolio is a working AI. It will introduce me to you. It will also notice you.
          </motion.p>

          {/* Secondary Text */}
          <motion.p
            className="text-sm text-gray-400 text-center max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Say something — or scroll if you&apos;d rather watch.
          </motion.p>

          {/* Input Field */}
          <motion.form
            onSubmit={handleInputSubmit}
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="..."
              className="px-0 py-2 bg-transparent text-white border-0 border-b border-white/40 placeholder-gray-500 focus:outline-none focus:border-white focus:ring-0 transition-colors duration-200"
              style={{
                width: 'min(320px, 90vw)',
              }}
            />
          </motion.form>

          {/* Idle Prompt */}
          {showIdlePrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <IdlePrompt />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Audio Toggle */}
      <AudioToggle />
    </div>
  );
}
