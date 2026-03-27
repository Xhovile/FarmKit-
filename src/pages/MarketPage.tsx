import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChartLine, 
  Search, 
  PlusCircle,
  Package,
  TrendingUp,
  Filter,
  ArrowRight,
  LayoutGrid,
  ClipboardList,
  Plus,
  Building2,
  MapPin,
  Truck,
  Info,
  AlertCircle,
  Crown,
  ShieldCheck,
  History,
  Flag,
  X,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { marketCategories, deliveryMethods } from '../data/constants';
import { api } from '../lib/api';
import { MarketListing, BuyerRequest, StockStatus, User } from '../types';

const computeStockStatus = (
  availableQuantity: number,
  totalQuantity: number
): StockStatus => {
  if (availableQuantity <= 0) return 'out_of_stock';
  if (totalQuantity > 0 && availableQuantity <= totalQuantity * 0.2) return 'low_stock';
  return 'in_stock';
};
// Real data states (placeholders for now)
const marketPricesData = [
  { commodity: 'Maize', limbe: 850, lilongwe: 780, mzuzu: 720, unit: 'kg' },
  { commodity: 'Soya Beans', limbe: 1200, lilongwe: 1150, mzuzu: 1100, unit: 'kg' },
  { commodity: 'Groundnuts', limbe: 1500, lilongwe: 1450, mzuzu: 1400, unit: 'kg' },
  { commodity: 'Rice (Kilombero)', limbe: 2200, lilongwe: 2100, mzuzu: 2000, unit: 'kg' },
  { commodity: 'Common Beans', limbe: 1800, lilongwe: 1750, mzuzu: 1700, unit: 'kg' },
];

const priceTrendData = [
  { month: 'Oct', maize: 650, beans: 1400, rice: 1800 },
  { month: 'Nov', maize: 720, beans: 1550, rice: 1950 },
  { month: 'Dec', maize: 800, beans: 1700, rice: 2100 },
  { month: 'Jan', maize: 950, beans: 1900, rice: 2300 },
  { month: 'Feb', maize: 1100, beans: 2100, rice: 2500 },
  { month: 'Mar', maize: 850, beans: 1800, rice: 2200 },
];
import { 
  ListingCard, 
  BuyerRequestCard, 
  MarketplaceFilters,
  DemandFilters,
  SellerOnboardingCTA,
  SellerCard
} from '../components/MarketplaceComponents';
import { PremiumLock, PremiumBadge } from '../components/PremiumLock';
import { toast } from 'react-hot-toast';

interface MarketPageProps {
  t: (key: string) => string;
  lang: string;
  marketSearchQuery: string;
  setMarketSearchQuery: (query: string) => void;
  user: User | null;
  marketListings: MarketListing[];
  setIsAddProductModalOpen: (open: boolean) => void;
  setFormStep: (step: number) => void;
  setActiveTab: (tab: any) => void;
  setSelectedItem: (item: any) => void;
  setEditingListing: (listing: MarketListing | null) => void;
  setEditingRequest: (request: BuyerRequest | null) => void;
  incrementListingViews: (listingId?: string) => Promise<void> | void;
  toggleSavedListing: (listing: MarketListing) => Promise<void> | void;
  incrementListingShares: (listingId?: string) => Promise<void> | void;
  onUpdateBuyerRequestStatus: (
    request: BuyerRequest,
    nextStatus: 'open' | 'matched' | 'closed'
  ) => Promise<void> | void;
  savedListingIds: string[];
}

