import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onShopCards: () => void;
  onPreApproval: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopCards,
  onPreApproval,
}) => {
  const [imageError, setImageError] = useState(false);
  const heroImagePath = '/assets/images/autumn_mountains_hero_1794203768706.jpg';

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-slate-50">
      {/* Background Image: Full-bleed high-quality photograph of rolling mountains with autumn foliage covering top 40vh */}
      <div className="relative w-full h-[40vh] min-h-[300px] max-h-[520px] overflow-hidden bg-amber-900/20">
        {!imageError ? (
          <img
            src={heroImagePath}
            alt="Rolling mountains with vibrant autumn foliage and misty blue peaks"
            className="w-full h-full object-cover object-center select-none"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Styled graceful CSS fallback container */
          <div className="w-full h-full bg-gradient-to-br from-amber-700 via-orange-600 to-indigo-950 flex items-center justify-center">
            <div className="text-center text-white/90 p-6">
              <span className="text-xl font-bold tracking-tight">Capital One Fall Rewards</span>
            </div>
          </div>
        )}

        {/* Subtle top scrim for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Overlay Card Container: Below the image, overlapping the bottom edge */}
      <div className="relative max-w-xl mx-auto px-4 -mt-16 sm:-mt-20 mb-8 z-10">
        <div className="bg-white rounded-[8px] p-6 sm:p-8 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center transition-transform hover:shadow-[0_12px_36px_rgb(0,0,0,0.12)]">
          {/* Hero Text H1: approx 28px, regular weight, dark grey */}
          <h1 className="text-[28px] sm:text-[32px] font-normal text-[#1A1A1A] leading-tight tracking-tight">
            Reward yourself this fall
          </h1>

          {/* Subtext: Check out Capital One cards with everyday rewards, low intro APR & more. */}
          <p className="text-base text-[#666666] mt-3 mb-6 max-w-md mx-auto leading-relaxed">
            Check out Capital One cards with everyday rewards, low intro APR &amp; more.
          </p>

          {/* Hero CTA: Solid blue button bg-[#005C9D], text-white, rounded-md, px-6 py-3 reading "Shop all cards" centered */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onShopCards}
              className="w-full sm:w-auto bg-[#005C9D] hover:bg-[#00487D] text-white rounded-md px-6 py-3 font-medium text-base transition-colors shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Shop all cards</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick pre-approval secondary action */}
            <button
              type="button"
              onClick={onPreApproval}
              className="w-full sm:w-auto text-[#005C9D] hover:text-[#00487D] hover:bg-sky-50/60 rounded-md px-4 py-3 font-medium text-sm transition-colors border border-transparent hover:border-sky-200 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>See if you're pre-approved</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

