'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, Building2, BadgeCheck } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

export interface VendorCardProps {
  business: {
    id: string;
    name: string;
    coverImage?: string;
    logo?: string;
    isVerified: boolean;
    city?: string;
    category?: { name: string };
    startingPrice: number;
    rating: number;
    reviewCount: number;
  };
  initialIsFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export function VendorCard({ business, initialIsFavorite = false, onFavoriteChange }: VendorCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const { user } = useAuth();

  // If initialIsFavorite is not provided (like in general search), we could theoretically check a global store.
  // For MVP, we will rely on the prop passed from parent, or fetch locally if needed.

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the profile
    
    if (!user) {
      toast.error('Please login to save favorites.');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/customer/account/favorites/${business.id}`);
        setIsFavorite(false);
        if (onFavoriteChange) onFavoriteChange(false);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/customer/account/favorites/${business.id}`);
        setIsFavorite(true);
        if (onFavoriteChange) onFavoriteChange(true);
        toast.success('Saved to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Link href={`/business/${business.id}`} className="group block">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full h-[400px]">
        
        {/* Image Section */}
        <div className="relative h-[220px] w-full bg-slate-100 overflow-hidden shrink-0">
          {business.coverImage ? (
            <img 
              src={business.coverImage} 
              alt={business.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
              <Building2 className="h-10 w-10 text-slate-400" />
            </div>
          )}
          
          {/* Favorite Button */}
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors z-10 shadow-sm"
          >
            <Heart className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-slate-900'}`} />
          </button>
        </div>
        
        {/* Details Section */}
        <div className="p-5 flex-1 flex flex-col relative">
          
          {/* Logo (Floating over edge) */}
          <div className="absolute -top-10 left-5 h-16 w-16 bg-white rounded-xl shadow-md border border-slate-100 p-1 overflow-hidden z-10 flex items-center justify-center">
            {business.logo ? (
              <img src={business.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Building2 className="h-6 w-6 text-slate-300" />
            )}
          </div>

          <div className="mt-6 flex flex-col flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 truncate">{business.name}</h3>
                {business.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />}
              </div>
              <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-2 py-0.5 rounded-md">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-slate-900">{business.rating > 0 ? business.rating : 'New'}</span>
                <span className="text-xs text-slate-500">({business.reviewCount})</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <span className="font-medium text-slate-700">{business.category?.name || 'Vendor'}</span>
              {business.city && (
                <>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{business.city}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">Packages from</span>
              <span className="font-bold text-slate-900">
                {business.startingPrice > 0 ? `LKR ${business.startingPrice.toLocaleString()}` : 'Custom'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
