'use client';

import { useEffect, useRef } from 'react';
import { useStillness } from './StillnessDetector';
import useStore from '@/lib/store';
import ArrivalLayer from '@/components/shell/ArrivalLayer';
import CinematicLayer from '@/components/shell/CinematicLayer';
import ConversationLayer from '@/components/shell/ConversationLayer';

/**
 * SceneOrchestrator
 *
 * State machine that transitions between three tiers:
 * - Tier 1 (Arrival): Dim point + stillness detection + text reveal
 * - Tier 2 (Cinematic): Scroll-paced 5-beat cinematic with 3D scene
 * - Tier 3 (Conversation): Chat interface with galaxy backdrop
 *
 * Transitions:
 * - Arrival → Cinematic: when user scrolls
 * - Arrival → Conversation: when user types & submits
 * - Cinematic → Conversation: when user reaches end of scroll
 */
export default function SceneOrchestrator() {
  const sceneState = useStore((state) => state.sceneState);
  const setSceneState = useStore((state) => state.setSceneState);
  const { isStill } = useStillness();

  const allowedTransitionRef = useRef(false);
  const transitionInitiatedRef = useRef(false);

  // Track scroll for Tier 1 → Tier 2 transition
  useEffect(() => {
    if (sceneState !== 'arrival') return;

    const handleScroll = () => {
      // Only transition once and if we've detected stillness
      if (allowedTransitionRef.current && isStill) {
        setSceneState('cinematic');
      }
    };

    // Allow transition only after stillness + text reveal
    // This will be coordinated by ArrivalLayer when text appears
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sceneState, isStill, setSceneState]);

  // Expose ability for ArrivalLayer to enable transitions
  useEffect(() => {
    (window as any).enableArrivalTransitions = () => {
      allowedTransitionRef.current = true;
    };

    (window as any).transitionToCinematic = () => {
      if (!transitionInitiatedRef.current) {
        transitionInitiatedRef.current = true;
        setSceneState('cinematic');
      }
    };

    (window as any).transitionToConversation = () => {
      if (!transitionInitiatedRef.current) {
        transitionInitiatedRef.current = true;
        setSceneState('conversation');
      }
    };
  }, [setSceneState]);

  return (
    <div className="w-full h-screen">
      {sceneState === 'arrival' && <ArrivalLayer onEnableTransitions={() => { (window as any).enableArrivalTransitions?.(); }} />}
      {sceneState === 'cinematic' && <CinematicLayer />}
      {sceneState === 'conversation' && <ConversationLayer />}
    </div>
  );
}
