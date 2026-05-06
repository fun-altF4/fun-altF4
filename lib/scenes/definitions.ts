/**
 * definitions.ts
 *
 * Beat timings, scroll thresholds, and scene state definitions.
 * Used by CinematicLayer and CameraDirector.
 *
 * All timings are in scroll progress (0–1) and paced time (0–45s).
 */

export const BEAT_TIMINGS = {
  BEAT_1: {
    scrollStart: 0,
    scrollEnd: 0.18,
    pairedTimeStart: 0,
    pairedTimeEnd: 8,
    name: 'The Dual Core',
  },
  BEAT_2: {
    scrollStart: 0.18,
    scrollEnd: 0.48,
    pairedTimeStart: 8,
    pairedTimeEnd: 22,
    name: 'Seven Bridges',
  },
  BEAT_3: {
    scrollStart: 0.48,
    scrollEnd: 0.72,
    pairedTimeStart: 22,
    pairedTimeEnd: 34,
    name: 'Galaxy Reveal',
  },
  BEAT_4: {
    scrollStart: 0.72,
    scrollEnd: 0.93,
    pairedTimeStart: 34,
    pairedTimeEnd: 45,
    name: 'The Dive',
  },
  BEAT_5: {
    scrollStart: 0.93,
    scrollEnd: 1.0,
    pairedTimeStart: 45,
    pairedTimeEnd: 45,
    name: 'Settling',
  },
};

// Helper to get current beat based on scroll progress
export const getBeatAtProgress = (progress: number) => {
  if (progress < BEAT_TIMINGS.BEAT_1.scrollEnd) return 1;
  if (progress < BEAT_TIMINGS.BEAT_2.scrollEnd) return 2;
  if (progress < BEAT_TIMINGS.BEAT_3.scrollEnd) return 3;
  if (progress < BEAT_TIMINGS.BEAT_4.scrollEnd) return 4;
  return 5;
};

// Helper to get paced time from scroll progress
export const getPacedTimeFromProgress = (progress: number): number => {
  const totalTime = 45;
  return progress * totalTime;
};
