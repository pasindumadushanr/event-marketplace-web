'use client';

import { mockVendors } from '@/data/mock/vendors';
import { Star, MapPin, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

export function SimilarBusinesses({ currentCategoryId }: { currentCategoryId: string }) {
  // Mock filtering logic for similar businesses
  const similar = mockVendors.filter(v => v.category === 'Hotels & Venues' || v.category === 'Photographers').slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-slate-900 mb-8">You May Also Like</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {similar.map((vendor) => (
          <Link key={vendor.id} href={`/business/${vendor.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all border border-slate-200 hover:border-primary/50 group flex flex-col h-full">
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={vendor.coverImage} 
                  alt={vendor.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-sm font-bold text-slate-900">{vendor.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                    {vendor.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1">
                    {vendor.name}
                    {vendor.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                  </h3>
                </div>

                <div className="flex items-center text-slate-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {vendor.location}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Starting from</p>
                  <p className="text-base font-bold text-slate-900">
                    LKR {vendor.startingPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
