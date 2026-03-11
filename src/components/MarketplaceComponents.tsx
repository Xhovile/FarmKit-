import React, { useState } from 'react';
import { 
  MapPin, 
  MessageCircle, 
  CheckCircle2, 
  Package, 
  Truck, 
  User, 
  Building2, 
  Tag, 
  Info,
  ChevronRight,
  Plus,
  Filter,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Flag,
  Phone,
  ExternalLink,
  Camera
} from 'lucide-react';
import { motion } from 'motion/react';
import { MarketListing, BuyerRequest } from '../types';

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

export const ListingCard: React.FC<{ listing: MarketListing; t: any; onReport?: (listing: MarketListing) => void }> = ({ listing, t, onReport }) => {
  const defaultImage = "https://picsum.photos/seed/farm/800/600";
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.imageUrl || defaultImage} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-black text-primary shadow-lg">
            MK {listing.price.toLocaleString()} / {listing.unit}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          {onReport && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onReport(listing);
              }}
              className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-rose-500 transition-all shadow-lg"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <SellerBadge verified={listing.verified} t={t} />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{listing.businessName}</h4>
            <div className="flex items-center text-[10px] text-gray-500 uppercase tracking-widest">
              <MapPin className="w-2.5 h-2.5 mr-1 text-primary" /> {listing.location}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{listing.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              listing.status === 'active'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Package className="w-3 h-3" />
            {listing.status === 'active' ? t('common.inStock') || 'In Stock' : listing.status} ({listing.quantity})
          </span>

          <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {listing.category.replace(/_/g, ' ')}
          </span>

          <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Truck className="w-3 h-3" />
            {listing.deliveryMethod.replace(/_/g, ' ')}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 h-10 leading-relaxed">
          {listing.description}
        </p>

        <a 
          href={`https://wa.me/${listing.phone}?text=Hello ${listing.sellerName}, I am interested in your ${listing.title} on FarmKit.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          {t('common.orderNow')}
        </a>
      </div>
    </motion.div>
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
