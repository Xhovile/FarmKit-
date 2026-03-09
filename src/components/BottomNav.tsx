import React from 'react';
import { Book, Store, GraduationCap, UserCircle } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  t: (key: string) => string;
}

const NavAction: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-2xl transition-all duration-300 ${active ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
  >
    <div className={`${active ? 'animate-bounce-subtle' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] md:text-sm font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, t }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-gray-700 z-50 md:relative md:bottom-auto md:bg-transparent md:border-none md:mt-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-center items-center gap-1 md:gap-4 py-2 md:py-0">
          <NavAction 
            active={activeTab === 'info'} 
            onClick={() => setActiveTab('info')} 
            icon={<Book className="w-5 h-5 md:w-4 md:h-4" />} 
            label={t('common.home')} 
          />
          
          {/* Market Tab with Bulge */}
          <div className="relative -top-6 md:top-0">
            <button 
              onClick={() => setActiveTab('market')}
              className={`flex flex-col items-center justify-center w-20 h-20 md:w-auto md:h-auto md:flex-row md:gap-3 md:px-6 md:py-3 rounded-full md:rounded-2xl transition-all duration-300 shadow-2xl md:shadow-lg border-4 border-neutral-50 dark:border-dark-900 md:border-none ${activeTab === 'market' ? 'bg-primary text-white scale-110 md:scale-105' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
            >
              <div className={`${activeTab === 'market' ? 'animate-bounce-subtle' : ''}`}>
                <Store className="w-8 h-8 md:w-5 md:h-5" />
              </div>
              <span className={`text-[10px] md:text-sm font-bold uppercase tracking-wider ${activeTab === 'market' ? 'opacity-100' : 'opacity-70'}`}>
                {t('common.market')}
              </span>
            </button>
          </div>

          <NavAction 
            active={activeTab === 'experts'} 
            onClick={() => setActiveTab('experts')} 
            icon={<GraduationCap className="w-5 h-5 md:w-4 md:h-4" />} 
            label={t('common.experts')} 
          />
          <NavAction 
            active={activeTab === 'account'} 
            onClick={() => setActiveTab('account')} 
            icon={<UserCircle className="w-5 h-5 md:w-4 md:h-4" />} 
            label={t('common.account')} 
          />
        </div>
      </div>
    </nav>
  );
};
