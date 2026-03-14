import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';

interface DetailModalProps {
  t: (key: string) => string;
  lang: string;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
}

const formatCategoryLabel = (value?: string) => {
  if (!value) return 'Product';
  return value.replace(/_/g, ' ');
};

const formatDeliveryLabel = (value?: string) => {
  if (!value) return 'Not specified';
  return value.replace(/_/g, ' ');
};

const formatStatusLabel = (value?: string) => {
  if (!value) return 'Active';
  if (value === 'active') return 'Active';
  if (value === 'sold') return 'Sold';
  if (value === 'hidden') return 'Hidden';
  return value;
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
        ['Available Amount', `${item.quantity || '-'}`],
        ['Delivery', item.deliveryMethod?.replace(/_/g, ' ') || 'Not specified'],
      ];

    default:
      return [
        ['Category', formatCategoryLabel(item.category)],
        ['Available Amount', `${item.quantity || '-'}`],
        ['Delivery', item.deliveryMethod?.replace(/_/g, ' ') || 'Not specified'],
        ['Seller Type', item.sellerTier || 'Standard'],
        ['Status', item.status || 'active'],
      ];
  }
};

export const DetailModal: React.FC<DetailModalProps> = ({
  t,
  lang,
  selectedItem,
  setSelectedItem
}) => {
  if (!selectedItem) return null;

  const isMarketListing = selectedItem.type === 'market_listing';
  const specs = isMarketListing ? renderMarketSpecs(selectedItem) : [];

  const [saved, setSaved] = useState(false);

  const shareText = isMarketListing
    ? `Check out this listing on FarmKit: ${selectedItem.title} - MK ${selectedItem.price?.toLocaleString()} / ${selectedItem.unit}`
    : `${selectedItem.title || selectedItem.name}`;

  const createdDateLabel = useMemo(() => {
    if (!selectedItem?.createdAt) return 'Recently added';

    try {
      if (selectedItem.createdAt?.seconds) {
        return new Date(selectedItem.createdAt.seconds * 1000).toLocaleDateString();
      }

      return 'Recently added';
    } catch {
      return 'Recently added';
    }
  }, [selectedItem]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedItem.title || selectedItem.name,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
    } catch (error: any) {
      const isCancel = 
        error?.name === 'AbortError' || 
        error?.message?.toLowerCase().includes('cancel') ||
        error?.message?.toLowerCase().includes('abort');
        
      if (!isCancel) {
        console.error('Share failed:', error);
      }
    }
  };

  return (
    <AnimatePresence>
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
            data-farmkit-detail-modal="true"
            className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-[36px] shadow-[0_36px_120px_rgba(0,0,0,0.24)] overflow-hidden max-h-[92vh] flex flex-col border border-gray-200 dark:border-gray-800 ring-1 ring-black/[0.04] dark:ring-white/[0.05]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-white/92 dark:bg-gray-900/92 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500 font-semibold">
                  Listing Details
                </p>
                <h3 className="text-sm sm:text-base font-semibold text-black dark:text-white truncate">
                  {selectedItem.title || selectedItem.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleShare}
                  className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSaved((prev) => !prev)}
                  className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                    saved
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto bg-neutral-50/70 dark:bg-gray-950/40">
              <div className="relative h-72 sm:h-80 rounded-[30px] overflow-hidden mb-8 border border-gray-200 dark:border-gray-800 shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
                <img
                  src={
                    selectedItem.image ||
                    selectedItem.imageUrl ||
                    selectedItem.icon ||
                    'https://picsum.photos/seed/farm/1200/800'
                  }
                  alt={selectedItem.title || selectedItem.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-white/90 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {isMarketListing
                        ? formatCategoryLabel(selectedItem.category)
                        : selectedItem.category || selectedItem.type || 'Detail'}
                    </span>

                    {isMarketListing && selectedItem.verified && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Seller
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-[2rem] font-semibold text-white leading-tight">
                    {selectedItem.title || selectedItem.name}
                  </h3>

                  {isMarketListing && (
                    <p className="text-white/90 mt-2 text-base sm:text-lg font-medium">
                      MK {selectedItem.price?.toLocaleString()} / {selectedItem.unit}
                    </p>
                  )}
                </div>
              </div>
              {isMarketListing ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    <div className="rounded-[24px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-2 font-semibold">
                        <Building2 className="w-4 h-4" />
                        Seller
                      </div>
                      <p className="font-bold">{selectedItem.businessName}</p>
                    </div>

                    <div className="rounded-[24px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-2 font-semibold">
                        <MapPin className="w-4 h-4" />
                        Location
                      </div>
                      <p className="font-bold">{selectedItem.location}</p>
                    </div>

                    <div className="rounded-[24px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-2 font-semibold">
                        <Package className="w-4 h-4" />
                        Available amount
                      </div>
                      <p className="font-bold">
                        {selectedItem.quantity}
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500 mb-2 font-semibold">
                        <Truck className="w-4 h-4" />
                        Delivery
                      </div>
                      <p className="font-bold">
                        {formatDeliveryLabel(selectedItem.deliveryMethod)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-8">
                    <span className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-full text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm">
                      Status: {formatStatusLabel(selectedItem.status)}
                    </span>

                    <span className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-full text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm">
                      Added: {createdDateLabel}
                    </span>

                    <span className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-full text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm">
                      Seller tier: {selectedItem.sellerTier || 'Standard'}
                    </span>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-black dark:text-white mb-3">Description</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedItem.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specs.map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[24px] p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                        >
                          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.16em] mb-2">
                            {label}
                          </p>
                          <p className="font-medium text-black dark:text-white">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {selectedItem.viewsCount ?? 0} views
                    </div>

                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      {(selectedItem.savesCount ?? 0) + (saved ? 1 : 0)} saves
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {createdDateLabel}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <a
                      href={`https://wa.me/${selectedItem.phone}?text=Hello ${selectedItem.sellerName}, I am interested in your ${selectedItem.title} on FarmKit.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:opacity-90"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Contact Seller
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-gray-600 dark:text-gray-300">
                  <p>
                    {lang === 'en'
                      ? (selectedItem.description || selectedItem.content)
                      : (selectedItem.descriptionNy || selectedItem.contentNy)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