export const MarketPage: React.FC<MarketPageProps> = ({ 
  t, 
  lang,
  marketSearchQuery, 
  setMarketSearchQuery, 
  user,
  marketListings,
  setIsAddProductModalOpen, 
  setFormStep,
  setActiveTab,
  setSelectedItem,
  setEditingListing,
  setEditingRequest,
  incrementListingViews,
  toggleSavedListing,
  incrementListingShares,
  onUpdateBuyerRequestStatus,
  savedListingIds
}) => {
  const [marketTab, setMarketTab] = useState<'supply' | 'demand' | 'insights'>('supply');
  const [activeCategory, setActiveCategory] = useState('all');
  const [reportingItem, setReportingItem] = useState<any>(null);
  const [reportReason, setReportReason] = useState('');
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);
  const [hiddenListingIds, setHiddenListingIds] = useState<string[]>([]);
  const [saleListing, setSaleListing] = useState<MarketListing | null>(null);
  const [restockListing, setRestockListing] = useState<MarketListing | null>(null);
  const [saleAmount, setSaleAmount] = useState('');
  const [restockAmount, setRestockAmount] = useState('');
  const [isStockActionLoading, setIsStockActionLoading] = useState(false);

  // New Filters
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Demand Filters
  const [demandCategory, setDemandCategory] = useState('all');
  const [demandRegion, setDemandRegion] = useState('all');
  const [demandUrgency, setDemandUrgency] = useState('all');
  const [demandBuyerType, setDemandBuyerType] = useState('all');
  const [demandStatus, setDemandStatus] = useState('open');

  const [foundQtyRequest, setFoundQtyRequest] = useState<BuyerRequest | null>(null);
  const [foundQtyValue, setFoundQtyValue] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await api.get('/api/buyer-requests');
        const newRequests = data as BuyerRequest[];
        
        // Client-side sort (ISO strings)
        newRequests.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        
        setRequests(newRequests);
      } catch (error) {
        console.error('Error loading buyer requests:', error);
      } finally {
        setIsRequestsLoading(false);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setHiddenListingIds([]);
      return;
    }

    const fetchHiddenListings = async () => {
      try {
        // We'll need an endpoint for hidden listings if we want to support this
        // For now, let's assume we might add it or just use an empty array if not implemented
        // const data = await api.get('/api/hidden-listings');
        // setHiddenListingIds(data.map((item: any) => item.listing_id));
      } catch (error) {
        console.error('Error loading hidden listings:', error);
      }
    };

    fetchHiddenListings();
  }, [user?.uid]);

  useEffect(() => {
    setSelectedItem((current: any) => {
      if (!current || current.type !== 'buyer_request' || !current.id) {
        return current;
      }

      const updatedRequest = requests.find((req) => req.id === current.id);

      if (!updatedRequest) {
        return current;
      }

      return {
        ...updatedRequest,
        type: 'buyer_request',
      };
    });
  }, [requests, setSelectedItem]);

  const isPremium = user?.status === 'premium' || user?.status === 'verified';
  const onUpgrade = () => setActiveTab('account');

  const handleReport = () => {
    if (!reportReason.trim()) {
      toast.error(t('market.provideReason'));
      return;
    }
    toast.success(t('market.reportSuccess'));
    setReportingItem(null);
    setReportReason('');
  };

  const handleToggleListingAvailability = async (listing: MarketListing) => {
    if (!listing.id) return;

    if (user?.uid !== listing.sellerId) {
      toast.error('Only the owner can change this listing status.');
      return;
    }

    const nextStatus = listing.status === 'sold' ? 'active' : 'sold';
    const totalQuantity = listing.quantity || 0;

    try {
      const nextAvailableQuantity = nextStatus === 'sold' ? 0 : totalQuantity;
      const nextSoldQuantity = nextStatus === 'sold' ? totalQuantity : 0;

      await api.put(`/api/market-listings/${listing.id}`, {
        status: nextStatus,
        availableQuantity: nextAvailableQuantity,
        soldQuantity: nextSoldQuantity,
      });

      toast.success(
        nextStatus === 'sold'
          ? 'Listing marked as sold.'
          : 'Listing marked as available.'
      );
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast.error('Failed to update listing.');
    }
  };

  const handleRecordSale = async () => {
    if (!saleListing?.id) return;

    const amount = Number(saleAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid sold amount.');
      return;
    }

    const currentAvailable = saleListing.availableQuantity ?? saleListing.quantity ?? 0;
    const currentSold = saleListing.soldQuantity ?? 0;

    if (amount > currentAvailable) {
      toast.error('Sold amount cannot be greater than available stock.');
      return;
    }

    setIsStockActionLoading(true);

    try {
      const nextAvailableQuantity = currentAvailable - amount;
      const nextSoldQuantity = currentSold + amount;

      await api.put(`/api/market-listings/${saleListing.id}`, {
        availableQuantity: nextAvailableQuantity,
        soldQuantity: nextSoldQuantity,
        status: nextAvailableQuantity <= 0 ? 'sold' : 'active',
      });

      toast.success('Sale recorded successfully.');
      setSaleListing(null);
      setSaleAmount('');
    } catch (error) {
      console.error('Error recording sale:', error);
      toast.error('Failed to record sale.');
    } finally {
      setIsStockActionLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!restockListing?.id) return;

    const amount = Number(restockAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid restock amount.');
      return;
    }

    const currentAvailable = restockListing.availableQuantity ?? restockListing.quantity ?? 0;
    const currentSold = restockListing.soldQuantity ?? 0;
    const currentQuantity = restockListing.quantity ?? 0;

    setIsStockActionLoading(true);

    try {
      const nextAvailableQuantity = currentAvailable + amount;
      const nextQuantity = currentQuantity + amount;

      await api.put(`/api/market-listings/${restockListing.id}`, {
        quantity: nextQuantity,
        availableQuantity: nextAvailableQuantity,
        soldQuantity: currentSold,
        status: 'active',
      });

      toast.success('Stock added successfully.');
      setRestockListing(null);
      setRestockAmount('');
    } catch (error) {
      console.error('Error restocking listing:', error);
      toast.error('Failed to restock listing.');
    } finally {
      setIsStockActionLoading(false);
    }
  };

  const handleOpenEditRequest = (request: BuyerRequest) => {
    setSelectedItem(null);
    setEditingListing(null);
    setEditingRequest(request);
    setIsAddProductModalOpen(true);
    setFormStep(10);
  };

  const handleUpdateFoundQuantity = async () => {
    if (!foundQtyRequest?.id) return;

    const amount = Number(foundQtyValue);

    if (!Number.isFinite(amount) || amount < 0) {
      toast.error('Enter a valid found quantity.');
      return;
    }

    if (amount > (foundQtyRequest.quantity ?? 0)) {
      toast.error('Found quantity cannot be greater than requested quantity.');
      return;
    }

    try {
      const nextStatus =
        amount >= (foundQtyRequest.quantity ?? 0)
          ? 'matched'
          : foundQtyRequest.status === 'closed'
          ? 'closed'
          : 'open';

      await api.put(`/api/buyer-requests/${foundQtyRequest.id}`, {
        quantityFound: amount,
        status: nextStatus,
      });

      toast.success('Found quantity updated successfully.');
      setFoundQtyRequest(null);
      setFoundQtyValue('');
    } catch (error) {
      console.error('Error updating found quantity:', error);
      toast.error('Failed to update found quantity.');
    }
  };

  const handleHideListing = async (listing: MarketListing) => {
    if (!listing.id) return;

    if (!user?.uid) {
      toast.error('Please sign in first.');
      return;
    }

    try {
      // await api.post(`/api/hidden-listings/${listing.id}`, {});
      toast.success('Listing hidden from your feed.');
    } catch (error) {
      console.error('Error hiding listing:', error);
      toast.error('Failed to hide listing.');
    }
  };

  const handleDeleteListing = async (listing: MarketListing) => {
    if (!listing.id) return;

    if (user?.uid !== listing.sellerId) {
      toast.error('Only the owner can delete this listing.');
      return;
    }

    const confirmed = window.confirm(`Delete "${listing.title}" permanently?`);

    if (!confirmed) return;

    try {
      await api.delete(`/api/market-listings/${listing.id}`);

      if ((window as any).__farmkitSelectedListingId === listing.id) {
        setSelectedItem(null);
      }

      toast.success('Listing deleted successfully.');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing.');
    }
  };

  const handleOpenListingDetails = (listing: MarketListing) => {
    (window as any).__farmkitSelectedListingId = listing.id;

    incrementListingViews(listing.id);

    setSelectedItem({
      ...listing,
      image: listing.imageUrl || '/placeholder-image.png',
      type: 'market_listing',
    });
  };

  const handleOpenRequestDetails = (request: BuyerRequest) => {
    setSelectedItem({
      ...request,
      type: 'buyer_request',
    });
  };

  const verifiedSellers = Array.from(
    new Set(marketListings.filter((l) => l.verified).map((l) => l.sellerId))
  ).map((sellerId) => marketListings.find((l) => l.sellerId === sellerId))
   .filter(Boolean);

  return (
    <motion.div 
      key="market"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Market Sub-Nav */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setMarketTab('supply')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            marketTab === 'supply'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> {t('market.supply')}
        </button>

        <button
          onClick={() => setMarketTab('demand')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            marketTab === 'demand'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> {t('market.demand')}
        </button>

        <button
          onClick={() => setMarketTab('insights')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 relative ${
            marketTab === 'insights'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          {t('market.insights')}
          {!isPremium && <Crown className="w-3 h-3 absolute -top-1 -right-1 text-amber-500 fill-amber-500" />}
        </button>
      </div>

      {marketTab === 'insights' && (
        <PremiumLock 
          isLocked={!isPremium} 
          t={t} 
          onUpgrade={onUpgrade} 
          featureKey="home.marketAnalytics"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ChartLine className="w-6 h-6 text-primary" />
                {t('account.premiumBenefits')}
              </h2>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {t('common.activeAlerts')}
              </span>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">{t('common.cropGuides')}</th>
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Limbe</th>
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Lilongwe</th>
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Mzuzu</th>
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">{t('common.unit')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketPricesData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="py-4 px-2 font-bold">{row.commodity}</td>
                        <td className="py-4 px-2 text-primary font-medium">{row.limbe.toLocaleString()}</td>
                        <td className="py-4 px-2 text-primary font-medium">{row.lilongwe.toLocaleString()}</td>
                        <td className="py-4 px-2 text-primary font-medium">{row.mzuzu.toLocaleString()}</td>
                        <td className="py-4 px-2 text-gray-500 text-sm">per {row.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Trends Chart */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {t('market.priceTrends')}
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      tickFormatter={(value) => `MK${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                      }} 
                    />
                    <Legend iconType="circle" />
                      <Line 
                        type="monotone" 
                        dataKey="maize" 
                        name={t('common.maize')} 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#10b981' }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="beans" 
                        name={t('common.beans')} 
                        stroke="#f59e0b" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#f59e0b' }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rice" 
                        name={t('common.rice')} 
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#6366f1' }} 
                      />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </PremiumLock>
      )}

      {(marketTab === 'supply' || marketTab === 'demand') && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={marketSearchQuery}
                onChange={(e) => setMarketSearchQuery(e.target.value)}
                placeholder={
                  marketTab === 'supply' ? t('market.searchProducts') : 
                  t('market.searchRequests')
                }
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {marketTab === 'supply' ? t('market.availableSupply') : 
                 t('market.currentDemand')}
              </h2>
              <p className="text-sm text-gray-500">
                {marketTab === 'supply' ? t('market.browseVerified') : 
                 t('market.seeWhatBuyersWant')}
              </p>
            </div>
            
            {(marketTab === 'supply' || marketTab === 'demand') && (
              <button 
                onClick={() => {
                  if (user) {
                    setEditingListing(null);
                    setEditingRequest(null);
                    setIsAddProductModalOpen(true);
                    setFormStep(marketTab === 'supply' ? 1 : 10);
                  } else {
                    toast.error(t('account.signIn'));
                  }
                }}
                className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 ${marketTab === 'supply' ? 'bg-primary text-white shadow-primary/10' : 'bg-indigo-600 text-white shadow-indigo-500/10'}`}
              >
                <PlusCircle className="w-5 h-5" />
                {marketTab === 'supply' ? t('market.addListing') : t('market.postRequest')}
              </button>
            )}
          </div>

          {marketTab === 'supply' && (
            <>
              <MarketplaceFilters 
                categories={marketCategories} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                verifiedOnly={verifiedOnly}
                setVerifiedOnly={setVerifiedOnly}
                selectedDeliveryMethod={selectedDeliveryMethod}
                setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                t={t} 
              />
              
              {marketListings.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-12 text-center border border-gray-100 dark:border-gray-700">
                  <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t('market.noListings')}</h3>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">{t('market.beFirstToSell')}</p>
                  <button 
                    onClick={() => {
                      if (user) {
                        setEditingListing(null);
                        setEditingRequest(null);
                        setIsAddProductModalOpen(true);
                        setFormStep(1);
                      } else {
                        toast.error(t('account.signIn'));
                      }
                    }}
                    className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20"
                  >
                    {t('market.addListing')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketListings
                    .filter((item) => {
                      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
                      const matchesSearch = 
                        item.title.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
                        item.location.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
                        item.businessName.toLowerCase().includes(marketSearchQuery.toLowerCase());
                      const matchesVerified = !verifiedOnly || item.verified;
                      const matchesDelivery = selectedDeliveryMethod === 'all' || item.deliveryMethod === selectedDeliveryMethod;
                      const matchesRegion = selectedRegion === 'all' || item.locationData?.region === selectedRegion;
                      const isVisible = ((item.availableQuantity ?? item.quantity ?? 0) > 0 || item.sellerId === user?.uid) &&
                                       !hiddenListingIds.includes(item.id || '');
                      
                      return matchesCategory && matchesSearch && matchesVerified && matchesDelivery && matchesRegion && isVisible;
                    })
                    .map((item) => (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        t={t}
                        currentUserId={user?.uid}
                        onReport={setReportingItem}
                        onMarkSold={handleToggleListingAvailability}
                        onHide={handleHideListing}
                        onEdit={(listing) => {
                          setEditingListing(listing);
                          setFormStep(1);
                          setIsAddProductModalOpen(true);
                        }}
                        onDelete={handleDeleteListing}
                        onOpenDetails={handleOpenListingDetails}
                        onRecordSale={(listing) => {
                          setSaleListing(listing);
                          setSaleAmount('');
                        }}
                        onRestock={(listing) => {
                          setRestockListing(listing);
                          setRestockAmount('');
                        }}
                        onToggleSave={toggleSavedListing}
                        onShareListing={incrementListingShares}
                        isSaved={savedListingIds.includes(item.id || '')}
                      />
                    ))
                  }
                  {marketListings.filter((item) => {
                    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
                    const matchesSearch = 
                      item.title.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
                      item.location.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
                      item.businessName.toLowerCase().includes(marketSearchQuery.toLowerCase());
                    const matchesVerified = !verifiedOnly || item.verified;
                    const matchesDelivery = selectedDeliveryMethod === 'all' || item.deliveryMethod === selectedDeliveryMethod;
                    const matchesRegion = selectedRegion === 'all' || item.locationData?.region === selectedRegion;
                    const isVisible = ((item.availableQuantity ?? item.quantity ?? 0) > 0 || item.sellerId === user?.uid) &&
                                     !hiddenListingIds.includes(item.id || '');
                    
                    return matchesCategory && matchesSearch && matchesVerified && matchesDelivery && matchesRegion && isVisible;
                  }).length === 0 && (
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                      <h3 className="text-lg font-bold mb-2">{t('market.noListings') || 'No listings yet'}</h3>
                      <p className="text-sm text-gray-500">
                        {t('market.beFirstToList') || 'Be the first to add a product to the marketplace.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {user?.status !== 'verified' && (
                <div className="mt-12">
                  <SellerOnboardingCTA t={t} onUpgrade={onUpgrade} />
                </div>
              )}
            </>
          )}

          {marketTab === 'demand' && (
            <>
              <DemandFilters
                categories={marketCategories}
                demandCategory={demandCategory}
                setDemandCategory={setDemandCategory}
                demandRegion={demandRegion}
                setDemandRegion={setDemandRegion}
                demandUrgency={demandUrgency}
                setDemandUrgency={setDemandUrgency}
                demandBuyerType={demandBuyerType}
                setDemandBuyerType={setDemandBuyerType}
                demandStatus={demandStatus}
                setDemandStatus={setDemandStatus}
                t={t}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.length === 0 ? (
                <div className="col-span-full bg-white dark:bg-gray-800 rounded-[2.5rem] p-12 text-center border border-gray-100 dark:border-gray-700">
                  <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t('market.noRequests')}</h3>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">{t('market.beFirstToRequest')}</p>
                  <button 
                    onClick={() => {
                      if (user) {
                        setEditingListing(null);
                        setEditingRequest(null);
                        setIsAddProductModalOpen(true);
                        setFormStep(10);
                      } else {
                        toast.error(t('account.signIn'));
                      }
                    }}
                    className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20"
                  >
                    {t('market.postRequest')}
                  </button>
                </div>
              ) : (
                <>
                  {requests
                    .filter((req) => {
                      const q = marketSearchQuery.toLowerCase();

                      const matchesSearch =
                        req.commodity.toLowerCase().includes(q) ||
                        req.location.toLowerCase().includes(q) ||
                        req.buyerName.toLowerCase().includes(q);

                      const matchesCategory =
                        demandCategory === 'all' || req.category === demandCategory;

                      const matchesRegion =
                        demandRegion === 'all' || req.locationData?.region === demandRegion;

                      const matchesUrgency =
                        demandUrgency === 'all' || req.urgency === demandUrgency;

                      const matchesBuyerType =
                        demandBuyerType === 'all' || req.buyerType === demandBuyerType;

                      const matchesStatus =
                        demandStatus === 'all' || req.status === demandStatus;

                      return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesRegion &&
                        matchesUrgency &&
                        matchesBuyerType &&
                        matchesStatus
                      );
                    })
                    .map((req) => (
                      <BuyerRequestCard
                        key={req.id}
                        request={req}
                        t={t}
                        currentUserId={user?.uid}
                        onOpenDetails={handleOpenRequestDetails}
                        onUpdateStatus={onUpdateBuyerRequestStatus}
                        onUpdateFoundQuantity={(request) => {
                          setFoundQtyRequest(request);
                          setFoundQtyValue(String(request.quantityFound ?? 0));
                        }}
                        onEditRequest={handleOpenEditRequest}
                      />
                    ))}

                  {requests.filter((req) => {
                    const q = marketSearchQuery.toLowerCase();

                    const matchesSearch =
                      req.commodity.toLowerCase().includes(q) ||
                      req.location.toLowerCase().includes(q) ||
                      req.buyerName.toLowerCase().includes(q);

                    const matchesCategory =
                      demandCategory === 'all' || req.category === demandCategory;

                    const matchesRegion =
                      demandRegion === 'all' || req.locationData?.region === demandRegion;

                    const matchesUrgency =
                      demandUrgency === 'all' || req.urgency === demandUrgency;

                    const matchesBuyerType =
                      demandBuyerType === 'all' || req.buyerType === demandBuyerType;

                    const matchesStatus =
                      demandStatus === 'all' || req.status === demandStatus;

                    return (
                      matchesSearch &&
                      matchesCategory &&
                      matchesRegion &&
                      matchesUrgency &&
                      matchesBuyerType &&
                      matchesStatus
                    );
                  }).length === 0 && (
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
                      <h3 className="text-lg font-bold mb-2">No matching requests</h3>
                      <p className="text-sm text-gray-500">
                        Try changing your demand filters or search terms.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </>
    )}

      {/* Report Modal */}
      {reportingItem && (
        <div key="report-modal-overlay" className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            key="report-modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-2 text-rose-600">
                <Flag className="w-6 h-6" />
                {t('market.reportSuspicious')}
              </h3>
              <button onClick={() => setReportingItem(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('market.reporting')}</p>
                <p className="font-bold">{reportingItem.title || reportingItem.businessName}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {t('market.reasonForReport')}
                </label>
                <textarea 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder={t('market.describeIssue')}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setReportingItem(null)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={handleReport}
                  className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all"
                >
                  {t('market.submitReport')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {saleListing && (
        <div key="sale-modal-overlay" className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            key="sale-modal-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Record sale</h3>
                <p className="text-sm text-gray-500 mt-1">{saleListing.title}</p>
              </div>
              <button
                onClick={() => {
                  setSaleListing(null);
                  setSaleAmount('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-700/40 p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Current stock</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Available: <span className="font-bold">{saleListing.availableQuantity ?? saleListing.quantity ?? 0}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Sold: <span className="font-bold">{saleListing.soldQuantity ?? 0}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Units sold
                </label>
                <input
                  type="number"
                  min="1"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSaleListing(null);
                    setSaleAmount('');
                  }}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleRecordSale}
                  disabled={isStockActionLoading}
                  className="flex-1 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Confirm sale
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {restockListing && (
        <div key="restock-modal-overlay" className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            key="restock-modal-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Restock listing</h3>
                <p className="text-sm text-gray-500 mt-1">{restockListing.title}</p>
              </div>
              <button
                onClick={() => {
                  setRestockListing(null);
                  setRestockAmount('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-700/40 p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Current stock</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Available: <span className="font-bold">{restockListing.availableQuantity ?? restockListing.quantity ?? 0}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Sold: <span className="font-bold">{restockListing.soldQuantity ?? 0}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Units added
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setRestockListing(null);
                    setRestockAmount('');
                  }}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleRestock}
                  disabled={isStockActionLoading}
                  className="flex-1 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Add stock
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Found Quantity Modal */}
      {foundQtyRequest && (
        <div key="found-qty-modal-overlay" className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            key="found-qty-modal-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Update found quantity</h3>
                <p className="text-sm text-gray-500 mt-1">{foundQtyRequest.commodity}</p>
              </div>
              <button
                onClick={() => {
                  setFoundQtyRequest(null);
                  setFoundQtyValue('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-700/40 p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Request progress</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Requested: <span className="font-bold">{foundQtyRequest.quantity} {foundQtyRequest.unit}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Found so far: <span className="font-bold">{foundQtyRequest.quantityFound ?? 0}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Found quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={foundQtyValue}
                  onChange={(e) => setFoundQtyValue(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setFoundQtyRequest(null);
                    setFoundQtyValue('');
                  }}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleUpdateFoundQuantity}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
