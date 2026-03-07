import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Share2, MessageCircle, ArrowRight } from 'lucide-react';

interface DetailModalProps {
  t: (en: string, ny: string) => string;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  t,
  selectedItem,
  setSelectedItem
}) => {
  return (
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
            className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-64 relative">
              <img 
                src={selectedItem.image || selectedItem.icon} 
                alt={selectedItem.title || selectedItem.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <div>
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
                    {selectedItem.category || selectedItem.type}
                  </span>
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    {t(selectedItem.title || selectedItem.name, selectedItem.titleNy || selectedItem.nameNy)}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {selectedItem.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> {selectedItem.location}
                  </div>
                )}
                {selectedItem.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> {selectedItem.time}
                  </div>
                )}
                {selectedItem.price && (
                  <div className="text-primary font-bold text-lg">
                    MK {selectedItem.price.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                  {t(selectedItem.description || selectedItem.content, selectedItem.descriptionNy || selectedItem.contentNy)}
                </p>

                {selectedItem.type === 'livestock' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {t('Housing', 'Nyumba')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedItem.housing}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {t('Feeding', 'Chakudya')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedItem.feeding}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {t('Health', 'Umoyo')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedItem.health}</p>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'crop' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {t('Planting Dates', 'Nthawi Yodzala')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedItem.plantingDates}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {t('Spacing', 'Mipata')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedItem.spacing}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {t('Fertilizer', 'Feteleza')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedItem.fertilizer}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-10">
                <button className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                  {selectedItem.price ? t('Contact Seller', 'Lumikizanani ndi Wogulitsa') : t('Learn More', 'Dziwani Zambiri')}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  <button className="p-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-2xl hover:bg-gray-200 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                  {selectedItem.price && (
                    <button className="p-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-2xl hover:bg-gray-200 transition-all">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
