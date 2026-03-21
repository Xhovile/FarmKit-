import React from 'react';
import { motion } from 'motion/react';
import {
  UserCircle,
  X,
  Store,
  Building2,
  Users,
  HandHelping,
  Save
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { User as UserType } from '../types';
import { malawiRegions, malawiDistrictsByRegion } from '../data/constants';
import AccountHeader from '../components/account/AccountHeader';
import AccountTypeCard from '../components/account/AccountTypeCard';
import PersonalAccountCard from '../components/account/PersonalAccountCard';
import SellerProfileCard from '../components/account/SellerProfileCard';
import OrganizationProfileCard from '../components/account/OrganizationProfileCard';
import AccountActionsCard from '../components/account/AccountActionsCard';
import RoleUpgradeModal from '../components/account/RoleUpgradeModal';
import PrimaryRoleModal from '../components/account/PrimaryRoleModal';
import EditSellerProfileModal from '../components/account/EditSellerProfileModal';
import EditOrganizationProfileModal from '../components/account/EditOrganizationProfileModal';

interface AccountPageProps {
  t: (key: string) => string;
  lang: 'en' | 'ny';
  setLang: (lang: 'en' | 'ny') => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  profileFormData: any;
  setProfileFormData: (val: any) => void;
  setIsAuthModalOpen: (val: boolean) => void;
  setShowTour: (val: boolean) => void;
}

type AccountView =
  | 'hub'
  | 'editPersonal'
  | 'editSeller'
  | 'editOrganization'
  | 'switchRole'
  | 'upgradeRole'
  | 'selectUpgradeRole';

export const AccountPage: React.FC<AccountPageProps> = ({
  t,
  lang,
  setLang,
  user,
  setUser,
  isEditingProfile,
  setIsEditingProfile,
  profileFormData,
  setProfileFormData,
  setIsAuthModalOpen,
  setShowTour
}) => {
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

  const canSell = user ? (
    user.roles.includes('seller') ||
    user.roles.includes('business') ||
    user.roles.includes('cooperative') ||
    user.roles.includes('ngo')
  ) : false;

  const organizationTypeLabelMap = {
    business: 'Business',
    cooperative: 'Cooperative',
    ngo: 'NGO',
  } as const;

  const [accountView, setAccountView] = React.useState<AccountView>('hub');
  const [isAccountModalOpen, setIsAccountModalOpen] = React.useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = React.useState(false);
  const [isSubmittingSellerProfile, setIsSubmittingSellerProfile] = React.useState(false);
  const [isSubmittingOrganizationProfile, setIsSubmittingOrganizationProfile] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'seller' | 'business' | 'cooperative' | 'ngo' | null>(null);
  
  const [sellerUpgradeForm, setSellerUpgradeForm] = React.useState({
    businessName: '',
    fullName: user?.name || '',
    phone: user?.phone || '',
    region: '',
    district: '',
    area: '',
    category: '',
    deliveryMethod: 'pickup',
    experienceYears: '',
    description: '',
  });

  const [businessUpgradeForm, setBusinessUpgradeForm] = React.useState({
    organizationName: '',
    contactPerson: user?.name || '',
    phone: user?.phone || '',
    district: '',
    address: '',
    businessType: '',
    productsOrServices: '',
    registrationNumber: '',
    description: '',
  });

  const [cooperativeUpgradeForm, setCooperativeUpgradeForm] = React.useState({
    organizationName: '',
    contactPerson: user?.name || '',
    phone: user?.phone || '',
    district: '',
    area: '',
    memberCount: '',
    mainCommodities: '',
    registrationNumber: '',
    description: '',
  });

  const [ngoUpgradeForm, setNgoUpgradeForm] = React.useState({
    organizationName: '',
    contactPerson: user?.name || '',
    phone: user?.phone || '',
    district: '',
    address: '',
    organizationType: '',
    description: '',
  });

  const [isSubmittingRole, setIsSubmittingRole] = React.useState(false);

  const [selectedPrimaryRole, setSelectedPrimaryRole] = React.useState<UserType['primaryRole']>(user?.primaryRole || 'buyer');

  const [sellerEditForm, setSellerEditForm] = React.useState({
    businessName: user?.sellerProfile?.businessName || '',
    fullName: user?.sellerProfile?.fullName || '',
    phone: user?.sellerProfile?.phone || '',
    region: user?.sellerProfile?.region || '',
    district: user?.sellerProfile?.district || '',
    area: user?.sellerProfile?.area || '',
    category: user?.sellerProfile?.category || '',
    deliveryMethod: user?.sellerProfile?.deliveryMethod || 'pickup',
    experienceYears: user?.sellerProfile?.experienceYears || '',
    description: user?.sellerProfile?.description || '',
  });

  const [organizationEditForm, setOrganizationEditForm] = React.useState({
    organizationName: user?.organizationProfile?.organizationName || '',
    contactPerson: user?.organizationProfile?.contactPerson || '',
    phone: user?.organizationProfile?.phone || '',
    region: user?.organizationProfile?.region || '',
    district: user?.organizationProfile?.district || '',
    address: user?.organizationProfile?.address || '',
    businessType: user?.organizationProfile?.businessType || '',
    productsOrServices: user?.organizationProfile?.productsOrServices || '',
    registrationNumber: user?.organizationProfile?.registrationNumber || '',
    area: user?.organizationProfile?.area || '',
    memberCount: user?.organizationProfile?.memberCount || '',
    mainCommodities: user?.organizationProfile?.mainCommodities || '',
    focusArea: user?.organizationProfile?.focusArea || '',
    servicesOffered: user?.organizationProfile?.servicesOffered || '',
    websiteOrSocial: user?.organizationProfile?.websiteOrSocial || '',
    description: user?.organizationProfile?.description || '',
  });

  React.useEffect(() => {
    if (accountView === 'editSeller' && user?.sellerProfile) {
      setSellerEditForm({
        businessName: user.sellerProfile.businessName || '',
        fullName: user.sellerProfile.fullName || '',
        phone: user.sellerProfile.phone || '',
        region: user.sellerProfile.region || '',
        district: user.sellerProfile.district || '',
        area: user.sellerProfile.area || '',
        category: user.sellerProfile.category || '',
        deliveryMethod: user.sellerProfile.deliveryMethod || 'pickup',
        experienceYears: user.sellerProfile.experienceYears || '',
        description: user.sellerProfile.description || '',
      });
    }
  }, [accountView, user?.sellerProfile]);

  React.useEffect(() => {
    if (accountView === 'editOrganization' && user?.organizationProfile) {
      setOrganizationEditForm({
        organizationName: user.organizationProfile.organizationName || '',
        contactPerson: user.organizationProfile.contactPerson || '',
        phone: user.organizationProfile.phone || '',
        region: user.organizationProfile.region || '',
        district: user.organizationProfile.district || '',
        address: user.organizationProfile.address || '',
        businessType: user.organizationProfile.businessType || '',
        productsOrServices: user.organizationProfile.productsOrServices || '',
        registrationNumber: user.organizationProfile.registrationNumber || '',
        area: user.organizationProfile.area || '',
        memberCount: user.organizationProfile.memberCount || '',
        mainCommodities: user.organizationProfile.mainCommodities || '',
        focusArea: user.organizationProfile.focusArea || '',
        servicesOffered: user.organizationProfile.servicesOffered || '',
        websiteOrSocial: user.organizationProfile.websiteOrSocial || '',
        description: user.organizationProfile.description || '',
      });
    }
  }, [accountView, user?.organizationProfile]);

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

  const handleProfileUpdate = async () => {
    if (!user) return;

    if (!profileFormData.name.trim()) {
      toast.error('Name is required.');
      return;
    }

    if (!profileFormData.region || !profileFormData.district) {
      toast.error('Region and District are required.');
      return;
    }

    if (!profileFormData.phone.trim() || !/^\+?[0-9]{10,15}$/.test(profileFormData.phone.trim())) {
      toast.error('Please enter a valid phone number (10-15 digits).');
      return;
    }

    setIsSubmittingProfile(true);
    try {
      const updatedData = {
        name: profileFormData.name.trim(),
        region: profileFormData.region,
        district: profileFormData.district,
        location: profileFormData.location.trim(),
        phone: profileFormData.phone.trim(),
        bio: profileFormData.bio.trim()
      };

      await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });
      setUser({ ...user, ...updatedData });
      setIsAccountModalOpen(false);
      setAccountView('hub');
      toast.success(t('account.profileUpdated'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleRoleUpgrade = async () => {
    if (!user || !selectedRole) return;

    const nextRoles = Array.from(new Set([...user.roles, selectedRole]));
    const nextPrimaryRole = user.primaryRole === 'buyer' ? selectedRole : user.primaryRole;

    const updatePayload: any = {
      roles: nextRoles,
      primaryRole: nextPrimaryRole,
    };

    if (selectedRole === 'seller') {
      if (
        !sellerUpgradeForm.businessName.trim() ||
        !sellerUpgradeForm.fullName.trim() ||
        !sellerUpgradeForm.phone.trim() ||
        !sellerUpgradeForm.region.trim() ||
        !sellerUpgradeForm.district.trim() ||
        !sellerUpgradeForm.area.trim() ||
        !sellerUpgradeForm.category.trim() ||
        !sellerUpgradeForm.experienceYears.trim() ||
        !sellerUpgradeForm.description.trim()
      ) {
        toast.error('Please complete all seller upgrade fields.');
        return;
      }

      if (!/^\+?[0-9]{10,15}$/.test(sellerUpgradeForm.phone.trim())) {
        toast.error('Please enter a valid phone number (10-15 digits).');
        return;
      }

      updatePayload.sellerProfile = {
        type: 'individual_seller',
        businessName: sellerUpgradeForm.businessName.trim(),
        category: sellerUpgradeForm.category.trim(),
        region: sellerUpgradeForm.region.trim(),
        district: sellerUpgradeForm.district.trim(),
        deliveryMethod: sellerUpgradeForm.deliveryMethod,
        verified: false,
        fullName: sellerUpgradeForm.fullName.trim(),
        phone: sellerUpgradeForm.phone.trim(),
        area: sellerUpgradeForm.area.trim(),
        experienceYears: sellerUpgradeForm.experienceYears.trim(),
        description: sellerUpgradeForm.description.trim(),
      };
    }

    if (selectedRole === 'business') {
      if (
        !businessUpgradeForm.organizationName.trim() ||
        !businessUpgradeForm.contactPerson.trim() ||
        !businessUpgradeForm.phone.trim() ||
        !businessUpgradeForm.district.trim() ||
        !businessUpgradeForm.address.trim() ||
        !businessUpgradeForm.businessType.trim() ||
        !businessUpgradeForm.productsOrServices.trim() ||
        !businessUpgradeForm.description.trim()
      ) {
        toast.error('Please complete all business upgrade fields.');
        return;
      }

      if (!/^\+?[0-9]{10,15}$/.test(businessUpgradeForm.phone.trim())) {
        toast.error('Please enter a valid phone number (10-15 digits).');
        return;
      }

      updatePayload.organizationProfile = {
        type: 'business',
        organizationName: businessUpgradeForm.organizationName.trim(),
        contactPerson: businessUpgradeForm.contactPerson.trim(),
        phone: businessUpgradeForm.phone.trim(),
        district: businessUpgradeForm.district.trim(),
        address: businessUpgradeForm.address.trim(),
        businessType: businessUpgradeForm.businessType.trim(),
        productsOrServices: businessUpgradeForm.productsOrServices.trim(),
        registrationNumber: businessUpgradeForm.registrationNumber.trim(),
        description: businessUpgradeForm.description.trim(),
        verified: false,
      };
    }

    if (selectedRole === 'cooperative') {
      if (
        !cooperativeUpgradeForm.organizationName.trim() ||
        !cooperativeUpgradeForm.contactPerson.trim() ||
        !cooperativeUpgradeForm.phone.trim() ||
        !cooperativeUpgradeForm.district.trim() ||
        !cooperativeUpgradeForm.area.trim() ||
        !cooperativeUpgradeForm.memberCount.trim() ||
        !cooperativeUpgradeForm.mainCommodities.trim() ||
        !cooperativeUpgradeForm.description.trim()
      ) {
        toast.error('Please complete all cooperative upgrade fields.');
        return;
      }

      if (!/^\+?[0-9]{10,15}$/.test(cooperativeUpgradeForm.phone.trim())) {
        toast.error('Please enter a valid phone number (10-15 digits).');
        return;
      }

      updatePayload.organizationProfile = {
        type: 'cooperative',
        organizationName: cooperativeUpgradeForm.organizationName.trim(),
        contactPerson: cooperativeUpgradeForm.contactPerson.trim(),
        phone: cooperativeUpgradeForm.phone.trim(),
        district: cooperativeUpgradeForm.district.trim(),
        area: cooperativeUpgradeForm.area.trim(),
        memberCount: cooperativeUpgradeForm.memberCount.trim(),
        mainCommodities: cooperativeUpgradeForm.mainCommodities.trim(),
        registrationNumber: cooperativeUpgradeForm.registrationNumber.trim(),
        description: cooperativeUpgradeForm.description.trim(),
        verified: false,
      };
    }

    if (selectedRole === 'ngo') {
      if (
        !ngoUpgradeForm.organizationName.trim() ||
        !ngoUpgradeForm.contactPerson.trim() ||
        !ngoUpgradeForm.phone.trim() ||
        !ngoUpgradeForm.district.trim() ||
        !ngoUpgradeForm.address.trim() ||
        !ngoUpgradeForm.organizationType.trim() ||
        !ngoUpgradeForm.description.trim()
      ) {
        toast.error('Please complete all NGO upgrade fields.');
        return;
      }

      if (!/^\+?[0-9]{10,15}$/.test(ngoUpgradeForm.phone.trim())) {
        toast.error('Please enter a valid phone number (10-15 digits).');
        return;
      }

      updatePayload.organizationProfile = {
        type: 'ngo',
        organizationName: ngoUpgradeForm.organizationName.trim(),
        contactPerson: ngoUpgradeForm.contactPerson.trim(),
        phone: ngoUpgradeForm.phone.trim(),
        district: ngoUpgradeForm.district.trim(),
        address: ngoUpgradeForm.address.trim(),
        organizationType: ngoUpgradeForm.organizationType.trim(),
        description: ngoUpgradeForm.description.trim(),
        verified: false,
      };
    }

    setIsSubmittingRole(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), updatePayload);

      setUser({
        ...user,
        roles: nextRoles,
        primaryRole: nextPrimaryRole,
        sellerProfile: updatePayload.sellerProfile ?? user.sellerProfile,
        organizationProfile: updatePayload.organizationProfile ?? user.organizationProfile,
      });

      toast.success('Account upgraded successfully.');
      setIsAccountModalOpen(false);
      setAccountView('hub');
      setSelectedRole(null);

      setSellerUpgradeForm({
        businessName: '',
        fullName: user.name || '',
        phone: user.phone || '',
        region: '',
        district: '',
        area: '',
        category: '',
        deliveryMethod: 'pickup',
        experienceYears: '',
        description: '',
      });

      setBusinessUpgradeForm({
        organizationName: '',
        contactPerson: user.name || '',
        phone: user.phone || '',
        district: '',
        address: '',
        businessType: '',
        productsOrServices: '',
        registrationNumber: '',
        description: '',
      });

      setCooperativeUpgradeForm({
        organizationName: '',
        contactPerson: user.name || '',
        phone: user.phone || '',
        district: '',
        area: '',
        memberCount: '',
        mainCommodities: '',
        registrationNumber: '',
        description: '',
      });

      setNgoUpgradeForm({
        organizationName: '',
        contactPerson: user.name || '',
        phone: user.phone || '',
        district: '',
        address: '',
        organizationType: '',
        description: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to upgrade account.');
    } finally {
      setIsSubmittingRole(false);
    }
  };

  const handleSellerProfileUpdate = async () => {
    if (!user || !user.sellerProfile) return;

    if (
      !sellerEditForm.businessName.trim() ||
      !sellerEditForm.fullName.trim() ||
      !sellerEditForm.phone.trim() ||
      !sellerEditForm.region.trim() ||
      !sellerEditForm.district.trim() ||
      !sellerEditForm.area.trim() ||
      !sellerEditForm.category.trim() ||
      !sellerEditForm.experienceYears.trim() ||
      !sellerEditForm.description.trim()
    ) {
      toast.error('Please complete all seller profile fields.');
      return;
    }

    if (!/^\+?[0-9]{10,15}$/.test(sellerEditForm.phone.trim())) {
      toast.error('Please enter a valid phone number (10-15 digits).');
      return;
    }

    setIsSubmittingSellerProfile(true);
    try {
      const updatedSellerProfile = {
        ...user.sellerProfile,
        businessName: sellerEditForm.businessName.trim(),
        fullName: sellerEditForm.fullName.trim(),
        phone: sellerEditForm.phone.trim(),
        region: sellerEditForm.region.trim(),
        district: sellerEditForm.district.trim(),
        area: sellerEditForm.area.trim(),
        category: sellerEditForm.category.trim(),
        deliveryMethod: sellerEditForm.deliveryMethod,
        experienceYears: sellerEditForm.experienceYears.trim(),
        description: sellerEditForm.description.trim(),
      };

      await updateDoc(doc(db, 'users', user.uid), {
        sellerProfile: updatedSellerProfile,
      });

      setUser({
        ...user,
        sellerProfile: updatedSellerProfile,
      });

      toast.success('Seller profile updated.');
      setIsAccountModalOpen(false);
      setAccountView('hub');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update seller profile.');
    } finally {
      setIsSubmittingSellerProfile(false);
    }
  };

  const handleOrganizationProfileUpdate = async () => {
    if (!user || !user.organizationProfile) return;

    const { type } = user.organizationProfile;

    // Core validation
    if (
      !organizationEditForm.organizationName.trim() ||
      !organizationEditForm.contactPerson.trim() ||
      !organizationEditForm.phone.trim() ||
      !organizationEditForm.region.trim() ||
      !organizationEditForm.district.trim() ||
      !organizationEditForm.description.trim()
    ) {
      toast.error('Please complete all core profile fields.');
      return;
    }

    if (!/^\+?[0-9]{10,15}$/.test(organizationEditForm.phone.trim())) {
      toast.error('Please enter a valid phone number (10-15 digits).');
      return;
    }

    // Type-specific validation
    if (type === 'business') {
      if (!organizationEditForm.address.trim() || !organizationEditForm.businessType.trim() || !organizationEditForm.productsOrServices.trim() || !organizationEditForm.registrationNumber.trim()) {
        toast.error('Please complete all business fields.');
        return;
      }
    } else if (type === 'cooperative') {
      if (!organizationEditForm.area.trim() || !organizationEditForm.memberCount.trim() || !organizationEditForm.mainCommodities.trim() || !organizationEditForm.registrationNumber.trim()) {
        toast.error('Please complete all cooperative fields.');
        return;
      }
    } else if (type === 'ngo') {
      if (!organizationEditForm.focusArea.trim() || !organizationEditForm.servicesOffered.trim() || !organizationEditForm.registrationNumber.trim()) {
        toast.error('Please complete all NGO fields.');
        return;
      }
    }

    setIsSubmittingOrganizationProfile(true);
    try {
      const updatedOrganizationProfile = {
        ...user.organizationProfile,
        organizationName: organizationEditForm.organizationName.trim(),
        contactPerson: organizationEditForm.contactPerson.trim(),
        phone: organizationEditForm.phone.trim(),
        region: organizationEditForm.region.trim(),
        district: organizationEditForm.district.trim(),
        address: organizationEditForm.address.trim(),
        businessType: organizationEditForm.businessType.trim(),
        productsOrServices: organizationEditForm.productsOrServices.trim(),
        registrationNumber: organizationEditForm.registrationNumber.trim(),
        area: organizationEditForm.area.trim(),
        memberCount: organizationEditForm.memberCount.trim(),
        mainCommodities: organizationEditForm.mainCommodities.trim(),
        focusArea: organizationEditForm.focusArea.trim(),
        servicesOffered: organizationEditForm.servicesOffered.trim(),
        websiteOrSocial: organizationEditForm.websiteOrSocial.trim(),
        description: organizationEditForm.description.trim(),
      };

      await updateDoc(doc(db, 'users', user.uid), {
        organizationProfile: updatedOrganizationProfile,
      });

      setUser({
        ...user,
        organizationProfile: updatedOrganizationProfile,
      });

      toast.success('Organisation profile updated.');
      setIsAccountModalOpen(false);
      setAccountView('hub');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update organisation profile.');
    } finally {
      setIsSubmittingOrganizationProfile(false);
    }
  };

  const handlePrimaryRoleSwitch = async () => {
    if (!user) return;

    if (!user.roles.includes(selectedPrimaryRole)) {
      toast.error('You can only switch to a role already on your account.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        primaryRole: selectedPrimaryRole,
      });

      setUser({
        ...user,
        primaryRole: selectedPrimaryRole,
      });

      toast.success('Primary role updated.');
      setIsAccountModalOpen(false);
      setAccountView('hub');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update primary role.');
    }
  };

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
        setIsAccountModalOpen={setIsAccountModalOpen}
        setAccountView={setAccountView}
        statusBadgeClassMap={statusBadgeClassMap}
        statusLabelMap={statusLabelMap}
      />

      <AccountTypeCard
        user={user}
        roleLabelMap={roleLabelMap}
        statusLabelMap={statusLabelMap}
      />

      {user.sellerProfile && (
        <SellerProfileCard
          user={user}
          setIsAccountModalOpen={setIsAccountModalOpen}
          setAccountView={setAccountView}
        />
      )}

      {user.organizationProfile && (
        <OrganizationProfileCard
          user={user}
          setIsAccountModalOpen={setIsAccountModalOpen}
          setAccountView={setAccountView}
          organizationTypeLabelMap={organizationTypeLabelMap}
        />
      )}

      <AccountActionsCard
        user={user}
        t={t}
        setIsAccountModalOpen={setIsAccountModalOpen}
        setAccountView={setAccountView}
        setSelectedPrimaryRole={setSelectedPrimaryRole}
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
                <EditSellerProfileModal
                  sellerEditForm={sellerEditForm}
                  setSellerEditForm={setSellerEditForm}
                  handleSellerProfileUpdate={handleSellerProfileUpdate}
                  isSubmittingSellerProfile={isSubmittingSellerProfile}
                />
              )}

              {accountView === 'editOrganization' && (
                <EditOrganizationProfileModal
                  organizationEditForm={organizationEditForm}
                  setOrganizationEditForm={setOrganizationEditForm}
                  handleOrganizationProfileUpdate={handleOrganizationProfileUpdate}
                  isSubmittingOrganizationProfile={isSubmittingOrganizationProfile}
                />
              )}

              {accountView === 'switchRole' && (
                <PrimaryRoleModal
                  user={user}
                  selectedPrimaryRole={selectedPrimaryRole}
                  setSelectedPrimaryRole={setSelectedPrimaryRole}
                  handleSwitchPrimaryRole={handlePrimaryRoleSwitch}
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
                    <h4 className="font-bold mb-1">Agro-Business</h4>
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
                <RoleUpgradeModal
                  selectedRole={selectedRole}
                  setSelectedRole={setSelectedRole}
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
                  user={user}
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
