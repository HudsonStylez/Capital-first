import React, { useState } from 'react';
import { ShieldCheck, Check, Sparkles, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface CreditWiseSectionProps {
  onSignUp: () => void;
}

export const CreditWiseSection: React.FC<CreditWiseSectionProps> = ({ onSignUp }) => {
  const baseScore = 715;
  const [activeSimulations, setActiveSimulations] = useState<string[]>(['pay_debt']);

  const simulationOptions = [
    {
      id: 'pay_debt',
      label: 'Pay down credit card debt by $2,500',
      impact: +22,
      category: 'Credit Utilization',
    },
    {
      id: 'on_time',
      label: 'Make all payments on-time for 6 consecutive months',
      impact: +16,
      category: 'Payment History',
    },
    {
      id: 'credit_limit',
      label: 'Request a $4,000 credit limit increase',
      impact: +11,
      category: 'Available Credit',
    },
    {
      id: 'new_card',
      label: 'Apply for a new loan or card (Hard inquiry)',
      impact: -7,
      category: 'New Credit',
    },
    {
      id: 'missed_pay',
      label: 'Simulate one missed payment (30 days late)',
      impact: -65,
      category: 'Delinquency',
    },
  ];

  const totalDelta = simulationOptions
    .filter((opt) => activeSimulations.includes(opt.id))
    .reduce((acc, curr) => acc + curr.impact, 0);

  const currentScore = Math.min(850, Math.max(300, baseScore + totalDelta));

  const getScoreBand = (score: number) => {
    if (score >= 740) return { label: 'Excellent', color: 'text-emerald-600', stroke: '#059669', bg: 'bg-emerald-50' };
    if (score >= 670) return { label: 'Good', color: 'text-[#005C9D]', stroke: '#005C9D', bg: 'bg-sky-50' };
    if (score >= 580) return { label: 'Fair', color: 'text-amber-600', stroke: '#D97706', bg: 'bg-amber-50' };
    return { label: 'Needs Work', color: 'text-red-600', stroke: '#DC2626', bg: 'bg-red-50' };
  };

  const band = getScoreBand(currentScore);

  const scoreScaleBounds = [
    { label: 'Needs Work', from: 300, to: 580, color: 'bg-red-400' },
    { label: 'Fair', from: 580, to: 670, color: 'bg-amber-400' },
    { label: 'Good', from: 670, to: 740, color: 'bg-sky-500' },
    { label: 'Excellent', from: 740, to: 850, color: 'bg-emerald-500' },
  ];
  const scoreScaleMax = 850 - 300;
  const scoreScaleSegments = scoreScaleBounds.map((seg) => ({
    ...seg,
    widthPercent: ((seg.to - seg.from) / scoreScaleMax) * 100,
  }));

  const toggleSimulation = (id: string) => {
    if (activeSimulations.includes(id)) {
      setActiveSimulations(activeSimulations.filter((item) => item !== id));
    } else {
      setActiveSimulations([...activeSimulations, id]);
    }
  };

  return (
    <section id="creditwise" className="py-12 px-4 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold tracking-wider uppercase text-[#005C9D]">
                CreditWise® from Capital One
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Free for Everyone
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Monitor your credit score anytime. Completely free.
            </h2>
          </div>
          <p className="text-sm text-[#666666] max-w-md">
            You don’t even have to be a Capital One customer. Check your TransUnion® score as often as you want without hurting it.
          </p>
        </div>

        {/* 2-Column Split: Features + Interactive Credit Score Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: What CreditWise Offers */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-[#005C9D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Weekly Credit Updates</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Track your TransUnion® VantageScore® 3.0 updated weekly with clear insights on what affects your numbers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Dark Web &amp; SSN Alerts</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Get alerted if your Social Security number or personal data is discovered on compromised sites.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Interactive Simulator</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Test potential financial decisions before making them to understand potential score fluctuations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onSignUp}
                className="w-full py-3 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Get Free CreditWise Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-500 block text-center mt-2">
                No credit card required. Free forever.
              </span>
            </div>
          </div>

          {/* Right: Interactive Simulator Widget */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005C9D]">
                    Interactive Tool
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Credit Score Simulator
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSimulations([])}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors p-1"
                  title="Reset Simulator"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Gauge and Score Display */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 bg-slate-50/70 rounded-xl border border-slate-100 mb-6">
                {/* Score Number & Badge */}
                <div className="text-center sm:text-left">
                  <span className="text-xs text-slate-500 uppercase font-semibold">
                    Simulated VantageScore®
                  </span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight my-1 tabular-nums">
                    {currentScore}
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${band.bg} ${band.color}`}>
                      {band.label}
                    </span>
                    {totalDelta !== 0 && (
                      <span className={`text-xs font-mono font-bold ${totalDelta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {totalDelta > 0 ? `+${totalDelta} pts` : `${totalDelta} pts`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Scale Bar */}
                <div className="w-full sm:max-w-xs space-y-1 text-xs">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>300</span>
                    <span>580</span>
                    <span>670</span>
                    <span>740</span>
                    <span>850</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    {scoreScaleSegments.map((seg) => (
                      <div
                        key={seg.label}
                        className={`h-full ${seg.color}`}
                        style={{ width: `${seg.widthPercent}%` }}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 text-center font-medium pt-1">
                    Base starting score: {baseScore}
                  </div>
                </div>
              </div>

              {/* Toggles for Financial Scenarios */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2.5">
                  Toggle Actions to Test Score Impact:
                </span>
                <div className="space-y-2">
                  {simulationOptions.map((opt) => {
                    const isChecked = activeSimulations.includes(opt.id);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleSimulation(opt.id)}
                        className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? 'border-[#005C9D] bg-sky-50/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-[#005C9D] border-[#005C9D] text-white' : 'border-slate-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-800 block">
                              {opt.label}
                            </span>
                            <span className="text-[10px] text-slate-400">{opt.category}</span>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-mono font-bold shrink-0 ml-2 ${
                            opt.impact > 0 ? 'text-emerald-700' : 'text-red-700'
                          }`}
                        >
                          {opt.impact > 0 ? `+${opt.impact}` : opt.impact} pts
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-6 text-center">
              VantageScore 3.0 model used. Results are an educational estimation and not a guarantee of score change.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
