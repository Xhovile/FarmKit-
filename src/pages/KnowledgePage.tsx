import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  Award,
  BookOpen,
  ShieldCheck,
  Crown,
  Leaf,
  Beef,
  AlertTriangle,
  Map as MapIcon,
  TrendingUp,
  Clock,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { PremiumLock, PremiumBadge } from '../components/PremiumLock';
import { PesticideMarketMap } from '../components/PesticideMarketMap';

interface KnowledgePageProps {
  t: (key: string) => string;
  lang: 'en' | 'ny';
  communityTab: 'experts' | 'stories' | 'crops' | 'livestock' | 'training' | 'alerts' | 'pesticide_map';
  setCommunityTab: (tab: 'experts' | 'stories' | 'crops' | 'livestock' | 'training' | 'alerts' | 'pesticide_map') => void;
  experts: any[];
  successStories: any[];
  user: any;
  setActiveTab: (tab: any) => void;
}

// Mock data (should be passed from App or fetched)
const cropGuides: any[] = [
  {
    id: 'c1',
    name: 'Hybrid Maize',
    image: 'https://picsum.photos/seed/maize/800/600',
    plantingDates: 'Nov - Dec',
    tips: 'Best for high yield in central Malawi. Requires 3-4 rounds of weeding and balanced NPK application.'
  },
  {
    id: 'c2',
    name: 'Soya Beans',
    image: 'https://picsum.photos/seed/soya/800/600',
    plantingDates: 'Dec - Jan',
    tips: 'Excellent for soil nitrogen fixation. Ensure proper spacing of 10cm between plants.'
  },
  {
    id: 'c3',
    name: 'Groundnuts (CG7)',
    image: 'https://picsum.photos/seed/peanuts/800/600',
    plantingDates: 'Nov - Dec',
    tips: 'Drought resistant variety. Harvest when shells show internal dark markings.'
  }
];

const livestockGuides: any[] = [
  {
    id: 'l1',
    name: 'Poultry Management',
    image: 'https://picsum.photos/seed/chicken/800/600',
    tips: 'Focus on bio-security and vaccination schedules for Newcastle disease.'
  },
  {
    id: 'l2',
    name: 'Goat Farming',
    image: 'https://picsum.photos/seed/goat/800/600',
    tips: 'Local breeds are hardy. Supplement with urea-treated straw during dry season.'
  }
];

const verifiedTraining: any[] = [
  {
    id: 't1',
    title: 'Climate Smart Agriculture',
    provider: 'Ministry of Agriculture',
    duration: '4 Weeks',
    image: 'https://picsum.photos/seed/training1/800/600',
    description: 'Learn techniques for conservation agriculture, pit planting, and mulching.'
  },
  {
    id: 't2',
    title: 'Agri-Business Basics',
    provider: 'NGO Consortium',
    duration: '2 Weeks',
    image: 'https://picsum.photos/seed/training2/800/600',
    description: 'Master record keeping, gross margin analysis, and market negotiation.'
  }
];

const seasonalAlerts: any[] = [
  {
    id: 'a1',
    title: 'Fall Armyworm Warning',
    titleNy: 'Chenjezo la Mbozi ya Kapuchi',
    content: 'High activity reported in Salima and Dedza. Inspect maize whorls daily.',
    contentNy: 'Mbozi ya kapuchi yaoneka kwambiri ku Salima ndi Dedza. Onetsatirani chimanga chanu tsiku ndi tsiku.',
    severity: 'Critical',
    date: 'March 2026'
  },
  {
    id: 'a2',
    title: 'Late Blight Alert',
    titleNy: 'Chenjezo la Chidazo',
    content: 'Cool, humid weather in the highlands is favoring potato late blight.',
    contentNy: 'Nyengo ya chisanu ndi chinyezi m\'madera a mapiri ikupangitsa kuti chidazo chizifalikira m\'mbatata.',
    severity: 'High',
    date: 'March 2026'
  }
];

