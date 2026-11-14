import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Briefcase, Building } from 'lucide-react';

interface BusinessFinanceSectionProps {
  onExploreBusiness: () => void;
}

export const BusinessFinanceSection: React.FC<BusinessFinanceSectionProps> = ({ onExploreBusiness }) => {
  const [imageError, setImageError] = useState(false);
  const businessImage = '/assets/images/business_retail_women_1794216493886.jpg';

  return (
    <section id="business-solutions" className="w-full bg-white border-b border-slate-200/80 overflow-hidden">
      {/* Full-Bleed Image: Two women in brightly lit retail store (one on laptop, one with scanner) */}
      <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[440px] overflow-hidden bg-slate-100">
        {!imageError ? (
          <img
            src={businessImage}
            alt="Two professional women collaborating in a brightly lit modern retail boutique"
            className="w-full h-full object-cover object-center select-none"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-800 to-[#003B64] flex items-center justify-center p-6 text-white text-center">
            <div>
              <span className="text-xl font-bold">Capital One Business Solutions</span>
              <p className="text-xs text-slate-300 mt-1">Tools to power your enterprise</p>
            </div>
          </div>
        )}
        <div className="img-glass" />
      </div>

      {/* Content Container Below Image with Generous Padding */}
      <div className="py-10 px-6 sm:px-8 max-w-2xl mx-auto text-left sm:text-center">
        {/* Eyebrow: "SIMPLIFY YOUR BUSINESS FINANCES" (uppercase, bold) */}
        <span className="text-[11px] sm:text-xs font-bold text-[#666666] uppercase tracking-[0.18em] block mb-2">
          SIMPLIFY YOUR BUSINESS FINANCES
        </span>

        {/* Title: "Only the best for your business" (Large) */}
        <h2 className="text-[26px] sm:text-[32px] font-normal text-[#1A1A1A] leading-tight mb-3">
          Only the best for your business
        </h2>

        {/* Text */}
        <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-4">
          Earn unlimited rewards—travel or cash—with every card. Explore banking options that can help move your business forward.
        </p>

        {/* Link: "Explore business solutions >" (Blue) */}
        <div>
          <button
            type="button"
            onClick={onExploreBusiness}
            className="text-[#005C9D] hover:text-[#00487D] font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-1 cursor-pointer p-0 group"
          >
            <span>Explore business solutions &gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

