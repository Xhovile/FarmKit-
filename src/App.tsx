import React, { useState, useEffect } from 'react';
import { 
  Wifi
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthModal from './components/AuthModal';
import { Toaster } from 'react-hot-toast';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { MarketListing, BuyerRequest } from './types';
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
};

export default function App() {
  const { t, lang, setLang } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [infoCategory, setInfoCategory] = useState<'overview' | 'crops' | 'livestock' | 'prices' | 'markets' | 'training' | 'alerts' | 'pesticide_map'>('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketSearchQuery, setMarketSearchQuery] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
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

  const t_old = (en: string, ny: string) => lang === 'en' ? en : ny;

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

    const price = Number(data.price);
    const quantity = Number(data.quantity);

    if (!cleanedTitle) throw new Error('Product name is required.');
    if (!cleanedCategory) throw new Error('Category is required.');
    if (!cleanedUnit) throw new Error('Unit is required.');
    if (!cleanedLocation) throw new Error('Location is required.');
    if (!cleanedPhone) throw new Error('Phone number is required.');
    if (!Number.isFinite(price) || price <= 0) throw new Error('Price must be greater than 0.');
    if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('Quantity must be greater than 0.');

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
      imageUrl: null,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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
              setIsAddProductModalOpen={setIsAddProductModalOpen} 
              setFormStep={setFormStep} 
              setActiveTab={setActiveTab}
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
            onClick={() => setIsAddProductModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-10">
              {formStep < 10 ? (
                <AddListingForm 
                  t={t} 
                  user={user} 
                  step={formStep} 
                  setStep={setFormStep} 
                  onClose={() => setIsAddProductModalOpen(false)} 
                  onSubmit={async (data) => {
                    try {
                      await handleCreateListing(data);
                      setIsAddProductModalOpen(false);
                      setFormStep(1);
                    } catch (error: any) {
                      console.error('Error creating listing:', error);
                      alert(error.message || 'Failed to create listing.');
                    }
                  }} 
                />
              ) : (
                <AddRequestForm 
                  t={t} 
                  user={user} 
                  step={formStep} 
                  setStep={setFormStep} 
                  onClose={() => setIsAddProductModalOpen(false)} 
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
