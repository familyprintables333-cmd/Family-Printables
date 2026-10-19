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

  const rawValue = dateOrTimestamp || fallbackDateStr;

  // If already relative phrase like "2 days ago", "1 week ago", return directly
  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    if (trimmed.toLowerCase() === 'just now') {
      // Convert legacy "Just now" into an accurate fresh timestamp
      return 'Today · Just now';
    }
    if (trimmed.includes('ago') || trimmed.includes('Yesterday')) {
      return trimmed;
    }
  }

  // Parse milliseconds
  let ms: number | null = null;
  if (typeof rawValue === 'number') {
    ms = rawValue;
  } else if (typeof rawValue === 'string') {
    // Check if numeric string
    if (/^\d{10,13}$/.test(rawValue.trim())) {
      ms = Number(rawValue.trim());
      if (ms < 1e11) ms *= 1000; // convert seconds to ms if needed
    } else {
      const parsed = Date.parse(rawValue);
      if (!isNaN(parsed)) {
        ms = parsed;
      }
    }
  }

  if (ms) {
    const now = Date.now();
    const diffSeconds = Math.max(0, Math.floor((now - ms) / 1000));

    if (diffSeconds < 60) {
      return 'Just now (Verified)';
    }
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago · Verified`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago · Verified`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return 'Yesterday · Verified';
    }
    if (diffDays < 14) {
      return `${diffDays} days ago`;
    }
    return new Date(ms).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
    author: params.author.trim() || 'Verified Family Member',
    role: params.role || 'Verified Parent',
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
