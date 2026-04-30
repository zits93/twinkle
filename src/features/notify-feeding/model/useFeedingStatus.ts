import { useEffect, useState } from 'react';
import { useRecordStore } from '@entities/record';
import { useUserSettingsStore } from '@entities/user-settings';
import { differenceInMinutes } from 'date-fns';

export const useFeedingStatus = (babyId: string) => {
  const records = useRecordStore((state) => state.records);
  const { feedingInterval, muteDuringNight } = useUserSettingsStore();
  
  const [status, setStatus] = useState<'NORMAL' | 'HUNGRY' | 'OVERDUE'>('NORMAL');
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

  useEffect(() => {
    const lastFeed = records
      .filter((r) => r.babyId === babyId && r.category === 'FEEDING')
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

    const currentSleep = records
      .filter((r) => r.babyId === babyId && r.category === 'SLEEP' && !r.endTime)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

    const checkStatus = () => {
      // Check if currently in Night Sleep and if muting is enabled
      const isNightSleep = currentSleep && currentSleep.subCategory === 'NIGHT';
      
      if (isNightSleep && muteDuringNight) {
        setStatus('NORMAL'); // Mute during night sleep
        setMinutesLeft(null);
        return;
      }

      if (!lastFeed) {
        setStatus('NORMAL');
        setMinutesLeft(null);
        return;
      }
      const diff = differenceInMinutes(new Date(), new Date(lastFeed.startTime));
      const left = feedingInterval - diff;
      
      setMinutesLeft(left);

      if (left <= 0) {
        setStatus('OVERDUE');
      } else if (left <= 30) {
        setStatus('HUNGRY');
      } else {
        setStatus('NORMAL');
      }
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [records, babyId, feedingInterval, muteDuringNight]);

  return { status, minutesLeft };
};
