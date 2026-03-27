import React from 'react';
import { motion } from 'motion/react';
import {
  UserCircle,
  X,
  ArrowLeft,
  Store,
  Building2,
  Users,
  HandHelping,
  Save
} from 'lucide-react';
import { User as UserType, BuyerRequest } from '../types';
import { malawiRegions, malawiDistrictsByRegion } from '../data/constants';
import { useAccountPageController, AccountView } from '../hooks/useAccountPageController';
import AccountHeader from '../components/account/AccountHeader';
import AccountTypeCard from '../components/account/AccountTypeCard';
import PersonalAccountCard from '../components/account/PersonalAccountCard';
import SellerProfileCard from '../components/account/SellerProfileCard';
import OrganizationProfileCard from '../components/account/OrganizationProfileCard';
import AccountActionsCard from '../components/account/AccountActionsCard';
import RoleUpgradeForm from '../components/account/RoleUpgradeForm';
import PrimaryRoleForm from '../components/account/PrimaryRoleForm';
import EditSellerProfileForm from '../components/account/EditSellerProfileForm';
import EditOrganizationProfileForm from '../components/account/EditOrganizationProfileForm';
import MyBuyerRequestsSection from '../components/account/MyBuyerRequestsSection';
import MyListingsSection from '../components/account/MyListingsSection';
import SavedItemsSection from '../components/account/SavedItemsSection';

import RoleDashboardSection from '../components/account/RoleDashboardSection';

