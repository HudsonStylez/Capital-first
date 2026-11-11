import React from 'react';
import { ArrowRight, ShoppingBag, Coffee, Plane } from 'lucide-react';

interface MoreThanABankSectionProps {
  onLearnMore?: (cardId: string) => void;
}

export const MoreThanABankSection: React.FC<MoreThanABankSectionProps> = ({ onLearnMore }) => {
  const cards = [
    {
      id: 'shopping',
      image: '/assets/images/more_than_shopping_1794217356481.jpg',
      alt: 'Man opening a cardboard delivery box on a living room couch',
      title: 'Capital One Shopping',
      text: 'Automatically apply free coupons and save with price drop notifications.',
      tag: 'Smart Savings',
      icon: ShoppingBag,
    },
    {
      id: 'cafe',
      image: '/assets/images/more_than_cafe_1794217357411.jpg',
      alt: 'Man enjoying a coffee at a modern Capital One Cafe',
      title: 'Part bank, part café',
      text: 'Capital One Cafés are open 7 days a week with extended hours for banking.',
      tag: 'In-Person Community',
      icon: Coffee,
    },
    {
      id: 'travel',
      image: '/assets/images/more_than_travel_1794217356740.jpg',
      alt: 'Woman relaxing on a sun lounger beside a luxury resort pool',
      title: 'Capital One Travel',
      text: 'Earn rewards when you book a flight, hotel or car with an eligible card.',
      tag: 'Curated Trips',
      icon: Plane,
    },
  ];

  return (
    <section className="w-full py-12 px-4 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-xl mx-auto">
        {/* Header: Centered text "WE'RE MORE THAN A BANK" (uppercase, bold) */}
        <h2 className="text-sm sm:text-base font-bold text-[#666666] uppercase tracking-[0.2em] mb-8 text-center">
          WE'RE MORE THAN A BANK
        </h2>

        {/* Vertical stack of 3 cards */}
        <div className="flex flex-col gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-100">
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300 select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#005C9D] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{card.tag}</span>
                  </div>
                </div>

                {/* Card Content: Title and Body Text */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-4">
                    {card.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => onLearnMore?.(card.id)}
                    className="text-[#005C9D] hover:text-[#00487D] font-bold text-sm inline-flex items-center gap-1 transition-colors cursor-pointer p-0"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

