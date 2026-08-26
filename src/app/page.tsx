import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import StatsStrip from '@/app/components/StatsStrip';
import CategorySection from '@/app/components/CategorySection';
import FeaturedCourses from '@/app/components/FeaturedCourses';
import LiveClassesStrip from '@/app/components/LiveClassesStrip';
import TopEducators from '@/app/components/TopEducators';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import PricingSection from '@/app/components/PricingSection';
import FaqSection from '@/app/components/FaqSection';
import CtaBanner from '@/app/components/CtaBanner';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsStrip />
      <CategorySection />
      <FeaturedCourses />
      <LiveClassesStrip />
      <TopEducators />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaBanner />
      <Footer />
    </main>
  );
}
