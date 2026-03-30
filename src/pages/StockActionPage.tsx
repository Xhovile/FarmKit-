import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ArrowLeft, TrendingUp, Package, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';
import { useTranslation } from '../hooks/useTranslation';
import { MarketListing, MarketDemand } from '../types';

const StockActionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    listing?: MarketListing; 
    request?: MarketDemand;
    type: 'sale' | 'restock' | 'found-quantity';
  } | null;

  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!state) {
    navigate(-1);
    return null;
  }

  const { listing, request, type } = state;

  const handleAction = async () => {
    const val = Number(amount);
    if (!Number.isFinite(val) || (type !== 'found-quantity' && val <= 0) || (type === 'found-quantity' && val < 0)) {
      toast.error('Enter a valid amount.');
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'sale' && listing?.id) {
        const currentAvailable = listing.availableQuantity ?? listing.quantity ?? 0;
        const currentSold = listing.soldQuantity ?? 0;
        if (val > currentAvailable) {
          toast.error('Sold amount cannot be greater than available stock.');
          return;
        }
        const nextAvailableQuantity = currentAvailable - val;
        const nextSoldQuantity = currentSold + val;
        await api.put(`/api/market-listings/${listing.id}`, {
          availableQuantity: nextAvailableQuantity,
          soldQuantity: nextSoldQuantity,
          status: nextAvailableQuantity <= 0 ? 'sold' : 'active',
        });
        toast.success('Sale recorded successfully.');
      } else if (type === 'restock' && listing?.id) {
        const currentAvailable = listing.availableQuantity ?? listing.quantity ?? 0;
        const currentSold = listing.soldQuantity ?? 0;
        const currentQuantity = listing.quantity ?? 0;
        const nextAvailableQuantity = currentAvailable + val;
        const nextQuantity = currentQuantity + val;
        await api.put(`/api/market-listings/${listing.id}`, {
          quantity: nextQuantity,
          availableQuantity: nextAvailableQuantity,
          soldQuantity: currentSold,
          status: 'active',
        });
        toast.success('Stock added successfully.');
      } else if (type === 'found-quantity' && request?.id) {
        if (val > (request.quantity ?? 0)) {
          toast.error('Found quantity cannot be greater than requested quantity.');
          return;
        }
        const nextStatus = val >= (request.quantity ?? 0) ? 'matched' : (request.status === 'closed' ? 'closed' : 'open');
        await api.put(`/api/market-demands/${request.id}`, {
          quantityFound: val,
          status: nextStatus,
        });
        toast.success('Found quantity updated successfully.');
      }
      navigate(-1);
    } catch (error) {
      console.error('Error in stock action:', error);
      toast.error('Failed to update.');
    } finally {
      setIsLoading(false);
    }
  };

  const title = type === 'sale' ? 'Record Sale' : type === 'restock' ? 'Restock Listing' : 'Update Found Quantity';
  const itemTitle = listing?.title || request?.commodity;
  const Icon = type === 'sale' ? TrendingUp : type === 'restock' ? Package : ClipboardList;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-900 pb-24">
      <div className="sticky top-[56px] z-20 bg-neutral-50/80 dark:bg-dark-900/80 backdrop-blur-md px-4 py-4 border-b border-gray-200 dark:border-gray-800 mb-6">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <Icon className="w-7 h-7 text-primary" />
                  {title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{itemTitle}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-gray-50 dark:bg-gray-700/40 p-6 border border-gray-100 dark:border-gray-700">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">Current Status</p>
                {type !== 'found-quantity' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-200 flex justify-between">
                      Available: <span className="font-bold">{listing?.availableQuantity ?? listing?.quantity ?? 0}</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 flex justify-between">
                      Sold: <span className="font-bold">{listing?.soldQuantity ?? 0}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-200 flex justify-between">
                      Requested: <span className="font-bold">{request?.quantity} {request?.unit}</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-200 flex justify-between">
                      Found so far: <span className="font-bold">{request?.quantityFound ?? 0}</span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  {type === 'sale' ? 'Units sold' : type === 'restock' ? 'Units added' : 'Found quantity'}
                </label>
                <input
                  type="number"
                  min={type === 'found-quantity' ? "0" : "1"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-3xl focus:ring-2 focus:ring-primary outline-none text-lg font-bold shadow-inner"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleAction}
                  disabled={isLoading}
                  className="flex-1 py-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockActionPage;
