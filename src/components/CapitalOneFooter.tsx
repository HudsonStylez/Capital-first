import React from 'react';
import { CapitalOneLogo } from './CapitalOneLogo';
import { ShieldCheck, Building } from 'lucide-react';

export const CapitalOneFooter: React.FC = () => {
  return (
    <footer className="bg-[#333333] text-slate-300 py-12 px-4 text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top: Brand wordmark & quick link columns */}
        <div className="flex flex-col md:flex-row items-start justify-between pb-8 border-b border-slate-700 gap-8">
          <div>
            <CapitalOneLogo variant="light" className="h-8 mb-3" />
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Capital One is dedicated to financial freedom, everyday rewards, and modern digital banking for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
            <div>
              <span className="font-bold text-white uppercase tracking-wider block mb-3 text-[11px]">
                Products
              </span>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#cards" className="hover:text-white transition-colors">Credit Cards</a></li>
                <li><a href="#banking" className="hover:text-white transition-colors">Checking &amp; Savings</a></li>
                <li><a href="#auto" className="hover:text-white transition-colors">Auto Financing</a></li>
                <li><a href="#creditwise" className="hover:text-white transition-colors">CreditWise</a></li>
                <li><a href="#business" className="hover:text-white transition-colors">Business Accounts</a></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-white uppercase tracking-wider block mb-3 text-[11px]">
                Support
              </span>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#contact" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#locations" className="hover:text-white transition-colors">Cafés &amp; Branches</a></li>
                <li><a href="#atm" className="hover:text-white transition-colors">70,000+ Free ATMs</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security Center</a></li>
                <li><a href="#dispute" className="hover:text-white transition-colors">Report Fraud</a></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-white uppercase tracking-wider block mb-3 text-[11px]">
                About Us
              </span>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">Company Info</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#news" className="hover:text-white transition-colors">Press &amp; Newsroom</a></li>
                <li><a href="#inclusion" className="hover:text-white transition-colors">Diversity &amp; Inclusion</a></li>
                <li><a href="#esg" className="hover:text-white transition-colors">ESG Commitments</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Regulatory & Institutional Badges */}
        <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs py-2">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-300" />
            <span className="font-semibold text-white">Member FDIC</span>
            <span>· Bank deposits FDIC insured up to $250,000</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-300" />
            <span className="font-semibold text-white">Equal Housing Lender</span>
          </div>
        </div>

        {/* Legal Disclaimers (12px typography as required by prompt) */}
        <div className="space-y-3 text-[12px] text-slate-400 leading-relaxed border-t border-slate-700/80 pt-6">
          <p>
            <strong>Credit Cards:</strong> Advertised annual percentage rates (APRs) and promotional terms are accurate as of the date shown. Variable APRs vary with the market based on the Prime Rate. Cards are subject to credit approval. Terms apply.
          </p>
          <p>
            <strong>360 Performance Savings™:</strong> The Annual Percentage Yield (APY) is variable and subject to change at any time without notice, before or after account opening. No minimum balance required to open or maintain the account.
          </p>
          <p>
            <strong>Auto Navigator:</strong> Pre-qualification does not guarantee loan approval or specific terms. Pre-qualification is a soft credit check that will not affect your credit score. Participating dealers are independent third parties and are not agents of Capital One.
          </p>
          <p>
            <strong>CreditWise®:</strong> Educational score provided is a VantageScore® 3.0 based on TransUnion® data. It is not used by all lenders to make credit decisions. Free for everyone, regardless of whether you have an existing Capital One account.
          </p>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026 Capital One. All rights reserved. Capital One, 360 Checking, 360 Performance Savings, Venture X, and Savor are registered trademarks.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
            <a href="#adchoices" className="hover:text-white transition-colors">Ad Choices</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
