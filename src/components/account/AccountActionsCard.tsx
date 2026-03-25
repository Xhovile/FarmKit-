import React from 'react';
import {
  Settings,
  UserCircle,
  Languages,
  HelpCircle,
  LogOut,
  Store,
} from 'lucide-react';
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

      <div className="pt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={openSwitchRole}
          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
        >
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
            <UserCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-500 text-center">
            Switch Role
          </span>
        </button>

        <button
          onClick={openUpgradeRole}
          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
        >
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
            <Store className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-500 text-center">
            {canSell ? 'Add Another Role' : 'Become Seller / Organisation'}
          </span>
        </button>

        <button
          onClick={() => setLang(lang === 'en' ? 'ny' : 'en')}
          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
        >
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
            <Languages className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-500 text-center">
            {lang === 'en' ? 'Switch to Chichewa' : 'Switch to English'}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
        >
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center transition-all">
            <LogOut className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-rose-500 text-center">
            {t('common.logout')}
          </span>
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowTour(true)}
          className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="font-bold">Take a Tour</p>
            <p className="text-xs text-gray-500">Learn how to use FarmKit</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AccountActionsCard; 
