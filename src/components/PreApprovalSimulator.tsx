import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface PreApprovalSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMatchedCard: (cardName: string) => void;
}

export const PreApprovalSimulator: React.FC<PreApprovalSimulatorProps> = ({
  isOpen,
  onClose,
  onSelectMatchedCard,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [goal, setGoal] = useState<string>('cashback');
  const [creditTier, setCreditTier] = useState<string>('good');
  const [employment, setEmployment] = useState<string>('employed');

  useEscapeKey(() => onClose(), isOpen);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setGoal('cashback');
    setCreditTier('good');
    setEmployment('employed');
  };

  const getMatchedCard = () => {
    if (goal === 'apr') {
      return {
        name: 'Quicksilver Cash Rewards',
        perk: '0% Intro APR for 15 Months',
        fee: '$0 Annual Fee',
        apr: '0% Intro APR for 15 months; then 19.99% - 29.99%',
        matchScore: '97% Match',
        image: '/assets/images/funnel_two_cards_1794213932269.jpg',
      };
    }
    if (goal === 'travel' && creditTier === 'excellent') {
      return {
        name: 'Venture X Rewards',
        perk: '75,000 Bonus Miles + 2X Everywhere',
        fee: '$395 Annual Fee',
        apr: '19.99% - 29.99% Variable APR',
        matchScore: '98% Match',
        image: '/assets/images/venture_x_card_1794203768439.jpg',
      };
    }
    if (goal === 'build' || creditTier === 'rebuilding' || creditTier === 'fair') {
      return {
        name: 'Platinum Mastercard',
        perk: 'No Annual Fee + Automatic Credit Line Reviews',
        fee: '$0 Annual Fee',
        apr: '29.99% Variable APR',
        matchScore: '95% Match',
        image: '/assets/images/savor_card_1794203769130.jpg',
      };
    }
    return {
      name: 'Savor Cash Rewards',
      perk: '3% Cash Back on Dining, Groceries & Entertainment',
      fee: '$0 Annual Fee',
      apr: '19.99% - 29.99% Variable APR',
      matchScore: '96% Match',
      image: '/assets/images/savor_card_1794203769130.jpg',
    };
  };

  const match = getMatchedCard();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-[#005C9D] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Capital One Pre-Approval
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> No impact to your credit score
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="my-4">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span>Step {step} of 3</span>
            <span>{step === 1 ? 'Select Goal' : step === 2 ? 'Credit Profile' : 'Personalized Offer'}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#005C9D] transition-all duration-300"
              style={{ width: `${((step - 1) / (3 - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Select Card Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-700 font-medium">
              What is your primary goal for your next card?
            </p>
            <div className="space-y-2">
              {[
                { id: 'cashback', title: 'Everyday Cash Back', desc: 'Dining, groceries, and streaming perks' },
                { id: 'travel', title: 'Travel & Airline Miles', desc: 'Flights, hotels, lounges and trip credits' },
                { id: 'apr', title: '0% Intro APR', desc: 'Save on interest for large purchases or balance transfers' },
                { id: 'build', title: 'Building / Rebuilding Credit', desc: 'Accessible approvals with credit line growth' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    goal === opt.id
                      ? 'border-[#005C9D] bg-sky-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{opt.title}</span>
                    <span className="text-xs text-slate-500">{opt.desc}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      goal === opt.id ? 'border-[#005C9D] bg-[#005C9D] text-white' : 'border-slate-300'
                    }`}
                  >
                    {goal === opt.id && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Credit Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-700 font-medium">
              How would you rate your current credit health?
            </p>
            <div className="space-y-2">
              {[
                { id: 'excellent', score: '740 - 850', label: 'Excellent Credit', note: 'Never missed a payment, high credit limits' },
                { id: 'good', score: '670 - 739', label: 'Good Credit', note: 'Consistent payments, established credit history' },
                { id: 'fair', score: '580 - 669', label: 'Fair Credit', note: 'Limited credit or occasional late mark' },
                { id: 'rebuilding', score: '< 580', label: 'Rebuilding Credit', note: 'Looking to start fresh or repair score' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setCreditTier(tier.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    creditTier === tier.id
                      ? 'border-[#005C9D] bg-sky-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{tier.label}</span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {tier.score}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">{tier.note}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      creditTier === tier.id ? 'border-[#005C9D] bg-[#005C9D] text-white' : 'border-slate-300'
                    }`}
                  >
                    {creditTier === tier.id && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>View My Pre-Approved Match</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Match Result */}
        {step === 3 && (
          <div className="text-center py-2 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-3 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Pre-Approval Recommended</span>
            </div>

            <h4 className="text-xl font-bold text-slate-900">
              Great news! You have strong odds for:
            </h4>

            {/* Matched Card Card */}
            <div className="mt-4 p-4 rounded-xl border-2 border-[#005C9D] bg-sky-50/40 text-left">
              <div className="flex items-center gap-4">
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-24 h-16 object-cover rounded-md border border-slate-200 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-slate-900 text-base">{match.name}</h5>
                    <span className="text-[10px] bg-[#005C9D] text-white font-bold px-1.5 py-0.5 rounded">
                      {match.matchScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-0.5">{match.perk}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{match.fee} · {match.apr}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-sm mx-auto">
              This simulated pre-approval does not guarantee account opening. Final approval is subject to application verification.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onSelectMatchedCard(match.name);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Proceed to Apply
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Try Different Answers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

