import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Info, 
  ExternalLink, 
  MessageSquare,
  Package,
  CheckCircle2,
  X
} from 'lucide-react';
import { authenticityGuidance } from '../data/constants';
// Real data states (placeholders for now)
const pesticideSellers: any[] = [];
import { toast } from 'react-hot-toast';

interface PesticideMarketMapProps {
  t: (key: string) => string;
  lang: string;
}

export const PesticideMarketMap: React.FC<PesticideMarketMapProps> = ({ t, lang }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSeller, setSelectedSeller] = React.useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState('');

  const filteredSellers = pesticideSellers.filter(seller => 
    seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReport = () => {
    if (!reportReason.trim()) {
      toast.error(t('market.provideReason'));
      return;
    }
    // In a real app, this would be a database call
    console.log(`Reporting seller ${selectedSeller?.businessName} for: ${reportReason}`);
    toast.success(t('market.reportSuccess'));
    setIsReportModalOpen(false);
    setReportReason('');
  };

  return (
    <div className="space-y-8">
      {/* Search and Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-primary" />
              {t('common.pesticideMap')}
            </h2>
            <p className="text-sm text-gray-500">
              {t('home.pesticideMapDesc')}
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm"
            />
          </div>
        </div>

        {/* Authenticity Guidance Quick Link */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">{t('common.safetyFirst') }</h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {t('common.pcbCheck')}
            </p>
          </div>
          <button 
            onClick={() => {
              const element = document.getElementById('authenticity-guidance');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            {t('common.learnMore')} <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSellers.map((seller) => (
          <motion.div 
            key={seller.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-xl">
                    {seller.businessName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {seller.businessName}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      <ShieldCheck className="w-3 h-3" />
                      {t('market.verifiedSeller')}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedSeller(seller);
                    setIsReportModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                  title={t('market.reportSuspicious')}
                >
                  <AlertTriangle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{seller.location}, {seller.district}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{seller.phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  {t('common.allProducts')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {seller.products.map((product: any, idx: number) => (
                    <div 
                      key={idx}
                      className="px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] font-bold flex items-center gap-1.5"
                    >
                      <Package className="w-3 h-3 text-primary" />
                      {product.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <a 
                href={`tel:${seller.phone}`}
                className="flex-1 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
              >
                <Phone className="w-4 h-4" /> {t('common.call')}
              </a>
              <a 
                href={`https://wa.me/${seller.phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Authenticity Guidance Section */}
      <div id="authenticity-guidance" className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black">{lang === 'en' ? authenticityGuidance.title : authenticityGuidance.titleNy}</h2>
            <p className="text-sm text-gray-500">{t('home.pesticideMapDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {authenticityGuidance.tips.map((tip, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-primary">
                0{idx + 1}
              </div>
              <div>
                <h4 className="font-bold mb-1">{lang === 'en' ? tip.title : tip.titleNy}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{lang === 'en' ? tip.description : tip.descriptionNy}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 p-6 rounded-3xl">
          <h4 className="text-rose-900 dark:text-rose-200 font-black flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" />
            {lang === 'en' ? authenticityGuidance.title : authenticityGuidance.titleNy}
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(lang === 'en' ? authenticityGuidance.warningSigns : authenticityGuidance.warningSignsNy).map((sign: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-rose-700 dark:text-rose-300">
                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0" />
                {sign}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
                {t('market.reportSuspicious')}
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('market.reporting')}</p>
                <p className="font-bold">{selectedSeller?.businessName}</p>
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
                  onClick={() => setIsReportModalOpen(false)}
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
    </div>
  );
};
