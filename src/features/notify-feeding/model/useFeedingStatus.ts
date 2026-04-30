import { useEffect, useState } from 'react';
import { useRecordStore } from '@entities/record';
import { differenceInMinutes } from 'date-fns';

export const useFeedingStatus = (babyId: string, interval: number = 180) => {
  const records = useRecordStore((state) => state.records);
  const [status, setStatus] = useState<'NORMAL' | 'HUNGRY' | 'OVERDUE'>('NORMAL');
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);

  useEffect(() => {
    const lastFeed = records
      .filter((r) => r.babyId === babyId && r.category === 'FEEDING')
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

    if (!lastFeed) {
      setStatus('NORMAL');
      setMinutesLeft(null);
      return;
    }

    const checkStatus = () => {
      const diff = differenceInMinutes(new Date(), new Date(lastFeed.startTime));
      const left = interval - diff;
      
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
  }, [records, babyId, interval]);

  return { status, minutesLeft };
};
