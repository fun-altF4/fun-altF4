'use client';

import { useEffect } from 'react';
import useStore from '@/lib/store';

export default function TimeOfDay() {
  const setTimeOfDay = useStore((state) => state.setTimeOfDay);

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();

      let time: 'morning' | 'afternoon' | 'evening' | 'night';

      if (hour >= 5 && hour < 12) {
        time = 'morning';
      } else if (hour >= 12 && hour < 17) {
        time = 'afternoon';
      } else if (hour >= 17 && hour < 21) {
        time = 'evening';
      } else {
        time = 'night';
      }

      setTimeOfDay(time);

      // Apply to DOM
      const html = document.documentElement;
      html.setAttribute('data-time-of-day', time);
    };

    updateTimeOfDay();

    // Update every 10 minutes
    const interval = setInterval(updateTimeOfDay, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setTimeOfDay]);

  return null;
}
