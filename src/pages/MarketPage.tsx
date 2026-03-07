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
  AlertCircle
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
  marketPricesData, 
  priceTrendData, 
  marketplaceListings, 
  buyerRequests,
  marketCategories,
  deliveryMethods
} from '../data/mockData';
import { 
  ListingCard, 
  BuyerRequestCard, 
  MarketplaceFilters,
  SellerOnboardingCTA
} from '../components/MarketplaceComponents';

interface MarketPageProps {
  t: (en: string, ny: string) => string;
  marketSearchQuery: string;
  setMarketSearchQuery: (query: string) => void;
  user: any;
  setIsAddProductModalOpen: (open: boolean) => void;
  setFormStep: (step: number) => void;
}

export const MarketPage: React.FC<MarketPageProps> = ({ 
  t, 
  marketSearchQuery, 
  setMarketSearchQuery, 
  user, 
  setIsAddProductModalOpen, 
  setFormStep 
}) => {
  const [marketTab, setMarketTab] = React.useState<'supply' | 'demand' | 'trends'>('supply');
  const [activeCategory, setActiveCategory] = React.useState('all');

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
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${marketTab === 'supply' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <LayoutGrid className="w-4 h-4" /> {t('Supply', 'Zogulitsa')}
        </button>
        <button 
          onClick={() => setMarketTab('demand')}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${marketTab === 'demand' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <ClipboardList className="w-4 h-4" /> {t('Demand', 'Zofunika')}
        </button>
        <button 
          onClick={() => setMarketTab('trends')}
          className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${marketTab === 'trends' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <TrendingUp className="w-4 h-4" /> {t('Trends', 'Mitengo')}
        </button>
      </div>

      {marketTab === 'trends' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ChartLine className="w-6 h-6 text-primary" />
              {t('Market Prices (MK)', 'Mitengo ya pa Msika (MK)')}
            </h2>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {t('Updated: Today', 'Zasinthidwa: Lero')}
            </span>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">{t('Commodity', 'Zokolola')}</th>
                    <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Limbe</th>
                    <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Lilongwe</th>
                    <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Mzuzu</th>
                    <th className="py-4 px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">{t('Unit', 'Muyeso')}</th>
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
              {t('Price Trends (Last 5 Months)', 'Kayendedwe ka Mitengo (Myezi 5 Yapitayi)')}
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
                    name={t('Maize', 'Chimanga')} 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10b981' }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="beans" 
                    name={t('Beans', 'Nyemba')} 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#f59e0b' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rice" 
                    name={t('Rice', 'Mpunga')} 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#6366f1' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
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
                placeholder={marketTab === 'supply' ? t('Search products or locations...', 'Sakani zokolola kapena malo...') : t('Search buyer requests...', 'Sakani zofunika za ogula...')}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {marketTab === 'supply' ? t('Available Supply', 'Zogulitsa Zomwe Zilipo') : t('Current Demand', 'Zofunika za Ogula')}
              </h2>
              <p className="text-sm text-gray-500">
                {marketTab === 'supply' ? t('Browse verified products from farmers across Malawi.', 'Onani zokolola zotsimikizika kuchokera kwa alimi m\'Malawi muno.') : t('See what buyers are looking for and fulfill their needs.', 'Onani zomwe ogula akufuna ndipo gulitsani zokolola zanu.')}
              </p>
            </div>
            
            <button 
              onClick={() => {
                if (user) {
                  setIsAddProductModalOpen(true);
                  setFormStep(marketTab === 'supply' ? 1 : 10); // 10 is start of buyer request form
                } else {
                  alert(t('Please sign in to post on the marketplace.', 'Chonde lowani mu akaunti yanu kuti mulembe pa msika.'));
                }
              }}
              className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 ${marketTab === 'supply' ? 'bg-primary text-white shadow-primary/20' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
            >
              <PlusCircle className="w-5 h-5" />
              {marketTab === 'supply' ? t('Add Listing', 'Wonjezani Zogulitsa') : t('Post Request', 'Lembani Chofunika')}
            </button>
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
                    <ListingCard key={item.id} listing={item as any} t={t} />
                  ))
                }
              </div>

              {user?.tier !== 'Verified Seller' && (
                <div className="mt-12">
                  <SellerOnboardingCTA t={t} onUpgrade={() => {}} />
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
    </motion.div>
  );
};
