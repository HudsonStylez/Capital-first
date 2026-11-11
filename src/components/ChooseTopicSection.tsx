import React, { useState } from 'react';
import { HeartHandshake, FileHeart, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ChooseTopicSectionProps {
  onSelectTopic?: (topicId: string) => void;
}

export const ChooseTopicSection: React.FC<ChooseTopicSectionProps> = ({ onSelectTopic }) => {
  const [activeTopic, setActiveTopic] = useState<'meet' | 'wellness' | 'benefits'>('meet');
  const [topicModalContent, setTopicModalContent] = useState<{ title: string; desc: string; highlights: string[] } | null>(null);

  const topics = [
    {
      id: 'meet' as const,
      label: 'Meet Capital One',
      icon: HeartHandshake,
      title: 'Banking Designed Around You',
      desc: 'At Capital One, we’re changing banking for good. We combine ingenuity, simplicity, and human touch to help our customers thrive.',
      highlights: [
        'Over 100 million satisfied customer accounts nationwide',
        'Transparent fees with zero hidden account maintenance surprises',
        'Award-winning customer care available 24/7 online and via phone',
      ],
    },
    {
      id: 'wellness' as const,
      label: 'Financial wellness',
      icon: FileHeart,
      title: 'Tools to Strengthen Your Financial Health',
      desc: 'Take control of your money with free credit monitoring, budgeting tools, and personalized insights from CreditWise and Eno.',
      highlights: [
        'Free weekly TransUnion VantageScore® credit score tracking',
        'Intelligent Eno® virtual numbers to safeguard online payments',
        'Actionable simulator to plan debt payoff and score improvements',
      ],
    },
    {
      id: 'benefits' as const,
      label: 'Built-in benefits',
      icon: Sparkles,
      title: 'Everyday Perks & Premium Experiences',
      desc: 'Get more from your cards with complimentary airport lounge access, dining rewards, shopping discounts, and travel insurance.',
      highlights: [
        'Capital One Lounges & Partner Network access worldwide',
        'Up to 10X rewards on hotels and rental cars with Capital One Travel',
        'Automatic Capital One Shopping coupons applied at checkout',
      ],
    },
  ];

  const handleTopicClick = (topic: typeof topics[0]) => {
    setActiveTopic(topic.id);
    onSelectTopic?.(topic.id);
  };

  return (
    <section className="w-full py-10 px-4 bg-white border-b border-slate-100">
      <div className="max-w-md mx-auto text-center">
        {/* Header: Centered text "CHOOSE A TOPIC" (uppercase, bold, approx 14px, letter-spacing) */}
        <h2 className="text-[14px] font-bold text-[#666666] uppercase tracking-[0.2em] mb-6">
          CHOOSE A TOPIC
        </h2>

        {/* Button Stack: Vertical stack of three interactive buttons with gap-4 */}
        <div className="flex flex-col gap-4">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isSelected = activeTopic === topic.id;

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleTopicClick(topic)}
                className={`w-full min-h-[52px] px-6 py-3.5 rounded-full flex items-center justify-center gap-3 font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer active:scale-98 select-none ${
                  isSelected
                    ? 'bg-[#005C9D] text-white shadow-md shadow-[#005C9D]/20 hover:bg-[#00487D]'
                    : 'bg-white text-[#1A1A1A] border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isSelected ? 'text-white stroke-[2.2]' : 'text-[#1A1A1A] stroke-[1.8]'
                  }`}
                />
                <span className="tracking-tight">{topic.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Context Card below buttons reflecting selected topic */}
        {activeTopic && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left animate-in fade-in duration-300">
            {(() => {
              const current = topics.find((t) => t.id === activeTopic)!;
              return (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>{current.title}</span>
                    <span className="text-[10px] text-[#005C9D] font-bold uppercase tracking-wider bg-sky-100/80 px-2 py-0.5 rounded">
                      Active Topic
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {current.desc}
                  </p>
                  <ul className="space-y-1.5">
                    {current.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
};
