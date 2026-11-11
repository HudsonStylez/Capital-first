import React from 'react';
import { CreditCard, Landmark, Car, Briefcase, ShieldCheck, Building2 } from 'lucide-react';

interface ProductNavTilesProps {
  activeSection: string;
  onSelectProduct: (productId: string) => void;
}

export const ProductNavTiles: React.FC<ProductNavTilesProps> = ({
  activeSection,
  onSelectProduct,
}) => {
  const products = [
    {
      id: 'cards',
      name: 'Credit Cards',
      sub: 'Explore rewards & rates',
      icon: CreditCard,
      badge: 'Popular',
    },
    {
      id: 'banking',
      name: 'Checking & Savings',
      sub: '4.25% APY high yield',
      icon: Landmark,
      badge: '4.25% APY',
    },
    {
      id: 'auto',
      name: 'Auto Loans',
      sub: 'Shop with real rates',
      icon: Car,
      badge: 'Auto Navigator',
    },
    {
      id: 'business',
      name: 'Business',
      sub: 'Cards, checking & lending',
      icon: Briefcase,
    },
    {
      id: 'creditwise',
      name: 'CreditWise',
      sub: 'Free credit monitoring',
      icon: ShieldCheck,
      badge: '100% Free',
    },
    {
      id: 'commercial',
      name: 'Commercial',
      sub: 'Tailored enterprise solutions',
      icon: Building2,
    },
  ];

  return (
    <section className="w-full py-8 px-4 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#666666]">
            Explore Capital One Products
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Tap any product to view rates &amp; tools
          </span>
        </div>

        {/* Responsive grid: 2 cols on mobile, 3 cols on tablet, 6 cols on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {products.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectProduct(item.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all min-h-[96px] group cursor-pointer active:scale-95 relative ${
                  isSelected
                    ? 'border-[#005C9D] bg-sky-50/50 shadow-sm'
                    : 'border-slate-200/80 bg-white hover:border-[#005C9D]/40 hover:bg-slate-50/80'
                }`}
              >
                {item.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-semibold text-[#005C9D] bg-sky-100/80 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isSelected
                      ? 'bg-[#005C9D] text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-[#005C9D] group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-tight">
                  {item.name}
                </span>
                <span className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
