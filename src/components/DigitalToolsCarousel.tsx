import React, { useState } from 'react';
import {
  ChevronDown,
  Home,
  Gift,
  ArrowLeftRight,
  HelpCircle,
  User,
  CreditCard,
  Landmark,
  ShieldCheck,
  Bell,
  Sparkles,
  Smartphone,
  Lock,
} from 'lucide-react';
import { CapitalOneLogo } from './CapitalOneLogo';

interface DigitalToolsCarouselProps {
  onExploreMoreTools: () => void;
  onOpenSignIn: () => void;
}

export const DigitalToolsCarousel: React.FC<DigitalToolsCarouselProps> = ({
  onExploreMoreTools,
  onOpenSignIn,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);
  const [currentTopicTitle, setCurrentTopicTitle] = useState('Meet Capital One');

  const slides = [
    {
      id: 0,
      title: 'Anytime account access',
      description: 'Monitor your accounts on the go with our top-rated Capital One Mobile app.',
      screenCard: 'venture',
    },
    {
      id: 1,
      title: 'Eno, your 24/7 security assistant',
      description: 'Get real-time purchase alerts, virtual card numbers for safe checkout, and fraud monitoring.',
      screenCard: 'security',
    },
    {
      id: 2,
      title: 'CreditWise at your fingertips',
      description: 'Check your TransUnion credit score weekly and simulate financial moves with zero score damage.',
      screenCard: 'creditwise',
    },
    {
      id: 3,
      title: 'Auto Navigator on mobile',
      description: 'Browse over 4 million vehicles and see exact monthly financing terms right from your pocket.',
      screenCard: 'auto',
    },
  ];

  const currentSlide = slides[activeSlide];

  return (
    <section id="digital-tools" className="w-full bg-slate-50 border-b border-slate-200/80 pb-14">
      {/* Sticky Sub-Header: Light grey sticky sub-header. Tiny text "TOPIC" above "Meet Capital One" with downward chevron */}
      <div className="sticky top-16 z-30 bg-[#F4F6F8]/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 transition-all">
        <div className="max-w-md mx-auto relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block leading-none mb-0.5">
                TOPIC
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {currentTopicTitle}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsTopicMenuOpen(!isTopicMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-200/60 cursor-pointer"
              aria-label="Expand Topic Menu"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isTopicMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Interactive Topic Dropdown */}
          {isTopicMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
              {[
                { label: 'Meet Capital One', target: 'hero' },
                { label: 'Financial wellness', target: 'banking' },
                { label: 'Built-in benefits', target: 'cards' },
                { label: 'Digital tools built for ease', target: 'digital-tools' },
              ].map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => {
                    setCurrentTopicTitle(topic.label);
                    setIsTopicMenuOpen(false);
                    const el = document.getElementById(topic.target);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-sky-50 transition-colors cursor-pointer ${
                    currentTopicTitle === topic.label ? 'text-[#005C9D] bg-sky-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>{topic.label}</span>
                  {currentTopicTitle === topic.label && <span className="w-2 h-2 rounded-full bg-[#005C9D]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-8 text-center">
        {/* Main Content: Centered text "DIGITAL TOOLS BUILT FOR EASE" (uppercase, bold) */}
        <h2 className="text-[13px] sm:text-sm font-bold text-[#666666] uppercase tracking-[0.2em] mb-8">
          DIGITAL TOOLS BUILT FOR EASE
        </h2>

        {/* Realistic CSS-based iPhone Mockup (silver border, notch, screen) */}
        <div className="relative mx-auto w-[285px] sm:w-[310px] rounded-[44px] p-2.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-300/80">
          {/* Outer phone rim & screen frame */}
          <div className="relative w-full rounded-[36px] bg-[#071B2F] overflow-hidden border-[2px] border-slate-800 shadow-inner">
            {/* Top Speaker & Camera Notch */}
            <div className="relative w-full pt-2 pb-1 bg-[#071B2F] flex justify-center items-center z-20">
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
              </div>
            </div>

            {/* Screen Content: Capital One Mobile App Dashboard Replica */}
            <div className="w-full bg-gradient-to-b from-[#09223D] to-[#041224] text-white p-3.5 pt-1 text-left flex flex-col justify-between min-h-[460px] select-none">
              {/* App Status & Greeting Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-300 tracking-wider">
                      CAPITAL ONE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Bell className="w-3.5 h-3.5 text-slate-300" />
                      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#DA291C]" />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[10px] font-bold text-slate-200">
                      JS
                    </div>
                  </div>
                </div>

                {/* Account Cards Inside Phone Dashboard */}
                <div className="mt-3 space-y-2.5">
                  {/* Account Card 1: "VENTURE" card showing $1,293.92 */}
                  <div className="bg-gradient-to-r from-[#0C335C] to-[#124276] p-3 rounded-xl border border-white/15 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-sky-300" />
                        <span className="text-[11px] font-extrabold tracking-wider uppercase text-white">
                          VENTURE
                        </span>
                        <span className="text-[9px] text-slate-300 font-mono">...4819</span>
                      </div>
                      <span className="text-[9px] bg-sky-400/20 text-sky-200 px-1.5 py-0.5 rounded font-mono">
                        74,210 Miles
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-[9px] text-slate-300 block uppercase font-medium">
                          Current Balance
                        </span>
                        <span className="text-lg font-bold font-mono tracking-tight text-white tabular-nums">
                          $1,293.92
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenSignIn}
                        className="px-2.5 py-1 bg-[#005C9D] hover:bg-[#00487D] text-white text-[10px] font-bold rounded shadow-xs cursor-pointer"
                      >
                        Pay Bill
                      </button>
                    </div>
                  </div>

                  {/* Account Card 2: "360 Checking" showing $4,090.14 */}
                  <div className="bg-gradient-to-r from-[#0B2A4A] to-[#0E355D] p-3 rounded-xl border border-white/15 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold tracking-wide text-white">
                          360 Checking
                        </span>
                        <span className="text-[9px] text-slate-300 font-mono">...8201</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-semibold">
                        Available
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-[9px] text-slate-300 block uppercase font-medium">
                          Available Balance
                        </span>
                        <span className="text-lg font-bold font-mono tracking-tight text-white tabular-nums">
                          $4,090.14
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onOpenSignIn}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-semibold rounded border border-white/20 cursor-pointer"
                      >
                        Activity
                      </button>
                    </div>
                  </div>

                  {/* Quick Action Ribbon inside phone */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveSlide(0)}
                      className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        activeSlide === 0 ? 'bg-sky-500/20 border-sky-400/40' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <ArrowLeftRight className="w-3 h-3 mx-auto text-sky-300 mb-0.5" />
                      <span className="text-[9px] font-medium text-slate-300 block">Transfer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide(1)}
                      className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        activeSlide === 1 ? 'bg-emerald-500/20 border-emerald-400/40' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 mx-auto text-emerald-400 mb-0.5" />
                      <span className="text-[9px] font-medium text-slate-300 block">Eno Lock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide(2)}
                      className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        activeSlide === 2 ? 'bg-amber-500/20 border-amber-400/40' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <Smartphone className="w-3 h-3 mx-auto text-amber-300 mb-0.5" />
                      <span className="text-[9px] font-medium text-slate-300 block">Deposit</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom App Navigation Bar Replica inside phone: Home, Benefits, Pay/Move, Help, Profile */}
              <div className="mt-4 pt-2 border-t border-white/10 grid grid-cols-5 text-center text-slate-400">
                <div className="flex flex-col items-center text-[#005C9D]">
                  <Home className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="text-[8px] font-bold mt-0.5 text-white">Home</span>
                </div>
                <div className="flex flex-col items-center hover:text-white">
                  <Gift className="w-3.5 h-3.5" />
                  <span className="text-[8px] mt-0.5">Benefits</span>
                </div>
                <div className="flex flex-col items-center hover:text-white">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span className="text-[8px] mt-0.5">Pay/Move</span>
                </div>
                <div className="flex flex-col items-center hover:text-white">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span className="text-[8px] mt-0.5">Help</span>
                </div>
                <div className="flex flex-col items-center hover:text-white">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-[8px] mt-0.5">Profile</span>
                </div>
              </div>

              {/* Home indicator bar inside phone */}
              <div className="w-20 h-1 bg-white/30 rounded-full mx-auto mt-2" />
            </div>
          </div>
        </div>

        {/* Carousel Text: Below the phone */}
        <div className="mt-6 mb-4">
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-1.5">
            {currentSlide.title}
          </h3>
          <p className="text-sm text-[#666666] max-w-sm mx-auto leading-relaxed">
            {currentSlide.description}
          </p>
        </div>

        {/* Carousel Controls: A row of 4 dots (one black, three grey) */}
        <div className="flex items-center justify-center gap-2.5 mb-6" role="tablist">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`transition-all cursor-pointer rounded-full ${
                activeSlide === index
                  ? 'w-6 h-2.5 bg-black'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={activeSlide === index}
            />
          ))}
        </div>

        {/* Link: "Explore more digital tools >" (Blue, centered) */}
        <div>
          <button
            type="button"
            onClick={onExploreMoreTools}
            className="text-[#005C9D] hover:text-[#00487D] font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-1 cursor-pointer p-0 group"
          >
            <span>Explore more digital tools &gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
};
