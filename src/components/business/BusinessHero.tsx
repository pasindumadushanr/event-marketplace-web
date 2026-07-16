'use client';

import { FullBusinessProfile } from '@/types/business-profile';
import { BadgeCheck, Star, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusinessHeroProps {
  business: FullBusinessProfile;
}

export function BusinessHero({ business }: BusinessHeroProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-8">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 w-full bg-slate-100">
        <img 
          src={business.coverImage} 
          alt={`${business.name} Cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        {/* Badges Overlay */}
        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md">
            {business.categoryName}
          </span>
          {business.isVerified && (
            <span className="bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Main Info Section */}
      <div className="px-6 md:px-10 pb-10 pt-6 relative">
        {/* Logo (Overlapping) */}
        <div className="absolute -top-16 left-6 md:left-10 h-32 w-32 rounded-2xl bg-white p-2 shadow-lg border border-slate-100">
          <img 
            src={business.logo} 
            alt={`${business.name} Logo`}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="ml-0 md:ml-40 mt-16 md:mt-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              {business.name}
            </h1>
            <div className="flex flex-wrap items-center text-slate-500 gap-4 text-sm font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {business.location.city}, {business.location.district}
              </span>
              <span className="flex items-center gap-1 text-primary">
                <Star className="h-4 w-4 fill-primary" /> {business.rating} ({business.reviewCount} Reviews)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Responds {business.responseTime}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full md:w-auto">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Starting From</p>
            <p className="text-2xl font-bold text-slate-900">
              LKR {business.startingPrice.toLocaleString()}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
