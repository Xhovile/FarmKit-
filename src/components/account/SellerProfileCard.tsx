import React from 'react';
import { Store, MapPin, Phone, Briefcase, Truck, Calendar, FileText } from 'lucide-react';
import { User as UserType } from '../../types';

interface SellerProfileCardProps {
  user: UserType;
  setIsAccountModalOpen: (val: boolean) => void;
  setAccountView: (view: any) => void;
}

const SellerProfileCard: React.FC<SellerProfileCardProps> = ({
  user,
  setIsAccountModalOpen,
  setAccountView,
}) => {
  if (!user.sellerProfile) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-emerald-100 dark:border-emerald-900/30">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
            <Store className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Seller Profile</h3>
            <p className="text-sm text-gray-500">{user.sellerProfile.businessName}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setAccountView('editSeller');
            setIsAccountModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-100 transition-all text-sm"
        >
          Manage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
              <p className="text-gray-700 dark:text-gray-300">{user.sellerProfile.area}, {user.sellerProfile.district}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</p>
              <p className="text-gray-700 dark:text-gray-300">{user.sellerProfile.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</p>
              <p className="text-gray-700 dark:text-gray-300 capitalize">{user.sellerProfile.category}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery</p>
              <p className="text-gray-700 dark:text-gray-300 capitalize">{user.sellerProfile.deliveryMethod}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</p>
              <p className="text-gray-700 dark:text-gray-300">{user.sellerProfile.experienceYears} Years</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</p>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{user.sellerProfile.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileCard;
