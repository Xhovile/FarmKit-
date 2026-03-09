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
  Building2,
  LifeBuoy,
  HeartHandshake,
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { PremiumLock, PremiumBadge } from '../components/PremiumLock';
import { PesticideMarketMap } from '../components/PesticideMarketMap';

interface ExpertPageProps {
  t: (key: string) => string;
  lang: 'en' | 'ny';
  communityTab: 'experts' | 'organizations' | 'support' | 'stories';
  setCommunityTab: (tab: 'experts' | 'organizations' | 'support' | 'stories') => void;
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

export const ExpertPage: React.FC<ExpertPageProps> = ({
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
      {/* Experts Sub-Nav */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setCommunityTab('experts')}
          className={`shrink-0 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'experts' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <GraduationCap className="w-4 h-4" /> {t('common.experts')}
        </button>
        <button 
          onClick={() => setCommunityTab('organizations')}
          className={`shrink-0 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'organizations' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Building2 className="w-4 h-4" /> {t('experts.organizations')}
        </button>
        <button 
          onClick={() => setCommunityTab('support')}
          className={`shrink-0 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'support' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <LifeBuoy className="w-4 h-4" /> {t('experts.support')}
        </button>
        <button 
          onClick={() => setCommunityTab('stories')}
          className={`shrink-0 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${communityTab === 'stories' ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
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

      {communityTab === 'organizations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Ministry of Agriculture</h3>
            <p className="text-sm text-gray-500 mb-4">National agricultural policies, extension services, and regulatory framework.</p>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
              Visit Website <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">NASFAM</h3>
            <p className="text-sm text-gray-500 mb-4">National Smallholder Farmers' Association of Malawi. Supporting smallholder commercialization.</p>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
              Visit Website <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {communityTab === 'support' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('experts.getSupport')}</h3>
            <p className="text-sm text-gray-500 mb-6">Need help with the app or have a specific farming challenge? Our support team is here for you.</p>
            <div className="flex flex-col gap-3">
              <button className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all">
                {t('common.call')} Support
              </button>
              <button className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-md hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" /> WhatsApp Support
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Emergency Contacts</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-sm font-medium">Pest Outbreak Hotline</span>
                <span className="text-primary font-bold">0888 123 456</span>
              </li>
              <li className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-sm font-medium">Market Information Service</span>
                <span className="text-primary font-bold">0999 789 012</span>
              </li>
            </ul>
          </div>
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
