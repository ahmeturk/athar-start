import { useState, useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import MarqueeBanner from '../components/layout/MarqueeBanner';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import StatsSection from '../components/landing/StatsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/layout/Footer';
import LoginModal from '../components/auth/LoginModal';
import SignupModal from '../components/auth/SignupModal';

export default function LandingPage() {
  const [modal, setModal] = useState(null); // 'login' | 'signup' | null

  const handleScrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <MarqueeBanner />
      <Navbar
        onLogin={() => setModal('login')}
        onSignup={() => setModal('signup')}
        onScrollTo={handleScrollTo}
      />

      <HeroSection
        onSignup={() => setModal('signup')}
        onScrollTo={handleScrollTo}
      />
      <ProblemSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection onSignup={() => setModal('signup')} />
      <FAQSection />
      <CTASection onSignup={() => setModal('signup')} />
      <Footer onScrollTo={handleScrollTo} />

      {/* Auth Modals */}
      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToSignup={() => setModal('signup')}
        />
      )}
      {modal === 'signup' && (
        <SignupModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
    </div>
  );
}
