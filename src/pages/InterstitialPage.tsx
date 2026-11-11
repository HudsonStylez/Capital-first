import React, { useState } from 'react';
import { CapitalOneLogo } from '../components/CapitalOneLogo';
import {
  CreditCard,
  ChevronRight,
  Download,
  ArrowRight,
  ShieldCheck,
  Bell,
  Clock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface InterstitialPageProps {
  onNavigate: (path: string) => void;
}

export const InterstitialPage: React.FC<InterstitialPageProps> = ({ onNavigate }) => {
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const handleDownloadApp = () => {
    setDownloadTriggered(true);
    setTimeout(() => setDownloadTriggered(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#001B3A] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-[#005C9D] selection:text-white">
      {/* Top back navigation / home shortcut */}
      <div className="w-full max-w-md mx-auto px-4 pt-4 flex items-center justify-between text-xs text-sky-200">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Capital One</span>
        </button>
        <span className="font-mono text-[11px] opacity-75">Mobile App Interstitial</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full text-center">
        {/* Centered White Capital One Logo */}
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="mb-4 cursor-pointer hover:opacity-85 transition-opacity"
          title="Return to Capital One Home"
        >
          <CapitalOneLogo variant="light" className="h-10 mx-auto" />
        </button>

        {/* Text Below: "Looking for money management in the palm of your hand?" */}
        <h1 className="text-xl sm:text-2xl font-light text-slate-100 leading-snug tracking-tight max-w-xs mb-8">
          Looking for money management in the palm of your hand?
        </h1>

        {/* Hero Image: A realistic CSS-built smartphone mockup */}
        <div className="relative w-[280px] sm:w-[295px] rounded-[42px] p-2.5 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-400/40 mx-auto my-2">
          {/* Outer phone rim & screen frame */}
          <div className="relative w-full rounded-[34px] bg-[#0A2342] overflow-hidden border-[2px] border-slate-900 shadow-inner">
            {/* Top Speaker & Notch */}
            <div className="relative w-full pt-2 pb-1 bg-[#0A2342] flex justify-center items-center z-20">
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
              </div>
            </div>

            {/* Screen Content: Capital One app dashboard with QUICKSILVER card showing $524.13 */}
            <div className="w-full bg-gradient-to-b from-[#09223D] via-[#0B2A4C] to-slate-950 text-white p-3.5 pt-1 text-left flex flex-col min-h-[440px] select-none">
              {/* App Status Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-200">
                  CAPITAL ONE
                </span>
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-slate-300" />
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
                    AC
                  </div>
                </div>
              </div>

              {/* QUICKSILVER Card showing $524.13 balance, available credit, and rewards cash */}
              <div className="mt-3 bg-gradient-to-br from-[#123962] via-[#0E3156] to-[#0A2342] p-3.5 rounded-xl border border-sky-400/30 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-sky-300" />
                    <span className="text-xs font-black tracking-wider uppercase text-white">
                      QUICKSILVER
                    </span>
                    <span className="text-[9px] text-slate-300 font-mono">...4819</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                    1.5% Cash
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-[9px] text-slate-300 block uppercase font-medium">
                    Current Balance
                  </span>
                  <div className="text-2xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    $524.13
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <div>
                    <span className="text-slate-300 block">Available Credit</span>
                    <span className="font-bold font-mono text-slate-100">$4,475.87</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-300 block">Rewards Cash</span>
                    <span className="font-bold font-mono text-emerald-300">$48.20</span>
                  </div>
                </div>
              </div>

              {/* White panel below card showing "Payment Due Apr 15" with a blue "PAY BILL" link */}
              <div className="mt-3 bg-white text-slate-900 rounded-xl p-3 shadow-md border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Payment Due Apr 15
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Minimum Due: $35.00
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('/signin')}
                    className="px-2.5 py-1 bg-[#005C9D] text-white text-[11px] font-bold rounded uppercase tracking-wide hover:bg-[#00487D] transition-colors shadow-xs"
                  >
                    PAY BILL
                  </button>
                </div>
              </div>

              {/* "Recent Transactions" List (e.g. Towers Croissant $6.83) */}
              <div className="mt-3 flex-1 bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 pb-1.5 border-b border-white/10">
                    <span>Recent Transactions</span>
                    <span className="text-[9px] text-sky-300 font-normal">View All</span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block text-[11px]">
                          Towers Croissant
                        </span>
                        <span className="text-[9px] text-slate-300">Apr 12 · Dining</span>
                      </div>
                      <span className="font-mono font-bold text-white text-[11px]">
                        $6.83
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block text-[11px]">
                          Whole Foods Market
                        </span>
                        <span className="text-[9px] text-slate-300">Apr 11 · Groceries</span>
                      </div>
                      <span className="font-mono font-bold text-white text-[11px]">
                        $42.19
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block text-[11px]">
                          Uber Trip
                        </span>
                        <span className="text-[9px] text-slate-300">Apr 10 · Rideshare</span>
                      </div>
                      <span className="font-mono font-bold text-white text-[11px]">
                        $18.50
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: A white bar at the bottom */}
      <div className="w-full bg-white text-slate-900 py-6 px-4 shadow-2xl border-t border-slate-200">
        <div className="max-w-md mx-auto text-center flex flex-col items-center">
          {downloadTriggered ? (
            <div className="w-full py-3.5 px-6 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2 animate-in fade-in">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulated: Opening iOS App Store / Google Play...</span>
            </div>
          ) : (
            /* Large blue button: "Download the App" */
            <button
              type="button"
              onClick={handleDownloadApp}
              className="w-full py-3.5 px-6 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-base rounded-lg transition-colors shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download the App</span>
            </button>
          )}

          {/* Text link below: "Sign in online >" which routes to /signin */}
          <button
            type="button"
            onClick={() => onNavigate('/signin')}
            className="mt-4 text-[#005C9D] hover:text-[#00487D] font-bold text-sm transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Sign in online &gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
