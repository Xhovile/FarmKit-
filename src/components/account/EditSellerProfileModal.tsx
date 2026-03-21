import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';
import { malawiRegions, malawiDistrictsByRegion } from '../../data/constants';

interface EditSellerProfileModalProps {
  sellerEditForm: any;
  setSellerEditForm: (val: any) => void;
  handleSellerProfileUpdate: () => Promise<void>;
  isSubmittingSellerProfile: boolean;
}

const EditSellerProfileModal: React.FC<EditSellerProfileModalProps> = ({
  sellerEditForm,
  setSellerEditForm,
  handleSellerProfileUpdate,
  isSubmittingSellerProfile,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Business Name</label>
          <input 
            type="text" 
            value={sellerEditForm.businessName}
            onChange={e => setSellerEditForm({...sellerEditForm, businessName: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
          <input 
            type="text" 
            value={sellerEditForm.fullName}
            onChange={e => setSellerEditForm({...sellerEditForm, fullName: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
          <input 
            type="tel" 
            value={sellerEditForm.phone}
            onChange={e => setSellerEditForm({...sellerEditForm, phone: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Region</label>
          <select 
            value={sellerEditForm.region}
            onChange={e => setSellerEditForm({...sellerEditForm, region: e.target.value, district: ''})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none"
          >
            <option value="">Select Region</option>
            {malawiRegions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">District</label>
          <select 
            value={sellerEditForm.district}
            onChange={e => setSellerEditForm({...sellerEditForm, district: e.target.value})}
            disabled={!sellerEditForm.region}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none disabled:opacity-50"
          >
            <option value="">Select District</option>
            {sellerEditForm.region && malawiDistrictsByRegion[sellerEditForm.region as keyof typeof malawiDistrictsByRegion]?.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Area / Market</label>
          <input 
            type="text" 
            value={sellerEditForm.area}
            onChange={e => setSellerEditForm({...sellerEditForm, area: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
          <select 
            value={sellerEditForm.category}
            onChange={e => setSellerEditForm({...sellerEditForm, category: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none"
          >
            <option value="">Select Category</option>
            <option value="crops">Crops</option>
            <option value="livestock">Livestock</option>
            <option value="inputs">Inputs</option>
            <option value="machinery">Machinery</option>
            <option value="services">Services</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Method</label>
          <select 
            value={sellerEditForm.deliveryMethod}
            onChange={e => setSellerEditForm({...sellerEditForm, deliveryMethod: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none"
          >
            <option value="pickup">Pickup Only</option>
            <option value="delivery">Delivery Available</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience (Years)</label>
          <input 
            type="number" 
            value={sellerEditForm.experienceYears}
            onChange={e => setSellerEditForm({...sellerEditForm, experienceYears: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
          <textarea 
            value={sellerEditForm.description}
            onChange={e => setSellerEditForm({...sellerEditForm, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <button 
        onClick={handleSellerProfileUpdate}
        disabled={isSubmittingSellerProfile}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmittingSellerProfile ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        {isSubmittingSellerProfile ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default EditSellerProfileModal;
