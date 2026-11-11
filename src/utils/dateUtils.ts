/**
 * Helper to generate an ISO timestamp relative to the current runtime clock (in the past).
 */
export function hoursAgoISO(hours: number): string {
  const d = new Date(Date.now() - hours * 60 * 60 * 1000);
  return d.toISOString();
}

/**
 * Helper to generate a future ISO timestamp relative to the current runtime clock.
 */
export function daysFromNowISO(days: number): string {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

/**
 * Default active window for a job posting without an explicit deadline (30 days after postedAt).
 */
export function computeDefaultExpiresAt(postedAt: string): string {
  const postedTime = new Date(postedAt).getTime();
  const base = isNaN(postedTime) ? Date.now() : postedTime;
  return new Date(base + 30 * 24 * 60 * 60 * 1000).toISOString();
}

const EXPIRED_PHRASES = [
  'no longer accepting applications',
  'this job has expired',
  'position has been filled',
  'this position is closed',
  'job is no longer available',
  'denna annons är inte längre aktuell',
  '[closed]',
  '[expired]',
];

/**
 * Strictly determines whether a job post is expired or closed.
 * Any job returning true is excluded from the UI.
 */
export function isJobExpired(job: {
  postedAt: string;
  expiresAt?: string;
  isClosedOrExpired?: boolean;
  title?: string;
  description?: string;
}): boolean {
  if (job.isClosedOrExpired) {
    return true;
  }

  const now = Date.now();

  // 1. Check explicit expiration / application_deadline timestamp
  if (job.expiresAt) {
    const expTime = new Date(job.expiresAt).getTime();
    if (!isNaN(expTime) && expTime <= now) {
      return true;
    }
  }

  // 2. Check if postedAt is older than 30 days (stale/expired listing)
  const postedTime = new Date(job.postedAt).getTime();
  if (isNaN(postedTime)) {
    return true;
  }
  const ageDays = (now - postedTime) / (1000 * 60 * 60 * 24);
  if (ageDays > 30) {
    return true;
  }

  // 3. Check title & description for closed/expired indicators
  const text = `${job.title || ''} ${job.description || ''}`.toLowerCase();
  if (EXPIRED_PHRASES.some((phrase) => text.includes(phrase))) {
    return true;
  }

  return false;
}

export function formatPostedDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Recently posted';

  return new Intl.DateTimeFormat('en-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 5) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return new Intl.DateTimeFormat('en-SE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatExpirationStatus(expiresAt: string): string {
  const exp = new Date(expiresAt);
  if (isNaN(exp.getTime())) return 'Active';

  const diffMs = exp.getTime() - Date.now();
  if (diffMs <= 0) return 'Expired';

  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const formattedDate = new Intl.DateTimeFormat('en-SE', {
    month: 'short',
    day: 'numeric',
  }).format(exp);

  return `Active • ${daysLeft}d left (until ${formattedDate})`;
}

export function isPostedWithinHours(isoDate: string, hours: number): boolean {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return false;
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= hours;
}
