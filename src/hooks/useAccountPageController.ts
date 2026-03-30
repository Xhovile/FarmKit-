import React from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';
import { 
  User as UserType, 
  SellerUpgradeForm, 
  BusinessUpgradeForm, 
  CooperativeUpgradeForm, 
  NgoUpgradeForm 
} from '../types';

export type AccountView =
  | 'hub'
  | 'editPersonal'
  | 'editSeller'
  | 'editOrganization'
  | 'switchRole'
  | 'upgradeRole'
  | 'selectUpgradeRole'
  | 'myListings';

interface UseAccountPageControllerProps {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  t: (key: string) => string;
}

export const useAccountPageController = ({
  user,
  setUser,
  t,
}: UseAccountPageControllerProps) => {
  const [isSubmittingProfile, setIsSubmittingProfile] = React.useState(false);
  const [isSubmittingSellerProfile, setIsSubmittingSellerProfile] = React.useState(false);
  const [isSubmittingOrganizationProfile, setIsSubmittingOrganizationProfile] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'seller' | 'business' | 'cooperative' | 'ngo' | null>(null);
  
  const [showSettings, setShowSettings] = React.useState(false);
  const [profileFormData, setProfileFormData] = React.useState({
    name: user?.name || '',
    region: user?.region || '',
    district: user?.district || '',
    location: user?.location || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });

  React.useEffect(() => {
    if (user) {
      setProfileFormData({
        name: user.name || '',
        region: user.region || '',
        district: user.district || '',
        location: user.location || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);
  const [sellerUpgradeForm, setSellerUpgradeForm] = React.useState<SellerUpgradeForm>({
    businessName: '',
    fullName: user?.name || '',
    phone: user?.phone || '',
    region: user?.region || '',
    district: user?.district || '',
    area: user?.location || '',
    category: '',
    deliveryMethod: 'pickup',
    experienceYears: '',
    description: '',
  });

  const [businessUpgradeForm, setBusinessUpgradeForm] = React.useState<BusinessUpgradeForm>({
    organizationName: '',
    contactPerson: user?.name || '',
    phone: user?.phone || '',
    region: user?.region || '',
    district: user?.district || '',
    address: user?.location || '',
    businessType: '',
    productsOrServices: '',
    registrationNumber: '',
    description: '',
  });

  const [cooperativeUpgradeForm, setCooperativeUpgradeForm] = React.useState<CooperativeUpgradeForm>({
    organizationName: '',
    contactPerson: user?.name || '',
    phone: user?.phone || '',
    region: user?.region || '',
    district: user?.district || '',
    area: user?.location || '',
    memberCount: '',
    mainCommodities: '',
    registrationNumber: '',
    description: '',
  });

  const [ngoUpgradeForm, setNgoUpgradeForm] = React.useState<NgoUpgradeForm>({
    organizationName: '',
    contactPerson: user?.name || '',
    phone: user?.phone || '',
    region: user?.region || '',
    district: user?.district || '',
    address: user?.location || '',
    organizationType: '',
    description: '',
  });

  React.useEffect(() => {
    if (user) {
      setSellerUpgradeForm(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        region: prev.region || user.region || '',
        district: prev.district || user.district || '',
        area: prev.area || user.location || '',
      }));
      setBusinessUpgradeForm(prev => ({
        ...prev,
        contactPerson: prev.contactPerson || user.name || '',
        phone: prev.phone || user.phone || '',
        region: prev.region || user.region || '',
        district: prev.district || user.district || '',
        address: prev.address || user.location || '',
      }));
      setCooperativeUpgradeForm(prev => ({
        ...prev,
        contactPerson: prev.contactPerson || user.name || '',
        phone: prev.phone || user.phone || '',
        region: prev.region || user.region || '',
        district: prev.district || user.district || '',
        area: prev.area || user.location || '',
      }));
      setNgoUpgradeForm(prev => ({
        ...prev,
        contactPerson: prev.contactPerson || user.name || '',
        phone: prev.phone || user.phone || '',
        region: prev.region || user.region || '',
        district: prev.district || user.district || '',
        address: prev.address || user.location || '',
      }));
    }
  }, [user]);

  const [isSubmittingRole, setIsSubmittingRole] = React.useState(false);
  const [isSubmittingRoleSwitch, setIsSubmittingRoleSwitch] = React.useState(false);

  const [selectedPrimaryRole, setSelectedPrimaryRole] = React.useState<UserType['primaryRole']>(user?.primaryRole || 'buyer');

  const accountState = {
    isBuyer: user?.primaryRole === 'buyer',
    isSeller: user?.primaryRole === 'seller',
    isBusiness: user?.primaryRole === 'business',
    isCooperative: user?.primaryRole === 'cooperative',
    isNgo: user?.primaryRole === 'ngo',
    isVerified: user?.status === 'verified' || user?.status === 'premium',
    hasSellerProfile: !!user?.sellerProfile,
    hasOrgProfile: !!user?.organizationProfile,
    canManageListings:
      ['seller', 'business', 'cooperative', 'ngo'].includes(user?.primaryRole || '') &&
      (user?.sellerProfile?.verified || user?.organizationProfile?.verified || false),
  };

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
    organizationType: user?.organizationProfile?.organizationType || '',
    area: user?.organizationProfile?.area || '',
    memberCount: user?.organizationProfile?.memberCount || '',
    mainCommodities: user?.organizationProfile?.mainCommodities || '',
    focusArea: user?.organizationProfile?.focusArea || '',
    servicesOffered: user?.organizationProfile?.servicesOffered || '',
    websiteOrSocial: user?.organizationProfile?.websiteOrSocial || '',
    description: user?.organizationProfile?.description || '',
  });

  React.useEffect(() => {
    if (user?.sellerProfile) {
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
  }, [user?.sellerProfile]);

  React.useEffect(() => {
    if (user?.organizationProfile) {
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
        organizationType: user.organizationProfile.organizationType || '',
        area: user.organizationProfile.area || '',
        memberCount: user.organizationProfile.memberCount || '',
        mainCommodities: user.organizationProfile.mainCommodities || '',
        focusArea: user.organizationProfile.focusArea || '',
        servicesOffered: user.organizationProfile.servicesOffered || '',
        websiteOrSocial: user.organizationProfile.websiteOrSocial || '',
        description: user.organizationProfile.description || '',
      });
    }
  }, [user?.organizationProfile]);

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

      const result = await api.put('/api/users/me', updatedData);
      setUser(result as UserType);
      toast.success(t('account.profileUpdated'));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile.';
      toast.error(message);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleRoleUpgrade = async () => {
    if (!user || !selectedRole) return;

    const nextRoles = Array.from(new Set([...(user.roles || []), selectedRole]));

    const shouldSetPrimaryRole =
      user.roles?.length === 1 && user.roles[0] === 'buyer';

    const updatePayload: Partial<UserType> = {
      roles: nextRoles,
      ...(shouldSetPrimaryRole ? { primaryRole: selectedRole } : {}),
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
        !businessUpgradeForm.region.trim() ||
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
        region: businessUpgradeForm.region.trim(),
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
        !cooperativeUpgradeForm.region.trim() ||
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
        region: cooperativeUpgradeForm.region.trim(),
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
        !ngoUpgradeForm.region.trim() ||
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
        region: ngoUpgradeForm.region.trim(),
        district: ngoUpgradeForm.district.trim(),
        address: ngoUpgradeForm.address.trim(),
        organizationType: ngoUpgradeForm.organizationType.trim(),
        description: ngoUpgradeForm.description.trim(),
        verified: false,
      };
    }

    setIsSubmittingRole(true);

    try {
      const result = await api.put('/api/users/me', updatePayload);
      setUser(result as UserType);

      toast.success('Account upgraded successfully.');
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
        region: '',
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
        region: '',
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
        region: '',
        district: '',
        address: '',
        organizationType: '',
        description: '',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to upgrade account.';
      toast.error(message);
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

      const result = await api.put('/api/users/me', {
        sellerProfile: updatedSellerProfile,
      });

      setUser(result as UserType);

      toast.success('Seller profile updated.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update seller profile.';
      toast.error(message);
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
        organizationType: organizationEditForm.organizationType.trim(),
        area: organizationEditForm.area.trim(),
        memberCount: organizationEditForm.memberCount.trim(),
        mainCommodities: organizationEditForm.mainCommodities.trim(),
        focusArea: organizationEditForm.focusArea.trim(),
        servicesOffered: organizationEditForm.servicesOffered.trim(),
        websiteOrSocial: organizationEditForm.websiteOrSocial.trim(),
        description: organizationEditForm.description.trim(),
      };

      const result = await api.put('/api/users/me', {
        organizationProfile: updatedOrganizationProfile,
      });

      setUser(result as UserType);

      toast.success('Organisation profile updated.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update organisation profile.';
      toast.error(message);
    } finally {
      setIsSubmittingOrganizationProfile(false);
    }
  };

  const handlePrimaryRoleSwitch = async () => {
    if (!user) return;

    if (!user.roles?.includes(selectedPrimaryRole)) {
      toast.error('You can only switch to a role already on your account.');
      return;
    }

    if (selectedPrimaryRole === user.primaryRole) {
      toast('That role is already active.');
      return;
    }

    try {
      setIsSubmittingRoleSwitch(true);

      const result = await api.put('/api/users/me', {
        primaryRole: selectedPrimaryRole,
      });

      setUser(result as UserType);
      toast.success('Primary role updated.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update primary role.';
      toast.error(message);
    } finally {
      setIsSubmittingRoleSwitch(false);
    }
  };

  return {
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
    handleDeleteRole: async (roleToDelete: UserType['primaryRole']) => {
      if (!user) return;

      if (roleToDelete === 'buyer' && user.roles?.length === 1) {
        toast.error('You must have at least one role.');
        return;
      }

      const nextRoles = user.roles?.filter(r => r !== roleToDelete) || [];
      
      if (nextRoles.length === 0) {
        toast.error('You must have at least one role.');
        return;
      }

      let nextPrimaryRole = user.primaryRole;
      if (user.primaryRole === roleToDelete) {
        nextPrimaryRole = nextRoles[0];
      }

      const updatePayload: any = {
        roles: nextRoles,
        primaryRole: nextPrimaryRole,
      };

      // Clean up profiles if the role being deleted is the only one using that profile type
      if (roleToDelete === 'seller') {
        updatePayload.sellerProfile = null;
      }
      
      const orgRoles: UserType['primaryRole'][] = ['business', 'cooperative', 'ngo'];
      if (orgRoles.includes(roleToDelete)) {
        const remainingOrgRoles = nextRoles.filter(r => orgRoles.includes(r));
        if (remainingOrgRoles.length === 0) {
          updatePayload.organizationProfile = null;
        }
      }

      try {
        setIsSubmittingRoleSwitch(true);
        const result = await api.put('/api/users/me', updatePayload);
        setUser(result as UserType);
        toast.success(`${roleToDelete.charAt(0).toUpperCase() + roleToDelete.slice(1)} role removed.`);
      } catch (error: any) {
        toast.error(error.message || 'Failed to remove role.');
      } finally {
        setIsSubmittingRoleSwitch(false);
      }
    },
    handleAvatarUpload: async (file: File) => {
      if (!user) return;
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const { url } = await api.post('/api/upload', formData);
        
        const result = await api.put('/api/users/me', { avatar: url });
        setUser(result as UserType);
        toast.success('Avatar updated successfully.');
      } catch (error: any) {
        toast.error(error.message || 'Failed to upload avatar.');
      }
    },
    showSettings,
    setShowSettings,
    profileFormData,
    setProfileFormData,
    canSell: (user?.primaryRole === 'seller' && !!user.sellerProfile) ||
      (['business', 'cooperative', 'ngo'].includes(user?.primaryRole || '') && !!user.organizationProfile),
    canEditCurrentProfile: user?.primaryRole === 'seller'
      ? !!user.sellerProfile
      : ['business', 'cooperative', 'ngo'].includes(user?.primaryRole || '')
        ? !!user.organizationProfile
        : true,
    accountState,
  };
};
