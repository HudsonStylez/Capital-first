import React, { useState } from 'react';
import { Car, Search, ShieldCheck, ArrowRight, Calculator } from 'lucide-react';

interface AutoNavigatorSectionProps {
  onPreQualify: () => void;
}

export const AutoNavigatorSection: React.FC<AutoNavigatorSectionProps> = ({ onPreQualify }) => {
  const [carPrice, setCarPrice] = useState<number>(32000);
  const [downPayment, setDownPayment] = useState<number>(4000);
  const [termMonths, setTermMonths] = useState<number>(60);
  const [apr, setApr] = useState<number>(6.49);

  // Loan computation: Loan Amount = Price - DownPayment
  const loanAmount = Math.max(0, carPrice - downPayment);
  const monthlyInterestRate = (apr / 100) / 12;
  const estimatedMonthlyPayment =
    monthlyInterestRate === 0
      ? Math.round(loanAmount / termMonths)
      : Math.round(
          (loanAmount *
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths))) /
            (Math.pow(1 + monthlyInterestRate, termMonths) - 1)
        );

  return (
    <section id="auto" className="py-12 px-4 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold tracking-wider uppercase text-[#005C9D]">
                Capital One Auto Navigator®
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> No Credit Score Impact
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Shop cars with real rates before visiting the dealer
            </h2>
          </div>
          <p className="text-sm text-[#666666] max-w-md">
            Find the right car for your budget, see real financing terms, and walk into the dealership with confidence.
          </p>
        </div>

        {/* 2-Column Grid: Visual Banner & Interactive Car Payment Estimator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visual Car Photo + Key Highlights */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
              <img
                src="/assets/images/auto_navigator_car_1794203770230.jpg"
                alt="Modern blue SUV on scenic mountain overlook"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="img-glass" />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                <span>Over 4 Million New &amp; Used Cars</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Why finance your vehicle with Auto Navigator?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold block text-slate-900">Pre-Qualify in Minutes</span>
                  <span className="text-slate-500 mt-0.5 block">Won't impact your credit score</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold block text-slate-900">Real Monthly Rates</span>
                  <span className="text-slate-500 mt-0.5 block">See true APRs on actual cars</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold block text-slate-900">Participating Dealers</span>
                  <span className="text-slate-500 mt-0.5 block">Nationwide network of 12,000+</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onPreQualify}
                className="w-full py-3 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Search Local Dealer Inventory</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Monthly Payment Calculator */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#005C9D]" />
                  <h3 className="font-bold text-slate-900 text-lg">
                    Auto Payment Estimator
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Est. {apr}% APR
                </span>
              </div>

              {/* Vehicle Price Slider */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Vehicle Price</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                    ${carPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="80000"
                  step="500"
                  value={carPrice}
                  onChange={(e) => setCarPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005C9D]"
                />
              </div>

              {/* Down Payment Slider */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Down Payment / Trade-in</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                    ${downPayment.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25000"
                  step="500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005C9D]"
                />
              </div>

              {/* Loan Term Selector */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Loan Term (Months)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[36, 48, 60, 72].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setTermMonths(term)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        termMonths === term
                          ? 'bg-[#005C9D] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* APR Slider */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>APR</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">{apr}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="0.01"
                  value={apr}
                  onChange={(e) => setApr(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005C9D]"
                />
              </div>

              {/* Live Payment Summary Box */}
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-5 text-center">
                <span className="text-xs font-semibold text-sky-800 uppercase tracking-wide">
                  Estimated Monthly Payment
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#005C9D] font-mono mt-1 mb-1 tabular-nums">
                  ${estimatedMonthlyPayment}
                  <span className="text-sm font-normal text-slate-600"> /mo</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-center gap-3">
                  <span>Loan Amount: <strong>${loanAmount.toLocaleString()}</strong></span>
                  <span>·</span>
                  <span>Term: <strong>{termMonths} months</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onPreQualify}
                className="w-full py-3 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors text-center cursor-pointer shadow-xs"
              >
                Pre-Qualify With No Credit Impact
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

