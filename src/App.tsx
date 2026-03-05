import React, { useState, useEffect } from 'react';
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
  Book, 
  Store, 
  ChartLine, 
  Users, 
  Star, 
  User, 
  Search, 
  Mic, 
  PlusCircle, 
  Sprout, 
  Lightbulb, 
  Calendar, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  ChevronRight, 
  ArrowDown, 
  ArrowRight,
  Wifi,
  CloudSun,
  Droplets,
  Crown,
  UserCircle,
  MessageCircle,
  Languages,
  Phone,
  Bug,
  Leaf,
  FlaskConical,
  Info,
  Droplets as Water,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Language = 'en' | 'ny';
type Tab = 'info' | 'market' | 'community' | 'account';

const marketplaceListings = [
  {
    id: 1,
    title: "Fresh Organic Maize",
    price: 45000,
    image: "https://picsum.photos/seed/maize/800/600",
    description: "High quality, sun-dried organic maize. Harvested last week. Available in 50kg bags.",
    seller: {
      name: "Chifundo Phiri",
      avatar: "https://picsum.photos/seed/seller1/100/100",
      location: "Lilongwe, Area 25",
      phone: "265888123456"
    }
  },
  {
    id: 2,
    title: "Red Kidney Beans",
    price: 1200,
    image: "https://picsum.photos/seed/beans/800/600",
    description: "Grade A red kidney beans. Very clean and well-sorted. Price per kg.",
    seller: {
      name: "Grace Mwale",
      avatar: "https://picsum.photos/seed/seller2/100/100",
      location: "Dedza Boma",
      phone: "265999654321"
    }
  },
  {
    id: 3,
    title: "Hybrid Tomato Seedlings",
    price: 5000,
    image: "https://picsum.photos/seed/tomatoes/800/600",
    description: "Strong, disease-resistant tomato seedlings ready for transplanting. Tray of 50.",
    seller: {
      name: "John Banda",
      avatar: "https://picsum.photos/seed/seller3/100/100",
      location: "Ntcheu",
      phone: "265881112233"
    }
  }
];

const cropGuides = [
  {
    id: 'maize',
    name: "Maize (Chimanga)",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Nov - Dec (Rain-fed)",
    spacing: "75cm x 25cm (1 seed per station)",
    fertilizer: "Basal: 23:21:0+4S (at planting). Top: Urea (3-4 weeks after).",
    tips: "Keep field weed-free during the first 6 weeks."
  },
  {
    id: 'tobacco',
    name: "Tobacco (Fodya)",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Dec - Jan",
    spacing: "120cm x 60cm",
    fertilizer: "Basal: Compound D. Top: CAN or Nitrate of Soda.",
    tips: "Requires careful nursery management before transplanting."
  },
  {
    id: 'soya',
    name: "Soya Beans (Soya)",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Nov - Dec",
    spacing: "45cm x 5cm",
    fertilizer: "Inoculum (Rhizobium) at planting. Single Super Phosphate if needed.",
    tips: "Inoculation is key for high yields and nitrogen fixation."
  },
  {
    id: 'cotton',
    name: "Cotton (Thonje)",
    image: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Nov - Dec",
    spacing: "60cm x 20cm",
    fertilizer: "Basal: Compound L. Boron application is often necessary.",
    tips: "Requires intensive pest management throughout the season."
  },
  {
    id: 'tomatoes',
    name: "Tomatoes (Mapichesi/Matimati)",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Year-round (Irrigation preferred)",
    spacing: "60cm x 45cm",
    fertilizer: "Basal: Compound S. Top: CAN at flowering.",
    tips: "Staking helps prevent fruit rot and diseases."
  },
  {
    id: 'groundnuts',
    name: "Groundnuts (Mtedza)",
    image: "https://images.unsplash.com/photo-1563636619-e9107b1c196e?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Nov - Dec",
    spacing: "30cm x 15cm",
    fertilizer: "Gypsum (Calcium Sulfate) at flowering for pod filling.",
    tips: "Earth up plants to encourage more pods."
  }
];

