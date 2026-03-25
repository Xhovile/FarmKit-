import React from 'react';
import { User, MarketListing } from '../../types';
import { useSavedListings } from '../../hooks/useSavedListings';
import SavedListingCard from './SavedListingCard';
import { Bookmark } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Props {
  user: User;
  setSelectedItem: (item: any) => void;
}

const SavedItemsSection: React.FC<Props> = ({ user, setSelectedItem }) => {
  const { items, loading } = useSavedListings(user);

  const handleOpen = (item: MarketListing) => {
    setSelectedItem(item);
  };

  const handleRemove = async (item: MarketListing) => {
    if (!user?.uid || !item.id) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'saved_listings', item.id));
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItemsSection;
