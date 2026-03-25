import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  Wifi
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthModal from './components/AuthModal';
import { Toaster } from 'react-hot-toast';
import { api } from './lib/api';
import { BuyerRequest, MarketListing, StockStatus, User } from './types';
import toast from 'react-hot-toast';

const computeStockStatus = (
  availableQuantity: number,
  totalQuantity: number
): StockStatus => {
  if (availableQuantity <= 0) return 'out_of_stock';
  if (totalQuantity > 0 && availableQuantity <= totalQuantity * 0.2) return 'low_stock';
  return 'in_stock';
};

// New Imports
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { MarketPage } from './pages/MarketPage';
import { ExpertPage } from './pages/ExpertPage';
import { AccountPage } from './pages/AccountPage';
import { ChatWidget } from './components/ChatWidget';
import { WelcomeTour } from './components/WelcomeTour';
import { DetailModal } from './components/DetailModal';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AddListingForm, AddRequestForm } from './components/MarketplaceForms';
import { tourSteps } from './data/constants';
// Real data states (placeholders for now)
const experts: any[] = [];
const successStories: any[] = [];
import { useTranslation } from './hooks/useTranslation';

type Tab = 'info' | 'market' | 'experts' | 'account';
type ListingFormData = {
  title: string;
  category: string;
  price: string;

  unit: string;
  customUnit?: string;
  quantity: string;

  availableQuantity?: number;
  soldQuantity?: number;

  location: string;
  locationData?: {
    region: string;
    district: string;
    area: string;
    label: string;
  };

  deliveryMethod: string;
  description: string;
  businessName: string;
  phone: string;

  sellerType?: string;
  stockStatus?: StockStatus;

  imageFiles?: File[];
  imagePreviews?: string[];

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
};

const normalizeRoles = (roles: unknown): import('./types').UserRole[] => {
  const validRoles = new Set(['buyer', 'seller', 'business', 'cooperative', 'ngo']);

  if (!Array.isArray(roles)) return ['buyer'];

  const cleaned = roles.filter(
    (role): role is import('./types').UserRole =>
      typeof role === 'string' && validRoles.has(role)
  );

  return cleaned.length > 0 ? cleaned : ['buyer'];
};

const deriveStatus = (data: any): import('./types').AccountStatus => {
  if (data?.status === 'verified' || data?.status === 'premium' || data?.status === 'basic') {
    return data.status;
  }

  if (data?.tier === 'Verified Seller') return 'verified';
  if (data?.tier === 'Premium') return 'premium';
  return 'basic';
};

const derivePrimaryRole = (data: any, roles: import('./types').UserRole[]): import('./types').UserRole => {
  if (
    data?.primaryRole === 'buyer' ||
    data?.primaryRole === 'seller' ||
    data?.primaryRole === 'business' ||
    data?.primaryRole === 'cooperative' ||
    data?.primaryRole === 'ngo'
  ) {
    return data.primaryRole;
  }

  if (roles.includes('seller')) return 'seller';
  if (roles.includes('business')) return 'business';
  if (roles.includes('cooperative')) return 'cooperative';
  if (roles.includes('ngo')) return 'ngo';

  return 'buyer';
};

const normalizeUserData = (firebaseUser: any, data: any) => {
  const roles = normalizeRoles(data?.roles);
  const primaryRole = derivePrimaryRole(data, roles);
  const status = deriveStatus(data);

  return {
    uid: firebaseUser.uid,
    name: data?.name || firebaseUser.displayName || 'Farmer',
    email: data?.email || firebaseUser.email || '',
    phone: data?.phone || '',
    region: data?.region || '',
    district: data?.district || '',
    location: data?.location || '',
    bio: data?.bio || '',
    avatar: data?.avatar || firebaseUser.photoURL || '',

    primaryRole,
    roles,
    status,

    sellerProfile: data?.sellerProfile || null,
    organizationProfile: data?.organizationProfile || null,

    createdAt: data?.createdAt || new Date().toISOString(),
    emailVerified: firebaseUser.emailVerified,
  };
};

