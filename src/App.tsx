import React, { useEffect, useMemo, useState } from 'react';
import { 
  Wifi
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthModal from './components/AuthModal';
import { Toaster } from 'react-hot-toast';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { BuyerRequest, MarketListing } from './types';
import toast from 'react-hot-toast';

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
  quantity: string;
  location: string;
  deliveryMethod: string;
  description: string;
  businessName: string;
  phone: string;
  imageFile?: File | null;
  imagePreview?: string;

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

export default function App() {
  const { t, lang, setLang } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [infoCategory, setInfoCategory] = useState<'overview' | 'crops' | 'livestock' | 'prices' | 'markets' | 'training' | 'alerts' | 'pesticide_map'>('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketSearchQuery, setMarketSearchQuery] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<MarketListing | null>(null);
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [user, setUser] = useState<{ 
    uid: string;
    email: string;
    name: string; 
    tier: string; 
    location: string; 
    phone: string; 
    avatar?: string;
    bio?: string;
  } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    location: '',
    phone: '',
    bio: ''
  });
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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as any;
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: data.name || firebaseUser.displayName || 'Farmer',
            tier: data.tier || 'Free',
            location: data.location || '',
            phone: data.phone || '',
            avatar: data.avatar || firebaseUser.photoURL || '',
            bio: data.bio || ''
          });
          setProfileFormData({
            name: data.name || '',
            location: data.location || '',
            phone: data.phone || '',
            bio: data.bio || ''
          });
        } else {
          const initialData = {
            name: firebaseUser.displayName || 'Farmer',
            tier: 'Free',
            location: '',
            phone: '',
            avatar: firebaseUser.photoURL || '',
            bio: ''
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), initialData);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            ...initialData
          });
          setProfileFormData({
            name: initialData.name,
            location: initialData.location,
            phone: initialData.phone,
            bio: initialData.bio
          });
        }

        // Removed auto-show tour logic as per screen map
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
    const listingsQuery = query(
      collection(db, 'market_listings'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeListings = onSnapshot(
      listingsQuery,
      (snapshot) => {
        const listings: MarketListing[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<MarketListing, 'id'>;
          return {
            id: docSnap.id,
            ...data,
          };
        });

        setMarketListings(listings);
      },
      (error) => {
        console.error('Error fetching market listings:', error);
        toast.error('Failed to load market listings.');
      }
    );

    return () => unsubscribeListings();
  }, []);

  const t_old = (en: string, ny: string) => lang === 'en' ? en : ny;

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your environment variables.');
    }

    // Optional: Check file size (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image file is too large. Maximum size is 10MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || 'Image upload to Cloudinary failed.';
      
      if (errorMessage.includes('Upload preset')) {
        throw new Error(`Cloudinary Error: ${errorMessage}. Ensure your upload preset is "Unsigned" in Cloudinary settings.`);
      }

      if (errorMessage.includes('API key')) {
        throw new Error(`Cloudinary Error: ${errorMessage}. This usually happens when your Upload Preset is set to "Signed". Please go to Cloudinary Settings > Upload > Upload presets and change your preset's Signing Mode to "Unsigned".`);
      }
      
      throw new Error(`Cloudinary Error: ${errorMessage}`);
    }

    const result = await response.json();

    if (!result.secure_url) {
      throw new Error('Cloudinary did not return an image URL.');
    }

    return result.secure_url;
  };

  const mapListingToFormData = (listing: MarketListing): ListingFormData => ({
    title: listing.title || '',
    category: listing.category || '',
    price: String(listing.price ?? ''),
    unit: listing.unit || '',
    quantity: String(listing.quantity ?? ''),
    location: listing.location || '',
    deliveryMethod: listing.deliveryMethod || 'pickup',
    description: listing.description || '',
    businessName: listing.businessName || '',
    phone: listing.phone || '',
    imageFile: null,
    imagePreview: listing.imageUrl || '',

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
      let imageUrl: string | null = null;

      if (data.imageFile) {
        imageUrl = await uploadImageToCloudinary(data.imageFile);
      }

      await addDoc(collection(db, 'market_listings'), {
        title: cleanedTitle,
        category: cleanedCategory,
        price,
        unit: cleanedUnit,
        quantity,
        location: cleanedLocation,
        deliveryMethod: data.deliveryMethod,
        description: cleanedDescription,
        businessName: cleanedBusinessName || user.name || 'Seller',
        phone: cleanedPhone,
        sellerId: user.uid,
        sellerName: user.name || 'Seller',
        sellerTier: user.tier || 'Free',
        verified: user.tier === 'Verified Seller',
        imageUrl,
        condition,
        brand,
        model,
        capacity,
        fuelType,

        seedType,
        variety,
        packSize,
        season,
        germinationRate,

        breed,
        age,
        sex,
        healthStatus,
        vaccinationStatus,

        inputType,
        usage,
        expiryDate,

        viewsCount: 0,
        sharesCount: 0,
        savesCount: 0,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
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

    if (!cleanedTitle) throw new Error('Product name is required.');
    if (!cleanedCategory) throw new Error('Category is required.');
    if (!cleanedUnit) throw new Error('Unit is required.');
    if (!cleanedLocation) throw new Error('Location is required.');
    if (!cleanedPhone) throw new Error('Phone number is required.');
    if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be greater than 0.');
    if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('Quantity must be greater than 0.');

    setIsSubmittingListing(true);

    try {
      let imageUrl = editingListing?.imageUrl || null;

      if (data.imageFile) {
        imageUrl = await uploadImageToCloudinary(data.imageFile);
      }

      await updateDoc(doc(db, 'market_listings', listingId), {
        title: cleanedTitle,
        category: cleanedCategory,
        price,
        unit: cleanedUnit,
        quantity,
        location: cleanedLocation,
        deliveryMethod: data.deliveryMethod,
        description: cleanedDescription,
        businessName: cleanedBusinessName || user.name || 'Seller',
        phone: cleanedPhone,
        imageUrl,

        condition,
        brand,
        model,
        capacity,
        fuelType,

        seedType,
        variety,
        packSize,
        season,
        germinationRate,

        breed,
        age,
        sex,
        healthStatus,
        vaccinationStatus,

        inputType,
        usage,
        expiryDate,

        updatedAt: serverTimestamp(),
      });

      toast.success('Listing updated successfully!');
    } finally {
      setIsSubmittingListing(false);
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
        lang={lang} 
        switchLanguage={setLang} 
        t={t} 
        user={user} 
        setIsAuthModalOpen={setIsAuthModalOpen} 
      />

      <DetailModal 
        t={t} 
        lang={lang}
        selectedItem={selectedItem} 
        setSelectedItem={setSelectedItem} 
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
            />
          )}

          {activeTab === 'experts' && (
            <ExpertPage 
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
              t={t} 
              user={user} 
              setUser={setUser} 
              isEditingProfile={isEditingProfile} 
              setIsEditingProfile={setIsEditingProfile} 
              profileFormData={profileFormData} 
              setProfileFormData={setProfileFormData} 
              setIsAuthModalOpen={setIsAuthModalOpen} 
              setShowTour={setShowTour} 
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              setIsAddProductModalOpen(false);
              setFormStep(1);
              setEditingListing(null);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
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
                  onClose={() => {
                    setIsAddProductModalOpen(false);
                    setFormStep(1);
                    setEditingListing(null);
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
                  onClose={() => {
                    setIsAddProductModalOpen(false);
                    setFormStep(1);
                  }} 
                  onSubmit={async (data) => {
                    if (!user) {
                      toast.error(t('account.signIn'));
                      return;
                    }

                    setLoading(true);
                    try {
                      const requestData: Omit<BuyerRequest, 'id'> = {
                        commodity: data.commodity,
                        category: data.category || 'other',
                        quantity: Number(data.quantity),
                        unit: data.unit,
                        priceRange: data.priceRange,
                        location: data.location,
                        description: data.description || '',
                        buyerId: user.uid,
                        buyerName: user.name,
                        phone: data.phone || user.phone,
                        status: 'active',
                        createdAt: serverTimestamp()
                      };

                      await addDoc(collection(db, 'buyer_requests'), requestData);
                      toast.success(t('market.requestPosted') || 'Request posted successfully!');
                      setIsAddProductModalOpen(false);
                      setFormStep(1);
                    } catch (error) {
                      console.error('Error adding request:', error);
                      toast.error(t('common.error') || 'An error occurred');
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
