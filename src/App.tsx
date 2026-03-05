import React, { useState, useEffect } from 'react';
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
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Language = 'en' | 'ny';
type Tab = 'info' | 'market' | 'community' | 'account';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<Tab>('info');
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
      setUser({ name: 'John Phiri', tier: 'Premium' });
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

      {/* Language Switcher */}
      <div className="fixed top-4 left-4 z-40 flex gap-2 glass px-2 py-1 rounded-lg shadow-sm">
        <button 
          onClick={() => switchLanguage('en')} 
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'hover:bg-white/20'}`}
        >
          EN
        </button>
        <button 
          onClick={() => switchLanguage('ny')} 
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${lang === 'ny' ? 'bg-primary text-white' : 'hover:bg-white/20'}`}
        >
          NY
        </button>
      </div>

      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-30 shadow-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 shadow-inner border border-white/20">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase">FarmKit Pro</h1>
                <p className="text-indigo-100/80 text-xs font-medium tracking-wide">
                  {t('Complete Agricultural Platform for Malawi', 'Malo Onse a Ulimi wa ku Malawi')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/20 flex items-center shadow-sm">
                <UserCircle className="w-4 h-4 mr-2 opacity-70" /> {user ? user.name : t('Guest', 'Mlendo')}
              </span>
              {user && (
                <span className="px-4 py-1.5 bg-accent text-white rounded-full text-sm font-bold shadow-lg flex items-center">
                  <Crown className="w-4 h-4 mr-2" /> {user.tier}
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
              {/* Search Section */}
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="bg-primary text-white p-2 rounded-lg mr-2 shadow-sm">
                      <Sprout className="w-6 h-6" />
                    </span>
                    {t('Farming Information Hub', 'Malo a Zidziwitso za Ulimi')}
                  </h2>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-sm flex items-center">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t('Add Tip', 'Onjezani Malangizo')}
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder={t('Search crops, practices, diseases...', 'Sakani mbewu, njira, matenda...')}
                      className="w-full px-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <Mic className="absolute right-3 top-3.5 text-gray-400 cursor-pointer hover:text-primary transition-colors w-5 h-5" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['#Maize', '#Irrigation', '#OrganicFarming', '#Fertilizers'].map(tag => (
                      <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-primary hover:text-white transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Crop Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CropCard 
                    title={t('Maize (Chimanga)', 'Chimanga')}
                    image="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400"
                    badge={t('Popular Crop', 'Mbewu Yotchuka')}
                    rating={4.0}
                    reviews={120}
                    description={t("Malawi's staple crop, best planted at the beginning of rainy season.", "Mbewu yofunika kwambiri ku Malawi, ibzyalidwa pa nthawi ya mvula.")}
                    status={t('Plant Now', 'Bzalani Tsopano')}
                    t={t}
                  />
                  <CropCard 
                    title={t('Beans (Nyemba)', 'Nyemba')}
                    image="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400"
                    badge={t('Season Special', "Yam'mwambovo")}
                    rating={4.5}
                    reviews={98}
                    description={t("Great nitrogen fixer, ideal for crop rotation with maize.", "Ibzyala natroje mthaka, yabwino kubzyala pakadutsa chimanga.")}
                    status={t('Plant Now', 'Bzalani Tsopano')}
                    t={t}
                  />
                  <CropCard 
                    title={t('Cassava (Chinangwa)', 'Chinangwa')}
                    image="https://images.unsplash.com/photo-1621460245180-873539824696?auto=format&fit=crop&q=80&w=400"
                    badge={t('Drought Resistant', 'Yopilira Chilala')}
                    rating={4.0}
                    reviews={85}
                    description={t("Drought-tolerant root crop, ideal for food security.", "Mbewu yopilila chilala, yabwino kuti chakudya chisasowe.")}
                    status={t('Plant Soon', 'Bzalani Posachedwa')}
                    t={t}
                  />
                </div>

                <div className="mt-8 flex justify-center">
                  <button className="bg-white text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors shadow-sm flex items-center">
                    {t('Load More Crops', 'Onetsani Zambiri')}
                    <ArrowDown className="w-4 h-4 ml-2" />
                  </button>
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
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold">{t('Marketplace & Prices', 'Msika ndi Mitengo')}</h2>
                <p className="text-gray-500 mt-2">{t('Browse products and check daily market prices across Malawi.', 'Onani zokolola ndi mitengo ya tsiku ndi tsiku m\'Malawi muno.')}</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <Store className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-bold">{t('Marketplace', 'Msika')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('Buy and sell farm produce', 'Gulani kapena gulisani zokolola')}</p>
                  </div>
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                    <ChartLine className="w-8 h-8 text-accent mx-auto mb-3" />
                    <h3 className="font-bold">{t('Market Prices', 'Mitengo')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('Daily price updates', 'Mitengo ya tsiku ndi tsiku')}</p>
                  </div>
                </div>
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
                    <p className="text-gray-500">{user ? `${user.tier} Member` : t('Sign in to access all features', 'Lowani kuti mupeze zonse')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
                    <Star className="w-5 h-5 mr-3 text-accent" />
                    <span className="font-medium">{t('Premium Subscription', 'Zosankhika')}</span>
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
              <h2 className="text-xl font-bold mb-4">🌾 FarmKit Pro</h2>
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
              © 2023 FarmKit Pro. {t('All rights reserved.', 'Ufulu wonse ndi wathu.')}
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
