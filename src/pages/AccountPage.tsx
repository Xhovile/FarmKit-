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
  const [selectedRole, setSelectedRole] = React.useState<'seller' | 'business' | 'cooperative' | 'ngo' | null>(null);
  
  const [sellerUpgradeForm, setSellerUpgradeForm] = React.useState({
    businessName: '',
    fullName: user.name || '',
    phone: user.phone || '',
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
    focusArea: '',
    servicesOffered: '',
    registrationNumber: '',
    websiteOrSocial: '',
    description: '',
  });

  const [isSubmittingRole, setIsSubmittingRole] = React.useState(false);

  const [isEditingSellerProfile, setIsEditingSellerProfile] = React.useState(false);
  const [isEditingOrganizationProfile, setIsEditingOrganizationProfile] = React.useState(false);

  const [isSwitchingPrimaryRole, setIsSwitchingPrimaryRole] = React.useState(false);
  const [selectedPrimaryRole, setSelectedPrimaryRole] = React.useState<UserType['primaryRole']>(user.primaryRole);

  const [sellerEditForm, setSellerEditForm] = React.useState({
    businessName: user.sellerProfile?.businessName || '',
    fullName: user.sellerProfile?.fullName || '',
    phone: user.sellerProfile?.phone || '',
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
        !sellerUpgradeForm.district.trim() ||
        !sellerUpgradeForm.area.trim() ||
        !sellerUpgradeForm.category.trim() ||
        !sellerUpgradeForm.experienceYears.trim() ||
        !sellerUpgradeForm.description.trim()
      ) {
        toast.error('Please complete all seller upgrade fields.');
        return;
      }

      updatePayload.sellerProfile = {
        type: 'individual_seller',
        businessName: sellerUpgradeForm.businessName.trim(),
        category: sellerUpgradeForm.category.trim(),
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

      updatePayload.organizationProfile = {
        type: 'business',
        organizationName: businessUpgradeForm.organizationName.trim(),
        contactPerson: businessUpgradeForm.contactPerson.trim(),
        district: businessUpgradeForm.district.trim(),
        description: businessUpgradeForm.description.trim(),
        verified: false,
        phone: businessUpgradeForm.phone.trim(),
        address: businessUpgradeForm.address.trim(),
        businessType: businessUpgradeForm.businessType.trim(),
        productsOrServices: businessUpgradeForm.productsOrServices.trim(),
        registrationNumber: businessUpgradeForm.registrationNumber.trim(),
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

      updatePayload.organizationProfile = {
        type: 'cooperative',
        organizationName: cooperativeUpgradeForm.organizationName.trim(),
        contactPerson: cooperativeUpgradeForm.contactPerson.trim(),
        district: cooperativeUpgradeForm.district.trim(),
        description: cooperativeUpgradeForm.description.trim(),
        verified: false,
        phone: cooperativeUpgradeForm.phone.trim(),
        area: cooperativeUpgradeForm.area.trim(),
        memberCount: cooperativeUpgradeForm.memberCount.trim(),
        mainCommodities: cooperativeUpgradeForm.mainCommodities.trim(),
        registrationNumber: cooperativeUpgradeForm.registrationNumber.trim(),
      };
    }

    if (selectedRole === 'ngo') {
      if (
        !ngoUpgradeForm.organizationName.trim() ||
        !ngoUpgradeForm.contactPerson.trim() ||
        !ngoUpgradeForm.phone.trim() ||
        !ngoUpgradeForm.district.trim() ||
        !ngoUpgradeForm.focusArea.trim() ||
        !ngoUpgradeForm.servicesOffered.trim() ||
        !ngoUpgradeForm.description.trim()
      ) {
        toast.error('Please complete all NGO upgrade fields.');
        return;
      }

      updatePayload.organizationProfile = {
        type: 'ngo',
        organizationName: ngoUpgradeForm.organizationName.trim(),
        contactPerson: ngoUpgradeForm.contactPerson.trim(),
        district: ngoUpgradeForm.district.trim(),
        description: ngoUpgradeForm.description.trim(),
        verified: false,
        phone: ngoUpgradeForm.phone.trim(),
        focusArea: ngoUpgradeForm.focusArea.trim(),
        servicesOffered: ngoUpgradeForm.servicesOffered.trim(),
        registrationNumber: ngoUpgradeForm.registrationNumber.trim(),
        websiteOrSocial: ngoUpgradeForm.websiteOrSocial.trim(),
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
        focusArea: '',
        servicesOffered: '',
        registrationNumber: '',
        websiteOrSocial: '',
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
      !sellerEditForm.district.trim() ||
      !sellerEditForm.area.trim() ||
      !sellerEditForm.category.trim() ||
      !sellerEditForm.experienceYears.trim() ||
      !sellerEditForm.description.trim()
    ) {
      toast.error('Please complete all seller profile fields.');
      return;
    }

    try {
      const updatedSellerProfile = {
        ...user.sellerProfile,
        businessName: sellerEditForm.businessName.trim(),
        fullName: sellerEditForm.fullName.trim(),
        phone: sellerEditForm.phone.trim(),
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
      !organizationEditForm.district.trim() ||
      !organizationEditForm.description.trim()
    ) {
      toast.error('Please complete all core profile fields.');
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

    try {
      const updatedOrganizationProfile = {
        ...user.organizationProfile,
        organizationName: organizationEditForm.organizationName.trim(),
        contactPerson: organizationEditForm.contactPerson.trim(),
        phone: organizationEditForm.phone.trim(),
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
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('common.location')}</label>
                  <input 
                    type="text" 
                    value={profileFormData.location}
                    onChange={e => setProfileFormData({...profileFormData, location: e.target.value})}
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
                  onClick={async () => {
                    if (user) {
                      const updatedData = {
                        name: profileFormData.name,
                        location: profileFormData.location,
                        phone: profileFormData.phone,
                        bio: profileFormData.bio
                      };
                      try {
                        await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });
                        setUser({ ...user, ...updatedData });
                        setIsEditingProfile(false);
                        toast.success(t('account.profileUpdated'));
                      } catch (error: any) {
                        toast.error(error.message);
                      }
                    }
                  }}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> {t('common.save')}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-1">{user?.name}</h2>
                <p className="text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> {user?.location}
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

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setShowTour(true)}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{t('account.helpTour')}</span>
                </button>
                <button
                  onClick={() => setLang(lang === 'en' ? 'ny' : 'en')}
                  className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
                    <Languages className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    Language ({lang.toUpperCase()})
                  </span>
                </button>
                <button 
                  onClick={() => {
                    auth.signOut();
                    toast.success(t('account.loggedOut'));
                  }}
                  className="flex-col items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all group flex"
                >
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center transition-all">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-rose-500">{t('common.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isSwitchingPrimaryRole && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSwitchingPrimaryRole(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Switch Primary Role</h3>
                <p className="text-sm text-gray-500">Choose which role should be your main account identity.</p>
              </div>
              <button
                onClick={() => setIsSwitchingPrimaryRole(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {user.roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedPrimaryRole(role)}
                  className={`w-full text-left px-4 py-4 rounded-2xl border transition-all ${
                    selectedPrimaryRole === role
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{roleLabelMap[role]}</span>
                    {selectedPrimaryRole === role && (
                      <span className="text-xs font-bold text-emerald-600">Selected</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsSwitchingPrimaryRole(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handlePrimaryRoleSwitch}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingSellerProfile && user.sellerProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditingSellerProfile(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Edit Seller Profile</h3>
              <button
                onClick={() => setIsEditingSellerProfile(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Business Name</label>
                <input
                  type="text"
                  placeholder="Business name"
                  value={sellerEditForm.businessName}
                  onChange={(e) => setSellerEditForm({ ...sellerEditForm, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Seller Full Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={sellerEditForm.fullName}
                  onChange={(e) => setSellerEditForm({ ...sellerEditForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={sellerEditForm.phone}
                  onChange={(e) => setSellerEditForm({ ...sellerEditForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">District</label>
                  <input
                    type="text"
                    placeholder="District"
                    value={sellerEditForm.district}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Area</label>
                  <input
                    type="text"
                    placeholder="Area"
                    value={sellerEditForm.area}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, area: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  value={sellerEditForm.category}
                  onChange={(e) => setSellerEditForm({ ...sellerEditForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Delivery</label>
                  <select
                    value={sellerEditForm.deliveryMethod}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, deliveryMethod: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Experience (Yrs)</label>
                  <input
                    type="text"
                    placeholder="Years"
                    value={sellerEditForm.experienceYears}
                    onChange={(e) => setSellerEditForm({ ...sellerEditForm, experienceYears: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                <textarea
                  placeholder="Short business description"
                  rows={3}
                  value={sellerEditForm.description}
                  onChange={(e) => setSellerEditForm({ ...sellerEditForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEditingSellerProfile(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSellerProfileUpdate}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingOrganizationProfile && user.organizationProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditingOrganizationProfile(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Edit Organisation Profile</h3>
              <button
                onClick={() => setIsEditingOrganizationProfile(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Organisation Name</label>
                <input
                  type="text"
                  placeholder="Organisation name"
                  value={organizationEditForm.organizationName}
                  onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, organizationName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="Contact person"
                  value={organizationEditForm.contactPerson}
                  onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, contactPerson: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="Phone number"
                  value={organizationEditForm.phone}
                  onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">District</label>
                <input
                  type="text"
                  placeholder="District"
                  value={organizationEditForm.district}
                  onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, district: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              {user.organizationProfile.type === 'business' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Exact Address</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={organizationEditForm.address}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Business Type</label>
                    <input
                      type="text"
                      placeholder="Business type"
                      value={organizationEditForm.businessType}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, businessType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Products/Services</label>
                    <input
                      type="text"
                      placeholder="Products or services"
                      value={organizationEditForm.productsOrServices}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, productsOrServices: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                </>
              )}

              {user.organizationProfile.type === 'cooperative' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">EPA / Area</label>
                    <input
                      type="text"
                      placeholder="Area"
                      value={organizationEditForm.area}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, area: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Member Count</label>
                    <input
                      type="text"
                      placeholder="Members"
                      value={organizationEditForm.memberCount}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, memberCount: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Main Commodities</label>
                    <input
                      type="text"
                      placeholder="Commodities"
                      value={organizationEditForm.mainCommodities}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, mainCommodities: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                </>
              )}

              {user.organizationProfile.type === 'ngo' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Focus Area</label>
                    <input
                      type="text"
                      placeholder="Focus area"
                      value={organizationEditForm.focusArea}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, focusArea: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Services Offered</label>
                    <input
                      type="text"
                      placeholder="Services"
                      value={organizationEditForm.servicesOffered}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, servicesOffered: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Website/Social</label>
                    <input
                      type="text"
                      placeholder="Link"
                      value={organizationEditForm.websiteOrSocial}
                      onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, websiteOrSocial: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Registration Number</label>
                <input
                  type="text"
                  placeholder="Reg number"
                  value={organizationEditForm.registrationNumber}
                  onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, registrationNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                <textarea
                  placeholder="Description"
                  rows={3}
                  value={organizationEditForm.description}
                  onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEditingOrganizationProfile(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleOrganizationProfileUpdate}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsRoleModalOpen(false);
              setSelectedRole(null);
            }}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 md:p-8 overflow-y-auto overscroll-contain space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Upgrade Account</h3>
                  <p className="text-sm text-gray-500">Choose how you want to use FarmKit.</p>
                </div>
                <button
                  onClick={() => {
                    setIsRoleModalOpen(false);
                    setSelectedRole(null);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!selectedRole ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => !user.roles.includes('seller') && setSelectedRole('seller')}
                    disabled={user.roles.includes('seller')}
                    className={`p-5 rounded-2xl border text-left ${
                      user.roles.includes('seller')
                        ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                    }`}
                  >
                    <Store className="w-7 h-7 mb-3 text-emerald-600" />
                    <h4 className="font-bold">Individual Seller</h4>
                    <p className="text-sm text-gray-500">Sell products as an individual farmer or trader.</p>
                  </button>

                  <button
                    onClick={() => !user.roles.includes('business') && setSelectedRole('business')}
                    disabled={user.roles.includes('business')}
                    className={`p-5 rounded-2xl border text-left ${
                      user.roles.includes('business')
                        ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                    }`}
                  >
                    <Building2 className="w-7 h-7 mb-3 text-emerald-600" />
                    <h4 className="font-bold">Business</h4>
                    <p className="text-sm text-gray-500">Register a company or commercial entity.</p>
                  </button>

                  <button
                    onClick={() => !user.roles.includes('cooperative') && setSelectedRole('cooperative')}
                    disabled={user.roles.includes('cooperative')}
                    className={`p-5 rounded-2xl border text-left ${
                      user.roles.includes('cooperative')
                        ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                    }`}
                  >
                    <Users className="w-7 h-7 mb-3 text-emerald-600" />
                    <h4 className="font-bold">Cooperative</h4>
                    <p className="text-sm text-gray-500">Register a farmer group or cooperative.</p>
                  </button>

                  <button
                    onClick={() => !user.roles.includes('ngo') && setSelectedRole('ngo')}
                    disabled={user.roles.includes('ngo')}
                    className={`p-5 rounded-2xl border text-left ${
                      user.roles.includes('ngo')
                        ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                    }`}
                  >
                    <HandHelping className="w-7 h-7 mb-3 text-emerald-600" />
                    <h4 className="font-bold">NGO</h4>
                    <p className="text-sm text-gray-500">Register a development or support organisation.</p>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedRole === 'seller' && (
                    <>
                      <input
                        type="text"
                        placeholder="Business or stall name"
                        value={sellerUpgradeForm.businessName}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, businessName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Seller full name"
                        value={sellerUpgradeForm.fullName}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Phone number"
                        value={sellerUpgradeForm.phone}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="District"
                        value={sellerUpgradeForm.district}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Area / market"
                        value={sellerUpgradeForm.area}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, area: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Product category"
                        value={sellerUpgradeForm.category}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <select
                        value={sellerUpgradeForm.deliveryMethod}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, deliveryMethod: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      >
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                        <option value="both">Both</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Years of experience"
                        value={sellerUpgradeForm.experienceYears}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, experienceYears: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <textarea
                        placeholder="Short business description"
                        rows={4}
                        value={sellerUpgradeForm.description}
                        onChange={(e) => setSellerUpgradeForm({ ...sellerUpgradeForm, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                    </>
                  )}

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
                        placeholder="District / region"
                        value={ngoUpgradeForm.district}
                        onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Focus area"
                        value={ngoUpgradeForm.focusArea}
                        onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, focusArea: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Services offered"
                        value={ngoUpgradeForm.servicesOffered}
                        onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, servicesOffered: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Registration number"
                        value={ngoUpgradeForm.registrationNumber}
                        onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, registrationNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Website or social link"
                        value={ngoUpgradeForm.websiteOrSocial}
                        onChange={(e) => setNgoUpgradeForm({ ...ngoUpgradeForm, websiteOrSocial: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
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
          </div>
        </div>
      )}
    </motion.div>
  );
};
