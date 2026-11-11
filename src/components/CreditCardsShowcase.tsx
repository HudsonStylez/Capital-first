import React, { useState } from 'react';
import { Sparkles, Check, ChevronRight, SlidersHorizontal, Scale, X } from 'lucide-react';

interface CreditCardItem {
  id: string;
  name: string;
  category: 'travel' | 'cashback' | 'buildcredit' | 'business';
  categoryLabel: string;
  annualFee: string;
  introOffer: string;
  rewardsRate: string;
  apr: string;
  creditLevel: string;
  image: string;
  styledArt?: boolean;
  perks: string[];
  highlight: string;
}

interface CreditCardsShowcaseProps {
  onPreApproval: () => void;
  onApplyCard: (cardName: string) => void;
}

export const CreditCardsShowcase: React.FC<CreditCardsShowcaseProps> = ({
  onPreApproval,
  onApplyCard,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'travel' | 'cashback' | 'buildcredit' | 'business'>('all');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const cards: CreditCardItem[] = [
    {
      id: 'venture-x',
      name: 'Venture X Rewards',
      category: 'travel',
      categoryLabel: 'Premium Travel',
      annualFee: '$395',
      introOffer: '75,000 Bonus Miles once you spend $4,000 on purchases within the first 3 months.',
      rewardsRate: '2X miles on all purchases; 10X on hotels & rental cars via Capital One Travel.',
      apr: '19.99% - 29.99% Variable APR',
      creditLevel: 'Excellent',
      image: '/assets/images/venture_x_card_1794203768439.jpg',
      highlight: '$300 Annual Travel Credit + Airport Lounge Access',
      perks: [
        '$300 annual credit for bookings through Capital One Travel',
        '10,000 bonus miles every year starting on first anniversary',
        'Unlimited complimentary access for you and 2 guests to Capital One Lounges & Partner Network',
      ],
    },
    {
      id: 'savor',
      name: 'Savor Cash Rewards',
      category: 'cashback',
      categoryLabel: 'Dining & Entertainment',
      annualFee: '$0',
      introOffer: 'Earn a one-time $200 cash bonus once you spend $500 on purchases within the first 3 months.',
      rewardsRate: '3% cash back on dining, entertainment, popular streaming services and grocery stores.',
      apr: '19.99% - 29.99% Variable APR',
      creditLevel: 'Excellent / Good',
      image: '/assets/images/savor_card_1794203769130.jpg',
      highlight: '3% Cash Back on Everyday Favorites',
      perks: [
        '3% cash back at grocery stores and popular streaming services',
        '8% cash back on Capital One Entertainment purchases',
        'No foreign transaction fees and $0 annual fee',
      ],
    },
    {
      id: 'quicksilver',
      name: 'Quicksilver Cash Rewards',
      category: 'cashback',
      categoryLabel: 'Everyday Cash Back',
      annualFee: '$0',
      introOffer: 'One-time $200 cash bonus after you spend $500 on purchases within 3 months.',
      rewardsRate: '1.5% unlimited cash back on every purchase, every day.',
      apr: '0% Intro APR for 15 months; then 19.99% - 29.99%',
      creditLevel: 'Good to Excellent',
      image: '/assets/images/funnel_two_cards_1794213932269.jpg',
      highlight: '0% Intro APR for 15 Months',
      perks: [
        '0% intro APR on purchases and balance transfers for 15 months',
        'Unlimited 1.5% cash back with no category tracking or activation required',
        'Cash back won’t expire for the life of the account',
      ],
    },
    {
      id: 'platinum',
      name: 'Platinum Mastercard',
      category: 'buildcredit',
      categoryLabel: 'Build Your Credit',
      annualFee: '$0',
      introOffer: 'Be automatically considered for a higher credit line in as little as 6 months.',
      rewardsRate: 'Standard card features focused on responsible credit building.',
      apr: '29.99% Variable APR',
      creditLevel: 'Fair / Rebuilding',
      image: '',
      styledArt: true,
      highlight: 'No Annual Fee Credit Building',
      perks: [
        'Automatic credit line reviews in as little as 6 months',
        '$0 fraud liability for unauthorized charges',
        'Free monthly TransUnion credit score monitoring with CreditWise',
      ],
    },
  ];

  const filteredCards = activeTab === 'all'
    ? cards
    : cards.filter((c) => c.category === activeTab);

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 cards at a time.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const comparedCardObjects = cards.filter((c) => selectedForCompare.includes(c.id));

  return (
    <section id="cards" className="py-12 px-4 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold tracking-wider uppercase text-[#005C9D]">
            Capital One Card Showcase
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1 mb-3">
            Find the card that fits your life
          </h2>
          <p className="text-sm sm:text-base text-[#666666]">
            Whether you're traveling the world, earning everyday cash back, or building credit, there's a Capital One card for you.
          </p>
        </div>

        {/* Category Tabs (Segmented control) */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {[
            { id: 'all', label: 'All Cards' },
            { id: 'travel', label: 'Travel Rewards' },
            { id: 'cashback', label: 'Cash Back' },
            { id: 'buildcredit', label: 'Building Credit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pre-Approval Banner Card */}
        <div className="bg-gradient-to-r from-sky-900 via-[#005C9D] to-indigo-900 rounded-xl p-5 sm:p-7 text-white shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/15 text-sky-100 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>No Impact on Credit Score</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              See if you're pre-approved in seconds
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 leading-relaxed">
              Find out which card offers are matched to your profile without hurting your credit score.
            </p>
          </div>
          <button
            type="button"
            onClick={onPreApproval}
            className="w-full md:w-auto px-6 py-3 bg-white text-[#005C9D] font-bold text-sm rounded-md hover:bg-sky-50 shadow-md transition-all active:scale-98 whitespace-nowrap cursor-pointer text-center"
          >
            Check Pre-Approval Now
          </button>
        </div>

        {/* Cards Grid: 1 col on mobile, 2 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredCards.map((card) => {
            const isCompared = selectedForCompare.includes(card.id);

            return (
              <div
                key={card.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Card Top: Visual & Basic Details */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-full sm:w-44 h-28 sm:h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm relative group">
                    {card.styledArt ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#003865] via-[#005C9D] to-[#0072B5] flex items-center justify-center">
                        <span className="text-white text-[11px] font-bold tracking-[0.2em]">PLATINUM</span>
                      </div>
                    ) : (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#005C9D]">
                      {card.categoryLabel}
                    </span>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mt-0.5">
                      {card.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 mt-1">
                      {card.highlight}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      <div>
                        <span className="text-slate-400">Annual Fee: </span>
                        <span className="font-semibold text-slate-800">{card.annualFee}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Credit: </span>
                        <span className="font-semibold text-slate-800">{card.creditLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body: Intro offer & Key rewards */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-slate-50/50">
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Intro Offer
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 mt-0.5 font-medium leading-relaxed">
                        {card.introOffer}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Rewards Rate
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 mt-0.5 leading-relaxed">
                        {card.rewardsRate}
                      </p>
                    </div>

                    {/* Bullet Perks */}
                    <div className="pt-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Featured Benefits
                      </span>
                      <ul className="mt-1.5 space-y-1.5">
                        {card.perks.map((perk, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions & APR Footnote */}
                  <div>
                    <div className="text-[11px] text-[#666666] mb-4">
                      {card.apr}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onApplyCard(card.name)}
                        className="flex-1 bg-[#005C9D] hover:bg-[#00487D] text-white py-2.5 px-4 rounded-md font-semibold text-sm transition-colors text-center shadow-sm cursor-pointer active:scale-98"
                      >
                        Apply Now
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCompare(card.id)}
                        className={`py-2.5 px-3 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isCompared
                            ? 'bg-sky-100 text-[#005C9D] border-[#005C9D]'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{isCompared ? 'Added' : 'Compare'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Bottom Floating Strip */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-24 z-30 bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold">
                Comparing {selectedForCompare.length} {selectedForCompare.length === 1 ? 'card' : 'cards'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-3 py-1 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded transition-colors"
              >
                View Comparison
              </button>
              <button
                onClick={() => setSelectedForCompare([])}
                className="p-1 text-slate-400 hover:text-white"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Compare Modal */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#005C9D]" />
                  <span>Card Comparison</span>
                </h3>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
                {comparedCardObjects.map((card) => (
                  <div key={card.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-slate-50/50">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{card.name}</h4>
                      <p className="text-xs text-[#005C9D] font-semibold mb-3">{card.categoryLabel}</p>
                      
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Annual Fee</span>
                          <span className="font-bold text-slate-800 text-sm">{card.annualFee}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Rewards Rate</span>
                          <span className="text-slate-700">{card.rewardsRate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">APR</span>
                          <span className="text-slate-700">{card.apr}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowCompareModal(false);
                        onApplyCard(card.name);
                      }}
                      className="mt-6 w-full py-2 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded transition-colors"
                    >
                      Apply for {card.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

