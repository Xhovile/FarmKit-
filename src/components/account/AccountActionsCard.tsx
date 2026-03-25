import React from 'react';
import { UserCircle, Languages, LogOut, Store, Settings } from 'lucide-react';
import { User as UserType } from '../../types';
import { auth } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface AccountActionsCardProps {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 space-y-6">
      {/* Top Section: Primary Actions (Stacked) */}
      <div className="space-y-3">
        <button 
          onClick={openUpgradeRole}
          className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Store className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-bold text-sm">{canSell ? t('account.addAnotherRole') : t('account.becomeSellerOrOrg')}</span>
        </button>

        <button 
          onClick={openSwitchRole}
          className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserCircle className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-sm">{t('account.switchRole')}</span>
        </button>
      </div>

      {/* Bottom Section: Secondary Actions (Icon Only) */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <button 
          onClick={() => setShowTour(true)}
          title={t('account.takeTour')}
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <Settings className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:rotate-90 transition-all" />
        </button>

        <button 
          onClick={() => setLang(lang === 'en' ? 'ny' : 'en')}
          title={lang === 'en' ? t('account.switchToChichewa') : t('account.switchToEnglish')}
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <Languages className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
        </button>

        <button 
          onClick={handleLogout}
          title={t('common.logout')}
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
        >
          <LogOut className="w-6 h-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default AccountActionsCard;
