import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';
import { malawiRegions, malawiDistrictsByRegion } from '../../data/constants';

interface EditOrganizationProfileModalProps {
  organizationEditForm: any;
  setOrganizationEditForm: (val: any) => void;
  handleOrganizationProfileUpdate: () => Promise<void>;
  isSubmittingOrganizationProfile: boolean;
}

const EditOrganizationProfileModal: React.FC<EditOrganizationProfileModalProps> = ({
  organizationEditForm,
  setOrganizationEditForm,
  handleOrganizationProfileUpdate,
  isSubmittingOrganizationProfile,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Organization Name</label>
          <input 
            type="text" 
            value={organizationEditForm.organizationName}
            onChange={e => setOrganizationEditForm({...organizationEditForm, organizationName: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Person</label>
          <input 
            type="text" 
            value={organizationEditForm.contactPerson}
            onChange={e => setOrganizationEditForm({...organizationEditForm, contactPerson: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
          <input 
            type="tel" 
            value={organizationEditForm.phone}
            onChange={e => setOrganizationEditForm({...organizationEditForm, phone: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Region</label>
          <select 
            value={organizationEditForm.region}
            onChange={e => setOrganizationEditForm({...organizationEditForm, region: e.target.value, district: ''})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none"
          >
            <option value="">Select Region</option>
            {malawiRegions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">District</label>
          <select 
            value={organizationEditForm.district}
            onChange={e => setOrganizationEditForm({...organizationEditForm, district: e.target.value})}
            disabled={!organizationEditForm.region}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none disabled:opacity-50"
          >
            <option value="">Select District</option>
            {organizationEditForm.region && malawiDistrictsByRegion[organizationEditForm.region as keyof typeof malawiDistrictsByRegion]?.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address / Area</label>
          <input 
            type="text" 
            value={organizationEditForm.address || organizationEditForm.area}
            onChange={e => setOrganizationEditForm({...organizationEditForm, address: e.target.value, area: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Business/Org Type</label>
          <input 
            type="text" 
            value={organizationEditForm.businessType || organizationEditForm.organizationType}
            onChange={e => setOrganizationEditForm({...organizationEditForm, businessType: e.target.value, organizationType: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registration Number</label>
          <input 
            type="text" 
            value={organizationEditForm.registrationNumber}
            onChange={e => setOrganizationEditForm({...organizationEditForm, registrationNumber: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
          <textarea 
            value={organizationEditForm.description}
            onChange={e => setOrganizationEditForm({...organizationEditForm, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <button 
        onClick={handleOrganizationProfileUpdate}
        disabled={isSubmittingOrganizationProfile}
        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmittingOrganizationProfile ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        {isSubmittingOrganizationProfile ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default EditOrganizationProfileModal;