export default function App() {
  const { t, lang, setLang } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const tabScrollPositionsRef = useRef<Record<string, number>>({
    info: 0,
    market: 0,
    experts: 0,
    account: 0,
  });

  const previousActiveTabRef = useRef<Tab>('info');
  const [infoCategory, setInfoCategory] = useState<'overview' | 'crops' | 'livestock' | 'prices' | 'markets' | 'training' | 'alerts' | 'pesticide_map'>('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketSearchQuery, setMarketSearchQuery] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<MarketListing | null>(null);
  const [editingRequest, setEditingRequest] = useState<BuyerRequest | null>(null);
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [communityTab, setCommunityTab] = useState<'experts' | 'organizations' | 'support' | 'stories'>('experts');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: 'Hello! How can I help you with your farm today?', isUser: false }
  ]);
  
  // Real data states (to replace mock data)
  const [realExperts, setRealExperts] = useState<any[]>([]);
  const [realSuccessStories, setRealSuccessStories] = useState<any[]>([]);
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user from PostgreSQL via API
          let userData: User;
          try {
            userData = await api.get('/api/users/me');
          } catch (error: any) {
            if (error.message.includes('404') || error.message.includes('User not found')) {
              // Create new user if not exists
              const initialData = {
                name: firebaseUser.displayName || 'Farmer',
                email: firebaseUser.email || '',
                phone: '',
                region: '',
                district: '',
                location: '',
                bio: '',
                avatar: firebaseUser.photoURL || '',
                primaryRole: 'buyer',
                roles: ['buyer'],
                status: 'basic',
                sellerProfile: null,
                organizationProfile: null,
                emailVerified: firebaseUser.emailVerified,
              };
              userData = await api.post('/api/users', initialData);
            } else {
              throw error;
            }
          }
          setUser(userData);
        } catch (error) {
          console.error('Auth sync error:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      tabScrollPositionsRef.current[activeTab] = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab]);

  useEffect(() => {
    if (previousActiveTabRef.current !== activeTab) {
      const savedPosition = tabScrollPositionsRef.current[activeTab] ?? 0;

      requestAnimationFrame(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'auto',
        });
      });

      previousActiveTabRef.current = activeTab;
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listings = await api.get('/api/market-listings');
        // Map snake_case from DB to camelCase for frontend if necessary
        // The current server returns what it gets, but the schema has snake_case
        const mappedListings = listings.map((l: any) => ({
          ...l,
          availableQuantity: Number(l.available_quantity),
          soldQuantity: Number(l.sold_quantity),
          deliveryMethod: l.delivery_method,
          businessName: l.business_name,
          sellerId: l.seller_id,
          sellerName: l.seller_name,
          sellerStatus: l.seller_status,
          imageUrl: l.image_url,
          imageUrls: l.image_urls,
          createdAt: l.created_at,
          updatedAt: l.updated_at,
        }));
        setMarketListings(mappedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
    const interval = setInterval(fetchListings, 30000); // Poll every 30s as a simple replacement for onSnapshot
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setSavedListingIds([]);
      return;
    }

    const fetchSavedIds = async () => {
      try {
        const saved = await api.get('/api/saved-listings');
        setSavedListingIds(saved.map((s: any) => s.id));
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      }
    };

    fetchSavedIds();
  }, [user?.uid]);

  useEffect(() => {
    if (selectedItem && selectedItem.id && selectedItem.type === 'market_listing') {
      const updatedItem = marketListings.find(item => item.id === selectedItem.id);
      if (updatedItem) {
        // Sync the selected item with live data
        setSelectedItem({
          ...updatedItem,
          image: updatedItem.imageUrl,
          type: 'market_listing'
        });
      }
    }
  }, [marketListings]);

  const t_old = (en: string, ny: string) => lang === 'en' ? en : ny;

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image file is too large. Maximum size is 10MB.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const mapListingToFormData = (listing: MarketListing): ListingFormData => ({
  title: listing.title || '',
  category: listing.category || '',
  price: String(listing.price ?? ''),

  unit: listing.unit || '',
  customUnit: '',
  quantity: String(listing.quantity ?? ''),

  availableQuantity: listing.availableQuantity,
  soldQuantity: listing.soldQuantity,

  location: listing.location || '',
  locationData: listing.locationData || {
    region: '',
    district: '',
    area: '',
    label: listing.location || '',
  },

  deliveryMethod: listing.deliveryMethod || 'pickup',
  description: listing.description || '',
  businessName: listing.businessName || '',
  phone: listing.phone || '',

  sellerType: listing.sellerType || 'farmer',
  stockStatus: listing.stockStatus,

  imageFiles: [],
  imagePreviews: listing.imageUrls?.length
    ? listing.imageUrls
    : (listing.imageUrl ? [listing.imageUrl] : []),

  condition: listing.condition || '',
  brand: listing.brand || '',
  model: listing.model || '',
  capacity: listing.capacity || '',
  fuelType: listing.fuelType || '',

  seedType: listing.seedType || '',
  variety: listing.variety || '',
  packSize: listing.packSize || '',
  season: listing.season || '',
  germinationRate: listing.germinationRate || '',

  breed: listing.breed || '',
  age: listing.age || '',
  sex: listing.sex || '',
  healthStatus: listing.healthStatus || '',
  vaccinationStatus: listing.vaccinationStatus || '',

  inputType: listing.inputType || '',
  usage: listing.usage || '',
  expiryDate: listing.expiryDate || '',
});

  const editingFormData = useMemo(() => {
    return editingListing ? mapListingToFormData(editingListing) : undefined;
  }, [editingListing]);

  const handleCreateListing = async (data: ListingFormData) => {
    if (!user) {
      throw new Error('You must be signed in to create a listing.');
    }

    const canSell =
      user.roles.includes('seller') ||
      user.roles.includes('business') ||
      user.roles.includes('cooperative') ||
      user.roles.includes('ngo');

    if (!canSell) {
      throw new Error('Please upgrade your account to a seller or organisation before creating listings.');
    }

    const cleanedTitle = data.title.trim();
    const cleanedCategory = data.category.trim();
    const cleanedUnit = data.unit.trim();
    const cleanedLocation = data.location.trim();
    const cleanedDescription = data.description.trim();
    const cleanedBusinessName = data.businessName.trim();
    const cleanedPhone = data.phone.trim();

    const cleanOptional = (value?: string) => value?.trim() || '';

    const condition = cleanOptional(data.condition);
    const brand = cleanOptional(data.brand);
    const model = cleanOptional(data.model);
    const capacity = cleanOptional(data.capacity);
    const fuelType = cleanOptional(data.fuelType);

    const seedType = cleanOptional(data.seedType);
    const variety = cleanOptional(data.variety);
    const packSize = cleanOptional(data.packSize);
    const season = cleanOptional(data.season);
    const germinationRate = cleanOptional(data.germinationRate);

    const breed = cleanOptional(data.breed);
    const age = cleanOptional(data.age);
    const sex = cleanOptional(data.sex);
    const healthStatus = cleanOptional(data.healthStatus);
    const vaccinationStatus = cleanOptional(data.vaccinationStatus);

    const inputType = cleanOptional(data.inputType);
    const usage = cleanOptional(data.usage);
    const expiryDate = cleanOptional(data.expiryDate);

    const price = Number(data.price);
    const quantity = Number(data.quantity);

    if (!cleanedTitle) throw new Error('Product name is required.');
    if (!cleanedCategory) throw new Error('Category is required.');
    if (!cleanedUnit) throw new Error('Unit is required.');
    if (!cleanedLocation) throw new Error('Location is required.');
    if (!cleanedPhone) throw new Error('Phone number is required.');
    if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be greater than 0.');
    if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('Quantity must be greater than 0.');

    setIsSubmittingListing(true);

    try {
      let imageUrls: string[] = [];

      if (data.imageFiles?.length) {
        const uploadResults = await Promise.allSettled(
          data.imageFiles.slice(0, 4).map((file: File) => uploadImageToCloudinary(file))
        );

        const successfulUploads = uploadResults
          .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
          .map((result) => result.value);

        const failedUploads = uploadResults.filter((result): result is PromiseRejectedResult => result.status === 'rejected');

        imageUrls = successfulUploads;

        if (failedUploads.length > 0) {
          const reasons = failedUploads.map(f => f.reason?.message || String(f.reason));
          console.error('Some image uploads failed:', reasons);
          toast.error(`${failedUploads.length} image upload(s) failed. The rest were uploaded.`);
        }
      }

      if (data.imageFiles?.length && imageUrls.length === 0) {
        throw new Error('All image uploads failed. Listing was not published.');
      }

      await api.post('/api/market-listings', {
        title: cleanedTitle,
        category: cleanedCategory,
        price,
        unit: cleanedUnit,
        quantity,
        availableQuantity: data.availableQuantity ?? quantity,
        soldQuantity: data.soldQuantity ?? 0,
        location: cleanedLocation,
        deliveryMethod: data.deliveryMethod,
        description: cleanedDescription,
        businessName: cleanedBusinessName || user.name || 'Seller',
        phone: cleanedPhone,
        sellerName: user.name || 'Seller',
        sellerStatus: user.status,
        verified: user.status === 'verified',
        imageUrl: imageUrls[0] || null,
        imageUrls,
      });

      toast.success('Listing created successfully!');
    } finally {
      setIsSubmittingListing(false);
    }
  };

  const handleUpdateListing = async (listingId: string, data: ListingFormData) => {
    if (!user) {
      throw new Error('You must be signed in to edit a listing.');
    }

    const cleanedTitle = data.title.trim();
    const cleanedCategory = data.category.trim();
    const cleanedUnit = data.unit.trim();
    const cleanedLocation = data.location.trim();
    const cleanedDescription = data.description.trim();
    const cleanedBusinessName = data.businessName.trim();
    const cleanedPhone = data.phone.trim();

    const cleanOptional = (value?: string) => value?.trim() || '';

    const condition = cleanOptional(data.condition);
    const brand = cleanOptional(data.brand);
    const model = cleanOptional(data.model);
    const capacity = cleanOptional(data.capacity);
    const fuelType = cleanOptional(data.fuelType);

    const seedType = cleanOptional(data.seedType);
    const variety = cleanOptional(data.variety);
    const packSize = cleanOptional(data.packSize);
    const season = cleanOptional(data.season);
    const germinationRate = cleanOptional(data.germinationRate);

    const breed = cleanOptional(data.breed);
    const age = cleanOptional(data.age);
    const sex = cleanOptional(data.sex);
    const healthStatus = cleanOptional(data.healthStatus);
    const vaccinationStatus = cleanOptional(data.vaccinationStatus);

    const inputType = cleanOptional(data.inputType);
    const usage = cleanOptional(data.usage);
    const expiryDate = cleanOptional(data.expiryDate);

    const price = Number(data.price);
    const quantity = Number(data.quantity);

    const previousQuantity = editingListing?.quantity ?? quantity;
    const previousAvailableQuantity = editingListing?.availableQuantity ?? previousQuantity;
    const previousSoldQuantity = editingListing?.soldQuantity ?? 0;

    const quantityDelta = quantity - previousQuantity;
    const nextAvailableQuantity = Math.max(0, previousAvailableQuantity + quantityDelta);

    if (!cleanedTitle) throw new Error('Product name is required.');
    if (!cleanedCategory) throw new Error('Category is required.');
    if (!cleanedUnit) throw new Error('Unit is required.');
    if (!cleanedLocation) throw new Error('Location is required.');
    if (!cleanedPhone) throw new Error('Phone number is required.');
    if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be greater than 0.');
    if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('Quantity must be greater than 0.');

    setIsSubmittingListing(true);

    try {
      let imageUrls = editingListing?.imageUrls?.length
        ? editingListing.imageUrls
        : (editingListing?.imageUrl ? [editingListing.imageUrl] : []);

      if (data.imageFiles?.length) {
        const uploadResults = await Promise.allSettled(
          data.imageFiles.slice(0, 4).map((file: File) => uploadImageToCloudinary(file))
        );

        const successfulUploads = uploadResults
          .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
          .map((result) => result.value);

        const failedUploads = uploadResults.filter((result): result is PromiseRejectedResult => result.status === 'rejected');

        if (successfulUploads.length > 0) {
          imageUrls = successfulUploads;
        }

        if (failedUploads.length > 0) {
          const reasons = failedUploads.map(f => f.reason?.message || String(f.reason));
          console.error('Some image uploads failed during update:', reasons);
          toast.error(`${failedUploads.length} image upload(s) failed. The rest were uploaded.`);
        }
      }

      await api.put(`/api/market-listings/${listingId}`, {
        title: cleanedTitle,
        category: cleanedCategory,
        price,
        unit: cleanedUnit,
        quantity,
        availableQuantity: nextAvailableQuantity,
        soldQuantity: previousSoldQuantity,
        location: cleanedLocation,
        deliveryMethod: data.deliveryMethod,
        description: cleanedDescription,
        businessName: cleanedBusinessName || user.name || 'Seller',
        phone: cleanedPhone,
        imageUrl: imageUrls[0] || null,
        imageUrls,
        status: data.stockStatus === 'out_of_stock' ? 'sold' : 'active',
      });

      toast.success('Listing updated successfully!');
    } finally {
      setIsSubmittingListing(false);
    }
  };

  const incrementListingViews = async (listingId?: string) => {
    if (!listingId) return;

    try {
      await api.post(`/api/market-listings/${listingId}/increment-views`, {});
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const incrementListingShares = async (listingId?: string) => {
    if (!listingId) return;

    try {
      await api.post(`/api/market-listings/${listingId}/increment-shares`, {});
    } catch (error) {
      console.error('Error incrementing shares:', error);
    }
  };

  const toggleSavedListing = async (listing: MarketListing) => {
    if (!user?.uid) {
      toast.error('Please sign in first.');
      return;
    }

    if (!listing.id) return;

    const isSaved = savedListingIds.includes(listing.id);

    try {
      if (isSaved) {
        await api.delete(`/api/saved-listings/${listing.id}`);
        setSavedListingIds(prev => prev.filter(id => id !== listing.id));
        toast.success('Removed from saved.');
      } else {
        await api.post(`/api/saved-listings/${listing.id}`, {});
        setSavedListingIds(prev => [...prev, listing.id!]);
        toast.success('Saved listing.');
      }
    } catch (error) {
      console.error('Error toggling saved listing:', error);
      toast.error('Failed to update saved listing.');
    }
  };

  const handleUpdateBuyerRequestStatus = async (
    request: BuyerRequest,
    nextStatus: 'open' | 'matched' | 'closed'
  ) => {
    if (!request.id) return;

    if (user?.uid !== request.buyerId) {
      toast.error('Only the request owner can change its status.');
      return;
    }

    try {
      await api.put(`/api/buyer-requests/${request.id}`, {
        status: nextStatus,
      });

      toast.success(
        nextStatus === 'matched'
          ? 'Request marked as matched.'
          : nextStatus === 'closed'
          ? 'Request closed.'
          : 'Request reopened.'
      );

      setSelectedItem((current: any) => {
        if (current?.id === request.id && current?.type === 'buyer_request') {
          return {
            ...current,
            status: nextStatus,
            updatedAt: { seconds: Math.floor(Date.now() / 1000) },
          };
        }
        return current;
      });
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status.');
    } 
  };

  return (
    <div className="bg-neutral-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
      <Toaster position="top-center" />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        t={t} 
        lang={lang}
      />

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-2.5 right-2.5 z-50 bg-red-500 text-white px-3 py-1 rounded-lg text-sm shadow-lg flex items-center animate-bounce">
          <Wifi className="w-4 h-4 mr-1" /> {t('common.offline')}
        </div>
      )}

      <Header 
        t={t} 
        user={user} 
        setIsAuthModalOpen={setIsAuthModalOpen} 
      />

      <DetailModal 
        t={t} 
        lang={lang}
        selectedItem={selectedItem} 
        setSelectedItem={setSelectedItem} 
        toggleSavedListing={toggleSavedListing}
        incrementListingShares={incrementListingShares}
        savedListingIds={savedListingIds}
      />

      <WelcomeTour 
        t={t} 
        showTour={showTour} 
        setShowTour={setShowTour} 
        tourStep={tourStep} 
        setTourStep={setTourStep} 
        tourSteps={tourSteps} 
      />

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

      <main className="max-w-7xl mx-auto px-4 pb-24 md:pb-16 mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <HomePage 
              key="home-tab"
              t={t} 
              lang={lang}
              infoCategory={infoCategory} 
              setInfoCategory={setInfoCategory} 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              setSelectedItem={setSelectedItem} 
              user={user}
              setActiveTab={setActiveTab}
              setIsChatOpen={setIsChatOpen}
            />
          )}

          {activeTab === 'market' && (
            <MarketPage 
              key="market-tab"
              t={t} 
              lang={lang}
              marketSearchQuery={marketSearchQuery} 
              setMarketSearchQuery={setMarketSearchQuery} 
              user={user}
              marketListings={marketListings}
              setIsAddProductModalOpen={setIsAddProductModalOpen} 
              setFormStep={setFormStep} 
              setActiveTab={setActiveTab}
              setSelectedItem={setSelectedItem}
              setEditingListing={setEditingListing}
              setEditingRequest={setEditingRequest}
              incrementListingViews={incrementListingViews}
              incrementListingShares={incrementListingShares}
              toggleSavedListing={toggleSavedListing}
              savedListingIds={savedListingIds}
              onUpdateBuyerRequestStatus={handleUpdateBuyerRequestStatus}
            />
          )}

          {activeTab === 'experts' && (
            <ExpertPage 
              key="experts-tab"
              t={t} 
              lang={lang} 
              communityTab={communityTab as any} 
              setCommunityTab={setCommunityTab as any} 
              experts={realExperts} 
              successStories={realSuccessStories} 
              user={user}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'account' && (
            <AccountPage 
              key="account-tab"
              t={t} 
              lang={lang}
              setLang={setLang}
              user={user} 
              setUser={setUser} 
              setIsAuthModalOpen={setIsAuthModalOpen} 
              setShowTour={setShowTour} 
              setActiveTab={setActiveTab}
              setSelectedItem={setSelectedItem}
              setEditingListing={setEditingListing}
              setEditingRequest={setEditingRequest}
              setIsAddProductModalOpen={setIsAddProductModalOpen}
              setFormStep={setFormStep}
              onUpdateBuyerRequestStatus={handleUpdateBuyerRequestStatus}
            />
          )}
        </AnimatePresence>
      </main>

      <FAQSection t={t} />
      <Footer t={t} />
      
      <ChatWidget 
        t={t} 
        isChatOpen={isChatOpen} 
        setIsChatOpen={setIsChatOpen} 
        chatMessage={chatMessage} 
        setChatMessage={setChatMessage} 
        messages={messages} 
        setMessages={setMessages} 
      />

      {/* Marketplace Modal */}
      {isAddProductModalOpen && (
        <div key="add-product-modal-overlay" className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            key="add-product-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              setIsAddProductModalOpen(false);
              setFormStep(1);
              setEditingListing(null);
              setEditingRequest(null);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            key="add-product-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-visible max-h-[90vh] flex flex-col"
          >
            <div className="p-8 md:p-10 overflow-y-auto max-h-[90vh]">
              {formStep < 10 ? (
                <AddListingForm 
                  t={t} 
                  user={user} 
                  step={formStep} 
                  setStep={setFormStep} 
                  initialData={editingFormData}
                  isEditMode={!!editingListing}
                  isSubmitting={isSubmittingListing}
                  onClose={() => {
                    setIsAddProductModalOpen(false);
                    setFormStep(1);
                    setEditingListing(null);
                    setEditingRequest(null);
                  }} 
                  onSubmit={async (data) => {
                    if (loading || isSubmittingListing) return;
                    try {
                      if (editingListing?.id) {
                        await handleUpdateListing(editingListing.id, data);
                      } else {
                        await handleCreateListing(data);
                      }
                      setIsAddProductModalOpen(false);
                      setFormStep(1);
                      setEditingListing(null);
                      setEditingRequest(null);
                    } catch (error: any) {
                      console.error('Error saving listing:', error);
                      toast.error(error.message || 'Failed to save listing.');
                    }
                  }} 
                />
              ) : (
                <AddRequestForm 
                  t={t} 
                  user={user} 
                  step={formStep} 
                  setStep={setFormStep} 
                  initialData={editingRequest}
                  isEditMode={!!editingRequest}
                  onClose={() => {
                    setIsAddProductModalOpen(false);
                    setFormStep(1);
                    setEditingRequest(null);
                  }} 
                  onSubmit={async (data) => {
                    if (!user) {
                      toast.error(t('account.signIn'));
                      return;
                    }

                    setLoading(true);
                    try {
                      let referenceImageUrl =
                        data.removeExistingImage ? null : (editingRequest?.referenceImageUrl || null);

                      if (data.imageFile) {
                        referenceImageUrl = await uploadImageToCloudinary(data.imageFile);
                      }

                      const requestData = {
                        commodity: data.commodity,
                        category: data.category || 'other',
                        quantity: Number(data.quantity),
                        unit: data.unit,
                        priceRange: data.priceRange,
                        location: data.location,
                        neededBy: data.neededBy || '',
                        urgency: data.urgency || 'normal',
                        buyerType: data.buyerType || 'individual',
                        deliveryPreference: data.deliveryPreference || 'pickup',
                        contactMethod: data.contactMethod || 'whatsapp',
                        description: data.description || '',
                        referenceImageUrl: referenceImageUrl,
                        buyerName: user.name,
                        phone: data.phone || user.phone,
                      };

                      if (editingRequest?.id) {
                        await api.put(`/api/buyer-requests/${editingRequest.id}`, requestData);
                        toast.success('Request updated successfully!');
                      } else {
                        await api.post('/api/buyer-requests', requestData);
                        toast.success(t('market.requestPosted') || 'Request posted successfully!');
                      }

                      setIsAddProductModalOpen(false);
                      setFormStep(1);
                      setEditingRequest(null);
                    } catch (error: any) {
                      console.error('Error saving request:', error);
                      toast.error(error.message || t('common.error') || 'An error occurred');
                    } finally {
                      setLoading(false);
                    }
                  }} 
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
