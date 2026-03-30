import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AddListingForm, AddDemandForm } from '../components/MarketplaceForms';
import { MarketListing, MarketDemand, User } from '../types';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AddProductPageProps {
  t: (key: string) => string;
  user: User | null;
  isSubmittingListing: boolean;
  handleUpdateListing: (id: string, data: any, editingListing?: MarketListing) => Promise<void>;
  handleCreateListing: (data: any) => Promise<void>;
  uploadImageToCloudinary: (file: File) => Promise<string>;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const AddProductPage: React.FC<AddProductPageProps> = ({
  t,
  user,
  isSubmittingListing,
  handleUpdateListing,
  handleCreateListing,
  uploadImageToCloudinary,
  setLoading,
  loading
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formStep, setFormStep] = React.useState(1);
  const state = location.state as { 
    editingListing?: MarketListing; 
    editingDemand?: MarketDemand;
    isDemand?: boolean;
  } | null;

  const editingListing = state?.editingListing || null;
  const editingDemand = state?.editingDemand || null;
  const isDemand = state?.isDemand || !!editingDemand;

  useEffect(() => {
    if (!user) {
      toast.error(t('account.signIn'));
      navigate('/auth');
    }
  }, [user, navigate, t]);

  const handleClose = () => {
    setFormStep(1);
    navigate(-1);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-900 pb-24">
      <div className="sticky top-[56px] z-20 bg-neutral-50/80 dark:bg-dark-900/80 backdrop-blur-md px-4 py-4 border-b border-gray-200 dark:border-gray-800 mb-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-8 md:p-10">
            {isDemand ? (
              <AddDemandForm 
                t={t} 
                user={user} 
                step={formStep} 
                setStep={setFormStep} 
                initialData={editingDemand}
                isEditMode={!!editingDemand}
                onClose={handleClose} 
                onSubmit={async (data) => {
                  setLoading(true);
                  try {
                    let referenceImageUrl =
                      data.removeExistingImage ? null : (editingDemand?.referenceImageUrl || null);

                    if (data.imageFile) {
                      referenceImageUrl = await uploadImageToCloudinary(data.imageFile);
                    }

                    const demandData = {
                      commodity: data.commodity,
                      category: data.category || 'other',
                      quantity: Number(data.quantity),
                      unit: data.unit,
                      priceRange: data.priceRange,
                      location: data.location,
                      neededBy: data.neededBy || '',
                      urgency: data.urgency || 'normal',
                      requesterType: data.requesterType || 'individual',
                      deliveryPreference: data.deliveryPreference || 'pickup',
                      contactMethod: data.contactMethod || 'whatsapp',
                      description: data.description || '',
                      referenceImageUrl: referenceImageUrl,
                      userName: user.name,
                      phone: data.phone || user.phone,
                    };

                    if (editingDemand?.id) {
                      await api.put(`/api/market-demands/${editingDemand.id}`, demandData);
                      toast.success('Demand updated successfully!');
                    } else {
                      await api.post('/api/market-demands', demandData);
                      toast.success(t('market.demandPosted') || 'Demand posted successfully!');
                    }

                    handleClose();
                  } catch (error: any) {
                    console.error('Error saving demand:', error);
                    toast.error(error.message || t('common.error') || 'An error occurred');
                  } finally {
                    setLoading(false);
                  }
                }} 
              />
            ) : (
              <AddListingForm 
                t={t} 
                user={user} 
                step={formStep} 
                setStep={setFormStep} 
                initialData={editingListing}
                isEditMode={!!editingListing}
                isSubmitting={isSubmittingListing}
                onClose={handleClose} 
                onSubmit={async (data) => {
                  if (loading || isSubmittingListing) return;
                  try {
                    if (editingListing?.id) {
                      await handleUpdateListing(editingListing.id, data, editingListing);
                    } else {
                      await handleCreateListing(data);
                    }
                    handleClose();
                  } catch (error: any) {
                    console.error('Error saving listing:', error);
                    toast.error(error.message || 'Failed to save listing.');
                  }
                }} 
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProductPage;
