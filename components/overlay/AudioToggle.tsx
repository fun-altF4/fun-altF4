'use client';

import { Volume2, VolumeX } from 'lucide-react';
import useStore from '@/lib/store';

/**
 * AudioToggle.tsx
 *
 * Bottom-right corner audio toggle button.
 * - 32px diameter circle
 * - Lucide icons: speaker-on / speaker-off
 * - 24px from edges
 * - Default: muted
 * - Click toggles ambient drone audio on
 *
 * Uses Howler for audio playback.
 * Audio continues across all tiers.
 *
 * See SECTION 2 TIER 1 (Audio Toggle)
 *
 * TODO: Wire to Howler instance when ambient-drone.mp3 is available
 */

export default function AudioToggle() {
  const audioEnabled = useStore((state) => state.audioEnabled);
  const setAudioEnabled = useStore((state) => state.setAudioEnabled);

  const handleToggle = () => {
    setAudioEnabled(!audioEnabled);
    // TODO: Call Howler play/pause
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
      aria-label="Toggle audio"
    >
      {audioEnabled ? (
        <Volume2 size={16} className="text-white" />
      ) : (
        <VolumeX size={16} className="text-white" />
      )}
    </button>
  );
}
