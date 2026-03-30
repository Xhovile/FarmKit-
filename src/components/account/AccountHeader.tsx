import React from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  MapPin,
  Settings,
  X,
  User,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react';
import { User as UserType, UserRole } from '../../types';

interface AccountHeaderProps {
  user: UserType;
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  t: (key: string) => string;
  settingsContent?: React.ReactNode;
  onAvatarUpload?: (file: File) => Promise<void>;
}

const roleLabelMap = (t: (k: string) => string): Partial<Record<UserRole, string>> => ({
  seller: t('account.seller'),
  business: t('account.business'),
  cooperative: t('account.cooperative'),
  ngo: t('account.ngo'),
});

const statusLabelMap = (t: (k: string) => string): Record<UserType['status'], string> => ({
  basic: t('account.basicAccount'),
  verified: t('account.verifiedAccount'),
  premium: t('account.premiumAccount'),
});

const statusClassMap: Record<UserType['status'], string> = {
  basic: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  verified: 'bg-emerald-500 text-white',
  premium: 'bg-amber-500 text-white',
};

const verificationLabel = (t: (k: string) => string, status?: string) => {
  if (status === 'verified') return t('account.identityVerified');
  if (status === 'pending') return t('account.verificationPending');
  if (status === 'rejected') return t('account.verificationRejected');
  return t('account.notVerified');
};

const verificationClass = (status?: string) => {
  if (status === 'verified') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
  if (status === 'pending') return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
  if (status === 'rejected') return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
};

const AccountHeader: React.FC<AccountHeaderProps> = ({
  user,
  showSettings,
  setShowSettings,
  t,
  settingsContent,
  onAvatarUpload,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAvatarUpload) return;

    setIsUploading(true);
    try {
      await onAvatarUpload(file);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const location = [user.location, user.district, user.region].filter(Boolean).join(', ');
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : '—';

  const activeRoleLabel = user.primaryRole ? roleLabelMap(t)[user.primaryRole] : t('account.account');

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4 min-w-0">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-md relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-10 h-10" />
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/35 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all disabled:cursor-not-allowed"
                  aria-label={t('account.uploadAvatar')}
                >
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="min-w-0 pt-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {user.name || 'User Name'}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    {activeRoleLabel}
                  </span>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusClassMap[user.status]}`}>
                    {statusLabelMap(t)[user.status]}
                  </span>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${verificationClass(user.verification?.status)}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {verificationLabel(t, user.verification?.status)}
                  </span>
                </div>

                <div className="mt-3 flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {location || t('account.locationNotSet')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 shrink-0" />
                    <span>{t('account.memberSince')} {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 shrink-0">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  showSettings
                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {showSettings ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>{t('account.close')}</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4" />
                    <span>{t('account.editProfile')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="px-3 py-2 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-600 dark:text-gray-300">
              {t('account.accountStatus')}: {statusLabelMap(t)[user.status]}
            </div>
            <div className="px-3 py-2 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-600 dark:text-gray-300">
              {t('account.activeRole')}: {activeRoleLabel}
            </div>
          </div>
        </div>
      </div>

      {showSettings && settingsContent && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('account.accountDetails')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('account.profileInfoAndSettings')}
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {settingsContent}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AccountHeader;
