import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Store, Building2, Users, HandHelping, Save } from 'lucide-react';
import { User as UserType } from '../../types';

interface RoleUpgradeModalProps {
  selectedRole: 'seller' | 'business' | 'cooperative' | 'ngo' | null;
  setSelectedRole: (role: 'seller' | 'business' | 'cooperative' | 'ngo' | null) => void;
  sellerUpgradeForm: any;
  setSellerUpgradeForm: (val: any) => void;
  businessUpgradeForm: any;
  setBusinessUpgradeForm: (val: any) => void;
  cooperativeUpgradeForm: any;
  setCooperativeUpgradeForm: (val: any) => void;
  ngoUpgradeForm: any;
  setNgoUpgradeForm: (val: any) => void;
  handleRoleUpgrade: () => Promise<void>;
  isSubmittingRole: boolean;
  user: UserType;
  malawiRegions: string[];
  malawiDistrictsByRegion: Record<string, string[]>;
}

const RoleUpgradeModal: React.FC<RoleUpgradeModalProps> = ({
  selectedRole,
  setSelectedRole,
  sellerUpgradeForm,
  setSellerUpgradeForm,
  businessUpgradeForm,
  setBusinessUpgradeForm,
  cooperativeUpgradeForm,
  setCooperativeUpgradeForm,
  ngoUpgradeForm,
  setNgoUpgradeForm,
  handleRoleUpgrade,
  isSubmittingRole,
  user,
  malawiRegions,
  malawiDistrictsByRegion,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {selectedRole === 'seller' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Business Name</label>
              <input
                type="text"
                value={sellerUpgradeForm.businessName}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, businessName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Isaac's Fresh Produce"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
              <input
                type="text"
                value={sellerUpgradeForm.fullName}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone</label>
              <input
                type="tel"
                value={sellerUpgradeForm.phone}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Region</label>
              <select
                value={sellerUpgradeForm.region}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, region: e.target.value, district: '' })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="">Select Region</option>
                {malawiRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">District</label>
              <select
                value={sellerUpgradeForm.district}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, district: e.target.value })}
                disabled={!sellerUpgradeForm.region}
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary appearance-none ${!sellerUpgradeForm.region ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">Select District</option>
                {sellerUpgradeForm.region && malawiDistrictsByRegion[sellerUpgradeForm.region as keyof typeof malawiDistrictsByRegion].map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Area</label>
              <input
                type="text"
                value={sellerUpgradeForm.area}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, area: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Area 25"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</label>
              <input
                type="text"
                value={sellerUpgradeForm.category}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Vegetables"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Experience (Years)</label>
              <input
                type="number"
                value={sellerUpgradeForm.experienceYears}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, experienceYears: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Method</label>
              <select
                value={sellerUpgradeForm.deliveryMethod}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, deliveryMethod: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary"
              >
                <option value="pickup">Pickup Only</option>
                <option value="delivery">Delivery Available</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</label>
              <textarea
                value={sellerUpgradeForm.description}
                onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary min-h-[100px]"
                placeholder="Tell us more about your business..."
              />
            </div>
          </div>
        )}

        {selectedRole === 'business' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Registered business name"
              value={businessUpgradeForm.organizationName}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, organizationName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Contact person"
              value={businessUpgradeForm.contactPerson}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, contactPerson: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Phone number"
              value={businessUpgradeForm.phone}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="District"
              value={businessUpgradeForm.district}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, district: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Exact address"
              value={businessUpgradeForm.address}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Business type"
              value={businessUpgradeForm.businessType}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, businessType: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Products or services offered"
              value={businessUpgradeForm.productsOrServices}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, productsOrServices: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Registration number"
              value={businessUpgradeForm.registrationNumber}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, registrationNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <textarea
              placeholder="Short business description"
              rows={4}
              value={businessUpgradeForm.description}
              onChange={(e) => setBusinessUpgradeForm({ ...businessUpgradeForm, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
          </div>
        )}

        {selectedRole === 'cooperative' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Cooperative name"
              value={cooperativeUpgradeForm.organizationName}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, organizationName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Contact person"
              value={cooperativeUpgradeForm.contactPerson}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, contactPerson: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Phone number"
              value={cooperativeUpgradeForm.phone}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="District"
              value={cooperativeUpgradeForm.district}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, district: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="EPA / area"
              value={cooperativeUpgradeForm.area}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, area: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Number of members"
              value={cooperativeUpgradeForm.memberCount}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, memberCount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Main commodities handled"
              value={cooperativeUpgradeForm.mainCommodities}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, mainCommodities: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Registration number"
              value={cooperativeUpgradeForm.registrationNumber}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, registrationNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <textarea
              placeholder="Short cooperative description"
              rows={4}
              value={cooperativeUpgradeForm.description}
              onChange={(e) => setCooperativeUpgradeForm({ ...cooperativeUpgradeForm, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
          </div>
        )}

        {selectedRole === 'ngo' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Organisation name"
              value={ngoUpgradeForm.organizationName}
              onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, organizationName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Contact person"
              value={ngoUpgradeForm.contactPerson}
              onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, contactPerson: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Phone number"
              value={ngoUpgradeForm.phone}
              onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="District"
              value={ngoUpgradeForm.district}
              onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, district: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <input
              type="text"
              placeholder="Exact address"
              value={ngoUpgradeForm.address}
              onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
            <select
              value={ngoUpgradeForm.organizationType}
              onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, organizationType: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            >
              <option value="">Select organisation type</option>
              <option value="local">Local NGO</option>
              <option value="international">International NGO</option>
              <option value="community">Community Based Organisation (CBO)</option>
              <option value="trust">Trust</option>
              <option value="other">Other</option>
            </select>
            <textarea
              placeholder="Short organisation description"
              rows={4}
              value={ngoUpgradeForm.description}
              onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />
          </div>
        )}
      </div>

      <div className="pt-4">
        <button 
          onClick={handleRoleUpgrade}
          disabled={isSubmittingRole}
          className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmittingRole ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSubmittingRole ? 'Upgrading...' : 'Confirm Upgrade'}
        </button>
      </div>
    </div>
  );
};

export default RoleUpgradeModal;
