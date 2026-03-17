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
  sellerTier: string;
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
