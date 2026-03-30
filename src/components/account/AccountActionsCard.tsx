import React from 'react';
import { UserCircle, Languages, LogOut, Store, Settings, HelpCircle } from 'lucide-react';
import { User as UserType, UserRole } from '../../types';
import { auth } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface AccountActionsCardProps {
  user: UserType;
  t: (key: string) => string;
  roleLabelMap: Partial<Record<UserRole, string>>;
  openSwitchRole: () => void;
  openUpgradeRole: () => void;
  openEditSeller: () => void;
  openEditOrganization: () => void;
  canSell: boolean;
  canEditCurrentProfile: boolean;
  lang: 'en' | 'ny';
  setLang: (lang: 'en' | 'ny') => void;
  setShowTour: (val: boolean) => void;
  setUser: (user: UserType | null) => void;
}

const AccountActionsCard: React.FC<AccountActionsCardProps> = ({
  user,
  t,
  roleLabelMap,
  openSwitchRole,
  openUpgradeRole,
  openEditSeller,
  openEditOrganization,
  canSell,
  canEditCurrentProfile,
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

  const activeRoleLabel = user.primaryRole ? roleLabelMap[user.primaryRole] : t('account.account');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 space-y-6">
      {/* Top Section: Primary Actions (Stacked) */}
      <div className="space-y-3">
        {canEditCurrentProfile && user.primaryRole && (
          <button 
            onClick={user.primaryRole === 'seller' ? openEditSeller : openEditOrganization}
            className="w-full flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{t('account.activeRole')}</p>
                <p className="font-bold text-sm">{activeRoleLabel}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary px-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">{t('common.manage')}</span>
          </button>
        )}

        <button 
          onClick={openUpgradeRole}
          className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
        >
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Store className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-bold text-sm">{canSell ? t('account.addBusinessCapability') : t('account.addBusinessCapability')}</span>
        </button>

        {user.roles.length > 1 && (
          <button 
            onClick={openSwitchRole}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-sm">{t('account.manageRoles')}</span>
          </button>
        )}
      </div>

      {/* Bottom Section: Secondary Actions (Icon Only) */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <button 
          onClick={() => toast('Settings coming soon')}
          title={t('common.settings')}
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
        >
          <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:rotate-90 transition-all" />
        </button>

        <button 
          onClick={() => setShowTour(true)}
          title={t('account.takeTour')}
          className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
        >
          <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
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
