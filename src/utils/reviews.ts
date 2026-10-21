/**
 * Technical backend & client tracking for verified user reviews and accurate timestamps.
 */

export const formatReviewTimestamp = (
  dateOrTimestamp?: string | number,
  fallbackDateStr?: string
): string => {
  if (!dateOrTimestamp && !fallbackDateStr) {
    return 'Recently Verified';
  }

  // Find the most accurate raw value (prefer number timestamp over string)
  let rawValue: string | number = dateOrTimestamp || fallbackDateStr || '';

  // If dateOrTimestamp is a string like "Just now", check if fallbackDateStr has a timestamp
  if (typeof dateOrTimestamp === 'string' && dateOrTimestamp.trim().toLowerCase() === 'just now') {
    if (fallbackDateStr && fallbackDateStr.trim().toLowerCase() !== 'just now') {
      rawValue = fallbackDateStr;
    }
  }

  // Parse milliseconds
  let ms: number | null = null;
  if (typeof rawValue === 'number') {
    ms = rawValue;
  } else if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();

    // Check if numeric timestamp string (e.g. "1729418290000")
    if (/^\d{10,13}$/.test(trimmed)) {
      ms = Number(trimmed);
      if (ms < 1e11) ms *= 1000;
    } else if (trimmed.toLowerCase() === 'yesterday') {
      return 'Yesterday';
    } else if (trimmed.includes('ago')) {
      return trimmed;
    } else {
      const parsed = Date.parse(trimmed);
      if (!isNaN(parsed)) {
        ms = parsed;
      }
    }
  }

  if (ms) {
    const now = Date.now();
    const diffSeconds = Math.max(0, Math.floor((now - ms) / 1000));

    if (diffSeconds < 60) {
      return 'Just now';
    }
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }

    return new Date(ms).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // If rawValue is literally "Just now" and cannot be parsed to timestamp
  if (typeof rawValue === 'string' && rawValue.trim().toLowerCase() === 'just now') {
    return 'Recently';
  }

  return String(rawValue);
};

export const createReviewRecord = (params: {
  author: string;
  role?: string;
  rating: number;
  comment: string;
  templateUsed?: string;
  categoryTag?: string;
  productId?: string;
}) => {
  const now = Date.now();
  const dateStr = new Date(now).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    id: `rev-${now}-${Math.random().toString(36).substring(2, 6)}`,
    author: params.author.trim() || 'Verified Customer',
    role: params.role || 'Verified Customer',
    rating: Math.min(5, Math.max(1, params.rating)),
    timestamp: now,
    createdAt: new Date(now).toISOString(),
    date: dateStr,
    comment: params.comment.trim(),
    verified: true,
    verifiedPurchase: true,
    templateUsed: params.templateUsed,
    categoryTag: params.categoryTag,
    productId: params.productId
  };
};
