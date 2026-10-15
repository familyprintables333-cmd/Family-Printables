export type CategoryId =
  | 'toddlers'
  | 'early-learning'
  | 'brain-teasers'
  | 'planning'
  | 'seasonal'
  | 'festivals'
  | 'audio-stories'
  | 'stories';

export interface CategoryInfo {
  id: CategoryId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  includedActivities: string[];
  purpose: string;
  targetAge: string;
  benefits: {
    forKids: string;
    forParents: string;
  };
  image: string;
  badge: string;
  accentColor: string;
}

export interface UserReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: CategoryId;
  categoryLabel: string;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  reviews?: UserReview[];
  pages: number;
  targetAge: string;
  educationalBenefit: string;
  includedItems: string[];
  format: string[];
  image: string;
  shortDesc: string;
  description: string;
  features: string[];
  samplePages: { title: string; subtitle: string; previewText: string }[];
  fileSize: string;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  country: string;
  city: string;
  date: string;
  items: CartItem[];
  totalUSD: number;
  paymentMethod: 'card' | 'applepay' | 'googlepay' | 'stripe' | 'paypal' | 'payoneer';
  downloadToken: string;
}

export interface AccessGrant {
  purchasedAt: string;
  expiresAt: string;
}

export interface UserAccount {
  name: string;
  email: string;
  isLoggedIn: boolean;
  purchasedProductIds: string[];
  purchasedAccess?: Record<string, AccessGrant>;
  orderHistory: Order[];
}

export interface RoutineItem {
  id: string;
  name: string;
  timeSlot: string;
  days: boolean[];
}

export interface TimetableConfig {
  kidName: string;
  weekLabel: string;
  theme: 'pastel' | 'forest' | 'sunshine' | 'minimal';
  checkShape?: 'circle' | 'square';
  rewardGoal: string;
  notes: string;
  routines: RoutineItem[];
}

export interface MerchantSettings {
  payoneerEmail: string;
  payoneerAccountId: string;
  receivingAccountNumber: string;
  routingNumber: string;
  bankName: string;
  gatewayMode: 'test' | 'live';
  currency: string;
  // Stripe Gateway Configuration
  paymentGateway?: 'stripe' | 'payoneer' | 'both';
  stripePublishableKey?: string;
  stripeAccountId?: string;
  stripeWebhookSecret?: string;
}
