import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FullWidthBannerProps {
  onExploreAllCards: () => void;
}

export const FullWidthBanner: React.FC<FullWidthBannerProps> = ({ onExploreAllCards }) => {
  const [imageError, setImageError] = useState(false);
  const bannerImagePath = '/src/assets/images/cards_floating_banner_1794213932237.jpg';

  return (
    <section className="relative w-full overflow-hidden bg-sky-100 border-b border-slate-200/80">
      {/* Full-Bleed Image Container */}
      <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[480px] overflow-hidden">
        {!imageError ? (
          <img
            src={bannerImagePath}
            alt="Hand holding smartphone with digital card and four colorful credit cards floating on light blue background"
            className="w-full h-full object-cover object-center select-none"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Graceful CSS/SVG Fallback */
          <div className="w-full h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-6 text-white text-center">
            <div>
              <span className="text-2xl font-bold tracking-tight block">
                Everyday Rewards In Your Pocket
              </span>
              <span className="text-sm text-sky-100 mt-2 block">
                Manage all your Capital One cards directly from your phone.
              </span>
            </div>
          </div>
        )}

        {/* Ambient bottom scrim and callout pill */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6 sm:p-10 pointer-events-none">
          <div className="max-w-md pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-[#005C9D] mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Mobile-First Banking</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm leading-tight">
              One app for all your cards and banking
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-1 mb-3 drop-shadow-xs">
              Seamlessly monitor balances, redeem rewards, and lock cards with a single tap.
            </p>
            <button
              type="button"
              onClick={onExploreAllCards}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-[#005C9D] font-bold text-xs sm:text-sm rounded-md shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>Explore All Cards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