interface AccountPageProps {
  t: (key: string) => string;
  lang: 'en' | 'ny';
  setLang: (lang: 'en' | 'ny') => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  setIsAuthModalOpen: (val: boolean) => void;
  setShowTour: (val: boolean) => void;
  setActiveTab: (tab: 'info' | 'market' | 'experts' | 'account') => void;
  setSelectedItem: (item: any) => void;
  setEditingListing: (listing: any) => void;
  setEditingRequest: (request: BuyerRequest | null) => void;
  setIsAddProductModalOpen: (open: boolean) => void;
  setFormStep: (step: number) => void;
  onUpdateBuyerRequestStatus: (
    request: BuyerRequest,
    nextStatus: 'open' | 'matched' | 'closed'
  ) => Promise<void> | void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  t,
  lang,
  setLang,
  user,
  setUser,
  setIsAuthModalOpen,
  setShowTour,
  setActiveTab,
  setSelectedItem,
  setEditingListing,
  setEditingRequest,
  setIsAddProductModalOpen,
  setFormStep,
  onUpdateBuyerRequestStatus,
}) => {
  const {
    accountView,
    setAccountView,
    isAccountModalOpen,
    setIsAccountModalOpen,
    isSubmittingProfile,
    isSubmittingSellerProfile,
    isSubmittingOrganizationProfile,
    selectedRole,
    setSelectedRole,
    isSubmittingRole,
    isSubmittingRoleSwitch,
    selectedPrimaryRole,
    setSelectedPrimaryRole,
    sellerUpgradeForm,
    setSellerUpgradeForm,
    businessUpgradeForm,
    setBusinessUpgradeForm,
    cooperativeUpgradeForm,
    setCooperativeUpgradeForm,
    ngoUpgradeForm,
    setNgoUpgradeForm,
    sellerEditForm,
    setSellerEditForm,
    organizationEditForm,
    setOrganizationEditForm,
    handleProfileUpdate,
    handleRoleUpgrade,
    handleSellerProfileUpdate,
    handleOrganizationProfileUpdate,
    handlePrimaryRoleSwitch,
    isEditingProfile,
    setIsEditingProfile,
    profileFormData,
    setProfileFormData,
    canSell,
    openEditPersonal,
    openEditSeller,
    openEditOrganization,
    openSwitchRole,
    openUpgradeRole
  } = useAccountPageController({
    user,
    setUser,
    t
  });

  const roleLabelMap: Record<UserType['primaryRole'], string> = {
    buyer: 'Buyer',
    seller: 'Seller',
    business: 'Business',
    cooperative: 'Cooperative',
    ngo: 'NGO',
  };

  const statusLabelMap: Record<UserType['status'], string> = {
    basic: 'Basic Account',
    verified: 'Verified Account',
    premium: 'Premium Account',
  };

  const statusBadgeClassMap: Record<UserType['status'], string> = {
    basic: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    verified: 'bg-emerald-500 text-white',
    premium: 'bg-amber-500 text-white',
  };

  const organizationTypeLabelMap = {
    business: 'Business',
    cooperative: 'Cooperative',
    ngo: 'NGO',
  } as const;

  if (!user) {
    return (
      <motion.div 
        key="account-unauth"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserCircle className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('account.signInTitle')}</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          {t('account.signInDesc')}
        </p>
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          {t('account.loginSignUp')}
        </button>
      </motion.div>
    );
  }

  if (accountView === 'myListings') {
    return (
      <motion.div 
        key="my-listings-view"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6 pb-20"
      >
        <div className="sticky top-0 z-30 -mx-4 px-4 py-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 mb-6">
          <button 
            onClick={() => {
              setAccountView('hub');
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary font-bold transition-all group"
          >
            <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>Back to Account Hub</span>
          </button>
        </div>
        
        <div className="px-1">
          <MyListingsSection
            user={user}
            onAddListing={() => {
              setEditingListing(null);
              setEditingRequest(null);
              setFormStep(0);
              setIsAddProductModalOpen(true);
            }}
            onEditListing={(listing) => {
              setEditingListing(listing);
              setEditingRequest(null);
              setFormStep(0);
              setIsAddProductModalOpen(true);
            }}
            onViewDetails={(listing) => {
              setSelectedItem(listing);
              setActiveTab('market');
            }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key="account-auth"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <AccountHeader 
        user={user} 
        isEditingProfile={isEditingProfile} 
        setIsEditingProfile={setIsEditingProfile} 
      />

      <PersonalAccountCard
        user={user}
        t={t}
        openEditPersonal={openEditPersonal}
        statusBadgeClassMap={statusBadgeClassMap}
        statusLabelMap={statusLabelMap}
      />

      <AccountTypeCard
        user={user}
        roleLabelMap={roleLabelMap}
        statusLabelMap={statusLabelMap}
      />

      <RoleDashboardSection
        user={user}
        t={t}
        setActiveTab={setActiveTab}
        setSelectedItem={setSelectedItem}
        setEditingListing={setEditingListing}
        setEditingRequest={setEditingRequest}
        setIsAddProductModalOpen={setIsAddProductModalOpen}
        setFormStep={setFormStep}
        openEditPersonal={openEditPersonal}
        openEditSeller={openEditSeller}
        openEditOrganization={openEditOrganization}
        openUpgradeRole={openUpgradeRole}
        setAccountView={setAccountView}
      />

      {user.primaryRole === 'buyer' && (
        <MyBuyerRequestsSection
          user={user}
          setActiveTab={setActiveTab}
          setSelectedItem={setSelectedItem}
          setEditingListing={setEditingListing}
          setEditingRequest={setEditingRequest}
          setIsAddProductModalOpen={setIsAddProductModalOpen}
          setFormStep={setFormStep}
          onUpdateBuyerRequestStatus={onUpdateBuyerRequestStatus}
        />
      )}

      {user.primaryRole === 'buyer' && (
        <SavedItemsSection
          user={user}
          setSelectedItem={setSelectedItem}
        />
      )}

      {user.primaryRole === 'seller' && user.sellerProfile && (
        <SellerProfileCard
          user={user}
          openEditSeller={openEditSeller}
        />
      )}

      {(user.primaryRole === 'business' ||
        user.primaryRole === 'cooperative' ||
        user.primaryRole === 'ngo') &&
        user.organizationProfile && (
          <OrganizationProfileCard
            user={user}
            openEditOrganization={openEditOrganization}
            organizationTypeLabelMap={organizationTypeLabelMap}
          />
        )}

      <AccountActionsCard
        t={t}
        openSwitchRole={openSwitchRole}
        openUpgradeRole={openUpgradeRole}
        canSell={canSell}
        lang={lang}
        setLang={setLang}
        setShowTour={setShowTour}
        setUser={setUser}
      />

      {isAccountModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAccountModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {accountView === 'editPersonal' && 'Edit Personal Account'}
                  {accountView === 'editSeller' && 'Edit Seller Profile'}
                  {accountView === 'editOrganization' && 'Edit Organisation Profile'}
                  {accountView === 'switchRole' && 'Switch Primary Role'}
                  {accountView === 'selectUpgradeRole' && 'Upgrade Account'}
                  {accountView === 'upgradeRole' && 'Complete Role Upgrade'}
                </h3>
              </div>

              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto overscroll-contain flex-1">
              {accountView === 'editPersonal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.fullName')}</label>
                      <input 
                        type="text" 
                        value={profileFormData.name}
                        onChange={e => setProfileFormData({...profileFormData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Region</label>
                      <select 
                        value={profileFormData.region}
                        onChange={e => setProfileFormData({...profileFormData, region: e.target.value, district: ''})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none"
                      >
                        <option value="">Select Region</option>
                        {malawiRegions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">District</label>
                      <select 
                        value={profileFormData.district}
                        onChange={e => setProfileFormData({...profileFormData, district: e.target.value})}
                        disabled={!profileFormData.region}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none disabled:opacity-50"
                      >
                        <option value="">Select District</option>
                        {profileFormData.region && malawiDistrictsByRegion[profileFormData.region as keyof typeof malawiDistrictsByRegion]?.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Area / Market</label>
                      <input 
                        type="text" 
                        value={profileFormData.location}
                        onChange={e => setProfileFormData({...profileFormData, location: e.target.value})}
                        placeholder="e.g. Area 25, Limbe Market"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.phoneNumber')}</label>
                      <input 
                        type="tel" 
                        value={profileFormData.phone}
                        onChange={e => setProfileFormData({...profileFormData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.bio')}</label>
                      <textarea 
                        value={profileFormData.bio}
                        onChange={e => setProfileFormData({...profileFormData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setIsAccountModalOpen(false)}
                      className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
                    >
                      {t('common.cancel')}
                    </button>
                    <button 
                      onClick={handleProfileUpdate}
                      disabled={isSubmittingProfile}
                      className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingProfile ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {isSubmittingProfile ? 'Saving...' : t('common.save')}
                    </button>
                  </div>
                </div>
              )}

              {accountView === 'editSeller' && (
                <EditSellerProfileForm
                  sellerEditForm={sellerEditForm}
                  setSellerEditForm={setSellerEditForm}
                  handleSellerProfileUpdate={handleSellerProfileUpdate}
                  isSubmittingSellerProfile={isSubmittingSellerProfile}
                />
              )}

              {accountView === 'editOrganization' && (
                <EditOrganizationProfileForm
                  organizationEditForm={organizationEditForm}
                  setOrganizationEditForm={setOrganizationEditForm}
                  handleOrganizationProfileUpdate={handleOrganizationProfileUpdate}
                  isSubmittingOrganizationProfile={isSubmittingOrganizationProfile}
                />
              )}

              {accountView === 'switchRole' && (
                <PrimaryRoleForm
                  user={user}
                  selectedPrimaryRole={selectedPrimaryRole}
                  setSelectedPrimaryRole={setSelectedPrimaryRole}
                  handleSwitchPrimaryRole={handlePrimaryRoleSwitch}
                  isSubmittingRoleSwitch={isSubmittingRoleSwitch}
                  roleLabelMap={roleLabelMap}
                />
              )}

              {accountView === 'selectUpgradeRole' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSelectedRole('seller');
                      setAccountView('upgradeRole');
                    }}
                    className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Store className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-bold mb-1">Individual Seller</h4>
                    <p className="text-xs text-gray-500">Sell your own farm produce</p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRole('business');
                      setAccountView('upgradeRole');
                    }}
                    className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-bold mb-1">Agri-Business</h4>
                    <p className="text-xs text-gray-500">Registered company or shop</p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRole('cooperative');
                      setAccountView('upgradeRole');
                    }}
                    className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h4 className="font-bold mb-1">Cooperative</h4>
                    <p className="text-xs text-gray-500">Farmer group or association</p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRole('ngo');
                      setAccountView('upgradeRole');
                    }}
                    className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <HandHelping className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h4 className="font-bold mb-1">NGO / Agency</h4>
                    <p className="text-xs text-gray-500">Non-profit or government</p>
                  </button>
                </div>
              )}

              {accountView === 'upgradeRole' && (
                <RoleUpgradeForm
                  selectedRole={selectedRole}
                  sellerUpgradeForm={sellerUpgradeForm}
                  setSellerUpgradeForm={setSellerUpgradeForm}
                  businessUpgradeForm={businessUpgradeForm}
                  setBusinessUpgradeForm={setBusinessUpgradeForm}
                  cooperativeUpgradeForm={cooperativeUpgradeForm}
                  setCooperativeUpgradeForm={setCooperativeUpgradeForm}
                  ngoUpgradeForm={ngoUpgradeForm}
                  setNgoUpgradeForm={setNgoUpgradeForm}
                  handleRoleUpgrade={handleRoleUpgrade}
                  isSubmittingRole={isSubmittingRole}
                  malawiRegions={malawiRegions}
                  malawiDistrictsByRegion={malawiDistrictsByRegion}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
