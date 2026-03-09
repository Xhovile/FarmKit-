import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Search, 
  Calendar, 
  ArrowRight, 
  Beef,
  TrendingUp,
  Store,
  GraduationCap,
  AlertTriangle,
  MapPin,
  Clock,
  ExternalLink,
  LayoutDashboard,
  Map as MapIcon,
  Crown
} from 'lucide-react';
// Real data states (placeholders for now)
const cropGuides: any[] = [];
const livestockGuides: any[] = [];
const performingMarkets: any[] = [];
const verifiedTraining: any[] = [];
const seasonalAlerts: any[] = [];
const priceTrendData: any[] = [];
const marketPricesData: any[] = [];
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
import { PremiumLock, PremiumBadge } from '../components/PremiumLock';
import { PesticideMarketMap } from '../components/PesticideMarketMap';

interface HomePageProps {
  t: (key: string) => string;
  lang: string;
  infoCategory: 'overview' | 'crops' | 'livestock' | 'prices' | 'markets' | 'training' | 'alerts' | 'pesticide_map';
  setInfoCategory: (cat: 'overview' | 'crops' | 'livestock' | 'prices' | 'markets' | 'training' | 'alerts' | 'pesticide_map') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedItem: (item: any) => void;
  user: any;
  setActiveTab: (tab: any) => void;
  setIsChatOpen: (val: boolean) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  t, 
  lang,
  infoCategory, 
  setInfoCategory, 
  searchQuery, 
  setSearchQuery, 
  setSelectedItem,
  user,
  setActiveTab,
  setIsChatOpen
}) => {
  const isPremium = user?.tier === 'Premium' || user?.tier === 'Verified Seller';
  const onUpgrade = () => setActiveTab('account');

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);

  const categories = [
    { id: 'overview', icon: LayoutDashboard, label: t('common.overview') },
    { id: 'crops', icon: Leaf, label: t('common.cropGuides') },
    { id: 'livestock', icon: Beef, label: t('common.livestock') },
    { id: 'prices', icon: TrendingUp, label: t('common.priceTrends') },
    { id: 'markets', icon: Store, label: t('common.markets'), premium: true },
    { id: 'pesticide_map', icon: MapIcon, label: t('common.pesticideMap'), premium: true },
    { id: 'training', icon: GraduationCap, label: t('common.training') },
    { id: 'alerts', icon: AlertTriangle, label: t('common.alerts') },
  ];

  const currentCategory = categories.find(c => c.id === infoCategory) || categories[0];

  return (
    <motion.div 
      key="info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search Section */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('market')}
            className="flex flex-col items-center gap-3 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300">{t('common.market')}</span>
          </button>
          <button 
            onClick={() => setActiveTab('experts')}
            className="flex flex-col items-center gap-3 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-blue-700 dark:text-blue-300">{t('common.experts')}</span>
          </button>
          <button 
            onClick={() => {
              setActiveTab('experts');
              setInfoCategory('alerts');
            }}
            className="flex flex-col items-center gap-3 p-6 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/20 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-rose-700 dark:text-rose-300">{t('common.alerts')}</span>
          </button>
          <button 
            onClick={() => setActiveTab('account')}
            className="flex flex-col items-center gap-3 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/20 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-amber-700 dark:text-amber-300">{t('common.account')}</span>
          </button>
        </div>

        {/* Featured Content */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{t('home.featured')}</h3>
            <button onClick={() => setActiveTab('experts')} className="text-primary text-sm font-bold hover:underline">
              {t('common.viewAll')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Trend Summary */}
            <div 
              onClick={() => {
                setActiveTab('experts');
                setInfoCategory('prices');
              }}
              className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{t('common.marketTrends')}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{t('home.maizePricesUp')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{t('home.maizePricesUpDesc')}</p>
            </div>

            {/* Seasonal Alert Summary */}
            <div 
              onClick={() => {
                setActiveTab('experts');
                setInfoCategory('alerts');
              }}
              className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/20 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">{t('common.activeAlerts')}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{t('home.weatherAlert')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{t('home.weatherAlertDesc')}</p>
            </div>
          </div>

          {/* Ask AI Entry */}
          <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-[2.5rem] border border-primary/10 text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t('home.askAiTitle')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {t('home.askAiDesc')}
            </p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all"
            >
              {t('home.startChat')}
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

