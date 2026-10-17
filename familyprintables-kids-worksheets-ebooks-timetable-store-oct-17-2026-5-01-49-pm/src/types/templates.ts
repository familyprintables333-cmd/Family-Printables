export type PrintThemeId = 'pastel' | 'botanical' | 'sunshine' | 'minimalist';

export type PaperSize = 'a4' | 'us-letter';

export type TemplateCategoryId = 'educational-study' | 'shop-business' | 'personal-home';

export interface PrintTheme {
  id: PrintThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
  highlightColor: string;
}

export interface PrintableTemplate {
  id: string;
  categoryId: TemplateCategoryId;
  categoryTitle: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badge?: string;
  isLocked?: boolean;
  priceUSD?: number;
}

export interface ShopBusinessHeader {
  shopName: string;
  ownerName: string;
  contactNumber: string;
  address: string;
  cityState: string;
  taxNumber?: string;
}

export interface RewardTask {
  id: string;
  title: string;
  points: number;
  description: string;
  actionLabel: string;
  completed?: boolean;
}

export interface UserReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  templateUsed?: string;
  categoryTag?: string;
}
