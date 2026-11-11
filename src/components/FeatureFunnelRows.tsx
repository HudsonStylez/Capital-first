import React from 'react';
import { ChevronRight } from 'lucide-react';

interface FeatureFunnelRowsProps {
  onCheckEligibility: () => void;
  onExploreBanking: () => void;
  onStartAutoShopping: () => void;
}

export const FeatureFunnelRows: React.FC<FeatureFunnelRowsProps> = ({
  onCheckEligibility,
  onExploreBanking,
  onStartAutoShopping,
}) => {
  const rows = [
    {
      id: 'cards',
      image: '/assets/images/funnel_two_cards_1794213932269.jpg',
      alt: 'Two overlapping dark blue credit cards with silver chips',
      title: 'Find the right card for you',
      text: 'Explore your card offers in as little as 90 seconds—with no impact to your credit score.',
      linkText: 'Check My Eligibility >',
      onClick: onCheckEligibility,
    },
    {
      id: 'banking',
      image: '/assets/images/funnel_piggy_bank_1794213933013.jpg',
      alt: 'Pink piggy bank with a gold coin',
      title: 'Bank with confidence',
      text: 'Enjoy no fees or minimums for checking and savings accounts.',
      linkText: 'Explore Banking >',
      onClick: onExploreBanking,
    },
    {
      id: 'auto',
      image: '/assets/images/funnel_car_keys_1794213933095.jpg',
      alt: 'Car keys with blue key fob',
      title: 'Find a car you love',
      text: 'Shop cars and pre-qualify for financing with Auto Navigator.',
      linkText: 'Start Shopping >',
      onClick: onStartAutoShopping,
    },
  ];

  return (
    <section className="w-full py-10 px-4 bg-white border-b border-slate-200/80">
      <div className="max-w-2xl mx-auto space-y-8 sm:space-y-10">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className={`flex flex-col sm:flex-row items-start gap-5 sm:gap-6 pb-8 ${
              index !== rows.length - 1 ? 'border-b border-slate-100' : ''
            } transition-all`}
          >
            {/* Left: Small illustration in a neat container */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100/80 p-1 flex items-center justify-center shadow-xs">
              <img
                src={row.image}
                alt={row.alt}
                className="w-full h-full object-contain select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right: Text and Link Button */}
            <div className="flex-1 flex flex-col items-start">
              {/* Title: approx 22px */}
              <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1A1A1A] leading-snug">
                {row.title}
              </h3>

              {/* Text: 16px body */}
              <p className="text-sm sm:text-base text-[#666666] mt-1.5 mb-3 leading-relaxed">
                {row.text}
              </p>

              {/* Link: Blue text #005C9D, no underline */}
              <button
                type="button"
                onClick={row.onClick}
                className="text-[#005C9D] hover:text-[#00487D] font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-1 cursor-pointer p-0 group"
              >
                <span>{row.linkText}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

