import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onShopCards: () => void;
  onPreApproval: () => void;
}

interface Slide {
  image: string;
  alt: string;
  eyebrow: string;
}

const SLIDES: Slide[] = [
  {
    image: '/assets/images/autumn_mountains_hero_1794203768706.jpg',
    alt: 'Rolling mountains with vibrant autumn foliage',
    eyebrow: 'Reward yourself this fall',
  },
  {
    image: '/assets/images/cards_floating_banner_1794213932237.jpg',
    alt: 'Credit cards floating on a bright background',
    eyebrow: 'Everyday rewards in your pocket',
  },
  {
    image: '/assets/images/business_retail_women_1794216493886.jpg',
    alt: 'Business owners collaborating in a modern boutique',
    eyebrow: 'Banking built for your business',
  },
  {
    image: '/assets/images/auto_navigator_car_1794203770230.jpg',
    alt: 'Modern SUV on a scenic mountain overlook',
    eyebrow: 'Shop cars, then get the financing',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopCards, onPreApproval }) => {
  const [index, setIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  const active = SLIDES[index];

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-slate-50">
      {/* Sliding background imagery (like capitalone.com) */}
      <div className="relative w-full h-[40vh] min-h-[300px] max-h-[520px] overflow-hidden bg-amber-900/20">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={i !== index}
          >
            {!imageErrors[i] ? (
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center select-none"
                referrerPolicy="no-referrer"
                onError={() => setImageErrors((prev) => ({ ...prev, [i]: true }))}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-700 via-orange-600 to-indigo-950 flex items-center justify-center">
                <span className="text-xl font-bold tracking-tight text-white/90">Capital One Rewards</span>
              </div>
            )}
          </div>
        ))}

        {/* Glass sheen + depth scrim over the photograph */}
        <div className="img-glass" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/15 pointer-events-none" />

        {/* Prev / Next controls */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass-pill items-center justify-center text-slate-800 hover:bg-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass-pill items-center justify-center text-slate-800 hover:bg-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Slide dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Overlay Card: below the image, overlapping the bottom edge */}
      <div className="relative max-w-xl mx-auto px-4 -mt-16 sm:-mt-20 mb-8 z-10">
        <div className="bg-white rounded-[8px] p-6 sm:p-8 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center transition-transform hover:shadow-[0_12px_36px_rgb(0,0,0,0.12)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#005C9D] mb-2">
            {active.eyebrow}
          </p>
          <h1 className="text-[28px] sm:text-[32px] font-normal text-[#1A1A1A] leading-tight tracking-tight">
            Reward yourself this fall
          </h1>

          <p className="text-base text-[#666666] mt-3 mb-6 max-w-md mx-auto leading-relaxed">
            Check out Capital One cards with everyday rewards, low intro APR &amp; more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onShopCards}
              className="w-full sm:w-auto bg-[#005C9D] hover:bg-[#00487D] text-white rounded-md px-6 py-3 font-medium text-base transition-colors shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Shop all cards</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onPreApproval}
              className="w-full sm:w-auto text-[#005C9D] hover:text-[#00487D] hover:bg-sky-50/60 rounded-md px-4 py-3 font-medium text-sm transition-colors border border-transparent hover:border-sky-200 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>See if you're pre-approved</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
