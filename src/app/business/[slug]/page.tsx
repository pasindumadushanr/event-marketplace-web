'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Building2, Frown } from 'lucide-react';
import api from '@/lib/api';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

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

export default function BusinessProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  
  const [business, setBusiness] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/discovery/vendors/${resolvedParams.slug}`);
        setBusiness(mapBusinessData(res.data));
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        setError('Business not found or is currently unavailable.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="bg-slate-900"><Navbar /></div>
        <div className="h-20 bg-slate-900" />
        <main className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-4 bg-slate-200 w-1/3 rounded mb-8"></div>
          <div className="h-96 bg-slate-200 rounded-3xl mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="h-32 bg-slate-200 rounded-3xl"></div>
              <div className="h-64 bg-slate-200 rounded-3xl"></div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="h-80 bg-slate-200 rounded-3xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <div className="bg-slate-900"><Navbar /></div>
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Frown className="h-24 w-24 text-slate-300 mb-6" />
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Business Not Found</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            We couldn't find the vendor profile you were looking for. It may have been removed or the URL is incorrect.
          </p>
          <Link href="/">
            <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
              Return to Homepage
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      
      <div className="h-20 bg-slate-900" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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

        <BusinessHero business={business} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          <div className="lg:col-span-8 space-y-8">
            <BusinessTrust verification={business.verification} />
            <BusinessAbout business={business} />
            <BusinessFeatures featureGroups={business.featureGroups} />
            <BusinessGallery gallery={business.gallery} />
            <BusinessPackages packages={business.packages} businessName={business.name} />
            <BusinessReviews reviews={business.reviews} rating={business.rating} reviewCount={business.reviewCount} />
            <BusinessFAQ faq={business.faq} />
            <BusinessPolicies policies={business.policies} />
          </div>

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

        <SimilarBusinesses currentCategoryId={business.categoryId} />
        
      </main>
      
      <Footer />
    </div>
  );
}

// Helper to map backend data to frontend component expected props
function mapBusinessData(data: any) {
  return {
    id: data.id,
    slug: data.profileSettings?.seo?.slug || data.id,
    name: data.name,
    logo: data.logo,
    coverImage: data.coverImage,
    categoryId: data.categoryId,
    categoryName: data.category?.name || 'Vendor',
    isVerified: data.isVerified,
    rating: data.rating,
    reviewCount: data.reviewCount,
    startingPrice: data.startingPrice,
    yearsOfExperience: data.profileSettings?.yearsOfExperience || 1,
    responseTime: 'Within 24 hours',
    memberSince: new Date(data.createdAt).getFullYear().toString(),
    
    description: data.description,
    highlights: data.profileSettings?.highlights || [],
    languages: data.profileSettings?.languages || ['English'],
    
    verification: {
      isBusinessVerified: data.isVerified,
      isEmailVerified: true,
      isPhoneVerified: !!data.phone,
      isIdentityVerified: false,
      isRegistrationVerified: data.isVerified,
    },
    
    featureGroups: data.profileSettings?.features || [],
    
    gallery: data.galleries?.map((g: any) => ({
      id: g.id,
      url: g.url,
      type: g.type
    })) || [],
    
    packages: data.packages?.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      description: p.description,
      features: p.features || [],
      duration: p.duration
    })) || [],
    
    bookingMethod: data.profileSettings?.bookingMethod || 'DIRECT_BOOKING',
    
    businessHours: data.profileSettings?.businessHours || {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    
    location: {
      address: data.address,
      city: data.city,
      district: data.district,
      mapEmbedUrl: data.profileSettings?.location?.mapEmbedUrl
    },
    
    contact: {
      phone: data.phone,
      email: data.email,
      website: data.website,
      facebook: data.facebook,
      instagram: data.instagram,
      whatsapp: data.profileSettings?.contact?.whatsapp
    },
    
    faq: data.profileSettings?.faq || [],
    
    policies: data.profileSettings?.policies || {
      booking: 'Contact vendor for booking policies.',
      cancellation: 'Contact vendor for cancellation policies.',
      payment: 'Contact vendor for payment terms.'
    },
    
    reviews: data.reviews?.map((r: any) => ({
      id: r.id,
      customerName: r.customer ? `${r.customer.firstName} ${r.customer.lastName}` : 'Customer',
      rating: r.rating,
      date: new Date(r.createdAt).toLocaleDateString(),
      comment: r.comment,
      vendorReply: r.reply
    })) || []
  };
}
