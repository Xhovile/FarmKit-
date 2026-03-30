import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Share2,
  MessageCircle,
  Package,
  Truck,
  Tag,
  CheckCircle2,
  Eye,
  Bookmark,
  CalendarDays,
  Building2,
  Expand,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { MarketListing, MarketDemand, User } from '../types';

interface ItemDetailPageProps {
  t: (key: string) => string;
  lang: string;
  user: User | null;
  marketListings: MarketListing[];
  toggleSavedListing?: (listing: any) => void;
  incrementListingShares?: (listingId?: string) => void;
  savedListingIds?: string[];
}

const formatCategoryLabel = (value?: string) => {
  if (!value) return 'Product';
  return value.replace(/_/g, ' ');
};

const renderMarketSpecs = (item: any) => {
  const category = item.category || '';

  switch (category) {
    case 'tools':
    case 'irrigation':
      return [
        ['Condition', item.condition || 'Not specified'],
        ['Brand', item.brand || 'Not specified'],
        ['Model', item.model || 'Not specified'],
        ['Power / Capacity', item.capacity || 'Not specified'],
        ['Fuel Type', item.fuelType || 'Not specified'],
        ['Unit', item.unit || 'Not specified'],
        ['Delivery', item.deliveryMethod?.replace(/_/g, ' ') || 'Not specified'],
      ];

    case 'seeds':
      return [
        ['Seed Type', item.seedType || 'Not specified'],
        ['Variety', item.variety || 'Not specified'],
        ['Pack Size', item.packSize || `${item.quantity || '-'} ${item.unit || ''}`.trim()],
        ['Season', item.season || 'Not specified'],
        ['Germination Rate', item.germinationRate || 'Not specified'],
      ];

    case 'livestock':
    case 'fish':
      return [
        ['Breed / Type', item.breed || 'Not specified'],
        ['Age', item.age || 'Not specified'],
        ['Sex', item.sex || 'Not specified'],
        ['Health Status', item.healthStatus || 'Not specified'],
        ['Vaccination', item.vaccinationStatus || 'Not specified'],
      ];

    case 'fertilizers':
    case 'pesticides':
    case 'vet_products':
    case 'feed':
      return [
        ['Brand', item.brand || 'Not specified'],
        ['Input Type', item.inputType || 'Not specified'],
        ['Pack Size', item.packSize || `${item.quantity || '-'} ${item.unit || ''}`.trim()],
        ['Usage', item.usage || 'Not specified'],
        ['Expiry', item.expiryDate || 'Not specified'],
      ];

    case 'crops':
    case 'animal_products':
      return [
        ['Variety / Grade', item.variety || 'Not specified'],
        ['Packaging', item.packSize || 'Not specified'],
        ['Season', item.season || 'Not specified'],
        ['Unit', item.unit || 'Not specified'],
        ['Available Amount', `${item.availableQuantity ?? item.quantity ?? '-'}`],
        ['Sold', `${item.soldQuantity ?? 0}`],
        ['Delivery', item.deliveryMethod?.replace(/_/g, ' ') || 'Not specified'],
      ];

    default:
      return [
        ['Category', formatCategoryLabel(item.category)],
        ['Unit', item.unit || 'Not specified'],
        ['Available Amount', `${item.availableQuantity ?? item.quantity ?? '-'}`],
        ['Sold', `${item.soldQuantity ?? 0}`],
        ['Delivery', item.deliveryMethod?.replace(/_/g, ' ') || 'Not specified'],
        ['Seller Type', item.sellerType?.replace(/_/g, ' ') || 'Not specified'],
        ['Stock Status', item.stockStatus?.replace(/_/g, ' ') || 'Active'],
      ];
  }
};

