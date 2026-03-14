import React, { useEffect, useState } from 'react';
import { Sprout, UserCircle } from 'lucide-react';

interface HeaderProps {
  t: (key: string) => string;
  user: any;
  setIsAuthModalOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ t, user, setIsAuthModalOpen }) => {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 36);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 text-white border-b border-white/10 transition-all duration-300 ${
        isCompact
          ? 'bg-primary/95 backdrop-blur-xl shadow-lg'
          : 'bg-primary shadow-md'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 transition-all duration-300 ${
          isCompact ? 'py-2.5' : 'py-4'
        }`}
      >
        <div
          className={`flex justify-between items-center transition-all duration-300 ${
            isCompact ? 'gap-3' : 'gap-4'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`bg-white/10 backdrop-blur-md border border-white/20 shrink-0 transition-all duration-300 ${
                isCompact ? 'rounded-lg p-2' : 'rounded-xl p-2.5'
              }`}
            >
              <Sprout className={`text-white transition-all duration-300 ${isCompact ? 'w-6 h-6' : 'w-8 h-8'}`} />
            </div>

            <div className="min-w-0">
              <h1
                className={`font-bold tracking-tight font-serif leading-none transition-all duration-300 ${
                  isCompact ? 'text-xl' : 'text-2xl'
                }`}
              >
                <span className="text-green-400">Farm</span><span className="text-amber-300">Kit</span>
              </h1>

              {!isCompact && (
                <p className="text-[11px] text-white/75 mt-1 font-medium">
                  Smart agriculture, market access, and practical tools
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <button
                type="button"
                className={`bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center shadow-sm transition-all ${
                  isCompact
                    ? 'h-9 w-9 rounded-full justify-center'
                    : 'px-4 py-1.5 rounded-full text-sm font-semibold'
                }`}
                aria-label={user.name}
              >
                <UserCircle className={`opacity-80 ${isCompact ? 'w-5 h-5' : 'w-4 h-4 mr-2'}`} />
                {!isCompact && <span className="max-w-[120px] truncate">{user.name}</span>}
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`bg-amber-400 text-primary shadow-md hover:bg-amber-300 transition-all font-bold ${
                  isCompact
                    ? 'h-9 px-3 rounded-full text-xs'
                    : 'px-6 py-1.5 rounded-full text-sm'
                }`}
              >
                {isCompact ? 'Sign in' : t('account.signIn')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
