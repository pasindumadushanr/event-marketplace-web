import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { Statistics } from '@/components/home/Statistics';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CategoryCarousel } from '@/components/home/CategoryCarousel';
import { FeaturedVendors } from '@/components/home/FeaturedVendors';
import { FeaturedPackages } from '@/components/home/FeaturedPackages';
import { LocationGrid } from '@/components/home/LocationGrid';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel';
import { VendorCTA } from '@/components/home/VendorCTA';
import { Footer } from '@/components/home/Footer';

export const metadata = {
  title: 'LuxeEvents - The Premium Event Marketplace',
  description: 'Discover and book the finest venues, photographers, and event professionals for weddings and corporate galas.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main>
        <Hero />
        <Statistics />
        <CategoryCarousel />
        <FeaturedVendors />
        <WhyChooseUs />
        <FeaturedPackages />
        <LocationGrid />
        <HowItWorks />
        <TestimonialCarousel />
        <VendorCTA />
      </main>
      <Footer />
    </div>
  );
}
