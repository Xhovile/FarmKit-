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
  const viewsCount = listing.viewsCount ?? 0;
  const sharesCount = listing.sharesCount ?? 0;
  const savesCount = listing.savesCount ?? 0;

  const shareText = `Check out this listing on FarmKit: ${listing.title} - MK ${listing.price.toLocaleString()} / ${listing.unit}`;

  const statusLabel = useMemo(() => {
    if (listing.status === 'sold') return 'Sold';
    if (listing.status === 'hidden') return 'Hidden';
    return 'Available';
  }, [listing.status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('touchmove', handleScrollOrResize, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('touchmove', handleScrollOrResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscapeLikeClose = () => {
      const modalOpen = document.querySelector('[data-farmkit-detail-modal="true"]');
      if (modalOpen) {
        setMenuOpen(false);
      }
    };

    const observer = new MutationObserver(handleEscapeLikeClose);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [menuOpen]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Copied to clipboard');
      }
    } catch (error: any) {
      const isCancel = 
        error?.name === 'AbortError' || 
        error?.message?.toLowerCase().includes('cancel') ||
        error?.message?.toLowerCase().includes('abort');
        
      if (!isCancel) {
        console.error('Share failed:', error);
      }
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-[30px] border border-gray-200/80 dark:border-gray-800 overflow-visible hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 relative">
      <div className="relative h-64 overflow-hidden rounded-t-[30px] bg-gray-100 dark:bg-gray-800">
        <img
          src={listing.imageUrl || defaultImage}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        <div className="absolute top-4 right-4 z-20" ref={menuRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="h-10 w-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white shadow-lg"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 min-w-[192px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-30">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full px-4 py-3 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Share
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenDetails?.(listing);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                        onEdit
                          ? 'text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                          : 'opacity-50 cursor-not-allowed'
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
                        onMarkSold
                          ? 'text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                          : 'opacity-50 cursor-not-allowed'
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
                      className={`w-full px-4 py-3 text-left text-sm ${
                        onDelete
                          ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                          : 'opacity-50 cursor-not-allowed'
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
                        onHide
                          ? 'text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                          : 'opacity-50 cursor-not-allowed'
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
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
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

        <div className="absolute left-5 bottom-5 flex items-end gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white/92 dark:bg-black/70 backdrop-blur-md shadow-xl border border-white/40 dark:border-white/10">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-300 font-semibold">
              Price
            </p>
            <p className="text-base font-black text-gray-950 dark:text-white">
              MK {listing.price.toLocaleString()}
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300"> / {listing.unit}</span>
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-black/55 text-white text-[11px] font-semibold backdrop-blur-sm">
            {statusLabel}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-[1.05rem] font-bold text-gray-950 dark:text-white leading-snug line-clamp-1">
              {listing.title}
            </h3>

            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium line-clamp-1">
                {listing.businessName}
              </p>
              {listing.verified && (
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSaved((prev) => !prev)}
            className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all ${
              saved
                ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-black'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-200">
            <Tag className="w-3 h-3" />
            {getCategoryLabel(listing.category, t)}
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-1 min-h-[20px] mb-5">
          {listing.description}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onOpenDetails?.(listing);
            }}
            className="h-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            View details
          </button>

          <a
            href={`https://wa.me/${listing.phone}?text=Hello ${listing.sellerName}, I am interested in your ${listing.title} on FarmKit.`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Contact
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
