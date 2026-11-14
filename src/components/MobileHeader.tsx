import React from 'react';
import { Menu, User, Search } from 'lucide-react';
import { CapitalOneLogo } from './CapitalOneLogo';

interface MobileHeaderProps {
  onOpenMenu: () => void;
  onOpenSignIn: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenMenu,
  onOpenSignIn,
  onNavigateSection,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-white/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 sm:h-18 flex items-center justify-between relative">
        {/* Left: Hamburger menu icon (thin, black, minimum 44x44px hitbox) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMenu}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-900 hover:text-black hover:bg-slate-100 rounded-md transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005C9D]"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Desktop Search trigger */}
          <button
            type="button"
            onClick={() => onNavigateSection?.('cards')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors ml-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search cards, accounts...</span>
          </button>
        </div>

        {/* Center: The Capital One logo (Swoosh and text) centered perfectly */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005C9D] rounded cursor-pointer"
            aria-label="Capital One Homepage"
          >
            <CapitalOneLogo className="h-8 sm:h-9" />
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 ml-auto mr-8">
          <a
            href="#cards"
            onClick={(e) => { e.preventDefault(); onNavigateSection?.('cards'); }}
            className="hover:text-[#005C9D] transition-colors whitespace-nowrap"
          >
            Credit Cards
          </a>
          <a
            href="#banking"
            onClick={(e) => { e.preventDefault(); onNavigateSection?.('banking'); }}
            className="hover:text-[#005C9D] transition-colors whitespace-nowrap"
          >
            Checking & Savings
          </a>
          <a
            href="#auto"
            onClick={(e) => { e.preventDefault(); onNavigateSection?.('auto'); }}
            className="hover:text-[#005C9D] transition-colors whitespace-nowrap"
          >
            Auto Loans
          </a>
          <a
            href="#creditwise"
            onClick={(e) => { e.preventDefault(); onNavigateSection?.('creditwise'); }}
            className="hover:text-[#005C9D] transition-colors whitespace-nowrap"
          >
            CreditWise
          </a>
        </nav>

        {/* Right: User profile icon with Sign In or My Account if logged in */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onOpenSignIn}
            className="min-w-[44px] min-h-[44px] px-2 flex flex-col items-center justify-center text-slate-800 hover:text-[#005C9D] hover:bg-slate-50 rounded-md transition-colors active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#005C9D]"
            aria-label="Sign In or Access Account"
          >
            <div className="w-6 h-6 rounded-full border border-slate-700 group-hover:border-[#005C9D] flex items-center justify-center mb-0.5 transition-colors">
              <User className="w-3.5 h-3.5 text-slate-800 group-hover:text-[#005C9D]" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight text-slate-800 group-hover:text-[#005C9D] leading-none">
              Sign In
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
