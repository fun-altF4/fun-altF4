'use client';

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from 'react';
import useStore from '@/lib/store';

interface CursorPosition {
  x: number;
  y: number;
}

interface GazeContextType {
  cursor: CursorPosition;
}

const GazeContext = createContext<GazeContextType | undefined>(undefined);

export const useCursor = () => {
  const context = useContext(GazeContext);
  if (!context) {
    throw new Error('useCursor must be used within GazeTracker');
  }
  return context;
};

interface GazeTrackerProps {
  children: ReactNode;
}

export default function GazeTracker({ children }: GazeTrackerProps) {
  const [cursor, setCursor] = useState<CursorPosition>({ x: 0, y: 0 });
  const setCursorStore = useStore((state) => state.setCursor);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize cursor to [-1, 1]
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      setCursor({ x, y });
      setCursorStore(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [setCursorStore]);

  return (
    <GazeContext.Provider value={{ cursor }}>
      {children}
    </GazeContext.Provider>
  );
}
