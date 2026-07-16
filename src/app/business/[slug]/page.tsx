'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { mockBusinessProfiles } from '@/data/mock/business-profiles';

import { BusinessHero } from '@/components/business/BusinessHero';
import { BusinessTrust } from '@/components/business/BusinessTrust';
import { BusinessAbout } from '@/components/business/BusinessAbout';
import { BusinessFeatures } from '@/components/business/BusinessFeatures';
import { BusinessGallery } from '@/components/business/BusinessGallery';
import { BusinessPackages } from '@/components/business/BusinessPackages';
import { BusinessReviews } from '@/components/business/BusinessReviews';
import { BusinessFAQ } from '@/components/business/BusinessFAQ';
import { BusinessPolicies } from '@/components/business/BusinessPolicies';
import { BusinessCTA } from '@/components/business/BusinessCTA';
import { BusinessAvailability } from '@/components/business/BusinessAvailability';
import { BusinessHours } from '@/components/business/BusinessHours';
import { BusinessContact } from '@/components/business/BusinessContact';
import { BusinessLocation } from '@/components/business/BusinessLocation';
import { SimilarBusinesses } from '@/components/business/SimilarBusinesses';
import { BlockRenderer } from '@/components/business/BlockRenderer';

export default function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const business = mockBusinessProfiles[resolvedParams.slug];
  
  // Future: Fetch PUBLISHED blocks from public API using business.id
  const blocks: any[] = [];

  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      
      {/* Spacer for sticky navbar */}
      <div className="h-20 bg-slate-900" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-8">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" /> Home
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <Link href="/vendors" className="hover:text-primary transition-colors">
            Vendors
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <Link href={`/category/${business.categoryId}`} className="hover:text-primary transition-colors">
            {business.categoryName}
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-slate-900">{business.name}</span>
        </nav>

        {/* Top Level Hero */}
        <BusinessHero business={business} />

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column (70%) */}
          <div className="lg:col-span-8 space-y-8">
            <BusinessTrust verification={business.verification} />
            
            {blocks.filter(b => b.position === 'BEFORE_ABOUT').map(b => (
              <BlockRenderer key={b.id} block={b} />
            ))}
            
            <BusinessAbout business={business} />
            
            {blocks.filter(b => b.position === 'AFTER_ABOUT').map(b => (
              <BlockRenderer key={b.id} block={b} />
            ))}
            
            <BusinessFeatures featureGroups={business.featureGroups} />
            
            {blocks.filter(b => b.position === 'BEFORE_GALLERY').map(b => (
              <BlockRenderer key={b.id} block={b} />
            ))}
            
            <BusinessGallery gallery={business.gallery} />
            <BusinessPackages packages={business.packages} businessName={business.name} />
            
            {blocks.filter(b => b.position === 'AFTER_PACKAGES').map(b => (
              <BlockRenderer key={b.id} block={b} />
            ))}
            
            <BusinessReviews reviews={business.reviews} rating={business.rating} reviewCount={business.reviewCount} />
            <BusinessFAQ faq={business.faq} />
            <BusinessPolicies policies={business.policies} />
            
            {blocks.filter(b => b.position === 'AT_BOTTOM').map(b => (
              <BlockRenderer key={b.id} block={b} />
            ))}
          </div>

          {/* Sticky Sidebar Column (30%) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <BusinessCTA bookingMethod={business.bookingMethod} startingPrice={business.startingPrice} />
              <BusinessAvailability />
              <BusinessHours hours={business.businessHours} />
              <BusinessContact contact={business.contact} />
              <BusinessLocation location={business.location} />
            </div>
          </div>

        </div>

        {/* Full width bottom section */}
        <SimilarBusinesses currentCategoryId={business.categoryId} />
        
      </main>
      
      <Footer />
    </div>
  );
}
