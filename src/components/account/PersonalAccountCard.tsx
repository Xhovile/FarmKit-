import React from 'react';
import { MapPin, UserCircle, Phone, FileText, Shield } from 'lucide-react';
import { User as UserType } from '../../types';

interface PersonalAccountCardProps {
  user: UserType;
  t: (key: string) => string;
  setIsAccountModalOpen: (val: boolean) => void;
  setAccountView: (view: any) => void;
  statusBadgeClassMap: Record<UserType['status'], string>;
  statusLabelMap: Record<UserType['status'], string>;
}

const PersonalAccountCard: React.FC<PersonalAccountCardProps> = ({
  user,
  t,
  setIsAccountModalOpen,
  setAccountView,
  statusBadgeClassMap,
  statusLabelMap,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setAccountView('editPersonal');
            setIsAccountModalOpen(true);
          }}
          className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm"
        >
          {t('common.edit')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('account.location')}</p>
              <p className="text-gray-700 dark:text-gray-300">
                {user.region && user.district ? `${user.district}, ${user.region}` : user.location || t('account.notSet')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('account.phoneNumber')}</p>
              <p className="text-gray-700 dark:text-gray-300">{user.phone || t('account.notSet')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('account.accountStatus')}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusBadgeClassMap[user.status]}`}>
                {statusLabelMap[user.status]}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('account.bio')}</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">{user.bio || t('account.noBio')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAccountCard;
