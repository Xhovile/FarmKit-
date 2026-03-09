import React from 'react';
import { motion } from 'motion/react';
import { 
  ChartLine, 
  Search, 
  PlusCircle,
  Package,
  TrendingUp,
  Filter,
  ArrowRight,
  LayoutGrid,
  ClipboardList,
  Plus,
  Building2,
  MapPin,
  Truck,
  Info,
  AlertCircle,
  Crown,
  ShieldCheck,
  History,
  Flag,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  marketCategories,
  deliveryMethods
} from '../data/constants';
// Real data states (placeholders for now)
const marketPricesData: any[] = [];
const priceTrendData: any[] = [];
const marketplaceListings: any[] = [];
const buyerRequests: any[] = [];
import { 
  ListingCard, 
  BuyerRequestCard, 
  MarketplaceFilters,
  SellerOnboardingCTA,
  SellerCard
} from '../components/MarketplaceComponents';
import { PremiumLock, PremiumBadge } from '../components/PremiumLock';
import { toast } from 'react-hot-toast';

interface MarketPageProps {
  t: (key: string) => string;
  lang: string;
  marketSearchQuery: string;
  setMarketSearchQuery: (query: string) => void;
  user: any;
  setIsAddProductModalOpen: (open: boolean) => void;
  setFormStep: (step: number) => void;
  setActiveTab: (tab: any) => void;
}

