'use client';

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
 * - Arrival → Cinematic: when user scrolls (handled by ArrivalLayer)
 * - Arrival → Conversation: when user types & submits (handled by ArrivalLayer)
 * - Cinematic → Conversation: when user reaches end of scroll (handled by CinematicLayer)
 */
export default function SceneOrchestrator() {
  const sceneState = useStore((state) => state.sceneState);

  return (
    <div className="w-full h-screen">
      {sceneState === 'arrival' && <ArrivalLayer />}
      {sceneState === 'cinematic' && <CinematicLayer />}
      {sceneState === 'conversation' && <ConversationLayer />}
    </div>
  );
}
