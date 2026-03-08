import React from 'react';
import { motion } from 'motion/react';
import { 
  UserCircle, 
  Settings, 
  X, 
  User, 
  Camera, 
  LogOut, 
  HelpCircle, 
  Share2, 
  MapPin,
  Phone,
  Save,
  Package,
  Star,
  ThumbsUp,
  Crown,
  ArrowRight,
  ClipboardList,
  TrendingUp,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
// Real data states (placeholders for now)
const marketplaceListings: any[] = [];
const buyerRequests: any[] = [];

interface AccountPageProps {
  t: (key: string) => string;
  user: any;
  setUser: (user: any) => void;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  profileFormData: any;
  setProfileFormData: (val: any) => void;
  setIsAuthModalOpen: (val: boolean) => void;
  setShowTour: (val: boolean) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  t,
  user,
  setUser,
  isEditingProfile,
  setIsEditingProfile,
  profileFormData,
  setProfileFormData,
  setIsAuthModalOpen,
  setShowTour
}) => {
  if (!user) {
    return (
      <motion.div 
        key="account-unauth"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserCircle className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('account.signInTitle')}</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          {t('account.signInDesc')}
        </p>
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          {t('account.loginSignUp')}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key="account-auth"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-primary to-emerald-600 relative">
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition-all"
          >
            {isEditingProfile ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-gray-800 overflow-hidden shadow-xl bg-gray-100">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              {isEditingProfile && (
                <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                  <Camera className="w-8 h-8" />
                </button>
              )}
            </div>
            
            {!isEditingProfile && (
              <div className="flex gap-2 mb-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${user?.tier === 'Verified Seller' ? 'bg-emerald-500 text-white' : user?.tier === 'Premium' ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {user?.tier === 'Verified Seller' ? t('account.verifiedSeller') : user?.tier === 'Premium' ? t('account.premiumMember') : t('account.freeMember')}
                </span>
              </div>
            )}
          </div>

          {isEditingProfile ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.fullName')}</label>
                  <input 
                    type="text" 
                    value={profileFormData.name}
                    onChange={e => setProfileFormData({...profileFormData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('common.location')}</label>
                  <input 
                    type="text" 
                    value={profileFormData.location}
                    onChange={e => setProfileFormData({...profileFormData, location: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.phoneNumber')}</label>
                  <input 
                    type="tel" 
                    value={profileFormData.phone}
                    onChange={e => setProfileFormData({...profileFormData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.bio')}</label>
                  <textarea 
                    value={profileFormData.bio}
                    onChange={e => setProfileFormData({...profileFormData, bio: e.target.value})}
                    rows={1}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={async () => {
                    if (user) {
                      const updatedData = {
                        name: profileFormData.name,
                        location: profileFormData.location,
                        phone: profileFormData.phone,
                        bio: profileFormData.bio
                      };
                      try {
                        await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });
                        setUser({ ...user, ...updatedData });
                        setIsEditingProfile(false);
                        toast.success(t('account.profileUpdated'));
                      } catch (error: any) {
                        toast.error(error.message);
                      }
                    }
                  }}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> {t('common.save')}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-1">{user?.name}</h2>
                <p className="text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> {user?.location}
                </p>
              </div>

              {user?.bio && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('account.about')}</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">"{user.bio}"</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">{t('common.listings')}</p>
                    <p className="text-lg font-bold">12</p>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">{t('account.rating')}</p>
                    <p className="text-lg font-bold">4.8/5</p>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">{t('account.followers')}</p>
                    <p className="text-lg font-bold">156</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
                    <Settings className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{t('common.settings')}</span>
                </button>
                <button 
                  onClick={() => setShowTour(true)}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{t('account.helpTour')}</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{t('account.shareProfile')}</span>
                </button>
                <button 
                  onClick={() => {
                    auth.signOut();
                    toast.success(t('account.loggedOut'));
                  }}
                  className="flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group flex"
                >
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center transition-all">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-rose-500">{t('common.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seller Dashboard (Only for Verified Sellers or Premium) */}
      {(user?.tier === 'Verified Seller' || user?.tier === 'Premium') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">{t('account.sellerInsights')}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{t('account.performanceOverview')}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <span className="text-sm font-bold text-gray-500">{t('account.totalViews')}</span>
                <span className="text-lg font-black">1,240</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <span className="text-sm font-bold text-gray-500">{t('account.activeLeads')}</span>
                <span className="text-lg font-black text-primary">42</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <span className="text-sm font-bold text-gray-500">{t('account.conversionRate')}</span>
                <span className="text-lg font-black text-emerald-600">8.4%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black">{t('account.businessProfile')}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{t('account.publicIdentity')}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">{t('account.verifiedStatus')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">{t('account.listingPriority')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">{t('account.directLeads')}</span>
              </div>
              <button className="w-full mt-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all">
                {t('account.editBusinessDetails')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Listings & Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              {t('account.myListings')}
            </h3>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              {marketplaceListings.filter(l => l.seller.id === 's1').length} {t('common.active')}
            </span>
          </div>
          <div className="space-y-3">
            {marketplaceListings.filter(l => l.seller.id === 's1').map(listing => (
              <div key={listing.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <img src={listing.image} alt={listing.title} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{listing.title}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">MK {listing.price.toLocaleString()} / {listing.unit}</p>
                </div>
                <button className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </button>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 font-bold text-sm hover:border-primary hover:text-primary transition-all">
              + {t('forms.addListing')}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-indigo-600" />
              {t('account.myRequests')}
            </h3>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              2 {t('common.active')}
            </span>
          </div>
          <div className="space-y-3">
            {buyerRequests.slice(0, 2).map(request => (
              <div key={request.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold">{request.commodity}</h4>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{request.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{request.quantity} {request.unit}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{request.priceRange.split('per')[0]}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all">
              + {t('forms.postRequest')}
            </button>
          </div>
        </div>
      </div>

      {/* Premium Upgrade CTA */}
      {!isEditingProfile && user?.tier === 'Free' && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black">{t('account.unlockPremium')}</h3>
            </div>
            <p className="text-amber-50 mb-8 max-w-xl leading-relaxed">
              {t('account.premiumDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                <TrendingUp className="w-5 h-5 text-amber-200" />
                <span className="text-sm font-bold">{t('market.trends')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                <MapPin className="w-5 h-5 text-amber-200" />
                <span className="text-sm font-bold">{t('market.pesticideMap')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-amber-200" />
                <span className="text-sm font-bold">{t('common.training')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                <Star className="w-5 h-5 text-amber-200" />
                <span className="text-sm font-bold">{t('account.prioritySupport')}</span>
              </div>
            </div>
            <button 
              onClick={async () => {
                if (user) {
                  try {
                    await setDoc(doc(db, 'users', user.uid), { tier: 'Premium' }, { merge: true });
                    setUser({...user, tier: 'Premium'});
                    toast.success(t('account.premiumSuccess'));
                  } catch (error: any) {
                    toast.error(error.message);
                  }
                }
              }}
              className="px-10 py-4 bg-white text-amber-600 font-black rounded-2xl shadow-xl hover:bg-amber-50 transition-all flex items-center gap-2 active:scale-95"
            >
              {t('account.upgradeNow')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Verified Seller CTA */}
      {!isEditingProfile && user?.tier !== 'Verified Seller' && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t('account.becomeVerifiedSeller')}</h3>
            </div>
            <p className="text-gray-500 mb-8 max-w-xl leading-relaxed">
              {t('account.verifiedSellerDesc')}
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t('account.unlimitedListings')}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t('account.verifiedBadge')}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t('account.prioritySearch')}
              </div>
            </div>
            <button 
              onClick={async () => {
                if (user) {
                  try {
                    await setDoc(doc(db, 'users', user.uid), { tier: 'Verified Seller' }, { merge: true });
                    setUser({...user, tier: 'Verified Seller'});
                    toast.success(t('account.verifiedSellerSuccess'));
                  } catch (error: any) {
                    toast.error(error.message);
                  }
                }
              }}
              className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95"
            >
              {t('account.applyForVerification')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

