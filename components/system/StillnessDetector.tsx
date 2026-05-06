'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';

interface StillnessContextType {
  isStill: boolean;
}

const StillnessContext = createContext<StillnessContextType | undefined>(
  undefined,
);

export const useStillness = () => {
  const context = useContext(StillnessContext);
  if (!context) {
    throw new Error('useStillness must be used within StillnessDetector');
  }
  return context;
};

interface StillnessDetectorProps {
  children: ReactNode;
  thresholdMs?: number;
}

export default function StillnessDetector({
  children,
  thresholdMs = 1500,
}: StillnessDetectorProps) {
  const [isStill, setIsStill] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = () => {
      // User moved — cancel the stillness
      setIsStill(false);

      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Start new timer
      timerRef.current = setTimeout(() => {
        setIsStill(true);
      }, thresholdMs);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize with a timer on mount
    timerRef.current = setTimeout(() => {
      setIsStill(true);
    }, thresholdMs);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [thresholdMs]);

  return (
    <StillnessContext.Provider value={{ isStill }}>
      {children}
    </StillnessContext.Provider>
  );
}
