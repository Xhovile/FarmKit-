export type SellerType = 'farmer' | 'agro_dealer' | 'cooperative' | 'company';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'seasonal';

export interface StructuredLocation {
  region: string;
  district: string;
  area: string;
  label: string;
}

export interface MarketListing {
  id?: string;
  title: string;
  category: string;
  price: number;

  unit: string;
  quantity: number;
  availableQuantity?: number;
  soldQuantity?: number;

  location: string;
  locationData?: StructuredLocation;

  deliveryMethod: string;
  description: string;
  businessName: string;
  phone: string;

  sellerId: string;
  sellerName: string;
  sellerStatus: AccountStatus;
  sellerType?: SellerType;

  verified: boolean;
  imageUrl: string | null;
  imageUrls?: string[];

  status: 'active' | 'sold' | 'hidden';
  stockStatus?: StockStatus;

  createdAt: any;
  updatedAt?: any;

  viewsCount?: number;
  sharesCount?: number;
  savesCount?: number;

  condition?: string;
  brand?: string;
  model?: string;
  capacity?: string;
  fuelType?: string;

  seedType?: string;
  variety?: string;
  packSize?: string;
  season?: string;
  germinationRate?: string;

  breed?: string;
  age?: string;
  sex?: string;
  healthStatus?: string;
  vaccinationStatus?: string;

  inputType?: string;
  usage?: string;
  expiryDate?: string;
}

export type UserRole = 'buyer' | 'seller' | 'business' | 'cooperative' | 'ngo';
export type AccountStatus = 'basic' | 'verified' | 'premium';

export interface SellerProfile {
  type: 'individual_seller';
  businessName: string;
  category: string;
  region?: string;
  district: string;
  deliveryMethod: string;
  verified: boolean;
  fullName?: string;
  phone?: string;
  area?: string;
  experienceYears?: string;
  description?: string;
}

export interface OrganizationProfile {
  type: 'business' | 'cooperative' | 'ngo';
  organizationName: string;
  contactPerson: string;
  region?: string;
  district: string;
  description: string;
  verified: boolean;
  phone?: string;
  address?: string;
  businessType?: string;
  productsOrServices?: string;
  registrationNumber?: string;
  organizationType?: string;
  area?: string;
  memberCount?: string;
  mainCommodities?: string;
  focusArea?: string;
  servicesOffered?: string;
  websiteOrSocial?: string;
}

export interface SellerUpgradeForm {
  businessName: string;
  fullName: string;
  phone: string;
  region: string;
  district: string;
  area: string;
  category: string;
  deliveryMethod: string;
  experienceYears: string;
  description: string;
}

export interface BusinessUpgradeForm {
  organizationName: string;
  contactPerson: string;
  phone: string;
  region: string;
  district: string;
  address: string;
  businessType: string;
  productsOrServices: string;
  registrationNumber: string;
  description: string;
}

export interface CooperativeUpgradeForm {
  organizationName: string;
  contactPerson: string;
  phone: string;
  region: string;
  district: string;
  area: string;
  memberCount: string;
  mainCommodities: string;
  registrationNumber: string;
  description: string;
}

export interface NgoUpgradeForm {
  organizationName: string;
  contactPerson: string;
  phone: string;
  region: string;
  district: string;
  address: string;
  organizationType: string;
  description: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  region?: string;
  district?: string;
  location: string;
  bio: string;
  avatar: string;

  primaryRole: UserRole;
  roles: UserRole[];

  status: AccountStatus;

  sellerProfile: SellerProfile | null;
  organizationProfile: OrganizationProfile | null;

  createdAt: string;
  emailVerified: boolean;
}

export type BuyerRequestStatus = 'open' | 'matched' | 'closed';

export type BuyerType = 'farmer' | 'trader' | 'processor' | 'business' | 'individual';

export interface BuyerRequest {
  id?: string;

  commodity: string;
  category: string;

  quantity: number;
  unit: string;
  quantityFound?: number;

  priceRange: string;

  location: string;
  locationData?: StructuredLocation;

  neededBy?: string;
  urgency?: 'normal' | 'urgent';

  buyerType?: BuyerType;

  deliveryPreference?: 'pickup' | 'seller_delivery' | 'third_party';
  contactMethod?: 'whatsapp' | 'phone';

  description: string;

  referenceImageUrl?: string | null;

  buyerId: string;
  buyerName: string;
  phone: string;

  status: BuyerRequestStatus;

  createdAt: any;
  updatedAt?: any;
}
