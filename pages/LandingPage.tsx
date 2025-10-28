

import React from 'react';

import LandingHeader from '../components/layout/LandingHeader';
import LandingFooter from '../components/layout/LandingFooter';
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import PlatformPreview from '../components/landing/PlatformPreview';
import WhyDeepThink from '../components/landing/WhyDeepThink';
import Features from '../components/landing/Features';
import { GridFeaturesSection } from '../components/landing/GridFeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import DemoSection from '../components/landing/DemoSection';
import UseCases from '../components/landing/UseCases';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import BackToTopButton from '../components/landing/BackToTopButton';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text">
      <LandingHeader />
      <main>
        <Hero />
        <TrustedBy />
        <PlatformPreview />
        <WhyDeepThink />
        <Features />
        <GridFeaturesSection />
        <HowItWorks />
        <div id="demo">
            <DemoSection />
        </div>
        <UseCases />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <LandingFooter />
      <BackToTopButton />
    </div>
  );
};

export default LandingPage;