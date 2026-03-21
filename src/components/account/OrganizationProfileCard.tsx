import React from 'react';
import { Building2, MapPin, Phone, User, Briefcase, FileText, Globe, Users, HandHelping } from 'lucide-react';
import { User as UserType } from '../../types';

interface OrganizationProfileCardProps {
  user: UserType;
  setIsAccountModalOpen: (val: boolean) => void;
  setAccountView: (view: any) => void;
  organizationTypeLabelMap: Record<string, string>;
}

const OrganizationProfileCard: React.FC<OrganizationProfileCardProps> = ({
  user,
  setIsAccountModalOpen,
  setAccountView,
  organizationTypeLabelMap,
}) => {
  if (!user.organizationProfile) return null;

  const orgType = user.roles.find(r => ['business', 'cooperative', 'ngo'].includes(r));
  const orgLabel = orgType ? organizationTypeLabelMap[orgType as keyof typeof organizationTypeLabelMap] : 'Organization';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-blue-100 dark:border-blue-900/30">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
            {orgType === 'ngo' ? (
              <HandHelping className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            ) : orgType === 'cooperative' ? (
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            ) : (
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">{orgLabel} Profile</h3>
            <p className="text-sm text-gray-500">{user.organizationProfile.organizationName}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setAccountView('editOrganization');
            setIsAccountModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 transition-all text-sm"
        >
          Manage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
              <p className="text-gray-700 dark:text-gray-300">{user.organizationProfile.district}, {user.organizationProfile.region}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Person</p>
              <p className="text-gray-700 dark:text-gray-300">{user.organizationProfile.contactPerson}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
              <p className="text-gray-700 dark:text-gray-300">{user.organizationProfile.phone}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Type</p>
              <p className="text-gray-700 dark:text-gray-300 capitalize">{user.organizationProfile.businessType || user.organizationProfile.type}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registration</p>
              <p className="text-gray-700 dark:text-gray-300">{user.organizationProfile.registrationNumber || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</p>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{user.organizationProfile.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfileCard;
