'use client';

import { useEffect } from 'react';
import useStore from '@/lib/store';
import SceneOrchestrator from '@/components/system/SceneOrchestrator';
import StillnessDetector from '@/components/system/StillnessDetector';
import GazeTracker from '@/components/system/GazeTracker';

export default function Home() {
  const initializeSessionId = useStore((state) => state.initializeSessionId);
  const initializeCluster = useStore((state) => state.initializeCluster);

  useEffect(() => {
    initializeSessionId();
    initializeCluster();
  }, [initializeSessionId, initializeCluster]);

  return (
    <main className="w-full h-screen bg-background text-foreground overflow-hidden">
      <StillnessDetector>
        <GazeTracker>
          <SceneOrchestrator />
        </GazeTracker>
      </StillnessDetector>
    </main>
  );
}
