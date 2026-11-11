import React, { useState } from 'react';
import { CapitalOneLogo } from './CapitalOneLogo';
import {
  Plus,
  Minus,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Building2,
  ShieldCheck,
  ToggleRight,
  ToggleLeft,
  ExternalLink,
} from 'lucide-react';

// Custom X (formerly Twitter) SVG Icon
const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-label="X (formerly Twitter)"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Subtle white Google "G" Icon triggering Admin Access
const GoogleGIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Admin Access">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.053 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

interface GlobalFooterProps {
  onOpenAdminPasscode?: () => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ onOpenAdminPasscode }) => {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const [isFootnotesOpen, setIsFootnotesOpen] = useState(true);
  const [privacyToggle, setPrivacyToggle] = useState(true);

  // 5-click trigger for admin terminal
  const [googleClickCount, setGoogleClickCount] = useState(0);
  const clickTimeoutRef = React.useRef<any>(null);

  const handleGoogleIconClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    const nextCount = googleClickCount + 1;
    if (nextCount >= 5) {
      setGoogleClickCount(0);
      onOpenAdminPasscode?.();
    } else {
      setGoogleClickCount(nextCount);
      clickTimeoutRef.current = setTimeout(() => {
        setGoogleClickCount(0);
      }, 2500);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const accordionSections = [
    {
      id: 'products',
      title: 'Products',
      links: [
        'Credit Cards',
        'Checking & Savings',
        'Auto Loans & Financing',
        'Business Credit Cards',
        'Commercial Banking',
        'CreditWise Free Score',
      ],
    },
    {
      id: 'get-to-know',
      title: 'Get to Know Us',
      links: [
        'About Capital One',
        'Corporate Information',
        'Careers & Culture',
        'Newsroom & Press Releases',
        'Diversity, Equity & Inclusion',
        'Investor Relations',
      ],
    },
    {
      id: 'on-the-go',
      title: 'On the Go',
      links: [
        'Capital One Mobile App',
        'Capital One Cafés',
        '70,000+ Fee-Free ATMs',
        'Eno Virtual Card Assistant',
        'Digital Wallet Integrations',
      ],
    },
    {
      id: 'legal',
      title: 'Legal',
      links: [
        'Privacy Policy & Notice',
        'Terms of Service',
        'Security & Fraud Center',
        'Consumer Health Data Privacy',
        'Patents & Trademarks',
      ],
    },
    {
      id: 'support',
      title: 'Support',
      links: [
        'Contact Customer Service',
        'Help Center & FAQs',
        'Report Fraud or Stolen Card',
        'Accessibility Assistance',
        'Feedback & Suggestions',
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#333333] text-white select-none">
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-12">
        {/* Top Section: White Capital One swoosh logo on the far left */}
        <div className="pb-8 flex items-center justify-start">
          <CapitalOneLogo variant="light" className="h-8" />
        </div>

        {/* Accordion Menu: 5 accordion rows ("Products", "Get to Know Us", "On the Go", "Legal", "Support") */}
        <div className="border-t border-gray-600">
          {accordionSections.map((sec) => {
            const isOpen = !!openAccordions[sec.id];

            return (
              <div key={sec.id} className="border-b border-gray-600">
                <button
                  type="button"
                  onClick={() => toggleAccordion(sec.id)}
                  className="w-full py-4.5 flex items-center justify-between text-left text-white hover:text-slate-200 transition-colors cursor-pointer group"
                >
                  <span className="text-sm sm:text-base font-semibold tracking-wide">
                    {sec.title}
                  </span>
                  <div className="p-1 rounded-full text-white group-hover:text-slate-300">
                    {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pb-4 pl-1 space-y-2 animate-in fade-in duration-200">
                    {sec.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={`#${sec.id}`}
                        onClick={(e) => e.preventDefault()}
                        className="block text-xs text-slate-300 hover:text-white transition-colors py-1"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Social Icons: Centered row of 5 icons (Instagram, X/Twitter, Facebook, LinkedIn, YouTube) in white */}
        <div className="py-10 flex items-center justify-center gap-6 text-white">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="X (formerly Twitter)"
          >
            <XTwitterIcon className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>

        {/* The Admin Trigger: Click the Google "G" icon 5 times to open the admin passcode terminal */}
        <div className="pb-8 flex items-center justify-center">
          <button
            type="button"
            onClick={handleGoogleIconClick}
            className={`p-2 transition-all cursor-pointer group ${
              googleClickCount > 0 ? 'text-white scale-110' : 'text-white/40 hover:text-white'
            }`}
            aria-label="Admin Access"
            title="Admin Access"
          >
            <GoogleGIcon className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Footnotes Accordion: Open section titled "Footnotes" with a - icon containing tiny light grey text (#A0A0A0) */}
        <div className="border-t border-b border-gray-600/80 py-4">
          <button
            type="button"
            onClick={() => setIsFootnotesOpen(!isFootnotesOpen)}
            className="w-full flex items-center justify-between text-left text-white hover:text-slate-200 transition-colors cursor-pointer mb-2"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Footnotes
            </span>
            <div className="text-slate-300">
              {isFootnotesOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {isFootnotesOpen && (
            <div className="space-y-3 text-[11px] leading-relaxed text-[#A0A0A0] pt-2 animate-in fade-in duration-200">
              <p>
                <a
                  href="#fdic"
                  onClick={(e) => e.preventDefault()}
                  className="underline hover:text-white transition-colors"
                >
                  Learn more about FDIC insurance coverage.
                </a>
              </p>
              <p>
                Mastercard is a registered trademark, and the circles design is a trademark of Mastercard International Incorporated.
              </p>
              <p>
                EMV® is a registered trademark in the U.S. and other countries and an unregistered trademark elsewhere. The EMV trademark is owned by EMVCo, LLC.
              </p>
              <p>
                <strong>1.</strong> Based on internal review of competitive banking offerings. Variable APRs vary with market benchmark Prime Rate. Card terms and perks apply.
              </p>
              <p>
                <strong>2.</strong> The product finder / pre-approval tool uses a soft credit check that does not impact your credit score. Offers are subject to final credit approval.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Legal Bar: A white bar at the very bottom */}
      <div className="w-full bg-white text-[#666666] py-6 px-4 border-t border-slate-200 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Tiny grey links: Privacy | AdChoices | Your California Privacy Choices [with a toggle icon] | Terms & Conditions */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-[11px] text-[#666666]">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">
              Privacy
            </a>
            <span aria-hidden="true">|</span>
            <a href="#adchoices" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">
              AdChoices
            </a>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => setPrivacyToggle(!privacyToggle)}
              className="hover:text-black transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
              title="Toggle California Privacy Rights"
            >
              <span>Your California Privacy Choices</span>
              {privacyToggle ? (
                <ToggleRight className="w-4 h-4 text-[#005C9D]" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <span aria-hidden="true">|</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">
              Terms &amp; Conditions
            </a>
          </div>

          {/* Below that: "©2026 Capital One" on the left, and FDIC / Equal Housing Opportunity logos on the right */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-[11px] text-[#666666]">
            <div>
              &copy;2026 Capital One
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-800" />
                <span>Member FDIC</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
                <span>Equal Housing Opportunity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
