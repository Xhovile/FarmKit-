import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  RefreshCw,
  ArrowUp
} from 'lucide-react';
import { User, MarketListing } from '../../types';
import { useUserListings } from '../../hooks/useUserListings';
import ListingManageCard from './ListingManageCard';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

interface MyListingsSectionProps {
  user: User | null;
  onAddListing: () => void;
  onEditListing: (listing: MarketListing) => void;
  onViewDetails: (listing: MarketListing) => void;
}

const MyListingsSection: React.FC<MyListingsSectionProps> = ({
  user,
  onAddListing,
  onEditListing,
  onViewDetails,
}) => {
  const { listings, loading, error, relistListing, updateListingStatus, deleteListing, refresh } = useUserListings(user);
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'hidden'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesTab = listing.status === activeTab;
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [listings, activeTab, searchQuery]);

  const stats = useMemo(() => {
    return {
      active: listings.filter(l => l.status === 'active').length,
      sold: listings.filter(l => l.status === 'sold').length,
      hidden: listings.filter(l => l.status === 'hidden').length,
    };
  }, [listings]);

  const [showBackToTop, setShowBackToTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestock = async (id: string, quantity: number, price: number) => {
    try {
      await relistListing(id, { quantity, price });
      toast.success('Listing restocked and activated!');
      refresh();
    } catch (err) {
      toast.error('Failed to restock listing');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: MarketListing['status']) => {
    try {
      const newStatus = currentStatus === 'hidden' ? 'active' : 'hidden';
      await updateListingStatus(id, newStatus);
      toast.success(`Listing is now ${newStatus}`);
      refresh();
    } catch (err) {
      toast.error('Failed to update listing status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    try {
      await deleteListing(id);
      toast.success('Listing deleted successfully');
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  if (loading && listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            My Listings
          </h2>
          <p className="text-gray-500 mt-1">Manage your market inventory and sales</p>
        </div>
        <button 
          onClick={onAddListing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add New Listing
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex p-1 bg-gray-50 dark:bg-gray-900 rounded-xl flex-1">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'active' 
                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Active ({stats.active})
          </button>
          <button 
            onClick={() => setActiveTab('sold')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'sold' 
                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Sold ({stats.sold})
          </button>
          <button 
            onClick={() => setActiveTab('hidden')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'hidden' 
                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            Hidden ({stats.hidden})
          </button>
        </div>

        <div className="relative md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ListingManageCard 
                  listing={listing}
                  onEdit={onEditListing}
                  onDelete={handleDelete}
                  onStatusToggle={handleStatusToggle}
                  onRestock={handleRestock}
                  onViewDetails={onViewDetails}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No {activeTab} listings found</h3>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                {searchQuery 
                  ? `No listings matching "${searchQuery}" in this category.`
                  : activeTab === 'sold' 
                    ? "You haven't sold any items yet. Keep listing to grow your business!"
                    : activeTab === 'hidden'
                      ? "You don't have any hidden listings."
                      : "You haven't listed any items for sale yet."}
              </p>
              {activeTab === 'active' && !searchQuery && (
                <button 
                  onClick={onAddListing}
                  className="mt-6 px-6 py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors"
                >
                  Create Your First Listing
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 p-4 bg-primary text-white rounded-full shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all"
            title="Back to Top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyListingsSection;
