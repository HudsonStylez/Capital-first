// Human-friendly, "live-feeling" date helpers used across the app.

export function parseDate(value: string | number | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Friendly transaction timestamp:
 *   Today, 9:15 AM · Yesterday, 4:02 PM · Nov 10 · Nov 10, 2024
 * Falls back to the raw value if it isn't a parseable date (e.g. 'Today').
 */
export function formatTxDate(value: string | number | Date, now: Date = new Date()): string {
  const d = parseDate(value);
  if (isNaN(d.getTime())) return String(value);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(d, now)) return `Today, ${formatTime(d)}`;
  if (isSameDay(d, yesterday)) return `Yesterday, ${formatTime(d)}`;
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString(
    'en-US',
    sameYear ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' }
  );
}

/** Relative "time ago" string that updates as `now` advances. */
export function timeAgo(value: string | number | Date, now: Date = new Date()): string {
  const d = parseDate(value);
  if (isNaN(d.getTime())) return String(value);
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffSec < 0) return 'Just now';
  if (diffSec < 45) return 'Just now';
  if (diffSec < 90) return '1 min ago';
  if (diffSec < 3600) return `${Math.round(diffSec / 60)} min ago`;
  if (diffSec < 5400) return '1 hour ago';
  if (diffSec < 86400) return `${Math.round(diffSec / 3600)} hours ago`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(d, yesterday)) return 'Yesterday';
  if (isSameDay(d, now)) return `Today, ${formatTime(d)}`;
  if (diffSec < 7 * 86400) return `${Math.round(diffSec / 86400)} days ago`;

  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString(
    'en-US',
    sameYear ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' }
  );
}

export function formatDateTime(value: string | number | Date): string {
  const d = parseDate(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
