import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BuiltInBenefitsSectionProps {
  onCompareCards: () => void;
}

export const BuiltInBenefitsSection: React.FC<BuiltInBenefitsSectionProps> = ({ onCompareCards }) => {
  return (
    <section className="w-full py-12 px-4 bg-white border-b border-slate-100 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Eyebrow text: "FIND THE RIGHT CARD" (uppercase, tiny, bold) */}
        <span className="text-[11px] sm:text-xs font-bold text-[#666666] uppercase tracking-[0.2em] block mb-2">
          FIND THE RIGHT CARD
        </span>

        {/* Title: "More built-in benefits" (Large, regular weight) */}
        <h2 className="text-[26px] sm:text-[32px] font-normal text-[#1A1A1A] leading-tight mb-3">
          More built-in benefits
        </h2>

        {/* Text */}
        <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-lg mx-auto">
          Narrow your search based on what you’re looking for—like rewards, low intro APR or credit growing cards.
        </p>

        {/* Link: "Compare credit cards >" (Blue) */}
        <div className="mt-4">
          <button
            type="button"
            onClick={onCompareCards}
            className="text-[#005C9D] hover:text-[#00487D] font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-1 cursor-pointer p-0 group"
          >
            <span>Compare credit cards &gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
};
