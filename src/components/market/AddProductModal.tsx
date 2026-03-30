import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AddListingForm, AddDemandForm } from '../MarketplaceForms';
import { MarketListing, MarketDemand, User } from '../../types';
import { toast } from 'react-hot-toast';
import { api } from '../../lib/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingListing: MarketListing | null;
  editingDemand: MarketDemand | null;
  formStep: number;
  setFormStep: (step: number) => void;
  t: (key: string) => string;
  user: User | null;
  editingFormData: any;
  isSubmittingListing: boolean;
  handleUpdateListing: (id: string, data: any) => Promise<void>;
  handleCreateListing: (data: any) => Promise<void>;
  uploadImageToCloudinary: (file: File) => Promise<string>;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  editingListing,
  editingDemand,
  formStep,
  setFormStep,
  t,
  user,
  editingFormData,
  isSubmittingListing,
  handleUpdateListing,
  handleCreateListing,
  uploadImageToCloudinary,
  setLoading,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div key="add-product-modal-overlay" className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        key="add-product-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        key="add-product-modal-content"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-visible max-h-[90vh] flex flex-col"
      >
        <div className="p-8 md:p-10 overflow-y-auto max-h-[90vh]">
          {editingDemand || formStep >= 10 ? (
            <AddDemandForm 
              t={t} 
              user={user} 
              step={formStep} 
              setStep={setFormStep} 
              initialData={editingDemand}
              isEditMode={!!editingDemand}
              onClose={onClose} 
              onSubmit={async (data) => {
                if (!user) {
                  toast.error(t('account.signIn'));
                  return;
                }

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

                  onClose();
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
              initialData={editingFormData}
              isEditMode={!!editingListing}
              isSubmitting={isSubmittingListing}
              onClose={onClose} 
              onSubmit={async (data) => {
                if (loading || isSubmittingListing) return;
                try {
                  if (editingListing?.id) {
                    await handleUpdateListing(editingListing.id, data);
                  } else {
                    await handleCreateListing(data);
                  }
                  onClose();
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
  );
};

export default AddProductModal;