const ItemDetailPage: React.FC<ItemDetailPageProps> = ({
  t,
  lang,
  user,
  marketListings,
  toggleSavedListing,
  incrementListingShares,
  savedListingIds = []
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const selectedItem = useMemo(() => {
    if (location.state?.item) return location.state.item;
    return marketListings.find(l => l.id === id);
  }, [id, marketListings, location.state]);

  const itemType = useMemo(() => {
    if (location.state?.type) return location.state.type;
    // Fallback: infer from properties
    if (selectedItem?.price !== undefined) return 'listing';
    if (selectedItem?.commodity !== undefined) return 'demand';
    return 'listing';
  }, [location.state, selectedItem]);

  const isMarketListing = itemType === 'listing' || itemType === 'market_listing';
  const isMarketDemand = itemType === 'demand' || itemType === 'market_demand' || itemType === 'market-demand' || itemType === 'request' || itemType === 'buyer_request' || itemType === 'buyer-request';

  const specs = useMemo(() => {
    if (!selectedItem) return [];
    if (isMarketListing) return renderMarketSpecs(selectedItem);
    if (isMarketDemand) {
      return [
        ['Requester Type', selectedItem.requesterType?.replace(/_/g, ' ') || 'Individual'],
        ['Urgency', selectedItem.urgency || 'Normal'],
        ['Delivery Preference', selectedItem.deliveryPreference?.replace(/_/g, ' ') || 'Not specified'],
        ['Contact Method', selectedItem.contactMethod || 'WhatsApp'],
        ['Needed By', selectedItem.neededBy || 'Not specified'],
        ['Quantity', `${selectedItem.quantity} ${selectedItem.unit}`],
        ['Target Price', selectedItem.priceRange || 'Negotiable'],
      ];
    }
    return [];
  }, [selectedItem, isMarketListing, isMarketDemand]);

  const saved = selectedItem?.id ? savedListingIds.includes(selectedItem.id) : false;

  const galleryImages = useMemo(() => {
    if (!selectedItem) return [];
    if (selectedItem.imageUrls && selectedItem.imageUrls.length > 0) return selectedItem.imageUrls;
    const single = selectedItem.image || selectedItem.imageUrl || selectedItem.icon || selectedItem.referenceImageUrl;
    return single ? [single] : [];
  }, [selectedItem]);

  useEffect(() => {
    setActiveImage(0);
  }, [selectedItem?.id]);

  const shareText = useMemo(() => {
    if (!selectedItem) return '';
    if (isMarketListing) return `Check out this listing on FarmKit: ${selectedItem.title} - MK ${selectedItem.price?.toLocaleString()} / ${selectedItem.unit}`;
    if (isMarketDemand) return `Market demand on FarmKit: ${selectedItem.commodity} - ${selectedItem.quantity} ${selectedItem.unit} needed${selectedItem.priceRange ? ` (${selectedItem.priceRange})` : ''}`;
    return `${selectedItem.title || selectedItem.name || selectedItem.commodity || 'FarmKit item'}`;
  }, [isMarketListing, isMarketDemand, selectedItem]);

  const createdDateLabel = useMemo(() => {
    if (!selectedItem?.createdAt) return 'Recently added';
    try {
      if (selectedItem.createdAt?.seconds) return new Date(selectedItem.createdAt.seconds * 1000).toLocaleDateString();
      const date = new Date(selectedItem.createdAt);
      return !isNaN(date.getTime()) ? date.toLocaleDateString() : 'Recently added';
    } catch { return 'Recently added'; }
  }, [selectedItem]);

  const updatedDateLabel = useMemo(() => {
    if (!selectedItem?.updatedAt) return 'Not updated yet';
    try {
      if (selectedItem.updatedAt?.seconds) return new Date(selectedItem.updatedAt.seconds * 1000).toLocaleDateString();
      const date = new Date(selectedItem.updatedAt);
      return !isNaN(date.getTime()) ? date.toLocaleDateString() : 'Not updated yet';
    } catch { return 'Not updated yet'; }
  }, [selectedItem]);

  const hasEngagementStats = isMarketListing && ((selectedItem?.viewsCount ?? 0) > 0 || (selectedItem?.sharesCount ?? 0) > 0 || (selectedItem?.savesCount ?? 0) > 0);

  if (!selectedItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Item not found</p>
          <button onClick={() => navigate(-1)} className="text-primary font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  const isOwner = user?.uid === (selectedItem?.uid || selectedItem?.userId || selectedItem?.sellerId);

  const handleEdit = () => {
    if (isMarketListing) {
      navigate('/add-product', { state: { editingListing: selectedItem, from: 'market' } });
    } else {
      navigate('/add-product', { state: { editingDemand: selectedItem, isRequest: true, from: 'market' } });
    }
  };

  const handleReport = () => {
    navigate('/report', { state: { item: selectedItem, from: 'market' } });
  };

  const handleStockAction = () => {
    navigate('/stock-action', { state: { item: selectedItem, from: 'market' } });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: isMarketListing ? selectedItem.title : isMarketDemand ? selectedItem.commodity : (selectedItem.title || selectedItem.name || 'FarmKit'),
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
      if (isMarketListing) incrementListingShares?.(selectedItem.id);
    } catch (error: any) {
      if (error?.name !== 'AbortError') console.error('Share failed:', error);
    }
  };

  const showPrevImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const showNextImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-900 pb-24">
      {/* Hero Section: Image Gallery */}
      <div className="relative h-72 sm:h-[50vh] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {galleryImages.length > 0 ? (
          <img
            src={galleryImages[activeImage] || galleryImages[0]}
            alt={selectedItem.title || selectedItem.name || selectedItem.commodity}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package className="w-16 h-16" />
          </div>
        )}

        {galleryImages.length > 0 && (
          <button
            type="button"
            onClick={() => setIsFullscreenOpen(true)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/85 dark:bg-black/55 text-gray-900 dark:text-white border border-white/40 dark:border-white/10 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black/70 transition-all z-10"
          >
            <Expand className="w-5 h-5" />
          </button>
        )}

        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 dark:bg-black/55 text-gray-900 dark:text-white border border-white/40 dark:border-white/10 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black/70 transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 dark:bg-black/55 text-gray-900 dark:text-white border border-white/40 dark:border-white/10 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-black/70 transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/65 text-white text-xs font-semibold z-10">
              {activeImage + 1} / {galleryImages.length}
            </div>
          </>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Sticky Back Button - Stays below header (56px) */}
      <div className="sticky top-[56px] z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white/92 dark:bg-gray-900/92 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 font-semibold">
                Listing Details
              </p>
              <h3 className="text-sm sm:text-base font-semibold text-black dark:text-white truncate">
                {selectedItem.title || selectedItem.name || selectedItem.commodity}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isOwner ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="h-10 px-4 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all shadow-sm font-bold text-sm"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReport}
                  className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                  title="Report"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              )}

              {isOwner && isMarketListing && (
                <button
                  type="button"
                  onClick={handleStockAction}
                  className="h-10 px-4 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all shadow-sm font-bold text-sm"
                >
                  Stock
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {isMarketListing && (
                <button
                  type="button"
                  onClick={() => toggleSavedListing?.(selectedItem)}
                  className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                    saved
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto bg-neutral-50/70 dark:bg-gray-950/40">
            {galleryImages.length > 1 && (
              <div className="flex gap-3 mb-6 px-1 overflow-x-auto pb-2 no-scrollbar">
                {galleryImages.map((img: string, idx: number) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === idx 
                        ? 'border-black dark:border-white scale-[1.03] shadow-md opacity-100 ring-2 ring-black/10 dark:ring-white/10' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mb-5">
              <div className="px-1">
                <p className="text-xl sm:text-2xl font-semibold text-black dark:text-white leading-tight">
                  {selectedItem.title || selectedItem.name || selectedItem.commodity}
                  {isMarketListing && (
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      : MK {selectedItem.price?.toLocaleString()} / {selectedItem.unit}
                    </span>
                  )}
                  {isMarketDemand && (
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      : {selectedItem.priceRange}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-lg font-semibold text-black dark:text-white mb-3">Description</h4>
              <div className="rounded-[22px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5 shadow-sm">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedItem.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-6">
              <div className="rounded-[22px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-1.5 font-semibold">
                  <Building2 className="w-4 h-4" />
                  {isMarketListing ? 'Seller' : 'Requester'}
                </div>
                <p className="font-semibold leading-snug">{selectedItem.businessName || selectedItem.userName}</p>
              </div>

              <div className="rounded-[22px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-1.5 font-semibold">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <p className="font-semibold leading-snug">
                  {selectedItem.locationData?.label || selectedItem.location}
                </p>
              </div>

              {isMarketListing && (
                <>
                  <div className="rounded-[22px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5 shadow-sm">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-1.5 font-semibold">
                      <Package className="w-4 h-4" />
                      Available amount
                    </div>
                    <p className="font-semibold leading-snug">
                      {selectedItem.availableQuantity ?? selectedItem.quantity ?? 0}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5 shadow-sm">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500 mb-1.5 font-semibold">
                      <Package className="w-4 h-4" />
                      Sold
                    </div>
                    <p className="font-semibold leading-snug">
                      {selectedItem.soldQuantity ?? 0}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {specs.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[22px] px-4 py-3.5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
                  >
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.14em] mb-1.5">
                      {label}
                    </p>
                    <p className="font-medium text-black dark:text-white leading-snug">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <a
                href={isMarketListing 
                  ? `https://wa.me/${selectedItem.phone}?text=Hello ${selectedItem.sellerName}, I am interested in your ${selectedItem.title} on FarmKit.`
                  : `https://wa.me/${selectedItem.phone}?text=Hello ${selectedItem.userName}, I saw your request for ${selectedItem.commodity} on FarmKit.`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:opacity-90"
              >
                <MessageCircle className="w-5 h-5" />
                {isMarketListing ? 'Contact Seller' : 'Contact Requester'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFullscreenOpen && galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullscreenOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsFullscreenOpen(false)}
              className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 text-white border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
                  className="absolute left-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showNextImage(); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="max-w-[95vw] max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={galleryImages[activeImage] || galleryImages[0]}
                alt={selectedItem.title || selectedItem.name || selectedItem.commodity}
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemDetailPage;
