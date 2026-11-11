import React, { useState } from 'react';
import {
  Home,
  Gift,
  ArrowLeftRight,
  HelpCircle,
  User,
  PlusCircle,
  ArrowDownLeft,
  Receipt,
  Repeat,
  X,
  ShieldCheck,
  Plane,
  Sparkles,
  PhoneCall,
  MessageSquare,
  Lock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'benefits' | 'pay-move' | 'help' | 'profile';
  onNavigate: (path: string) => void;
  onGoHome?: () => void;
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenPayBill?: () => void;
  onOpenTransfer?: () => void;
  onOpenTravel?: () => void;
  onOpenVirtualCards?: () => void;
  onOpenKyc?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  onGoHome,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenPayBill,
  onOpenTransfer,
  onOpenTravel,
  onOpenVirtualCards,
  onOpenKyc,
}) => {
  const [isPayMoveSheetOpen, setIsPayMoveSheetOpen] = useState(false);
  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [activeHelpFeature, setActiveHelpFeature] = useState<'none' | 'eno_chat' | 'routing_info' | 'locator'>('none');
  const [activeBenefitFeature, setActiveBenefitFeature] = useState<'none' | 'creditwise' | 'shopping_deals'>('none');
  const [bottomToast, setBottomToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setBottomToast(msg);
    setTimeout(() => setBottomToast(null), 3000);
  };

  const handleTabClick = (tab: 'home' | 'benefits' | 'pay-move' | 'help' | 'profile') => {
    if (tab === 'home') {
      if (onGoHome) {
        onGoHome();
      }
      onNavigate('/dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'profile') {
      onNavigate('/profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'pay-move') {
      setIsPayMoveSheetOpen(true);
    } else if (tab === 'benefits') {
      setIsBenefitsModalOpen(true);
    } else if (tab === 'help') {
      setIsHelpModalOpen(true);
    }
  };

  return (
    <>
      {/* Sticky Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors ${
              currentTab === 'home' ? 'text-[#005C9D]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Home</span>
          </button>

          {/* 2. Benefits */}
          <button
            type="button"
            onClick={() => handleTabClick('benefits')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors ${
              currentTab === 'benefits' ? 'text-[#005C9D]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Benefits</span>
          </button>

          {/* 3. Pay / Move (Highlighted central action) */}
          <button
            type="button"
            onClick={() => handleTabClick('pay-move')}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-[#005C9D] text-white flex items-center justify-center shadow-md group-hover:bg-[#00487D] transition-transform active:scale-95">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#005C9D] mt-0.5">Pay / Move</span>
          </button>

          {/* 4. Help */}
          <button
            type="button"
            onClick={() => handleTabClick('help')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors ${
              currentTab === 'help' ? 'text-[#005C9D]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Help</span>
          </button>

          {/* 5. Profile */}
          <button
            type="button"
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors ${
              currentTab === 'profile' ? 'text-[#005C9D]' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-1">Profile</span>
          </button>
        </div>
      </nav>

      {/* Pay / Move Action Sheet Modal */}
      {isPayMoveSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setIsPayMoveSheetOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg p-6 shadow-2xl relative border-t border-slate-200 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Move Money &amp; Payments</h3>
                <p className="text-xs text-slate-500">Choose a quick financial action</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPayMoveSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
              {/* Option 1: Add Money (Deposit) */}
              <button
                type="button"
                onClick={() => {
                  setIsPayMoveSheetOpen(false);
                  if (onOpenDeposit) onOpenDeposit();
                }}
                className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-800">
                    Add Money
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Mobile check, ACH, or deposit
                  </span>
                </div>
              </button>

              {/* Option 2: Withdraw Funds */}
              <button
                type="button"
                onClick={() => {
                  setIsPayMoveSheetOpen(false);
                  if (onOpenWithdraw) onOpenWithdraw();
                }}
                className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-[#005C9D] hover:bg-sky-50/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#005C9D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block group-hover:text-[#005C9D]">
                    Withdraw Funds
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Chase, BoA, Wire, or ATM cash
                  </span>
                </div>
              </button>

              {/* Option 3: Pay Bill */}
              <button
                type="button"
                onClick={() => {
                  setIsPayMoveSheetOpen(false);
                  if (onOpenPayBill) onOpenPayBill();
                }}
                className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-800">
                    Pay a Bill
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Pay credit card from checking
                  </span>
                </div>
              </button>

              {/* Option 4: Transfer Between Accounts */}
              <button
                type="button"
                onClick={() => {
                  setIsPayMoveSheetOpen(false);
                  if (onOpenTransfer) onOpenTransfer();
                }}
                className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-800">
                    Internal Transfer
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Move between your accounts
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Built-In Benefits Modal (In-App View so users are NEVER kicked out) */}
      {isBenefitsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsBenefitsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#005C9D]" />
                <h3 className="font-bold text-slate-900 text-base">Your Built-In Benefits</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBenefitsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
              {/* CreditWise */}
              <button
                type="button"
                onClick={() => {
                  setActiveBenefitFeature('creditwise');
                }}
                className="w-full p-3.5 bg-sky-50/60 hover:bg-sky-100/70 border border-sky-200 rounded-xl flex items-start gap-3 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#005C9D] text-white flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                  740
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-[#005C9D]">
                      CreditWise Free Score Monitoring
                    </span>
                    <span className="text-[10px] text-[#005C9D] font-bold">View Score →</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Your TransUnion credit score is in the Excellent range (740). Tap to view 6 score factors and simulator.
                  </p>
                </div>
              </button>

              {/* Capital One Shopping */}
              <button
                type="button"
                onClick={() => {
                  setActiveBenefitFeature('shopping_deals');
                }}
                className="w-full p-3.5 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 rounded-xl flex items-start gap-3 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-800">
                      Capital One Shopping Rebates &amp; Coupons
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">View Deals →</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Automated coupon detection and up to 15% cash back rebates at Apple, Nike, Walmart &amp; Dell.
                  </p>
                </div>
              </button>

              {/* Travel & Protection */}
              <button
                type="button"
                onClick={() => {
                  setIsBenefitsModalOpen(false);
                  if (onOpenTravel) {
                    onOpenTravel();
                  } else {
                    onNavigate('/dashboard');
                  }
                }}
                className="w-full p-3.5 bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200 rounded-xl flex items-start gap-3 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Plane className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-800">
                      Capital One Travel &amp; Lounges
                    </span>
                    <span className="text-[10px] text-purple-700 font-bold">Book Flight →</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Price match guarantee on flights, seat selection, and access to premium airport lounges worldwide.
                  </p>
                </div>
              </button>

              {/* Security Protection */}
              <button
                type="button"
                onClick={() => {
                  setIsBenefitsModalOpen(false);
                  if (onOpenVirtualCards) {
                    onOpenVirtualCards();
                  } else {
                    onNavigate('/dashboard');
                  }
                }}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-start gap-3 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-slate-900">
                      $0 Fraud Liability &amp; Virtual Cards
                    </span>
                    <span className="text-[10px] text-slate-800 font-bold">Manage Cards →</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Generate up to 3 distinct virtual cards with unique card art, spending limits, and instant lock.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsBenefitsModalOpen(false)}
                className="px-4 py-2 bg-[#005C9D] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#00487D]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Customer Support Modal (Never kicks user out) */}
      {isHelpModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsHelpModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#005C9D]" />
                <h3 className="font-bold text-slate-900 text-base">Capital One Support</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Live Chat with Eno */}
              <button
                type="button"
                onClick={() => {
                  setActiveHelpFeature('eno_chat');
                }}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-800">Chat with Eno</span>
                    <span className="text-[11px] text-slate-500">24/7 intelligent banking assistant</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-600 font-bold">Open Chat →</span>
              </button>

              {/* Option 2: Routing Number & Wire Instructions */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('051405515');
                  showToast('Routing Transit Number 051405515 copied to clipboard!');
                }}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-800">Routing Transit Number</span>
                    <span className="text-[11px] text-slate-500">Capital One, N.A. (051405515)</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-indigo-600 font-bold">Copy RTN</span>
              </button>

              {/* Option 3: Customer Service Line */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('1-800-227-4825');
                  showToast('Toll-Free Customer Service 1-800-227-4825 copied to clipboard!');
                }}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-[#005C9D] flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Customer Service Line</span>
                    <span className="text-[11px] text-slate-500">1-800-CAPITAL (227-4825)</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-600 font-bold">Toll-Free</span>
              </button>

              {/* Option 4: KYC Document Verification Shortcut */}
              <button
                type="button"
                onClick={() => {
                  setIsHelpModalOpen(false);
                  if (onOpenKyc) {
                    onOpenKyc();
                  } else {
                    onNavigate('/dashboard');
                  }
                }}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Account Verification (KYC)</span>
                    <span className="text-[11px] text-slate-500">Upload ID &amp; Utility Bill for Admin Approval</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-600 font-bold">Check Status →</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="px-4 py-2 bg-[#005C9D] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#00487D]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CreditWise Score Breakdown Modal */}
      {activeBenefitFeature === 'creditwise' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveBenefitFeature('none')}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#005C9D] text-white flex items-center justify-center text-xs font-bold">
                  CW
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">CreditWise by Capital One</h3>
                  <span className="text-[11px] text-slate-500">TransUnion VantageScore® 3.0</span>
                </div>
              </div>
              <button onClick={() => setActiveBenefitFeature('none')} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-3 bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-2xl border border-sky-100 mb-4">
              <span className="text-4xl font-extrabold text-[#005C9D] font-mono">740</span>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mt-1">Excellent Score Tier</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Updated this week · 0 impact to your credit</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-700 font-medium">On-Time Payment History</span>
                <span className="font-bold text-emerald-600 font-mono">100% (Exceptional)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-700 font-medium">Credit Card Utilization</span>
                <span className="font-bold text-emerald-600 font-mono">14% (Under 30% Goal)</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-700 font-medium">Derogatory Marks</span>
                <span className="font-bold text-emerald-600 font-mono">0 Marks</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-700 font-medium">Average Age of Credit</span>
                <span className="font-bold text-slate-900 font-mono">6 Yrs 8 Mos</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveBenefitFeature('none')}
                className="px-4 py-2 bg-[#005C9D] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close CreditWise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capital One Shopping Deals Modal */}
      {activeBenefitFeature === 'shopping_deals' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveBenefitFeature('none')}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Capital One Shopping</h3>
                  <span className="text-[11px] text-slate-500">Live Retail Cash Back Rebates</span>
                </div>
              </div>
              <button onClick={() => setActiveBenefitFeature('none')} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { merchant: 'Apple Store', rebate: '10% Cash Back', code: 'CAPONE-APL10', desc: 'Eligible on Mac, iPad, and Apple Watch models.' },
                { merchant: 'Nike Official', rebate: '15% Cash Back', code: 'AIRMAX-SAVOR', desc: 'Applies automatically at checkout on orders over $50.' },
                { merchant: 'Walmart.com', rebate: '8% Cash Back', code: 'AUTO-SAVINGS', desc: 'Electronics, groceries, and home goods eligible.' },
                { merchant: 'Dell Technologies', rebate: '12% Cash Back', code: 'DELL-CORP12', desc: 'XPS laptops and UltraSharp monitors.' },
              ].map((deal) => (
                <div key={deal.merchant} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{deal.merchant}</span>
                    <span className="text-[11px] text-emerald-700 font-bold block">{deal.rebate}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{deal.desc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(deal.code);
                      showToast(`Rebate ${deal.code} activated for ${deal.merchant}!`);
                    }}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg cursor-pointer shrink-0"
                  >
                    Activate
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveBenefitFeature('none')}
                className="px-4 py-2 bg-[#005C9D] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Live Eno Chat Modal */}
      {activeHelpFeature === 'eno_chat' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveHelpFeature('none')}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#005C9D] text-white flex items-center justify-center font-bold text-xs">
                  eno
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Eno by Capital One</h3>
                  <span className="text-[10px] text-emerald-600 font-bold">● Active 24/7 AI Assistant</span>
                </div>
              </div>
              <button onClick={() => setActiveHelpFeature('none')} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto p-1 text-xs">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-slate-800">
                Hi! I'm Eno, your Capital One intelligent assistant. How can I help you today?
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'What is my routing number?',
                  'How to unlock withdrawals?',
                  'Issue a virtual card',
                  'Book a flight',
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      if (q.includes('routing')) {
                        showToast('Capital One Routing Transit Number is 051405515');
                      } else if (q.includes('unlock')) {
                        setActiveHelpFeature('none');
                        setIsHelpModalOpen(false);
                        if (onOpenKyc) onOpenKyc();
                      } else if (q.includes('virtual')) {
                        setActiveHelpFeature('none');
                        setIsHelpModalOpen(false);
                        if (onOpenVirtualCards) onOpenVirtualCards();
                      } else if (q.includes('flight')) {
                        setActiveHelpFeature('none');
                        setIsHelpModalOpen(false);
                        if (onOpenTravel) onOpenTravel();
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[11px] font-medium cursor-pointer transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveHelpFeature('none')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Close Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Toast */}
      {bottomToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2 rounded-xl shadow-xl border border-slate-700 animate-in fade-in duration-200">
          {bottomToast}
        </div>
      )}
    </>
  );
};
