import React from 'react';
import { Building2, MapPin, Phone, User, Briefcase, FileText, Users, HandHelping, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../../types';

interface OrganizationProfileCardProps {
  user: UserType;
  openEditOrganization: () => void;
  organizationTypeLabelMap: Record<string, string>;
}

const OrganizationProfileCard: React.FC<OrganizationProfileCardProps> = ({
  user,
  openEditOrganization,
  organizationTypeLabelMap,
}) => {
  if (!user.organizationProfile) return null;

  const orgType = user.organizationProfile.type;
  const orgLabel = organizationTypeLabelMap[orgType] || 'Organization';

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
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{orgLabel} Profile</h3>
              {user.organizationProfile.verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">{user.organizationProfile.organizationName}</p>
          </div>
        </div>
        <button
          onClick={openEditOrganization}
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
              <p className="text-gray-700 dark:text-gray-300">
                {[user.organizationProfile.district, user.organizationProfile.region].filter(Boolean).join(', ') || 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Person</p>
              <p className="text-gray-700 dark:text-gray-300">{user.organizationProfile.contactPerson || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
              <p className="text-gray-700 dark:text-gray-300">{user.organizationProfile.phone || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</p>
              <p className="text-gray-700 dark:text-gray-300 capitalize">
                {orgLabel}
              </p>
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
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                {user.organizationProfile.description || 'No description yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfileCard;
