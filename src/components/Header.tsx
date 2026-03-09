import React from 'react';
import { Sprout, Languages, UserCircle, ThumbsUp } from 'lucide-react';

interface HeaderProps {
  lang: 'en' | 'ny';
  switchLanguage: (lang: 'en' | 'ny') => void;
  t: (key: string) => string;
  user: any;
  setIsAuthModalOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, switchLanguage, t, user, setIsAuthModalOpen }) => {
  return (
    <header className="bg-primary text-white sticky top-0 z-30 shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 shrink-0">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-[140px]">
              <h1 className="text-2xl font-bold tracking-tight font-serif">
                <span className="text-green-400">Farm</span><span className="text-amber-300">Kit</span>
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {/* Language Toggle */}
            <button 
              onClick={() => switchLanguage(lang === 'en' ? 'ny' : 'en')}
              className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-bold border border-white/20 flex items-center shadow-sm hover:bg-white/20 transition-all group"
            >
              <Languages className="w-4 h-4 mr-2 opacity-70 group-hover:rotate-12 transition-transform" />
              <span className="uppercase">{lang}</span>
            </button>
 
            {user ? (
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/20 flex items-center shadow-sm">
                <UserCircle className="w-4 h-4 mr-2 opacity-70" /> {user.name}
              </span>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-1.5 bg-amber-400 text-primary rounded-full text-sm font-bold shadow-md hover:bg-amber-300 transition-all flex items-center gap-2"
              >
                {t('account.signIn')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
