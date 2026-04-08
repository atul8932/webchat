import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

/**
 * Format a Firestore Timestamp or JS Date for display.
 */
export function formatTime(timestamp) {
  if (!timestamp) return '';

  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, h:mm a');
}

/**
 * Format relative time (e.g. "2 minutes ago").
 */
export function formatRelative(timestamp) {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
}
