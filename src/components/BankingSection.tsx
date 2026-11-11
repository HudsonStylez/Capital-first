import React, { useState } from 'react';
import { Landmark, ArrowRight, DollarSign, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface BankingSectionProps {
  onOpenAccount: (accountType: string) => void;
}

export const BankingSection: React.FC<BankingSectionProps> = ({ onOpenAccount }) => {
  const [deposit, setDeposit] = useState<number>(15000);

  // Capital One 360 Performance Savings rate (4.25% APY) vs National Average (0.45% APY)
  const apyCapitalOne = 0.0425;
  const apyNational = 0.0045;

  const earnedCapitalOne1Yr = Math.round(deposit * apyCapitalOne);
  const earnedNational1Yr = Math.round(deposit * apyNational);
  const difference1Yr = earnedCapitalOne1Yr - earnedNational1Yr;

  return (
    <section id="banking" className="py-12 px-4 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#005C9D]">
              Capital One 360 Banking
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1">
              Bank smarter with 4.25% APY &amp; no hidden fees
            </h2>
          </div>
          <p className="text-sm text-[#666666] max-w-md">
            Grow your savings faster without worrying about minimum balances, maintenance fees, or ATM charges.
          </p>
        </div>

        {/* 2-Column Split: Product Features + Interactive Savings Interest Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 360 Performance Savings & 360 Checking Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            {/* 360 Performance Savings Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 relative overflow-hidden group hover:border-[#005C9D]/40 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full mb-2">
                    High Yield Savings
                  </span>
                  <h3 className="text-xl font-bold text-[#1A1A1A]">
                    360 Performance Savings™
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#005C9D] tabular-nums">
                    4.25%
                  </span>
                  <span className="text-xs block text-slate-500 font-semibold uppercase">
                    Annual APY
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mb-6 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No monthly maintenance fees or minimum deposit required</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>FDIC insured up to $250,000 per depositor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic savings tools and goal-based buckets</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => onOpenAccount('360 Savings')}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Open 360 Savings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 360 Checking Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 relative overflow-hidden group hover:border-[#005C9D]/40 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-sky-100 text-[#005C9D] text-[11px] font-bold rounded-full mb-2">
                    Everyday Fee-Free
                  </span>
                  <h3 className="text-xl font-bold text-[#1A1A1A]">
                    360 Checking®
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-slate-800 tabular-nums">
                    $0 Fee
                  </span>
                  <span className="text-xs block text-slate-500">Everyday Banking</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Access to 70,000+ fee-free ATMs nationwide (Allpoint® &amp; MoneyPass®)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Get paid up to 2 days early with direct deposit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Overdraft options with no transfer fees or overdraft fees</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => onOpenAccount('360 Checking')}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-[#005C9D] border border-slate-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open 360 Checking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Savings Interest Growth Calculator */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-[#002D52] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Interactive Calculator
                </span>
                <span className="text-xs text-sky-200">Annual Return Estimator</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                See how much more you earn with 4.25% APY
              </h3>

              {/* Deposit Slider Control */}
              <div className="mt-6 bg-white/10 p-5 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-sky-200 font-semibold">Initial Deposit Amount:</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                    ${deposit.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>$1,000</span>
                  <span>$50,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              {/* Side-by-side comparison boxes */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Capital One Earnings */}
                <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-4">
                  <span className="text-xs font-semibold text-emerald-300 block">
                    Capital One (4.25% APY)
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1 tabular-nums">
                    +${earnedCapitalOne1Yr.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-200/80">in 1 year</span>
                </div>

                {/* National Average Earnings */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <span className="text-xs font-semibold text-slate-300 block">
                    National Avg (0.45% APY)
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-mono mt-1 tabular-nums">
                    +${earnedNational1Yr.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400">in 1 year</span>
                </div>
              </div>

              {/* Difference highlight */}
              <div className="mt-4 p-3 bg-sky-500/20 border border-sky-400/30 rounded-lg text-xs text-sky-200 flex items-center justify-between">
                <span>You earn an extra:</span>
                <span className="text-base font-bold text-white font-mono tabular-nums">
                  +${difference1Yr.toLocaleString()} / yr
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => onOpenAccount('360 Savings Calculator')}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-lg transition-colors cursor-pointer shadow-md"
              >
                Start Earning 4.25% APY Today
              </button>
              <span className="text-[11px] text-slate-400 block mt-2">
                APY is accurate as of latest review. Rates are variable and subject to change.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