const pestsData = [
  {
    id: 'fall-armyworm',
    name: "Fall Armyworm",
    symptoms: "Holes in leaves, sawdust-like droppings in the whorl.",
    organicControl: "Neem oil spray, hand-picking, or putting sand/ash in the whorl.",
    chemicalControl: "Cypermethrin or Belt (Flubendiamide).",
    image: "https://images.unsplash.com/photo-1502622645662-320b7671aa42?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'aphids',
    name: "Aphids",
    symptoms: "Curled leaves, sticky honeydew, stunted growth.",
    organicControl: "Strong water spray, soap water solution, or garlic spray.",
    chemicalControl: "Imidacloprid or Dimethoate.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tuta-absoluta',
    name: "Tomato Leaf Miner (Tuta)",
    symptoms: "Blotches on leaves, tunnels in stems and fruits.",
    organicControl: "Pheromone traps, removing infested leaves.",
    chemicalControl: "Spinosad or Coragen.",
    image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&q=80&w=800"
  }
];

const organicFertilizerGuides = [
  {
    id: 'compost',
    name: "Compost Manure (Manyowa a Khola)",
    steps: [
      "Select a shaded site.",
      "Layer 1: Dry stalks/grass (15cm).",
      "Layer 2: Green leaves/waste (15cm).",
      "Layer 3: Animal manure (5cm).",
      "Layer 4: Topsoil (2cm).",
      "Water each layer and repeat until 1.5m high.",
      "Turn every 3-4 weeks. Ready in 3 months."
    ],
    benefits: "Improves soil structure and water retention."
  },
  {
    id: 'liquid-manure',
    name: "Liquid Manure (Manyowa a Madzi)",
    steps: [
      "Fill a sack with 10kg of fresh animal manure.",
      "Suspend the sack in a 50L drum of water.",
      "Cover and let it ferment for 14 days.",
      "Dilute 1 part manure to 3 parts water before applying.",
      "Apply directly to the base of plants."
    ],
    benefits: "Fast-acting nutrient boost for growing crops."
  }
];

const marketPricesData = [
  { commodity: 'Maize (Chimanga)', limbe: 850, lilongwe: 800, mzuzu: 750, unit: 'kg' },
  { commodity: 'Beans (Nyemba)', limbe: 1500, lilongwe: 1400, mzuzu: 1300, unit: 'kg' },
  { commodity: 'Rice (Mpunga)', limbe: 1800, lilongwe: 1750, mzuzu: 1700, unit: 'kg' },
  { commodity: 'Soya Beans', limbe: 900, lilongwe: 850, mzuzu: 800, unit: 'kg' },
];

