import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  PlusCircle, 
  LayoutDashboard, 
  Heart, 
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { User as UserType, UserRole } from '../../types';
import { useAccountRoleStats } from '../../hooks/useAccountRoleStats';

interface RoleDashboardSectionProps {
  user: UserType;
  t: (key: string) => string;
  setActiveTab: (tab: 'info' | 'market' | 'experts' | 'account') => void;
  openEditPersonal: () => void;
  openEditSeller: () => void;
  openEditOrganization: () => void;
  openUpgradeRole: () => void;
  setAccountView: (view: any) => void;
}

const RoleDashboardSection: React.FC<RoleDashboardSectionProps> = ({
  user,
  t,
  setActiveTab,
  openEditPersonal,
  openEditSeller,
  openEditOrganization,
  openUpgradeRole,
  setAccountView,
}) => {
  const navigate = useNavigate();
  const stats = useAccountRoleStats(user);

  const handleAddListing = () => {
    navigate('/add-product');
  };

  const handlePostRequest = () => {
    navigate('/add-product', { state: { isRequest: true } });
  };

  const isAdvancedUser = (user.roles || []).length > 0;
  const isSellerOrOrg = !!user.primaryRole && ['seller', 'business', 'cooperative', 'ngo'].includes(user.primaryRole);

  const StatCard = ({ label, value, icon: Icon, colorClass, onClick }: any) => (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
    </button>
  );

  const ActionButton = ({ label, icon: Icon, onClick, primary = false }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        primary 
          ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const roleLabel = user.primaryRole ? t(`account.${user.primaryRole}`) : t('account.account');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            {roleLabel} Dashboard
          </h3>
          <p className="text-xs text-gray-500">Quick overview of your {roleLabel.toLowerCase()} activities</p>
        </div>
        <div className="flex gap-2">
          {isSellerOrOrg ? (
            <ActionButton 
              label="Add Listing" 
              icon={PlusCircle} 
              primary 
              onClick={handleAddListing} 
            />
          ) : (
            <ActionButton 
              label="Post Request" 
              icon={PlusCircle} 
              primary 
              onClick={handlePostRequest} 
            />
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {!isAdvancedUser ? (
          <>
            <StatCard 
              label="Saved" 
              value={stats.savedCount} 
              icon={Heart} 
              colorClass="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              onClick={() => setActiveTab('market')}
            />
            <StatCard 
              label="Open Demands" 
              value={stats.openDemands} 
              icon={Clock} 
              colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              onClick={() => setActiveTab('market')}
            />
            <StatCard 
              label="Matched" 
              value={stats.matchedDemands} 
              icon={CheckCircle2} 
              colorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              onClick={() => setActiveTab('market')}
            />
            <StatCard 
              label="Total Demands" 
              value={stats.totalDemands} 
              icon={ClipboardList} 
              colorClass="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              onClick={() => setActiveTab('market')}
            />
          </>
        ) : (
          <>
            <StatCard 
              label="Active" 
              value={stats.activeListings} 
              icon={ShoppingBag} 
              colorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              onClick={() => setAccountView('myListings')}
            />
            <StatCard 
              label="Low Stock" 
              value={stats.lowStockListings} 
              icon={AlertCircle} 
              colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              onClick={() => setAccountView('myListings')}
            />
            <StatCard 
              label="Sold" 
              value={stats.soldListings} 
              icon={CheckCircle2} 
              colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              onClick={() => setAccountView('myListings')}
            />
            <StatCard 
              label="Total" 
              value={stats.totalListings} 
              icon={ClipboardList} 
              colorClass="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              onClick={() => setAccountView('myListings')}
            />
          </>
        )}
      </div>

      {/* Quick Tips / Empty State */}
      {((!isAdvancedUser && stats.totalDemands === 0) || 
        (isSellerOrOrg && stats.totalListings === 0)) && (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <PlusCircle className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-bold mb-1">Get Started</h4>
          <p className="text-sm text-gray-500 mb-4">
            {!isAdvancedUser 
              ? "Post your first buying request to find sellers near you."
              : "List your first product to start selling on FarmKit."}
          </p>
          <button 
            onClick={!isAdvancedUser ? handlePostRequest : handleAddListing}
            className="text-primary font-bold text-sm hover:underline"
          >
            {!isAdvancedUser ? 'Post Request' : 'Create Listing'} &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleDashboardSection;
