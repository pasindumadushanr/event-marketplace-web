'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Globe, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
import { mockBusinessProfiles } from '@/data/mock/business-profiles';

import { BlockRenderer } from '@/components/business/BlockRenderer';

export default function VendorPreviewPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await api.get('/vendor/business');
      const blocksRes = await api.get('/vendor/business/content');
      
      const dbData = res.data;
      setBlocks(blocksRes.data || []);
      
      // We mix the DB data with a mock template so the rich UI components don't crash
      const template = mockBusinessProfiles['the-grand-ballroom-colombo'];
      
      const mixedBusiness = {
        ...template,
        name: dbData.name || template.name,
        description: dbData.description || template.description,
        categoryName: dbData.category?.name || template.categoryName,
        categoryId: dbData.category?.id || template.categoryId,
        status: dbData.status,
        contact: {
          ...template.contact,
          email: dbData.email || template.contact.email,
          phone: dbData.phone || template.contact.phone,
          website: dbData.website || template.contact.website,
        },
        location: {
          ...template.location,
          address: dbData.address || template.location.address,
          city: dbData.city || template.location.city,
        }
      };

      setBusiness(mixedBusiness);
    } catch (error) {
      toast.error('Failed to load preview');
      router.push('/vendor/business/general');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      if (business.status === 'ACTIVE') {
        await api.patch('/vendor/business/unpublish');
        setBusiness({ ...business, status: 'INACTIVE' });
        toast.success('Your business profile is now hidden from the public.');
      } else {
        await api.patch('/vendor/business/publish');
        setBusiness({ ...business, status: 'ACTIVE' });
        toast.success('Your business is now live on the marketplace!');
      }
    } catch (error) {
      toast.error('Failed to change publish status');
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Preview...</div>;
  if (!business) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Top Preview Bar */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/vendor/business/general')} className="text-slate-300 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
          <div className="h-6 w-px bg-slate-700 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Preview Mode
            </span>
            <span className="text-slate-400">
              This is exactly how customers see your profile.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {business.status === 'ACTIVE' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
              <CheckCircle className="h-4 w-4" />
              Published Live
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30">
              <EyeOff className="h-4 w-4" />
              Hidden (Unpublished)
            </div>
          )}
          <Button 
            onClick={handlePublishToggle} 
            disabled={isPublishing}
            className={business.status === 'ACTIVE' 
              ? "bg-slate-800 hover:bg-slate-700 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            {isPublishing ? 'Updating...' : business.status === 'ACTIVE' ? 'Unpublish' : 'Publish to Marketplace'}
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4 border-2 border-dashed border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden relative">
        
        {/* Top Level Hero */}
        <BusinessHero business={business} />

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
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
            <div className="sticky top-24 space-y-6">
              <BusinessCTA bookingMethod={business.bookingMethod} startingPrice={business.startingPrice} />
              <BusinessAvailability />
              <BusinessHours hours={business.businessHours} />
              <BusinessContact contact={business.contact} />
              <BusinessLocation location={business.location} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
