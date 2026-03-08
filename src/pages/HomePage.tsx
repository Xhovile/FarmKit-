import React from 'react';
import { motion } from 'motion/react';
import { 
  Leaf, 
  Search, 
  Calendar, 
  ArrowRight, 
  Lightbulb,
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
import { TipCard } from '../components/Cards';
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
  setActiveTab
}) => {
  const isPremium = user?.tier === 'Premium' || user?.tier === 'Verified Seller';
  const onUpgrade = () => setActiveTab('account');

  return (
    <motion.div 
      key="info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Category Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {[
          { id: 'overview', icon: LayoutDashboard, label: t('common.overview') },
          { id: 'crops', icon: Leaf, label: t('common.cropGuides') },
          { id: 'livestock', icon: Beef, label: t('common.livestock') },
          { id: 'prices', icon: TrendingUp, label: t('common.priceTrends') },
          { id: 'markets', icon: Store, label: t('common.markets'), premium: true },
          { id: 'pesticide_map', icon: MapIcon, label: t('common.pesticideMap'), premium: true },
          { id: 'training', icon: GraduationCap, label: t('common.training') },
          { id: 'alerts', icon: AlertTriangle, label: t('common.alerts') },
        ].map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setInfoCategory(cat.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all relative ${infoCategory === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <cat.icon className="w-4 h-4" /> 
            {cat.label}
            {cat.premium && !isPremium && (
              <div className="absolute -top-1 -right-1">
                <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
            )}
          </button>
        ))}
      </div>

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

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overview Dashboard */}
          {infoCategory === 'overview' && (
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Seasonal Alert Summary */}
              {seasonalAlerts.length > 0 && (
                <div 
                  onClick={() => setInfoCategory('alerts')}
                  className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/20 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">{t('common.activeAlerts')}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{lang === 'en' ? seasonalAlerts[0].title : seasonalAlerts[0].titleNy}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{lang === 'en' ? seasonalAlerts[0].content : seasonalAlerts[0].contentNy}</p>
                </div>
              )}

              {/* Price Trend Summary */}
              <div 
                onClick={() => setInfoCategory('prices')}
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

              {/* Training Summary */}
              {verifiedTraining.length > 0 && (
                <div 
                  onClick={() => setInfoCategory('training')}
                  className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/20 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t('common.newTraining')}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{verifiedTraining[0].title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{verifiedTraining[0].description}</p>
                </div>
              )}

              {/* Quick Links to Modules */}
              <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {[
                  { id: 'crops', icon: Leaf, label: t('common.cropGuides'), color: 'bg-emerald-500' },
                  { id: 'livestock', icon: Beef, label: t('common.livestock'), color: 'bg-amber-500' },
                  { id: 'markets', icon: Store, label: t('common.markets'), color: 'bg-indigo-500' },
                  { id: 'training', icon: GraduationCap, label: t('common.training'), color: 'bg-blue-500' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setInfoCategory(item.id as any)}
                    className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Crop Guides */}
          {infoCategory === 'crops' && cropGuides
            .filter(crop => crop.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(crop => (
            <motion.div 
              layout
              key={crop.id} 
              onClick={() => setSelectedItem({ ...crop, type: 'crop' })}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">{crop.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" /> {crop.plantingDates}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{crop.tips}</p>
                <div className="mt-5 flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                  {t('home.viewFullGuide')} <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Livestock Guides */}
          {infoCategory === 'livestock' && livestockGuides
            .filter(guide => guide.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(guide => (
            <motion.div 
              layout
              key={guide.id} 
              onClick={() => setSelectedItem({ ...guide, type: 'livestock' })}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={guide.image} alt={guide.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">{guide.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">{guide.tips}</p>
                <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                  {t('home.managementGuide')} <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Price Trends */}
          {infoCategory === 'prices' && (
            <div className="col-span-full space-y-8">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  {t('home.marketPriceTrends')}
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `MK${value}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                      <Legend iconType="circle" />
                          <Line type="monotone" dataKey="maize" name={t('common.maize')} stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="beans" name={t('common.beans')} stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketPricesData.map((price, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{price.commodity}</h4>
                      <p className="text-xs text-gray-500">{t('common.unit')}: {price.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-primary">MK {price.lilongwe}</p>
                      <p className="text-[10px] text-emerald-500 font-bold">{t('home.avgLilongwe')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performing Markets */}
          {infoCategory === 'markets' && (
            <div className="col-span-full">
              <PremiumLock 
                isLocked={!isPremium} 
                t={t} 
                onUpgrade={onUpgrade} 
                featureKey="home.performingMarkets"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {performingMarkets
                    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(market => (
                    <motion.div 
                      layout
                      key={market.id}
                      className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          <Store className="w-6 h-6" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${market.trend === 'Upward' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {market.trend} {t('common.trend')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{market.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <MapPin className="w-3 h-3 mr-1" /> {market.location}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{market.description}</p>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('home.topCommodities')}</p>
                        <div className="flex flex-wrap gap-2">
                          {market.topCommodities.map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg text-[10px] font-medium">{c}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </PremiumLock>
            </div>
          )}

          {/* Pesticide Market Map */}
          {infoCategory === 'pesticide_map' && (
            <div className="col-span-full">
              <PremiumLock 
                isLocked={!isPremium} 
                t={t} 
                onUpgrade={onUpgrade} 
                featureKey="common.pesticideMap"
              >
                <PesticideMarketMap t={t} lang={lang} />
              </PremiumLock>
            </div>
          )}

          {/* Verified Training */}
          {infoCategory === 'training' && verifiedTraining
            .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(course => (
            <motion.div 
              layout
              key={course.id}
              className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="h-40 relative">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-primary shadow-sm">
                    {course.duration}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-xs text-primary font-medium mb-3">{course.provider}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">{course.description}</p>
                <button className="w-full py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                  {t('common.enrollNow')} <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Seasonal Alerts */}
          {infoCategory === 'alerts' && seasonalAlerts
            .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(alert => (
            <motion.div 
              layout
              key={alert.id}
              className={`p-6 rounded-3xl border-2 transition-all ${alert.severity === 'Critical' ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/20' : alert.severity === 'High' ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${alert.severity === 'Critical' ? 'bg-rose-500 text-white' : alert.severity === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${alert.severity === 'Critical' ? 'text-rose-600' : alert.severity === 'High' ? 'text-amber-600' : 'text-blue-600'}`}>
                    {alert.severity}
                  </span>
                  <div className="flex items-center text-[10px] text-gray-400 mt-1">
                    <Clock className="w-3 h-3 mr-1" /> {alert.date}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{lang === 'en' ? alert.title : alert.titleNy}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lang === 'en' ? alert.content : alert.contentNy}</p>
              <button className={`mt-6 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all ${alert.severity === 'Critical' ? 'text-rose-600' : alert.severity === 'High' ? 'text-amber-600' : 'text-blue-600'}`}>
                {t('common.takeAction')} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Tips - Now more integrated */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Lightbulb className="w-6 h-6" />
            </div>
            {t('common.expertTips')}
          </h2>
          <button className="text-sm font-bold text-primary hover:underline">{t('common.viewAll')}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              author: "James Banda",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
              time: "2 days ago",
              content: t("chat.aiResponse"),
              likes: 45,
              comments: 12
            },
            {
              author: "Grace Mbewe",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
              time: "5 days ago",
              content: t("chat.aiResponse"),
              image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400",
              likes: 78,
              comments: 23
            }
          ].map((tip, i) => (
            <TipCard 
              key={i}
              author={tip.author}
              avatar={tip.avatar}
              time={tip.time}
              content={tip.content}
              image={tip.image}
              likes={tip.likes}
              comments={tip.comments}
              t={t}
            />
          ))}
        </div>
      </section>
    </motion.div>
  );
};