const priceTrendData = [
  { month: 'Jan', maize: 600, beans: 1200, rice: 1500 },
  { month: 'Feb', maize: 650, beans: 1250, rice: 1550 },
  { month: 'Mar', maize: 750, beans: 1300, rice: 1600 },
  { month: 'Apr', maize: 800, beans: 1400, rice: 1700 },
  { month: 'May', maize: 850, beans: 1500, rice: 1800 },
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [infoCategory, setInfoCategory] = useState<'crops' | 'pests' | 'organic'>('crops');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState<{ name: string; tier: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: 'Hello! How can I help you with your farm today?', isUser: false }
  ]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate login
    const timer = setTimeout(() => {
      setUser({ name: 'John Phiri', tier: 'Verified Seller' });
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, []);

  const t = (en: string, ny: string) => (lang === 'en' ? en : ny);

  const switchLanguage = (newLang: Language) => setLang(newLang);

  return (
    <div className="bg-neutral-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-2.5 right-2.5 z-50 bg-red-500 text-white px-3 py-1 rounded-lg text-sm shadow-lg flex items-center animate-bounce">
          <Wifi className="w-4 h-4 mr-1" /> {t('Offline Mode', 'Popanda Intaneti')}
        </div>
      )}

      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-30 shadow-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 shadow-inner border border-white/20 shrink-0">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-[140px]">
                <h1 className="text-2xl font-bold tracking-tight font-serif">
                  <span className="text-green-400">Farm</span><span className="text-amber-300">Kit</span>
                </h1>
                <p className="text-indigo-100/80 text-xs font-medium tracking-wide truncate">
                  {t('Complete Agricultural Platform', 'Malo Onse a Ulimi')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {/* Language Toggle */}
              <button 
                onClick={() => switchLanguage(lang === 'en' ? 'ny' : 'en')}
                className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-bold border border-white/20 flex items-center shadow-sm hover:bg-white/20 transition-all group"
                title={t('Switch to Chichewa', 'Sinthani kukhala Chingerezi')}
              >
                <Languages className="w-4 h-4 mr-2 opacity-70 group-hover:rotate-12 transition-transform" />
                <span className="uppercase">{lang}</span>
              </button>

              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/20 flex items-center shadow-sm">
                <UserCircle className="w-4 h-4 mr-2 opacity-70" /> {user ? user.name : t('Guest', 'Mlendo')}
              </span>
              {user && (
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center ${user.tier === 'Verified Seller' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white border border-white/20'}`}>
                  {user.tier === 'Verified Seller' ? (
                    <><ThumbsUp className="w-4 h-4 mr-2" /> {t('Verified', 'Wotsimikizika')}</>
                  ) : (
                    <><UserCircle className="w-4 h-4 mr-2 opacity-70" /> {t('Free', 'Waulere')}</>
                  )}
                </span>
              )}
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm border ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                <span className={`inline-block w-2 h-2 rounded-full pulse ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></span> 
                {isOnline ? t('Online', 'Pa Intaneti') : t('Offline', 'Popanda Intaneti')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Weather Widget */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="weather-widget text-white p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm md:text-base">
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <CloudSun className="w-5 h-5 mr-3 text-amber-300" />
              <span className="font-medium">{t('Lilongwe: 24°C, Partly Cloudy', 'Lilongwe: 24°C, Mitambo')}</span>
            </div>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <Droplets className="w-5 h-5 mr-3 text-indigo-300 animate-bounce" />
              <span className="font-medium">{t('Rainy Season Alert: Plant beans now!', 'Mvula: Dzala nyemba tsopano!')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop (Top) & Mobile (Bottom) */}
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64 shrink-0">
                {selectedItem.image && (
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
                {!selectedItem.image && (
                  <div className="w-full h-full bg-emerald-500 flex items-center justify-center">
                    <FlaskConical className="w-20 h-20 text-white/50" />
                  </div>
                )}
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                  <h2 className="text-3xl font-bold text-white font-serif">{selectedItem.name}</h2>
                </div>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                {selectedItem.type === 'crop' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{t('Planting Dates', 'Nthawi Yobzyala')}</h4>
                        <p className="font-medium">{selectedItem.plantingDates}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{t('Spacing', 'Mipata')}</h4>
                        <p className="font-medium">{selectedItem.spacing}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{t('Fertilizer Requirements', 'Manyowa Ofunika')}</h4>
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <p className="text-indigo-900 dark:text-indigo-200 font-medium">{selectedItem.fertilizer}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{t('Expert Tips', 'Malangizo a Akatswiri')}</h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedItem.tips}</p>
                    </div>
                  </>
                )}

                {selectedItem.type === 'pest' && (
                  <>
                    <div>
                      <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">{t('Symptoms', 'Zizindikiro')}</h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedItem.symptoms}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                        <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center">
                          <Leaf className="w-4 h-4 mr-2" /> {t('Organic Control', 'Njira za Zachilengedwe')}
                        </h4>
                        <p className="text-emerald-800 dark:text-emerald-200">{selectedItem.organicControl}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                          <FlaskConical className="w-4 h-4 mr-2" /> {t('Chemical Control', 'Njira za Mankhwala')}
                        </h4>
                        <p className="text-blue-800 dark:text-blue-200">{selectedItem.chemicalControl}</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedItem.type === 'organic' && (
                  <>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">{t('Benefits', 'Ubwino Wake')}</h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedItem.benefits}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">{t('Preparation Steps', 'Mmene Mungapangire')}</h4>
                      <div className="space-y-3">
                        {selectedItem.steps.map((step: string, i: number) => (
                          <div key={i} className="flex gap-3 items-start">
                            <span className="w-6 h-6 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-200">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-gray-700 z-50 md:relative md:bottom-auto md:bg-transparent md:border-none md:mt-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around md:justify-center items-center gap-1 md:gap-4 py-2 md:py-0">
            <NavAction 
              active={activeTab === 'info'} 
              onClick={() => setActiveTab('info')} 
              icon={<Book className="w-5 h-5 md:w-4 md:h-4" />} 
              label={t('Info', 'Zidziwitso')} 
            />
            <NavAction 
              active={activeTab === 'market'} 
              onClick={() => setActiveTab('market')} 
              icon={<Store className="w-5 h-5 md:w-4 md:h-4" />} 
              label={t('Market', 'Msika')} 
            />
            <NavAction 
              active={activeTab === 'community'} 
              onClick={() => setActiveTab('community')} 
              icon={<Users className="w-5 h-5 md:w-4 md:h-4" />} 
              label={t('Social', 'Gulu')} 
            />
            <NavAction 
              active={activeTab === 'account'} 
              onClick={() => setActiveTab('account')} 
              icon={<UserCircle className="w-5 h-5 md:w-4 md:h-4" />} 
              label={t('Account', 'Inu')} 
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pb-24 md:pb-16 mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div 
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Category Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                <button 
                  onClick={() => setInfoCategory('crops')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${infoCategory === 'crops' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700'}`}
                >
                  <Leaf className="w-4 h-4" /> {t('Crop Guides', 'Malangizo a Mbewu')}
                </button>
                <button 
                  onClick={() => setInfoCategory('pests')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${infoCategory === 'pests' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700'}`}
                >
                  <Bug className="w-4 h-4" /> {t('Pests & Diseases', 'Tizilombo ndi Matenda')}
                </button>
                <button 
                  onClick={() => setInfoCategory('organic')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${infoCategory === 'organic' ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700'}`}
                >
                  <FlaskConical className="w-4 h-4" /> {t('Organic Fertilizer', 'Manyowa a Zachilengedwe')}
                </button>
              </div>

              {/* Search Section */}
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('Search for information...', 'Sakani zidziwitso...')}
                      className="w-full px-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {infoCategory === 'crops' && cropGuides
                    .filter(crop => crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || crop.tips.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(crop => (
                    <div 
                      key={crop.id} 
                      onClick={() => setSelectedItem({ ...crop, type: 'crop' })}
                      className="group cursor-pointer bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <h3 className="text-white font-bold text-lg">{crop.name}</h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3 mr-1" /> {crop.plantingDates}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{crop.tips}</p>
                        <div className="mt-4 flex items-center text-primary font-bold text-sm">
                          {t('View Guide', 'Onani Malangizo')} <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {infoCategory === 'pests' && pestsData
                    .filter(pest => pest.name.toLowerCase().includes(searchQuery.toLowerCase()) || pest.symptoms.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(pest => (
                    <div 
                      key={pest.id} 
                      onClick={() => setSelectedItem({ ...pest, type: 'pest' })}
                      className="group cursor-pointer bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img src={pest.image} alt={pest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <h3 className="text-white font-bold text-lg">{pest.name}</h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{pest.symptoms}</p>
                        <div className="flex items-center text-rose-500 font-bold text-sm">
                          {t('Control Methods', 'Njira Zolimbirana')} <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {infoCategory === 'organic' && organicFertilizerGuides
                    .filter(guide => guide.name.toLowerCase().includes(searchQuery.toLowerCase()) || guide.benefits.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(guide => (
                    <div 
                      key={guide.id} 
                      onClick={() => setSelectedItem({ ...guide, type: 'organic' })}
                      className="group cursor-pointer bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{guide.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{guide.benefits}</p>
                      <div className="flex items-center text-emerald-600 font-bold text-sm">
                        {t('How to Prepare', 'Mmene Mungapangire')} <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Latest Farming Tips */}
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-primary text-white p-2 rounded-lg mr-2 shadow-sm">
                    <Lightbulb className="w-6 h-6" />
                  </span>
                  {t('Latest Farming Tips', 'Malangizo Atsopano')}
                </h2>

                <div className="space-y-4">
                  <TipCard 
                    author="James Banda"
                    avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                    time="2 days ago"
                    content={t("When planting maize, ensure spacing of 75cm between rows and 25cm between plants for optimal yield.", "Pobzyala chimanga, siyani mpata wa 75cm pakati pa mizere ndi 25cm pakati pa mbewu kuti zokolola zikhale zambiri.")}
                    likes={45}
                    comments={12}
                    t={t}
                  />
                  <TipCard 
                    author="Grace Mbewe"
                    avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
                    time="5 days ago"
                    content={t("Mix wood ash with your compost to add potassium and reduce acidity. Great for tomatoes and peppers!", "Sakanizani phulusa ndi manyowa kuti muonjezere potassium ndikuchotsa acidity. Zabwino kwa mapuno ndi tsabola!")}
                    image="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400"
                    likes={78}
                    comments={23}
                    t={t}
                  />
                </div>

                <div className="mt-6 flex justify-center">
                  <button className="bg-white text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors shadow-sm flex items-center">
                    {t('View All Tips', 'Onani Malangizo Onse')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </section>

              {/* Upcoming Events */}
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="bg-primary text-white p-2 rounded-lg mr-2 shadow-sm">
                    <Calendar className="w-6 h-6" />
                  </span>
                  {t('Upcoming Farming Events', 'Zochitika za Ulimi Zikubwera')}
                </h2>

                <div className="space-y-4">
                  <EventCard 
                    day="15"
                    month="Dec"
                    location="Lilongwe"
                    title={t("Modern Irrigation Techniques Workshop", "Maphunziro a Njira Zamakono Zothilira")}
                    description={t("Learn about water-efficient irrigation methods suitable for small-scale farmers.", "Phunzirani za njira zothirira zomwe zimagwiritsa ntchito madzi pang'ono, zoyenera kwa alimi ang'onoang'ono.")}
                    time="9:00 AM - 2:00 PM"
                    color="bg-primary"
                    t={t}
                  />
                  <EventCard 
                    day="22"
                    month="Dec"
                    location="Blantyre"
                    title={t("Organic Farming Certification Seminar", "Msonkhano wa Chiphaso cha Ulimi wa Zachilengedwe")}
                    description={t("Get information on how to certify your farm as organic and access premium markets.", "Dziwani m'mene mungapezere chiphaso cha ulimi wa zachilengedwe ndi kupeza misika yapamwamba.")}
                    time="10:00 AM - 1:00 PM"
                    color="bg-secondary"
                    t={t}
                  />
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'market' && (
            <motion.div 
              key="market"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Market Prices Section */}
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

              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('Recent Listings', 'Zokolola Zaposachedwa')}</h2>
                <button 
                  onClick={() => {
                    if (user?.tier === 'Verified Seller') {
                      alert(t('Opening product creation form...', 'Tikutsegula fomu yowonjezera zokolola...'));
                    } else {
                      alert(t('Only Verified Sellers can add products. Please upgrade in your account settings.', 'Alimi otsimikizika okha ndi omwe angathe kuwonjezera zokolola. Chonde sinthani mu akaunti yanu.'));
                    }
                  }}
                  className="text-primary font-bold flex items-center gap-1 hover:underline group"
                >
                  {t('Add Product', 'Wonjezani')} 
                  <PlusCircle className={`w-5 h-5 ${user?.tier !== 'Verified Seller' ? 'opacity-50' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceListings.map(item => (
                  <MarketListingCard key={item.id} item={item} t={t} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div 
              key="community"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-12 text-center"
            >
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-2xl font-bold">{t('Community Hub', 'Malo a Gulu')}</h2>
              <p className="text-gray-500 mt-2">{t('Connect with other farmers and experts.', 'Lumikizanani ndi alimi ena komanso akatswiri.')}</p>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div 
              key="account"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user ? user.name : t('Guest User', 'Mlendo')}</h2>
                    <p className="text-gray-500">
                      {user ? (user.tier === 'Verified Seller' ? t('Verified Seller', 'Wogulitsa Wotsimikizika') : t('Free Member', 'Membala Waulere')) : t('Sign in to access all features', 'Lowani kuti mupeze zonse')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      if (user) {
                        const newTier = user.tier === 'Verified Seller' ? 'Free' : 'Verified Seller';
                        setUser({ ...user, tier: newTier });
                        const msg = newTier === 'Verified Seller' 
                          ? t('You are now a Verified Seller!', 'Tsopano ndinu Wogulitsa Wotsimikizika!')
                          : t('Your status has been updated to Free Member.', 'Gulu lanu lasinthidwa kukhala Membala Waulere.');
                        alert(msg);
                      } else {
                        alert(t('Please sign in to verify your account.', 'Chonde lowani kuti mutsimikizire akaunti yanu.'));
                      }
                    }}
                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Star className={`w-5 h-5 mr-3 ${user?.tier === 'Verified Seller' ? 'text-emerald-500' : 'text-accent'}`} />
                    <span className="font-medium">
                      {user?.tier === 'Verified Seller' ? t('Manage Seller Status', 'Sinthani Udindo wa Wogulitsa') : t('Become a Verified Seller', 'Khalani Wogulitsa Wotsimikizika')}
                    </span>
                  </button>
                  <button className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
                    <Clock className="w-5 h-5 mr-3 text-primary" />
                    <span className="font-medium">{t('My Activity', 'Zochitika Zanga')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FAQs section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('Frequently Asked Questions', 'Mafunso Ofunsidwa Kawirikawiri')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <FAQCard 
              q={t("How do I save information for offline use?", "Ndingasunge bwanji zidziwitso kuti ndidzazigwiritse ntchito popanda intaneti?")}
              a={t("To save information for offline use, tap the download icon next to any farming guide or tip. All saved items can be accessed from your profile page.", "Kuti musunge zidziwitso zoti mudzazigwiritse ntchito popanda intaneti, dinani chizindikiro cha kutsitsa pambali pa ulangizi uliwonse wa ulimi. Zinthu zonse zosungidwa zitha kupezeka pa tsamba lanu la mbiri.")}
            />
            <FAQCard 
              q={t("How accurate are the market prices?", "Kodi mitengo ya msika ndi yoona bwanji?")}
              a={t("Market prices are updated daily from our network of on-ground partners at major markets across Malawi. Prices may vary slightly at your local market.", "Mitengo ya msika imaperekedwa tsiku ndi tsiku kuchokera ku gulu lathu la anthu ogwira nawo ntchito ku misika yaikulu ya m'Malawi. Mitengoyi ikhoza kusiyana pang'ono pa msika wanu wa pafupi.")}
            />
            <FAQCard 
              q={t("Can I sell my produce on the marketplace?", "Kodi ndingagulitse zokolola zanga pa msika uno?")}
              a={t("Yes! Any registered user can list products for sale. Simply go to the Marketplace tab, click 'Add Listing' and follow the instructions. Free users can post up to 3 listings per month.", "Inde! Aliyense amene walembetsa akhoza kulemba zokolola zake kuti azigulitse. Pitani ku mbali ya Msika, dinani 'Wonjezani Zokolola' ndikutsatira malangizo. Ogwiritsa ntchito aulere akhoza kulemba zokolola zosaposera zitatu pa mwezi.")}
            />
            <FAQCard 
              q={t("What are the benefits of Premium membership?", "Kodi ubwino wa kulembetsa kwa Premium ndi chani?")}
              a={t("Premium members receive personalized farming advice, unlimited marketplace listings, market price alerts, access to expert consultations, and offline access to all farming guides.", "Mamembala a Premium amalandira malangizo a ulimi okhudza iwo okha, kulemba zokolola zosazukuta, zizindikiro za mitengo ya msika, kupeza malangizo a akatswiri, ndi kupeza malangizo onse a ulimi popanda intaneti.")}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4 font-serif">
                <span className="text-green-500">Farm</span><span className="text-indigo-600 dark:text-indigo-400">Kit</span>
              </h2>
              <p className="text-gray-400 mb-4">
                {t('Empowering farmers across Malawi with information and market access.', 'Kupatsapo mphamvu kwa alimi ku Malawi ndi chidziwitso ndi mwayi wofikira misika.')}
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Users className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('Quick Links', 'Maulalo Osavuta')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('About Us', 'Za Ife')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('Contact Us', 'Tiyenimulumikize')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('FAQ', 'Mafunso')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('Contact Us', 'Tiyenimulumikize')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start"><MapPin className="w-4 h-4 mt-1 mr-2 text-primary" /> 123 Farm Road, Lilongwe</li>
                <li className="flex items-center"><Clock className="w-4 h-4 mr-2 text-primary" /> +265 1 234 5678</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('Download Our App', 'Tsitsani Pulogalamu Yathu')}</h3>
              <div className="space-y-3">
                <div className="bg-black text-white rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-gray-900 transition-colors">
                  <Store className="w-6 h-6 mr-2" />
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-medium">Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2023 <span className="font-serif font-bold"><span className="text-green-500">Farm</span>Kit</span>. {t('All rights reserved.', 'Ufulu wonse ndi wathu.')}
            </p>
          </div>
        </div>
      </footer>

      {/* Draggable Chat Button & Window */}
      <div className="fixed bottom-24 right-6 z-50 md:bottom-6">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 w-80 md:w-96 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-primary p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-bold">{t('FarmKit Assistant', 'Mthandizi wa FarmKit')}</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                  <PlusCircle className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark-900/50">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.isUser 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white dark:bg-dark-800 border-t border-gray-100 dark:border-gray-700">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!chatMessage.trim()) return;
                    setMessages([...messages, { text: chatMessage, isUser: true }]);
                    setChatMessage('');
                    // Simulate response
                    setTimeout(() => {
                      setMessages(prev => [...prev, { text: t("That's a great question! Let me look that up for you.", "Limenelo ndi funso labwino! Ndikuoneni."), isUser: false }]);
                    }, 1000);
                  }}
                  className="flex gap-2"
                >
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={t('Type a message...', 'Lembani uthenga...')}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                  <button type="submit" className="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          drag
          dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
          whileDrag={{ scale: 1.1 }}
          className="cursor-move"
        >
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-primary text-white rounded-full p-4 shadow-2xl hover:bg-primary-dark transition-all z-50 flex items-center justify-center group"
          >
            <MessageCircle className={`w-6 h-6 transition-transform duration-300 ${isChatOpen ? 'rotate-90' : ''}`} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap text-sm font-bold uppercase tracking-wider">
              {t('Chat', 'Chezani')}
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function MarketListingCard({ item, t }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
          MK {item.price.toLocaleString()}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={item.seller.avatar} 
            alt={item.seller.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" 
            referrerPolicy="no-referrer" 
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{item.seller.name}</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">{item.seller.location}</p>
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 h-10">
          {item.description}
        </p>
        
        <a 
          href={`https://wa.me/${item.seller.phone}?text=Hello ${item.seller.name}, I am interested in your ${item.title} on FarmKit.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold transition-all gap-2 shadow-lg shadow-green-500/20 active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          {t('WhatsApp Seller', 'Lankhulani pa WhatsApp')}
        </a>
      </div>
    </div>
  );
}

function NavAction({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col md:flex-row items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 group ${
        active 
          ? 'text-primary md:bg-primary md:text-white md:shadow-lg md:shadow-primary/30' 
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hover:bg-gray-100 dark:md:hover:bg-gray-700'
      }`}
    >
      <div className={`mb-1 md:mb-0 md:mr-2 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className={`text-[10px] md:text-sm font-bold tracking-tight uppercase ${active ? 'opacity-100' : 'opacity-70'}`}>
        {label}
      </span>
      {active && <div className="md:hidden absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />}
    </button>
  );
}

function CropCard({ title, image, badge, rating, reviews, description, status, t }: any) {
  return (
    <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="relative h-36 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
          {badge}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="flex items-center mb-2">
          <div className="text-yellow-500 flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">{rating} ({reviews} {t('reviews', 'ndemanga')})</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 h-10 overflow-hidden">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 px-2 py-1 rounded">{status}</span>
          <button className="text-primary hover:text-primary-dark transition-colors text-sm font-medium flex items-center">
            {t('View Details', 'Onani Zambiri')}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TipCard({ author, avatar, time, content, image, likes, comments, t }: any) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 slide-in">
      <div className="flex items-start">
        <img src={avatar} alt={author} className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-primary" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold">{author}</h3>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{content}</p>
          {image && (
            <div className="mt-2">
              <img src={image} alt="Tip" className="rounded-lg w-full h-32 object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          <div className="flex mt-3 text-sm">
            <button className="flex items-center mr-4 text-gray-500 hover:text-primary transition-colors">
              <ThumbsUp className="w-4 h-4 mr-1" /> {likes}
            </button>
            <button className="flex items-center mr-4 text-gray-500 hover:text-primary transition-colors">
              <MessageSquare className="w-4 h-4 mr-1" /> {comments}
            </button>
            <button className="flex items-center text-gray-500 hover:text-primary transition-colors">
              <Share2 className="w-4 h-4 mr-1" />
              {t('Share', 'Gawani')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ day, month, location, title, description, time, color, t }: any) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden slide-in">
      <div className="md:flex">
        <div className={`${color} text-white p-4 flex flex-col items-center justify-center md:w-1/4 text-center`}>
          <span className="text-3xl font-bold">{day}</span>
          <span className="text-xl">{month}</span>
          <span className="mt-2 bg-white text-gray-800 px-2 py-1 rounded text-sm font-medium flex items-center">
            <MapPin className="w-3 h-3 mr-1" /> {location}
          </span>
        </div>
        <div className="p-4 md:w-3/4">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" /> {time}
            </span>
            <button className={`${color} text-white px-3 py-1 rounded-lg hover:opacity-90 transition-colors text-sm`}>
              {t('Register Now', 'Lembetsani Tsopano')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQCard({ q, a }: { q: string; a: string }) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm">
      <h3 className="font-bold text-lg mb-3">{q}</h3>
      <p className="text-gray-600 dark:text-gray-300">{a}</p>
    </div>
  );
}
