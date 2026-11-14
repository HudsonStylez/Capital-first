import { useEffect, useState } from 'react';

/**
 * Returns a Date that refreshes on an interval so relative timestamps
 * ("2 min ago", "Today", …) stay live without a full reload.
 */
export function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
