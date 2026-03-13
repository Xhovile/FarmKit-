import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  MapPin, 
  MessageCircle, 
  CheckCircle2, 
  Package, 
  Truck, 
  User, 
  Building2, 
  Tag, 
  ArrowRight,
  TrendingUp,
  Flag,
  Phone,
  Eye,
  Bookmark,
  MoreVertical,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { MarketListing, BuyerRequest } from '../types';
import { marketCategories } from '../data/constants';
import toast from 'react-hot-toast';

export interface Seller {
  id: string;
  name: string;
  businessName: string;
  avatar: string;
  location: string;
  phone: string;
  type: string;
  verified: boolean;
}

// --- Components ---

export const SellerBadge: React.FC<{ verified: boolean; t: any }> = ({ verified, t }) => (
  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${verified ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
    {verified ? (
      <>
        <CheckCircle2 className="w-3 h-3" />
        {t('market.verifiedSeller')}
      </>
    ) : (
      t('common.unverified')
    )}
  </div>
);

const getCategoryLabel = (categoryId: string, t: any) => {
  const category = marketCategories.find((cat) => cat.id === categoryId);

  if (!category) {
    return categoryId.replace(/_/g, ' ');
  }

  return t(category.name, category.nameNy);
};

export const ListingCard: React.FC<{
  listing: MarketListing;
  t: any;
  currentUserId?: string;
  onReport?: (listing: MarketListing) => void;
  onMarkSold?: (listing: MarketListing) => void;
  onHide?: (listing: MarketListing) => void;
  onEdit?: (listing: MarketListing) => void;
  onDelete?: (listing: MarketListing) => void;
  onOpenDetails?: (listing: MarketListing) => void;
}> = ({
  listing,
  t,
  currentUserId,
  onReport,
  onMarkSold,
  onHide,
  onEdit,
  onDelete,
  onOpenDetails
}) => {
  const defaultImage = "https://picsum.photos/seed/farm/800/600";
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const isOwner = currentUserId === listing.sellerId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const viewsCount = listing.viewsCount ?? 0;
  const sharesCount = listing.sharesCount ?? 0;
  const savesCount = listing.savesCount ?? 0;

  const shareText = `Check out this listing on FarmKit: ${listing.title} - MK ${listing.price.toLocaleString()} / ${listing.unit}`;

  const statusLabel = useMemo(() => {
    if (listing.status === 'sold') return 'Sold';
    if (listing.status === 'hidden') return 'Hidden';
    return t('common.inStock') || 'In Stock';
  }, [listing.status, t]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: shareText,
        });
        toast.success(t('common.shared') || 'Shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success(t('common.copied') || 'Link copied to clipboard!');
      }
    } catch (error: any) {
      // Only log if it's not a user cancellation
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(shareText);
          toast.success(t('common.copied') || 'Link copied to clipboard!');
        } catch (clipError) {
          toast.error(t('common.shareError') || 'Failed to share');
        }
      }
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[28px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-visible hover:shadow-xl transition-all duration-300 relative">
      <div className="relative h-52 overflow-hidden rounded-t-[28px]">
        <img
          src={listing.imageUrl || defaultImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
        />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full text-xs font-black text-primary shadow-lg">
            MK {listing.price.toLocaleString()} / {listing.unit}
          </span>
          <SellerBadge verified={listing.verified} t={t} />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-[120]" ref={menuRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-lg"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 min-w-[192px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[130]">
              <button
                type="button"
                onClick={handleShare}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.share') || 'Share'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenDetails?.(listing);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                View details
              </button>

              {isOwner ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onEdit?.(listing);
                      setMenuOpen(false);
                    }}
                    disabled={!onEdit}
                    className={`w-full px-4 py-3 text-left text-sm ${
                      onEdit ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Edit listing
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onMarkSold?.(listing);
                      setMenuOpen(false);
                    }}
                    disabled={!onMarkSold}
                    className={`w-full px-4 py-3 text-left text-sm ${
                      onMarkSold ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Mark as sold
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onDelete?.(listing);
                      setMenuOpen(false);
                    }}
                    disabled={!onDelete}
                    className={`w-full px-4 py-3 text-left text-sm text-rose-600 ${
                      onDelete ? 'hover:bg-rose-50 dark:hover:bg-rose-900/20' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Delete listing
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onHide?.(listing);
                      setMenuOpen(false);
                    }}
                    disabled={!onHide}
                    className={`w-full px-4 py-3 text-left text-sm ${
                      onHide ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Hide listing
                  </button>

                  {onReport && (
                    <button
                      type="button"
                      onClick={() => {
                        onReport(listing);
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      Report listing
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              listing.status === 'active'
                ? 'bg-emerald-50 text-emerald-600'
                : listing.status === 'sold'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {statusLabel}
          </span>
        </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
              {listing.title}
            </h3>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 truncate">
              {listing.businessName}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSaved((prev) => !prev)}
            className={`shrink-0 p-2 rounded-full transition-all ${
              saved
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-wider mb-4">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{listing.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {getCategoryLabel(listing.category, t)}
          </span>

          <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Truck className="w-3 h-3" />
            {listing.deliveryMethod.replace(/_/g, ' ')}
          </span>

          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <Package className="w-3 h-3" />
            {listing.quantity} {listing.unit}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px] mb-4 leading-relaxed">
          {listing.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-700 py-3 mb-4">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{viewsCount}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Share2 className="w-4 h-4" />
            <span>{sharesCount}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4" />
            <span>{savesCount + (saved ? 1 : 0)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onOpenDetails?.(listing);
            }}
            className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            View details
          </button>

          <a
            href={`https://wa.me/${listing.phone}?text=Hello ${listing.sellerName}, I am interested in your ${listing.title} on FarmKit.`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
          >
            <MessageCircle className="w-4 h-4" />
            {t('common.orderNow')}
          </a>
        </div>
      </div>
    </div>
  );
};

export const BuyerRequestCard: React.FC<{ request: BuyerRequest; t: any }> = ({ request, t }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">{request.buyerName}</h4>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" /> {request.location}
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
          {t('market.demandSignal')}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('market.commodityWanted')}</p>
          <p className="text-xl font-black text-gray-900 dark:text-white">{request.commodity}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('common.quantity')}</p>
            <p className="text-sm font-bold">{request.quantity} {request.unit}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('market.targetPrice')}</p>
            <p className="text-sm font-bold text-primary">{request.priceRange}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <Truck className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
          {t('market.deliveryPreference') || t('market.deliveryMethod')}: <span className="text-gray-900 dark:text-white font-bold">{request.status}</span>
        </span>
      </div>

      <a 
        href={`https://wa.me/${request.phone}?text=Hello ${request.buyerName}, I saw your request for ${request.commodity} on FarmKit.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
      >
        <ArrowRight className="w-5 h-5" />
        {t('market.fulfillRequest')}
      </a>
    </motion.div>
  );
};

export const SellerCard: React.FC<{ seller: Seller; t: any; onReport?: (seller: Seller) => void }> = ({ seller, t, onReport }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600">
            <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{seller.businessName}</h3>
            <p className="text-sm text-gray-500">{seller.name}</p>
            <div className="mt-1">
              <SellerBadge verified={seller.verified} t={t} />
            </div>
          </div>
        </div>
        {onReport && (
          <button 
            onClick={() => onReport(seller as any)}
            className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
          >
            <Flag className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-primary" />
          {seller.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Tag className="w-4 h-4 text-primary" />
          {seller.type}
        </div>
      </div>

      <div className="flex gap-2">
        <a 
          href={`tel:${seller.phone}`}
          className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
        >
          <Phone className="w-4 h-4" /> {t('common.call')}
        </a>
        <a 
          href={`https://wa.me/${seller.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 bg-[#25D366] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>
    </motion.div>
  );
};

export const MarketplaceFilters: React.FC<{ 
  categories: any[]; 
  activeCategory: string; 
  setActiveCategory: (id: string) => void;
  t: any;
}> = ({ categories, activeCategory, setActiveCategory, t }) => (
  <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
    <button 
      onClick={() => setActiveCategory('all')}
      className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700 hover:bg-gray-50'}`}
    >
      {t('common.allProducts')}
    </button>
    {categories.map(cat => (
      <button 
        key={cat.id}
        onClick={() => setActiveCategory(cat.id)}
        className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700 hover:bg-gray-50'}`}
      >
        {t(cat.name, cat.nameNy)}
      </button>
    ))}
  </div>
);

export const SellerOnboardingCTA: React.FC<{ t: any; onUpgrade: () => void }> = ({ t, onUpgrade }) => (
  <div className="bg-gradient-to-br from-primary to-emerald-600 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black mb-2">{t('market.startSelling')}</h3>
        <p className="text-emerald-50 text-sm leading-relaxed max-w-md">
          {t('market.reachThousands')}
        </p>
      </div>
      <button 
        onClick={onUpgrade}
        className="px-8 py-4 bg-white text-primary font-black rounded-2xl shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
      >
        {t('market.getVerifiedStatus')}
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);
