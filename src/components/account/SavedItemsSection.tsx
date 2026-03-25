import React, { useState } from 'react';
import { User, MarketListing } from '../../types';
import { useSavedListings } from '../../hooks/useSavedListings';
import SavedListingCard from './SavedListingCard';
import { Bookmark } from 'lucide-react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

interface Props {
  user: User;
  setSelectedItem: (item: any) => void;
}

const SavedItemsSection: React.FC<Props> = ({ user, setSelectedItem }) => {
  const { items, loading } = useSavedListings(user);
  const [isOpening, setIsOpening] = useState<string | null>(null);

  const handleOpen = async (item: MarketListing) => {
    if (!item.id) return;
    
    setIsOpening(item.id);
    try {
      // Fetch the full listing from market_listings to ensure all details are present
      const listing = await api.get(`/api/market-listings/${item.id}`);
      if (listing) {
        setSelectedItem(listing);
      } else {
        // Fallback to the saved metadata if the original listing is gone
        setSelectedItem(item);
        toast.error('Original listing details not found. Showing saved preview.');
      }
    } catch (err) {
      console.error('Error fetching full listing:', err);
      setSelectedItem(item);
    } finally {
      setIsOpening(null);
    }
  };

  const handleRemove = async (item: MarketListing) => {
    if (!user?.uid || !item.id) return;

    try {
      await api.delete(`/api/saved-listings/${item.id}`);
    } catch (err) {
      console.error('Remove saved failed:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 space-y-6">
      
      <div>
        <h3 className="text-2xl font-black flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-600" />
          Saved Items
        </h3>
        <p className="text-sm text-gray-500">
          Listings you saved for later.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="border border-dashed p-10 rounded-2xl text-center">
          <h4 className="font-bold mb-2">No saved items</h4>
          <p className="text-sm text-gray-500">
            Start exploring the market and save listings to track them here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <SavedListingCard
              key={item.id}
              item={item}
              onOpen={handleOpen}
              onRemove={handleRemove}
              isOpening={isOpening === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItemsSection;
