import React, { useState } from 'react';
import { X, Search, ChevronRight, CreditCard, Landmark, Car, Briefcase, ShieldCheck, MapPin, HelpCircle, User, LogIn } from 'lucide-react';
import { CapitalOneLogo } from './CapitalOneLogo';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface SlideNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const SlideNavDrawer: React.FC<SlideNavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSignIn,
  onNavigateSection,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('cards');
  const [searchQuery, setSearchQuery] = useState('');

  useEscapeKey(() => onClose(), isOpen);

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const navCategories = [
    {
      id: 'cards',
      title: 'Credit Cards',
      icon: CreditCard,
      items: [
        { label: 'Shop All Cards', action: () => onNavigateSection('cards') },
        { label: 'Travel Cards & Venture X', action: () => onNavigateSection('cards') },
        { label: 'Cash Back Cards & Savor', action: () => onNavigateSection('cards') },
        { label: 'See If You’re Pre-Approved', action: () => onNavigateSection('cards') },
      ],
    },
    {
      id: 'banking',
      title: 'Checking & Savings',
      icon: Landmark,
      items: [
        { label: '360 Checking (Fee-free)', action: () => onNavigateSection('banking') },
        { label: '360 Performance Savings (4.25% APY)', action: () => onNavigateSection('banking') },
        { label: 'Interest Growth Calculator', action: () => onNavigateSection('banking') },
        { label: 'Find a Free ATM (70,000+)', action: () => onNavigateSection('banking') },
      ],
    },
    {
      id: 'auto',
      title: 'Auto Loans',
      icon: Car,
      items: [
        { label: 'Capital One Auto Navigator', action: () => onNavigateSection('auto') },
        { label: 'Shop 4 Million+ Cars', action: () => onNavigateSection('auto') },
        { label: 'Pre-Qualify for Financing', action: () => onNavigateSection('auto') },
        { label: 'Auto Loan Payment Calculator', action: () => onNavigateSection('auto') },
      ],
    },
    {
      id: 'creditwise',
      title: 'CreditWise®',
      icon: ShieldCheck,
      items: [
        { label: 'Free Credit Monitoring', action: () => onNavigateSection('creditwise') },
        { label: 'Interactive Score Simulator', action: () => onNavigateSection('creditwise') },
        { label: 'Dark Web & SSN Alerts', action: () => onNavigateSection('creditwise') },
      ],
    },
    {
      id: 'business',
      title: 'Business & Commercial',
      icon: Briefcase,
      items: [
        { label: 'Spark Business Cards', action: () => onNavigateSection('cards') },
        { label: 'Business Checking & Savings', action: () => onNavigateSection('banking') },
        { label: 'Commercial Lending Solutions', action: () => onNavigateSection('banking') },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Container (Slides from Left) */}
      <div className="fixed inset-y-0 left-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <CapitalOneLogo className="h-7" />
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:text-black rounded-lg hover:bg-slate-200/60"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sign In Bar in Drawer */}
        <div className="p-4 bg-sky-50/80 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#005C9D] text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                Capital One Account
              </span>
              <span className="text-[11px] text-slate-600">Access your cards &amp; savings</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSignIn();
            }}
            className="px-3.5 py-1.5 bg-[#005C9D] text-white text-xs font-bold rounded-md hover:bg-[#00487D] transition-colors"
          >
            Sign In
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, FAQs, routing numbers..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Navigation Accordion List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 divide-y divide-slate-100">
          {navCategories.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expandedSection === cat.id;

            return (
              <div key={cat.id} className="pt-2 first:pt-0">
                <button
                  type="button"
                  onClick={() => toggleSection(cat.id)}
                  className="w-full min-h-[44px] flex items-center justify-between text-left py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#005C9D]" />
                    <span className="text-sm font-bold text-slate-900">{cat.title}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="pl-10 pr-2 py-1.5 space-y-1">
                    {cat.items.map((subItem, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          subItem.action();
                          onClose();
                        }}
                        className="w-full min-h-[38px] text-left text-xs font-medium text-slate-600 hover:text-[#005C9D] py-1.5 px-2 rounded hover:bg-sky-50 transition-colors block"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Bottom Support Shortcuts */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 hover:text-[#005C9D] cursor-pointer">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Locations &amp; Cafés</span>
            </span>
            <span className="flex items-center gap-2 hover:text-[#005C9D] cursor-pointer">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Customer Help</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 text-center pt-2">
            Member FDIC · Equal Housing Lender
          </div>
        </div>
      </div>
    </div>
  );
};
