import React from 'react';
import { motion } from 'motion/react';
import {
  UserCircle,
  Settings,
  X,
  User,
  Camera,
  LogOut,
  HelpCircle,
  MapPin,
  Save,
  Languages,
  Store,
  Building2,
  Users,
  HandHelping
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { User as UserType } from '../types';
import { malawiRegions, malawiDistrictsByRegion } from '../data/constants';

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

  const canSell =
    user.roles.includes('seller') ||
    user.roles.includes('business') ||
    user.roles.includes('cooperative') ||
    user.roles.includes('ngo');

  const organizationTypeLabelMap = {
    business: 'Business',
    cooperative: 'Cooperative',
    ngo: 'NGO',
  } as const;

  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = React.useState(false);
  const [isSubmittingSellerProfile, setIsSubmittingSellerProfile] = React.useState(false);
  const [isSubmittingOrganizationProfile, setIsSubmittingOrganizationProfile] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'seller' | 'business' | 'cooperative' | 'ngo' | null>(null);
  
  const [sellerUpgradeForm, setSellerUpgradeForm] = React.useState({
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

  const [businessUpgradeForm, setBusinessUpgradeForm] = React.useState({
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

  const [cooperativeUpgradeForm, setCooperativeUpgradeForm] = React.useState({
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

  const [ngoUpgradeForm, setNgoUpgradeForm] = React.useState({
    organizationName: '',
    contactPerson: user.name || '',
    phone: user.phone || '',
    district: '',
    address: '',
    organizationType: '',
    description: '',
  });

  const [isSubmittingRole, setIsSubmittingRole] = React.useState(false);

  const [isEditingSellerProfile, setIsEditingSellerProfile] = React.useState(false);
  const [isEditingOrganizationProfile, setIsEditingOrganizationProfile] = React.useState(false);

  React.useEffect(() => {
    if (isEditingSellerProfile && user.sellerProfile) {
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
  }, [isEditingSellerProfile, user.sellerProfile]);

  React.useEffect(() => {
    if (isEditingOrganizationProfile && user.organizationProfile) {
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
  }, [isEditingOrganizationProfile, user.organizationProfile]);

  const [isSwitchingPrimaryRole, setIsSwitchingPrimaryRole] = React.useState(false);
  const [selectedPrimaryRole, setSelectedPrimaryRole] = React.useState<UserType['primaryRole']>(user.primaryRole);

  const [sellerEditForm, setSellerEditForm] = React.useState({
    businessName: user.sellerProfile?.businessName || '',
    fullName: user.sellerProfile?.fullName || '',
    phone: user.sellerProfile?.phone || '',
    region: user.sellerProfile?.region || '',
    district: user.sellerProfile?.district || '',
    area: user.sellerProfile?.area || '',
    category: user.sellerProfile?.category || '',
    deliveryMethod: user.sellerProfile?.deliveryMethod || 'pickup',
    experienceYears: user.sellerProfile?.experienceYears || '',
    description: user.sellerProfile?.description || '',
  });

  const [organizationEditForm, setOrganizationEditForm] = React.useState({
    organizationName: user.organizationProfile?.organizationName || '',
    contactPerson: user.organizationProfile?.contactPerson || '',
    phone: user.organizationProfile?.phone || '',
    region: user.organizationProfile?.region || '',
    district: user.organizationProfile?.district || '',
    address: user.organizationProfile?.address || '',
    businessType: user.organizationProfile?.businessType || '',
    productsOrServices: user.organizationProfile?.productsOrServices || '',
    registrationNumber: user.organizationProfile?.registrationNumber || '',
    area: user.organizationProfile?.area || '',
    memberCount: user.organizationProfile?.memberCount || '',
    mainCommodities: user.organizationProfile?.mainCommodities || '',
    focusArea: user.organizationProfile?.focusArea || '',
    servicesOffered: user.organizationProfile?.servicesOffered || '',
    websiteOrSocial: user.organizationProfile?.websiteOrSocial || '',
    description: user.organizationProfile?.description || '',
  });

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
      setIsEditingProfile(false);
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
      setIsRoleModalOpen(false);
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
      setIsEditingSellerProfile(false);
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
      setIsEditingOrganizationProfile(false);
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
      setIsSwitchingPrimaryRole(false);
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
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-primary relative">
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition-all"
          >
            {isEditingProfile ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg bg-gray-100">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              {isEditingProfile && (
                <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                  <Camera className="w-8 h-8" />
                </button>
              )}
            </div>
            
            {!isEditingProfile && (
              <div className="flex gap-2 mb-2">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${statusBadgeClassMap[user.status]}`}
                >
                  {statusLabelMap[user.status]}
                </span>
              </div>
            )}
          </div>

          {isEditingProfile ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
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
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.bio')}</label>
                  <textarea 
                    value={profileFormData.bio}
                    onChange={e => setProfileFormData({...profileFormData, bio: e.target.value})}
                    rows={1}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsEditingProfile(false)}
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
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-1">{user?.name}</h2>
                <p className="text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> 
                  {user?.region && user?.district ? `${user.district}, ${user.region}` : user?.location}
                  {user?.region && user?.district && user?.location && ` (${user.location})`}
                </p>
              </div>

              {user?.bio && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('account.about')}</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">"{user.bio}"</p>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Account Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {roleLabelMap[user.primaryRole]}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold">
                      {statusLabelMap[user.status]}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Active Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <span>{roleLabelMap[role]}</span>
                          {user.primaryRole === role && (
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Main</span>
                          )}
                        </div>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedPrimaryRole(user.primaryRole);
                      setIsSwitchingPrimaryRole(true);
                    }}
                    className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Switch Primary Role
                  </button>
                </div>
              </div>

              {user.sellerProfile && (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold">Seller Profile</h4>
                      <p className="text-sm text-gray-500">Your seller account details.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.sellerProfile.verified
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {user.sellerProfile.verified ? 'Verified' : 'Not Verified'}
                      </span>

                      <button
                        onClick={() => {
                          setSellerEditForm({
                            businessName: user.sellerProfile?.businessName || '',
                            fullName: user.sellerProfile?.fullName || '',
                            phone: user.sellerProfile?.phone || '',
                            region: user.sellerProfile?.region || '',
                            district: user.sellerProfile?.district || '',
                            area: user.sellerProfile?.area || '',
                            category: user.sellerProfile?.category || '',
                            deliveryMethod: user.sellerProfile?.deliveryMethod || 'pickup',
                            experienceYears: user.sellerProfile?.experienceYears || '',
                            description: user.sellerProfile?.description || '',
                          });
                          setIsEditingSellerProfile(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Business Name</p>
                      <p className="font-semibold">{user.sellerProfile.businessName || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Seller Name</p>
                      <p className="font-semibold">{user.sellerProfile.fullName || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Phone</p>
                      <p className="font-semibold">{user.sellerProfile.phone || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Region</p>
                      <p className="font-semibold">{user.sellerProfile.region || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">District</p>
                      <p className="font-semibold">{user.sellerProfile.district || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Area / Market</p>
                      <p className="font-semibold">{user.sellerProfile.area || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Category</p>
                      <p className="font-semibold">{user.sellerProfile.category || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Delivery Method</p>
                      <p className="font-semibold capitalize">{user.sellerProfile.deliveryMethod || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Experience</p>
                      <p className="font-semibold">{user.sellerProfile.experienceYears || '0'} Years</p>
                    </div>

                    <div className="col-span-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</p>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{user.sellerProfile.description || 'No description provided.'}</p>
                    </div>
                  </div>
                </div>
              )}

              {user.organizationProfile && (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold">Organisation Profile</h4>
                      <p className="text-sm text-gray-500">Your registered organisation details.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.organizationProfile.verified
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {user.organizationProfile.verified ? 'Verified' : 'Not Verified'}
                      </span>

                      <button
                        onClick={() => {
                          setOrganizationEditForm({
                            organizationName: user.organizationProfile?.organizationName || '',
                            contactPerson: user.organizationProfile?.contactPerson || '',
                            phone: user.organizationProfile?.phone || '',
                            region: user.organizationProfile?.region || '',
                            district: user.organizationProfile?.district || '',
                            address: user.organizationProfile?.address || '',
                            businessType: user.organizationProfile?.businessType || '',
                            productsOrServices: user.organizationProfile?.productsOrServices || '',
                            registrationNumber: user.organizationProfile?.registrationNumber || '',
                            area: user.organizationProfile?.area || '',
                            memberCount: user.organizationProfile?.memberCount || '',
                            mainCommodities: user.organizationProfile?.mainCommodities || '',
                            focusArea: user.organizationProfile?.focusArea || '',
                            servicesOffered: user.organizationProfile?.servicesOffered || '',
                            websiteOrSocial: user.organizationProfile?.websiteOrSocial || '',
                            description: user.organizationProfile?.description || '',
                          });
                          setIsEditingOrganizationProfile(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Type</p>
                      <p className="font-semibold">
                        {organizationTypeLabelMap[user.organizationProfile.type as keyof typeof organizationTypeLabelMap]}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Organisation Name</p>
                      <p className="font-semibold">{user.organizationProfile.organizationName || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Contact Person</p>
                      <p className="font-semibold">{user.organizationProfile.contactPerson || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Phone</p>
                      <p className="font-semibold">{user.organizationProfile.phone || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Region</p>
                      <p className="font-semibold">{user.organizationProfile.region || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">District</p>
                      <p className="font-semibold">{user.organizationProfile.district || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Reg Number</p>
                      <p className="font-semibold">{user.organizationProfile.registrationNumber || '—'}</p>
                    </div>

                    {user.organizationProfile.type === 'business' && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Address</p>
                          <p className="font-semibold">{user.organizationProfile.address || '—'}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Business Type</p>
                          <p className="font-semibold">{user.organizationProfile.businessType || '—'}</p>
                        </div>
                        <div className="col-span-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Products/Services</p>
                          <p className="font-semibold">{user.organizationProfile.productsOrServices || '—'}</p>
                        </div>
                      </>
                    )}

                    {user.organizationProfile.type === 'cooperative' && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Area</p>
                          <p className="font-semibold">{user.organizationProfile.area || '—'}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Members</p>
                          <p className="font-semibold">{user.organizationProfile.memberCount || '—'}</p>
                        </div>
                        <div className="col-span-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Main Commodities</p>
                          <p className="font-semibold">{user.organizationProfile.mainCommodities || '—'}</p>
                        </div>
                      </>
                    )}

                    {user.organizationProfile.type === 'ngo' && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Focus Area</p>
                          <p className="font-semibold">{user.organizationProfile.focusArea || '—'}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Website/Social</p>
                          <p className="font-semibold">{user.organizationProfile.websiteOrSocial || '—'}</p>
                        </div>
                        <div className="col-span-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Services Offered</p>
                          <p className="font-semibold">{user.organizationProfile.servicesOffered || '—'}</p>
                        </div>
                      </>
                    )}

                    <div className="col-span-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</p>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">"{user.organizationProfile.description || 'No description provided.'}"</p>
                    </div>
                  </div>

                </div>
              )}

              <div className="pt-2">
                <button
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
                  onClick={() => setIsRoleModalOpen(true)}
                >
                  {canSell ? 'Add Another Role' : 'Become a Seller or Organisation'}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-3">
                <button
                  onClick={() => setShowTour(true)}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all gap-2"
                >
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('account.help')}</span>
                </button>

                <button
                  onClick={() => setLang(lang === 'en' ? 'ny' : 'en')}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all gap-2"
                >
                  <Languages className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{lang === 'en' ? 'Chichewa' : 'English'}</span>
                </button>

                <button
                  onClick={async () => {
                    try {
                      await auth.signOut();
                      setUser(null);
                      toast.success(t('account.loggedOut'));
                    } catch (error: any) {
                      toast.error(error.message);
                    }
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t('account.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Upgrade Modal */}
        {isRoleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Upgrade Account</h3>
                  <p className="text-sm text-gray-500">Access more features by adding a new role.</p>
                </div>
                <button
                  onClick={() => {
                    setIsRoleModalOpen(false);
                    setSelectedRole(null);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {!selectedRole ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedRole('seller')}
                      className="p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Store className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-lg mb-1">Individual Seller</h4>
                      <p className="text-sm text-gray-500">Sell your products directly to buyers.</p>
                    </button>

                    <button
                      onClick={() => setSelectedRole('business')}
                      className="p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-lg mb-1">Business</h4>
                      <p className="text-sm text-gray-500">Register your company or shop.</p>
                    </button>

                    <button
                      onClick={() => setSelectedRole('cooperative')}
                      className="p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-lg mb-1">Cooperative</h4>
                      <p className="text-sm text-gray-500">Manage a group of farmers or producers.</p>
                    </button>

                    <button
                      onClick={() => setSelectedRole('ngo')}
                      className="p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <HandHelping className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-lg mb-1">NGO</h4>
                      <p className="text-sm text-gray-500">Provide services and support to the community.</p>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
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

                    {/* Business Upgrade Form */}
                    {selectedRole === 'business' && (
                    <>
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
                    </>
                  )}

                    {/* Cooperative Upgrade Form */}
                    {selectedRole === 'cooperative' && (
                    <>
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
                    </>
                  )}

                    {/* NGO Upgrade Form */}
                    {selectedRole === 'ngo' && (
                    <>
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
                    </>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setSelectedRole(null)}
                      className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRoleUpgrade}
                      disabled={isSubmittingRole}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isSubmittingRole ? 'Saving...' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

        {/* Role Switch Modal */}
        {isSwitchingPrimaryRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold">Switch Primary Role</h3>
                <button
                  onClick={() => setIsSwitchingPrimaryRole(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Select which role you want to use as your primary identity on the platform.
                </p>
                {user?.roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedPrimaryRole(role as any)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      selectedPrimaryRole === role
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        role === 'buyer' ? 'bg-blue-100 text-blue-600' :
                        role === 'seller' ? 'bg-primary/10 text-primary' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {role === 'buyer' ? <User className="w-5 h-5" /> :
                         role === 'seller' ? <Store className="w-5 h-5" /> :
                         <Building2 className="w-5 h-5" />}
                      </div>
                      <span className="font-bold capitalize">{role}</span>
                    </div>
                    {selectedPrimaryRole === role && (
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <Save className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => setIsSwitchingPrimaryRole(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrimaryRoleSwitch}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Switch Role
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Seller Edit Modal */}
        {isEditingSellerProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsEditingSellerProfile(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Edit Seller Profile</h3>
                <button 
                  onClick={() => setIsEditingSellerProfile(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
                  <input
                    type="text"
                    placeholder="Business name"
                    value={sellerEditForm.businessName}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, businessName: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={sellerEditForm.fullName}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, fullName: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={sellerEditForm.phone}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, phone: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Region</label>
                    <select
                      value={sellerEditForm.region}
                      onChange={(e) => setSellerEditForm({ ...sellerEditForm, region: e.target.value, district: '' })}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none appearance-none"
                    >
                      <option value="">Select Region</option>
                      {malawiRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                    <select
                      value={sellerEditForm.district}
                      onChange={(e) => setSellerEditForm({ ...sellerEditForm, district: e.target.value })}
                      disabled={!sellerEditForm.region}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none appearance-none disabled:opacity-50"
                    >
                      <option value="">Select District</option>
                      {sellerEditForm.region && malawiDistrictsByRegion[sellerEditForm.region as keyof typeof malawiDistrictsByRegion]?.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Area</label>
                  <input
                    type="text"
                    placeholder="Area/Location"
                    value={sellerEditForm.area}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, area: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <select
                    value={sellerEditForm.category}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, category: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Trader">Trader</option>
                    <option value="Processor">Processor</option>
                    <option value="Input Supplier">Input Supplier</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                  <input
                    type="number"
                    placeholder="Years of experience"
                    value={sellerEditForm.experienceYears}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, experienceYears: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Method</label>
                  <select
                    value={sellerEditForm.deliveryMethod}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, deliveryMethod: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  >
                    <option value="pickup">Pickup Only</option>
                    <option value="delivery">Delivery Available</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    placeholder="Tell us about your business..."
                    value={sellerEditForm.description}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSellerProfileUpdate}
                  disabled={isSubmittingSellerProfile}
                  className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingSellerProfile ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSubmittingSellerProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Organization Edit Modal */}
        {isEditingOrganizationProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsEditingOrganizationProfile(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Edit Organisation Profile</h3>
                <button 
                  onClick={() => setIsEditingOrganizationProfile(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Organisation Name</label>
                  <input
                    type="text"
                    placeholder="Organisation name"
                    value={organizationEditForm.organizationName}
                    onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, organizationName: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Contact person"
                    value={organizationEditForm.contactPerson}
                    onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, contactPerson: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={organizationEditForm.phone}
                    onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, phone: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="Registration number"
                    value={organizationEditForm.registrationNumber}
                    onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, registrationNumber: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                {user?.organizationProfile?.type === 'business' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Business Type</label>
                      <input
                        type="text"
                        placeholder="e.g. Retail, Wholesale"
                        value={organizationEditForm.businessType}
                        onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, businessType: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Products/Services</label>
                      <input
                        type="text"
                        placeholder="Products or services"
                        value={organizationEditForm.productsOrServices}
                        onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, productsOrServices: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                  </>
                )}

                {user?.organizationProfile?.type === 'cooperative' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Member Count</label>
                      <input
                        type="number"
                        placeholder="Number of members"
                        value={organizationEditForm.memberCount}
                        onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, memberCount: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Main Commodities</label>
                      <input
                        type="text"
                        placeholder="e.g. Maize, Tobacco"
                        value={organizationEditForm.mainCommodities}
                        onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, mainCommodities: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                  </>
                )}

                {user?.organizationProfile?.type === 'ngo' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Focus Area</label>
                      <input
                        type="text"
                        placeholder="e.g. Food Security"
                        value={organizationEditForm.focusArea}
                        onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, focusArea: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Services Offered</label>
                      <input
                        type="text"
                        placeholder="e.g. Training, Inputs"
                        value={organizationEditForm.servicesOffered}
                        onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, servicesOffered: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Region</label>
                    <select
                      value={organizationEditForm.region}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, region: e.target.value, district: '' })}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none appearance-none"
                    >
                      <option value="">Select Region</option>
                      {malawiRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                    <select
                      value={organizationEditForm.district}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, district: e.target.value })}
                      disabled={!organizationEditForm.region}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none appearance-none disabled:opacity-50"
                    >
                      <option value="">Select District</option>
                      {organizationEditForm.region && malawiDistrictsByRegion[organizationEditForm.region as keyof typeof malawiDistrictsByRegion]?.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Area</label>
                  <input
                    type="text"
                    placeholder="Area/Location"
                    value={organizationEditForm.area}
                    onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, area: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    placeholder="Tell us about your organisation..."
                    value={organizationEditForm.description}
                    onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleOrganizationProfileUpdate}
                  disabled={isSubmittingOrganizationProfile}
                  className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingOrganizationProfile ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSubmittingOrganizationProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
