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
  title: 'Nakathata.lk | Wedding Venues & Event Services in Sri Lanka',
  description: 'Discover and book the finest venues, photographers, and event professionals for weddings and corporate galas.',
  alternates: { canonical: 'https://nakathata.lk/' },
};

const brandStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://nakathata.lk/#organization',
      name: 'Nakathata.lk',
      url: 'https://nakathata.lk/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nakathata.lk/images/brand/nakathata-logo.jpg',
        width: 2048,
        height: 2048,
      },
      sameAs: [
        'https://web.facebook.com/profile.php?id=61595001868271',
        'https://www.instagram.com/nakathata.lk/',
        'https://www.tiktok.com/@nakathata.lk',
        'https://www.youtube.com/channel/UCYSC4gU8KyQuhFn7p3RUjMw',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://nakathata.lk/#website',
      name: 'Nakathata.lk',
      alternateName: 'Nakathata',
      url: 'https://nakathata.lk/',
      publisher: { '@id': 'https://nakathata.lk/#organization' },
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandStructuredData).replace(/</g, '\\u003c') }}
      />
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