export const KnowledgePage: React.FC<KnowledgePageProps> = ({
  t,
  lang,
  communityTab,
  setCommunityTab,
  experts,
  successStories,
  user,
  setActiveTab
}) => {
  const isPremium = user?.tier === 'Premium' || user?.tier === 'Verified Seller';
  const onUpgrade = () => setActiveTab('account');
  return (
    <motion.div 
      key="experts"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Knowledge Sub-Nav */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setCommunityTab('experts')}
          className={`shrink-0 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'experts' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <GraduationCap className="w-4 h-4" /> {t('common.experts')}
        </button>
        <button 
          onClick={() => setCommunityTab('crops')}
          className={`shrink-0 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'crops' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Leaf className="w-4 h-4" /> {t('common.cropGuides')}
        </button>
        <button 
          onClick={() => setCommunityTab('livestock')}
          className={`shrink-0 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'livestock' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Beef className="w-4 h-4" /> {t('common.livestock')}
        </button>
        <button 
          onClick={() => setCommunityTab('training')}
          className={`shrink-0 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'training' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <BookOpen className="w-4 h-4" /> {t('common.training')}
        </button>
        <button 
          onClick={() => setCommunityTab('alerts')}
          className={`shrink-0 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'alerts' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <AlertTriangle className="w-4 h-4" /> {t('common.alerts')}
        </button>
        <button 
          onClick={() => setCommunityTab('pesticide_map')}
          className={`shrink-0 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'pesticide_map' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <MapIcon className="w-4 h-4" /> {t('common.pesticideMap')}
        </button>
        <button 
          onClick={() => setCommunityTab('stories')}
          className={`shrink-0 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'stories' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Award className="w-4 h-4" /> {t('common.stories')}
        </button>
      </div>

      {communityTab === 'experts' && (
        <div className="space-y-6">
          <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">{t('experts.verifiedSupport')}</h3>
              <p className="text-emerald-100 mb-6 max-w-md text-sm leading-relaxed">
                {t('experts.expertAdvice')}
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2 text-sm">
                  <MessageCircle className="w-5 h-5" /> {t('experts.connectNow')}
                </button>
                <button 
                  onClick={() => !isPremium && onUpgrade()}
                  className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-md hover:bg-emerald-400 transition-all flex items-center gap-2 text-sm border border-emerald-400 relative"
                >
                  <BookOpen className="w-5 h-5" /> 
                  {t('common.training')}
                  {!isPremium && <Crown className="w-3 h-3 absolute -top-1 -right-1 text-amber-300 fill-amber-300" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experts.map(expert => (
              <motion.div 
                key={expert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-50 dark:border-gray-700 flex items-center gap-4 group hover:border-primary transition-all"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md">
                  <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <h4 className="font-bold text-gray-900 dark:text-white">{expert.name}</h4>
                    {expert.verified && <CheckCircle2 className="w-3 h-3 text-primary" />}
                  </div>
                  <p className="text-xs text-primary font-bold mb-1">
                    {lang === 'en' ? expert.specialty : expert.specialtyNy}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {t('common.verified')}
                    </span>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {expert.location}
                    </p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                  <Phone className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {communityTab === 'crops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cropGuides.length > 0 ? cropGuides.map(crop => (
            <motion.div 
              layout
              key={crop.id} 
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">{crop.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" /> {crop.plantingDates}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{crop.tips}</p>
                <div className="mt-5 flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                  {t('home.viewFullGuide')} <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('common.noContent')}</h3>
              <p className="text-gray-500 text-sm">{t('common.comingSoon')}</p>
            </div>
          )}
        </div>
      )}

      {communityTab === 'livestock' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livestockGuides.length > 0 ? livestockGuides.map(guide => (
            <motion.div 
              layout
              key={guide.id} 
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={guide.image} alt={guide.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-4">
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
          )) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Beef className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('common.noContent')}</h3>
              <p className="text-gray-500 text-sm">{t('common.comingSoon')}</p>
            </div>
          )}
        </div>
      )}

      {communityTab === 'training' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedTraining.length > 0 ? verifiedTraining.map(course => (
            <motion.div 
              layout
              key={course.id}
              className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
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
          )) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('common.noContent')}</h3>
              <p className="text-gray-500 text-sm">{t('common.comingSoon')}</p>
            </div>
          )}
        </div>
      )}

      {communityTab === 'alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seasonalAlerts.length > 0 ? seasonalAlerts.map(alert => (
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
          )) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('common.noContent')}</h3>
              <p className="text-gray-500 text-sm">{t('common.comingSoon')}</p>
            </div>
          )}
        </div>
      )}

      {communityTab === 'pesticide_map' && (
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

      {communityTab === 'stories' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('experts.successStories')}</h3>
              <p className="text-xs text-gray-500">{t('experts.learnFromFarmers')}</p>
            </div>
          </div>

          {successStories.map((story, index) => (
            <div key={story.id} className="relative">
                <PremiumLock 
                  isLocked={index > 0 && !isPremium} 
                  t={t} 
                  onUpgrade={onUpgrade} 
                  featureKey="experts.premiumNGOContent"
                >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-50 dark:border-gray-700"
                >
                  <div className="h-48 relative">
                    <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {lang === 'en' ? story.title : story.titleNy}
                      </h3>
                    </div>
                    {index > 0 && (
                      <div className="absolute top-4 right-4">
                        <PremiumBadge t={t} />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-xs">
                        {story.author[0]}
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{story.author}</span>
                      <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        {t('experts.expertVerified')}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                      {lang === 'en' ? story.content : story.contentNy}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Award className="w-5 h-5" />
                        <span className="text-xs font-bold">{t('common.experts')}</span>
                      </div>
                      <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                        {t('experts.readFullStory')} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </PremiumLock>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
