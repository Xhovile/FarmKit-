import React from 'react';
import { Settings, UserCircle, Languages, HelpCircle, LogOut, Store } from 'lucide-react';
import { User as UserType } from '../../types';
import { auth } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface AccountActionsCardProps {
  user: UserType;
  t: (key: string) => string;
  openSwitchRole: () => void;
  openUpgradeRole: () => void;
  canSell: boolean;
  lang: 'en' | 'ny';
  setLang: (lang: 'en' | 'ny') => void;
  setShowTour: (val: boolean) => void;
  setUser: (user: UserType | null) => void;
}

const AccountActionsCard: React.FC<AccountActionsCardProps> = ({
  user,
  t,
  openSwitchRole,
  openUpgradeRole,
  canSell,
  lang,
  setLang,
  setShowTour,
  setUser,
}) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      toast.success(t('account.logoutSuccess'));
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6">Account Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={openSwitchRole}
          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold">Switch Primary Role</p>
            <p className="text-xs text-gray-500">Change your default view</p>
          </div>
        </button>

        <button 
          onClick={openUpgradeRole}
          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Store className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-left">
            <p className="font-bold">{canSell ? 'Add Another Role' : 'Become a Seller or Organisation'}</p>
            <p className="text-xs text-gray-500">{canSell ? 'Expand your account capabilities' : 'Upgrade your account'}</p>
          </div>
        </button>

        <button 
          onClick={() => setLang(lang === 'en' ? 'ny' : 'en')}
          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Languages className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-left">
            <p className="font-bold">{lang === 'en' ? 'Switch to Chichewa' : 'Switch to English'}</p>
            <p className="text-xs text-gray-500">Change app language</p>
          </div>
        </button>

        <button 
          onClick={() => setShowTour(true)}
          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="font-bold">Take a Tour</p>
            <p className="text-xs text-gray-500">Learn how to use FarmKit</p>
          </div>
        </button>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all group md:col-span-2"
        >
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-left">
            <p className="font-bold text-red-600 dark:text-red-400">Logout</p>
            <p className="text-xs text-red-500/60">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AccountActionsCard;
