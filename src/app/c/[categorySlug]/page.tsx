'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { VendorCard } from '@/components/discovery/VendorCard';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import api from '@/lib/api';

export default function CategoryLandingPage() {
  const params = useParams();
  const slug = params.categorySlug as string;
  const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryResults = async () => {
      try {
        // Since we don't have strict slug fields in the DB for MVP, we just do a text search on the name for now
        const res = await api.get(`/discovery/search?q=${categoryName}`);
        setBusinesses(res.data.data);
      } catch (error) {
        console.error('Failed to load category', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryResults();
  }, [categoryName]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      {/* Category Hero Header */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Best {categoryName}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Discover top-rated {categoryName.toLowerCase()} professionals for your next luxury event. Carefully vetted and verified.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-[400px] bg-slate-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-slate-900">No vendors found in this category yet.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map(business => (
              <VendorCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
