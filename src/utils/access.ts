import { AccessGrant, UserAccount } from '../types';
export type { AccessGrant };

export const ACCESS_DURATION_DAYS = 90; // Strictly 3 months (90 days)

export const createAccessGrant = (days: number = ACCESS_DURATION_DAYS): AccessGrant => {
  const now = new Date();
  const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return {
    purchasedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
};

export interface ProductAccessStatus {
  isPurchased: boolean;
  isUnlocked: boolean; // Purchased AND not expired
  isExpired: boolean;  // Purchased but 90 days have lapsed
  daysRemaining: number;
  expiresAt: string | null;
}

export const getProductAccessStatus = (
  productId: string,
  account: UserAccount
): ProductAccessStatus => {
  const isPurchased = account.purchasedProductIds.includes(productId);
  if (!isPurchased) {
    return {
      isPurchased: false,
      isUnlocked: false,
      isExpired: false,
      daysRemaining: 0,
      expiresAt: null,
    };
  }

  const grant = account.purchasedAccess?.[productId];
  if (!grant) {
    // If no explicit grant record exists, treat as active for 90 days from now
    return {
      isPurchased: true,
      isUnlocked: true,
      isExpired: false,
      daysRemaining: ACCESS_DURATION_DAYS,
      expiresAt: null,
    };
  }

  const expiryTime = new Date(grant.expiresAt).getTime();
  const nowTime = Date.now();
  const diffMs = expiryTime - nowTime;

  if (diffMs <= 0) {
    return {
      isPurchased: true,
      isUnlocked: false,
      isExpired: true,
      daysRemaining: 0,
      expiresAt: grant.expiresAt,
    };
  }

  const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return {
    isPurchased: true,
    isUnlocked: true,
    isExpired: false,
    daysRemaining,
    expiresAt: grant.expiresAt,
  };
};
