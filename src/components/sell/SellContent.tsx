'use client';

import { SellHero } from '@/components/sell/SellHero';
import { SellTestimonials } from '@/components/sell/SellTestimonials';
import { SellPricing } from '@/components/sell/SellPricing';
import { AboutWhyChooseUs } from '@/components/about/AboutWhyChooseUs';
import { AboutHowItWorks } from '@/components/about/AboutHowItWorks';
import { AboutStatistics } from '@/components/about/AboutStatistics';
import { AboutCTA } from '@/components/about/AboutCTA';
import { sellData } from '@/data/sell';

export function SellContent() {
  return (
    <main className="flex-1">
      <SellHero data={sellData.hero} />
      
      <div id="benefits" className="pt-12">
        <AboutWhyChooseUs data={sellData.benefits} />
      </div>
      
      <AboutHowItWorks data={sellData.howItWorks} />
      
      <SellTestimonials data={sellData.testimonials} />
      
      <AboutStatistics data={sellData.statistics} />
      
      <SellPricing data={sellData.pricing} />
      
      <AboutCTA data={sellData.cta} />
    </main>
  );
}
