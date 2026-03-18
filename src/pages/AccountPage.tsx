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
  MapPin,
  Save,
  Languages
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { User as UserType } from '../types';

interface AccountPageProps {
  t: (key: string) => string;
  lang: 'en' | 'ny';
  setLang: (lang: 'en' | 'ny') => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  profileFormData: any;
  setProfileFormData: (val: any) => void;
  setIsAuthModalOpen: (val: boolean) => void;
  setShowTour: (val: boolean) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  t,
  lang,
  setLang,
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
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center"
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

  const roleLabelMap: Record<UserType['primaryRole'], string> = {
    buyer: 'Buyer',
    seller: 'Seller',
    business: 'Business',
    cooperative: 'Cooperative',
    ngo: 'NGO',
  };

  const statusLabelMap: Record<UserType['status'], string> = {
    basic: 'Basic Account',
    verified: 'Verified Account',
    premium: 'Premium Account',
  };

  const statusBadgeClassMap: Record<UserType['status'], string> = {
    basic: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    verified: 'bg-emerald-500 text-white',
    premium: 'bg-amber-500 text-white',
  };

  const canSell =
    user.roles.includes('seller') ||
    user.roles.includes('business') ||
    user.roles.includes('cooperative') ||
    user.roles.includes('ngo');

  return (
    <motion.div 
      key="account-auth"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-primary relative">
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
              <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg bg-gray-100">
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
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${statusBadgeClassMap[user.status]}`}
                >
                  {statusLabelMap[user.status]}
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

              <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Account Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {roleLabelMap[user.primaryRole]}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold">
                      {statusLabelMap[user.status]}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Active Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs font-semibold"
                      >
                        {roleLabelMap[role]}
                      </span>
                    ))}
                  </div>
                </div>

                {!canSell && (
                  <div className="pt-2">
                    <button
                      className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
                      onClick={() => toast('Role upgrade flow comes next.')}
                    >
                      Become a Seller or Organisation
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setShowTour(true)}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{t('account.helpTour')}</span>
                </button>
                <button
                  onClick={() => setLang(lang === 'en' ? 'ny' : 'en')}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
                    <Languages className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    Language ({lang.toUpperCase()})
                  </span>
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

    </motion.div>
  );
};

