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
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Types ---
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

export interface Listing {
  id: number;
  title: string;
  category: string;
  price: number;
  unit: string;
  stockStatus: string;
  quantity: number;
  image: string;
  description: string;
  deliveryMethod: string;
  seller: Seller;
}

export interface BuyerRequest {
  id: number;
  buyerName: string;
  commodity: string;
  quantity: string;
  unit: string;
  location: string;
  priceRange: string;
  deliveryPreference: string;
  contactMethod: string;
  phone: string;
  status: string;
}

// --- Components ---

export const SellerBadge: React.FC<{ verified: boolean; t: any }> = ({ verified, t }) => (
  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${verified ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
    {verified ? (
      <>
        <CheckCircle2 className="w-3 h-3" />
        {t('Verified Seller', 'Wotsimikizika')}
      </>
    ) : (
      t('Unverified', 'Satsimikizidwa')
    )}
  </div>
);

export const ListingCard: React.FC<{ listing: Listing; t: any }> = ({ listing, t }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-black text-primary shadow-lg">
            MK {listing.price.toLocaleString()} / {listing.unit}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <SellerBadge verified={listing.seller.verified} t={t} />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600">
            <img src={listing.seller.avatar} alt={listing.seller.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{listing.seller.businessName}</h4>
            <div className="flex items-center text-[10px] text-gray-500 uppercase tracking-widest">
              <MapPin className="w-2.5 h-2.5 mr-1 text-primary" /> {listing.seller.location}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{listing.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${listing.stockStatus === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            <Package className="w-3 h-3" /> {listing.stockStatus} ({listing.quantity})
          </span>
          <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Truck className="w-3 h-3" /> {listing.deliveryMethod.replace('_', ' ')}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 h-10 leading-relaxed">
          {listing.description}
        </p>

        <a 
          href={`https://wa.me/${listing.seller.phone}?text=Hello ${listing.seller.name}, I am interested in your ${listing.title} on FarmKit.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          {t('Order Now', 'Gula Tsopano')}
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
          {t('Demand Signal', 'Chofunika')}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('Commodity Wanted', 'Zofunika')}</p>
          <p className="text-xl font-black text-gray-900 dark:text-white">{request.commodity}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('Quantity', 'Kuchuluka')}</p>
            <p className="text-sm font-bold">{request.quantity} {request.unit}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('Target Price', 'Mtengo')}</p>
            <p className="text-sm font-bold text-primary">{request.priceRange}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <Truck className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
          {t('Delivery Preference', 'Mayendedwe')}: <span className="text-gray-900 dark:text-white font-bold">{request.deliveryPreference}</span>
        </span>
      </div>

      <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
        <ArrowRight className="w-5 h-5" />
        {t('Fulfill Request', 'Gwiritsani Ntchito')}
      </button>
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
      {t('All Products', 'Zonse')}
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
        <h3 className="text-2xl font-black mb-2">{t('Start Selling on FarmKit', 'Yambani Kugulitsa pa FarmKit')}</h3>
        <p className="text-emerald-50 text-sm leading-relaxed max-w-md">
          {t('Reach thousands of buyers across Malawi. Get a verified business profile, list your products, and track your sales performance.', 'Pezani ogula masauzande m\'Malawi muno. Khalani ndi mbiri yotsimikizika, lembani zokolola zanu, ndipo onani momwe mukugulitsira.')}
        </p>
      </div>
      <button 
        onClick={onUpgrade}
        className="px-8 py-4 bg-white text-primary font-black rounded-2xl shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
      >
        {t('Get Verified Seller Status', 'Khalani Wogulitsa Wotsimikizika')}
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);
