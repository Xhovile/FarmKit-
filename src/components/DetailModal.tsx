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
        ['Quantity', `${item.quantity || '-'} ${item.unit || ''}`.trim()],
        ['Delivery', item.deliveryMethod?.replace(/_/g, ' ') || 'Not specified'],
      ];

    default:
      return [
        ['Category', formatCategoryLabel(item.category)],
        ['Quantity', `${item.quantity || '-'} ${item.unit || ''}`.trim()],
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
    } catch (error) {
      console.error('Share failed:', error);
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
            className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72">
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-6 right-6 flex gap-2">
                <button
                  className="p-3 bg-black/25 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
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

                <h3 className="text-3xl font-bold text-white leading-tight">
                  {selectedItem.title || selectedItem.name}
                </h3>

                {isMarketListing && (
                  <p className="text-white/85 mt-2 text-lg font-semibold">
                    MK {selectedItem.price?.toLocaleString()} / {selectedItem.unit}
                  </p>
                )}
              </div>
            </div>

            <div className="p-8">
              {isMarketListing ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Building2 className="w-4 h-4" />
                        Seller
                      </div>
                      <p className="font-bold">{selectedItem.businessName}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <MapPin className="w-4 h-4" />
                        Location
                      </div>
                      <p className="font-bold">{selectedItem.location}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Package className="w-4 h-4" />
                        Quantity
                      </div>
                      <p className="font-bold">
                        {selectedItem.quantity} {selectedItem.unit}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Truck className="w-4 h-4" />
                        Delivery
                      </div>
                      <p className="font-bold">
                        {formatDeliveryLabel(selectedItem.deliveryMethod)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-8">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Status: {formatStatusLabel(selectedItem.status)}
                    </span>

                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Added: {createdDateLabel}
                    </span>

                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Seller tier: {selectedItem.sellerTier || 'Standard'}
                    </span>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-3">Description</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedItem.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-4">Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specs.map(([label, value]) => (
                        <div
                          key={label}
                          className="bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-700"
                        >
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            {label}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
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

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
                    <a
                      href={`https://wa.me/${selectedItem.phone}?text=Hello ${selectedItem.sellerName}, I am interested in your ${selectedItem.title} on FarmKit.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Contact Seller
                    </a>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="px-5 py-4 bg-gray-100 dark:bg-gray-700 rounded-2xl text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSaved((prev) => !prev)}
                      className={`px-5 py-4 rounded-2xl transition-all ${
                        saved
                          ? 'bg-primary/10 text-primary'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                    </button>
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
