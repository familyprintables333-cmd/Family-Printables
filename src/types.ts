export type CategoryId = 
  | 'toddlers' 
  | 'early-learning' 
  | 'puzzles' 
  | 'routines' 
  | 'festivals' 
  | 'brain-teasers' 
  | 'planning' 
  | 'seasonal' 
  | 'audio-stories';

export interface SamplePage {
  title: string;
  subtitle: string;
  previewText: string;
}

export interface UserReview {
  id?: string;
  productId?: string;
  userName?: string;
  author?: string;
  userRole?: string;
  verifiedPurchase?: boolean;
  rating: number;
  date: string;
  timestamp?: number;
  createdAt?: string;
  comment: string;
  helpfulCount?: number;
}

export interface Product {
  id: string;
  title: string;
  category: CategoryId;
  categoryLabel: string;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  pages: number;
  targetAge: string;
  educationalBenefit: string;
  includedItems: string[];
  format: string[];
  image: string;
  shortDesc: string;
  description: string;
  features: string[];
  samplePages?: SamplePage[];
  userReviews?: UserReview[];
  reviews?: UserReview[];
  fileSize?: string;
  audioDuration?: string;
  featuredBadge?: string;
  isBestSeller?: boolean;
  isBestseller?: boolean;
  isFree?: boolean;
  isLocked?: boolean;
  accessType?: 'free' | 'paid';
  documentFileUrl?: string;
  documentFileName?: string;
  documentFileType?: 'pdf' | 'doc' | 'docx';
  audioVideoUrl?: string;
  mediaType?: 'audio' | 'video' | 'none';
  gumroadUrl?: string;
  customHtmlSnippet?: string;
}

export interface CategoryInfo {
  id: CategoryId;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  shortDescription?: string;
  ageRange: string;
  accentColor: string;
  badge: string;
  itemCount: number;
  image: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AccessGrant {
  purchasedAt: string;
  expiresAt: string;
  productId?: string;
  productTitle?: string;
  orderId?: string;
  downloadUrl?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalUSD: number;
  currency: string;
  totalConverted: number;
  paymentMethod: string;
  date: string;
  status: 'completed' | 'processing' | 'refunded';
  accessGrants?: AccessGrant[];
  downloadToken?: string;
  country?: string;
  city?: string;
  transactionId?: string;
}

export interface UserAccount {
  email: string;
  name: string;
  isLoggedIn: boolean;
  purchasedProductIds: string[];
  purchasedAccess?: Record<string, AccessGrant>;
  orderHistory: Order[];
  orders?: Order[];
  grants?: AccessGrant[];
  isAuthenticated?: boolean;
}

export interface SocialLinks {
  pinterest: string;
  instagram: string;
  facebook: string;
  amazon: string;
  etsy: string;
}

export interface CustomCodeSettings {
  customCss?: string;
  customJs?: string;
  customHeadHtml?: string;
}

export interface MerchantSettings {
  payoneerEmail: string;
  payoneerAccountId: string;
  receivingAccountNumber: string;
  routingNumber: string;
  bankName: string;
  gatewayMode: 'test' | 'live';
  currency: string;
  stripePublishableKey?: string;
  stripeConnected?: boolean;
  socialLinks?: SocialLinks;
  customCode?: CustomCodeSettings;
}

