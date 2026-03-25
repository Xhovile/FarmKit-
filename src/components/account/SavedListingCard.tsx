import React from 'react';
import { MarketListing } from '../../types';
import { MapPin, BookmarkX, ArrowUpRight } from 'lucide-react';

interface Props {
  item: MarketListing;
  onOpen: (item: MarketListing) => void;
  onRemove: (item: MarketListing) => void;
}

const SavedListingCard: React.FC<Props> = ({ item, onOpen, onRemove }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold">{item.title}</h4>
          <p className="text-sm text-gray-500">{item.price} MWK</p>
        </div>
        <button onClick={() => onRemove(item)}>
          <BookmarkX className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
      </div>

      <div className="flex items-center text-sm text-gray-500 gap-2">
        <MapPin className="w-4 h-4" />
        <span>{item.location}</span>
      </div>

      <button
        onClick={() => onOpen(item)}
        className="w-full mt-2 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center justify-center gap-2"
      >
        <ArrowUpRight className="w-4 h-4" />
        View Listing
      </button>
    </div>
  );
};

export default SavedListingCard;
