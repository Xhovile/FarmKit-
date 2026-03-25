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
      <div className="flex gap-4">
        {item.imageUrl && (
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="truncate">
              <h4 className="font-bold truncate">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.price} MWK</p>
            </div>
            <button onClick={() => onRemove(item)} className="ml-2">
              <BookmarkX className="w-5 h-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>

          <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>
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
