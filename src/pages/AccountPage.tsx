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
  const [roleForm, setRoleForm] = React.useState({
    businessName: '',
    category: '',
    district: '',
    deliveryMethod: 'pickup',
    organizationName: '',
    contactPerson: '',
    description: '',
  });
  const [isSubmittingRole, setIsSubmittingRole] = React.useState(false);

  const [isEditingSellerProfile, setIsEditingSellerProfile] = React.useState(false);
  const [isEditingOrganizationProfile, setIsEditingOrganizationProfile] = React.useState(false);

  const [isSwitchingPrimaryRole, setIsSwitchingPrimaryRole] = React.useState(false);
  const [selectedPrimaryRole, setSelectedPrimaryRole] = React.useState<UserType['primaryRole']>(user.primaryRole);

  const [sellerEditForm, setSellerEditForm] = React.useState({
    businessName: user.sellerProfile?.businessName || '',
    category: user.sellerProfile?.category || '',
    district: user.sellerProfile?.district || '',
    deliveryMethod: user.sellerProfile?.deliveryMethod || 'pickup',
  });

  const [organizationEditForm, setOrganizationEditForm] = React.useState({
    organizationName: user.organizationProfile?.organizationName || '',
    contactPerson: user.organizationProfile?.contactPerson || '',
    district: user.organizationProfile?.district || '',
    description: user.organizationProfile?.description || '',
  });

  const handleRoleUpgrade = async () => {
    if (!user || !selectedRole) return;

    if (selectedRole === 'seller') {
      if (!roleForm.businessName.trim() || !roleForm.category.trim() || !roleForm.district.trim()) {
        toast.error('Please complete all seller details.');
        return;
      }
    }

    if (selectedRole === 'business' || selectedRole === 'cooperative' || selectedRole === 'ngo') {
      if (!roleForm.organizationName.trim() || !roleForm.contactPerson.trim() || !roleForm.district.trim()) {
        toast.error('Please complete all organisation details.');
        return;
      }
    }

    setIsSubmittingRole(true);

    try {
      const nextRoles = Array.from(new Set([...user.roles, selectedRole]));
      const nextPrimaryRole = user.primaryRole === 'buyer' ? selectedRole : user.primaryRole;

      const updatePayload: any = {
        roles: nextRoles,
        primaryRole: nextPrimaryRole,
      };

      if (selectedRole === 'seller') {
        updatePayload.sellerProfile = {
          type: 'individual_seller',
          businessName: roleForm.businessName.trim(),
          category: roleForm.category.trim(),
          district: roleForm.district.trim(),
          deliveryMethod: roleForm.deliveryMethod,
          verified: false,
        };
      }

      if (selectedRole === 'business' || selectedRole === 'cooperative' || selectedRole === 'ngo') {
        updatePayload.organizationProfile = {
          type: selectedRole,
          organizationName: roleForm.organizationName.trim(),
          contactPerson: roleForm.contactPerson.trim(),
          district: roleForm.district.trim(),
          description: roleForm.description.trim(),
          verified: false,
        };
      }

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
      setRoleForm({
        businessName: '',
        category: '',
        district: '',
        deliveryMethod: 'pickup',
        organizationName: '',
        contactPerson: '',
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
      !sellerEditForm.category.trim() ||
      !sellerEditForm.district.trim()
    ) {
      toast.error('Please complete all seller profile fields.');
      return;
    }

    try {
      const updatedSellerProfile = {
        ...user.sellerProfile,
        businessName: sellerEditForm.businessName.trim(),
        category: sellerEditForm.category.trim(),
        district: sellerEditForm.district.trim(),
        deliveryMethod: sellerEditForm.deliveryMethod,
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

    if (
      !organizationEditForm.organizationName.trim() ||
      !organizationEditForm.contactPerson.trim() ||
      !organizationEditForm.district.trim()
    ) {
      toast.error('Please complete all organisation profile fields.');
      return;
    }

    try {
      const updatedOrganizationProfile = {
        ...user.organizationProfile,
        organizationName: organizationEditForm.organizationName.trim(),
        contactPerson: organizationEditForm.contactPerson.trim(),
        district: organizationEditForm.district.trim(),
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
                            category: user.sellerProfile?.category || '',
                            district: user.sellerProfile?.district || '',
                            deliveryMethod: user.sellerProfile?.deliveryMethod || 'pickup',
                          });
                          setIsEditingSellerProfile(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Business Name</p>
                      <p className="font-semibold">{user.sellerProfile.businessName || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Category</p>
                      <p className="font-semibold">{user.sellerProfile.category || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">District</p>
                      <p className="font-semibold">{user.sellerProfile.district || '—'}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Delivery Method</p>
                      <p className="font-semibold capitalize">{user.sellerProfile.deliveryMethod || '—'}</p>
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
                            district: user.organizationProfile?.district || '',
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">District</p>
                      <p className="font-semibold">{user.organizationProfile.district || '—'}</p>
                    </div>
                  </div>

                  {user.organizationProfile.description && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</p>
                      <p className="text-sm leading-relaxed">{user.organizationProfile.description}</p>
                    </div>
                  )}
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

            <input
              type="text"
              placeholder="Business name"
              value={sellerEditForm.businessName}
              onChange={(e) => setSellerEditForm({ ...sellerEditForm, businessName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />

            <input
              type="text"
              placeholder="Category"
              value={sellerEditForm.category}
              onChange={(e) => setSellerEditForm({ ...sellerEditForm, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />

            <input
              type="text"
              placeholder="District"
              value={sellerEditForm.district}
              onChange={(e) => setSellerEditForm({ ...sellerEditForm, district: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />

            <select
              value={sellerEditForm.deliveryMethod}
              onChange={(e) => setSellerEditForm({ ...sellerEditForm, deliveryMethod: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
              <option value="both">Both</option>
            </select>

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

            <input
              type="text"
              placeholder="Organisation name"
              value={organizationEditForm.organizationName}
              onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, organizationName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />

            <input
              type="text"
              placeholder="Contact person"
              value={organizationEditForm.contactPerson}
              onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, contactPerson: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />

            <input
              type="text"
              placeholder="District"
              value={organizationEditForm.district}
              onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, district: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />

            <textarea
              placeholder="Description"
              rows={4}
              value={organizationEditForm.description}
              onChange={(e) => setOrganizationEditForm({ ...organizationEditForm, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
            />

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
                  {selectedRole === 'seller' ? (
                    <>
                      <input
                        type="text"
                        placeholder="Business name"
                        value={roleForm.businessName}
                        onChange={(e) => setRoleForm({ ...roleForm, businessName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        value={roleForm.category}
                        onChange={(e) => setRoleForm({ ...roleForm, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="District"
                        value={roleForm.district}
                        onChange={(e) => setRoleForm({ ...roleForm, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <select
                        value={roleForm.deliveryMethod}
                        onChange={(e) => setRoleForm({ ...roleForm, deliveryMethod: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      >
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                        <option value="both">Both</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Organisation name"
                        value={roleForm.organizationName}
                        onChange={(e) => setRoleForm({ ...roleForm, organizationName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Contact person"
                        value={roleForm.contactPerson}
                        onChange={(e) => setRoleForm({ ...roleForm, contactPerson: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="District"
                        value={roleForm.district}
                        onChange={(e) => setRoleForm({ ...roleForm, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none"
                      />
                      <textarea
                        placeholder="Description"
                        rows={3}
                        value={roleForm.description}
                        onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
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

