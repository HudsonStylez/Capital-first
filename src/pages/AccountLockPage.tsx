import React from 'react';
import { CapitalOneLogo } from '../components/CapitalOneLogo';
import { PhoneCall, HelpCircle, Shield, ArrowRight } from 'lucide-react';

interface AccountLockPageProps {
  onNavigate: (path: string) => void;
}

export const AccountLockPage: React.FC<AccountLockPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between text-[#1A1A1A]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <CapitalOneLogo className="h-8 sm:h-9" />
          </button>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Security &amp; Fraud Prevention
          </span>
        </div>
      </div>

      {/* Main Lock Card */}
      <div className="flex-1 flex items-center justify-center p-4 my-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[12px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] text-center animate-in fade-in zoom-in-95 duration-200">
          {/* Centered diamond icon inside a blue circle */}
          <div className="w-20 h-20 rounded-full bg-sky-50 border-4 border-[#005C9D]/20 mx-auto flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#005C9D] flex items-center justify-center shadow-md">
              {/* Diamond SVG icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M12 2L2 12l10 10 10-10L12 2z" />
              </svg>
            </div>
          </div>

          {/* Title: "We want to keep you safe" */}
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3 tracking-tight">
            We want to keep you safe
          </h1>

          {/* Text: "Your online access has been locked because we detected some suspicious activity. Give us a call so we can help you sort this out." */}
          <p className="text-sm text-[#666666] leading-relaxed mb-6">
            Your online access has been locked because we detected some suspicious activity. Give us a call so we can help you sort this out.
          </p>

          {/* Contact phone pill */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 mb-6 flex items-center justify-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#005C9D]" />
            <span>Call 24/7 Security Assistance: <strong>1-800-227-4825</strong></span>
          </div>

          {/* Action: A large blue "OK" button, outlined with a double border */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full py-3.5 px-6 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-base rounded-md border-4 border-double border-sky-300 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              OK
            </button>

            {/* Blue link below: "Please visit our FAQ for more information." */}
            <button
              type="button"
              onClick={() => onNavigate('/sign-in-help')}
              className="text-xs text-[#005C9D] hover:text-[#00487D] font-bold hover:underline cursor-pointer"
            >
              Please visit our FAQ for more information.
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-4 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        &copy;2026 Capital One · Member FDIC · 24/7 Fraud &amp; Identity Protection
      </div>
    </div>
  );
};