export const MarketPage: React.FC<MarketPageProps> = ({ 
  t, 
  lang,
  marketSearchQuery, 
  setMarketSearchQuery, 
  user, 
  setIsAddProductModalOpen, 
  setFormStep,
  setActiveTab
}) => {
  const [marketTab, setMarketTab] = React.useState<'supply' | 'demand' | 'insights'>('supply');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [reportingItem, setReportingItem] = React.useState<any>(null);
  const [reportReason, setReportReason] = React.useState('');

  const isPremium = user?.tier === 'Premium' || user?.tier === 'Verified Seller';
  const onUpgrade = () => setActiveTab('account');

  const handleReport = () => {
    if (!reportReason.trim()) {
      toast.error(t('market.provideReason'));
      return;
    }
    toast.success(t('market.reportSuccess'));
    setReportingItem(null);
    setReportReason('');
  };

  const verifiedSellers = Array.from(new Set(marketplaceListings.map(l => l.seller.id)))
    .map(id => marketplaceListings.find(l => l.seller.id === id)?.seller)
    .filter(s => s?.verified);

  return (
    <motion.div 
      key="market"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Market Sub-Nav */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setMarketTab('supply')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${marketTab === 'supply' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <LayoutGrid className="w-4 h-4" /> {t('market.supply')}
        </button>
        <button 
          onClick={() => setMarketTab('demand')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${marketTab === 'demand' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <ClipboardList className="w-4 h-4" /> {t('market.demand')}
        </button>
        <button 
          onClick={() => setMarketTab('insights')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 relative ${marketTab === 'insights' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <TrendingUp className="w-4 h-4" /> 
          {t('market.insights')}
          {!isPremium && <Crown className="w-3 h-3 absolute -top-1 -right-1 text-amber-500 fill-amber-500" />}
        </button>
      </div>

      {marketTab === 'insights' && (
        <PremiumLock 
          isLocked={!isPremium} 
          t={t} 
          onUpgrade={onUpgrade} 
          featureKey="home.marketAnalytics"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ChartLine className="w-6 h-6 text-primary" />
                {t('account.premiumBenefits')}
              </h2>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {t('common.activeAlerts')}
              </span>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">{t('common.cropGuides')}</th>
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Limbe</th>
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Lilongwe</th>
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Mzuzu</th>
                      <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">{t('common.unit')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketPricesData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="py-4 px-2 font-bold">{row.commodity}</td>
                        <td className="py-4 px-2 text-primary font-medium">{row.limbe.toLocaleString()}</td>
                        <td className="py-4 px-2 text-primary font-medium">{row.lilongwe.toLocaleString()}</td>
                        <td className="py-4 px-2 text-primary font-medium">{row.mzuzu.toLocaleString()}</td>
                        <td className="py-4 px-2 text-gray-500 text-sm">per {row.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Trends Chart */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {t('market.priceTrends')}
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      tickFormatter={(value) => `MK${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                      }} 
                    />
                    <Legend iconType="circle" />
                      <Line 
                        type="monotone" 
                        dataKey="maize" 
                        name={t('common.maize')} 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#10b981' }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="beans" 
                        name={t('common.beans')} 
                        stroke="#f59e0b" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#f59e0b' }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rice" 
                        name={t('common.rice')} 
                        stroke="#6366f1" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#6366f1' }} 
                      />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </PremiumLock>
      )}

      {(marketTab === 'supply' || marketTab === 'demand') && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={marketSearchQuery}
                onChange={(e) => setMarketSearchQuery(e.target.value)}
                placeholder={
                  marketTab === 'supply' ? t('market.searchProducts') : 
                  t('market.searchRequests')
                }
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {marketTab === 'supply' ? t('market.availableSupply') : 
                 t('market.currentDemand')}
              </h2>
              <p className="text-sm text-gray-500">
                {marketTab === 'supply' ? t('market.browseVerified') : 
                 t('market.seeWhatBuyersWant')}
              </p>
            </div>
            
            {(marketTab === 'supply' || marketTab === 'demand') && (
              <button 
                onClick={() => {
                  if (user) {
                    setIsAddProductModalOpen(true);
                    setFormStep(marketTab === 'supply' ? 1 : 10); // 10 is start of buyer request form
                  } else {
                    alert(t('account.signIn'));
                  }
                }}
                className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 ${marketTab === 'supply' ? 'bg-primary text-white shadow-primary/10' : 'bg-indigo-600 text-white shadow-indigo-500/10'}`}
              >
                <PlusCircle className="w-5 h-5" />
                {marketTab === 'supply' ? t('market.addListing') : t('market.postRequest')}
              </button>
            )}
          </div>

          {marketTab === 'supply' && (
            <>
              <MarketplaceFilters 
                categories={marketCategories} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                t={t} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceListings
                  .filter(item => 
                    (activeCategory === 'all' || item.category === activeCategory) &&
                    (item.title.toLowerCase().includes(marketSearchQuery.toLowerCase()) || 
                    item.description.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
                    item.seller.location.toLowerCase().includes(marketSearchQuery.toLowerCase()))
                  )
                  .map(item => (
                    <ListingCard key={item.id} listing={item as any} t={t} onReport={setReportingItem} />
                  ))
                }
              </div>

              {user?.tier !== 'Verified Seller' && (
                <div className="mt-12">
                  <SellerOnboardingCTA t={t} onUpgrade={onUpgrade} />
                </div>
              )}
            </>
          )}

          {marketTab === 'demand' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyerRequests
                .filter(req => 
                  req.commodity.toLowerCase().includes(marketSearchQuery.toLowerCase()) || 
                  req.location.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
                  req.buyerName.toLowerCase().includes(marketSearchQuery.toLowerCase())
                )
                .map(req => (
                  <BuyerRequestCard key={req.id} request={req as any} t={t} />
                ))
              }
            </div>
          )}
        </>
      )}

      {/* Report Modal */}
      {reportingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-2 text-rose-600">
                <Flag className="w-6 h-6" />
                {t('market.reportSuspicious')}
              </h3>
              <button onClick={() => setReportingItem(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('market.reporting')}</p>
                <p className="font-bold">{reportingItem.title || reportingItem.businessName}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  {t('market.reasonForReport')}
                </label>
                <textarea 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder={t('market.describeIssue')}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setReportingItem(null)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={handleReport}
                  className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all"
                >
                  {t('market.submitReport')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
