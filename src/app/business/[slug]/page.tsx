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
            <BusinessPackages packages={business.packages} businessName={business.name} blockedDates={business.blockedDates} />
            <BusinessReviews businessId={business.id} reviews={business.reviews} rating={business.rating} reviewCount={business.reviewCount} />
            <BusinessFAQ faq={business.faq} />
            <BusinessPolicies policies={business.policies} />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <BusinessCTA businessId={business.id} bookingMethod={business.bookingMethod} startingPrice={business.startingPrice} />
              <BusinessAvailability blockedDates={business.blockedDates} />
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
  if (!data) return null;

  // Safe parse for fields that might be arrays, comma-separated strings, or JSON strings
  const parseArrayOrDelimited = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.map(String).map(s => s.trim()).filter(Boolean);
      } catch {}
      return val.split(/,|\n/).map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const highlights = parseArrayOrDelimited(data.profileSettings?.highlights);
  const languages = (() => {
    const parsed = parseArrayOrDelimited(data.profileSettings?.languages);
    return parsed.length > 0 ? parsed : ['English'];
  })();

  const rawStartingPrice = Number(data.startingPrice);
  const startingPrice = !isNaN(rawStartingPrice) && rawStartingPrice > 0 
    ? rawStartingPrice 
    : (Array.isArray(data.packages) && data.packages.length > 0 
        ? Math.min(...data.packages.map((p: any) => Number(p.price) || 0).filter((p: number) => p > 0)) || 0
        : 0);

  return {
    id: data.id,
    slug: data.profileSettings?.seo?.slug || data.id,
    name: data.name || 'Vendor',
    logo: data.logo || '',
    coverImage: data.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    categoryId: data.categoryId || '',
    categoryName: data.category?.name || 'Vendor',
    isVerified: !!data.isVerified,
    rating: Number(data.rating) || 0,
    reviewCount: Number(data.reviewCount) || 0,
    startingPrice: startingPrice === Infinity ? 0 : startingPrice,
    yearsOfExperience: Number(data.profileSettings?.yearsOfExperience) || 1,
    responseTime: data.profileSettings?.responseTime || 'Within 24 hours',
    memberSince: data.createdAt ? new Date(data.createdAt).getFullYear().toString() : '2026',
    
    description: data.description || '',
    highlights,
    languages,
    
    verification: {
      isBusinessVerified: !!data.isVerified,
      isEmailVerified: true,
      isPhoneVerified: !!data.phone,
      isIdentityVerified: false,
      isRegistrationVerified: !!data.isVerified,
    },
    
    featureGroups: Array.isArray(data.profileSettings?.features) 
      ? data.profileSettings.features
          .filter((g: any) => g && (g.features?.length || (g as any).items?.length || g.groupName))
          .map((g: any) => ({
            groupName: g.groupName || 'Amenities',
            features: Array.isArray(g.features) ? g.features : parseArrayOrDelimited(g.items || g.features)
          }))
      : [],
    
    gallery: Array.isArray(data.galleries) ? data.galleries.map((g: any) => ({
      id: g.id,
      url: g.url,
      type: g.type || 'IMAGE'
    })) : [],
    
    packages: Array.isArray(data.packages) ? data.packages.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price) || 0,
      description: p.description || '',
      image: p.image || '',
      features: Array.isArray(p.features) ? p.features : parseArrayOrDelimited(p.features),
      duration: p.duration || ''
    })) : [],
    
    bookingMethod: data.profileSettings?.bookingMethod || 'DIRECT_BOOKING',
    blockedDates: parseArrayOrDelimited(data.profileSettings?.blockedDates),
    
    businessHours: (() => {
      const defaultHours: Record<string, string> = {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 5:00 PM',
        saturday: 'Closed',
        sunday: 'Closed',
      };

      if (Array.isArray(data.profileSettings?.hours)) {
        const obj: Record<string, string> = { ...defaultHours };
        data.profileSettings.hours.forEach((item: any) => {
          const key = item.day?.toLowerCase();
          if (key) {
            obj[key] = item.isClosed
              ? 'Closed'
              : `${item.openTime || '9:00 AM'} - ${item.closeTime || '6:00 PM'}`;
          }
        });
        return obj;
      }
      return data.profileSettings?.businessHours || defaultHours;
    })(),
    
    location: {
      address: data.address || '',
      city: data.city || '',
      district: data.district || '',
      mapEmbedUrl: data.googleMapLocation || data.profileSettings?.location?.mapEmbedUrl || '',
    },
    
    contact: {
      phone: data.phone || '',
      email: data.email || '',
      website: data.website || '',
      facebook: data.facebook || '',
      instagram: data.instagram || '',
      whatsapp: data.profileSettings?.whatsapp || data.profileSettings?.contact?.whatsapp || data.phone || '',
    },
    
    faq: Array.isArray(data.profileSettings?.faqs) 
      ? data.profileSettings.faqs 
      : (Array.isArray(data.profileSettings?.faq) ? data.profileSettings.faq : []),
    
    policies: {
      booking: data.profileSettings?.policies?.booking || data.profileSettings?.policies?.bookingPolicy || 'Contact vendor for booking policies.',
      cancellation: data.profileSettings?.policies?.cancellation || data.profileSettings?.policies?.cancellationPolicy || 'Contact vendor for cancellation policies.',
      payment: data.profileSettings?.policies?.payment || data.profileSettings?.policies?.paymentPolicy || 'Contact vendor for payment terms.',
      terms: data.profileSettings?.policies?.terms || 'Standard vendor terms apply.',
    },
    
    reviews: Array.isArray(data.reviews) ? data.reviews.map((r: any) => ({
      id: r.id,
      customerName: r.customer ? `${r.customer.firstName || ''} ${r.customer.lastName || ''}`.trim() || 'Customer' : 'Customer',
      rating: Number(r.rating) || 5,
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
      comment: r.comment || '',
      vendorReply: r.reply || null
    })) : []
  };
}
