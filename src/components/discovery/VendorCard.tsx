"use client";

import Link from "next/link";
import { Star, MapPin, Building2 } from "lucide-react";
import { ShortlistButton } from "./ShortlistButton";

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
    distanceKm?: number | null;
  };
  initialIsFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export function VendorCard({
  business,
  initialIsFavorite = false,
  onFavoriteChange,
}: VendorCardProps) {
  return (
    <Link href={`/business/${business.id}`} className="group block">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full min-h-[400px]">
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
          <ShortlistButton
            businessId={business.id}
            compact
            onChange={onFavoriteChange}
          />
        </div>

        {/* Details Section */}
        <div className="p-5 flex-1 flex flex-col relative">
          {/* Logo (Floating over edge) */}
          <div className="absolute -top-10 left-5 h-16 w-16 bg-white rounded-xl shadow-md border border-slate-100 p-1 overflow-hidden z-10 flex items-center justify-center">
            {business.logo ? (
              <img
                src={business.logo}
                alt="Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building2 className="h-6 w-6 text-slate-300" />
            )}
          </div>

          <div className="mt-6 flex flex-col flex-1">
            {typeof business.distanceKm === "number" && (
              <p className="text-xs font-medium text-teal-700 mb-1">
                About {business.distanceKm.toFixed(1)} km away
              </p>
            )}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {business.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-2 py-0.5 rounded-md">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-slate-900">
                  {business.rating > 0 ? business.rating : "New"}
                </span>
                <span className="text-xs text-slate-500">
                  ({business.reviewCount})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <span className="font-medium text-slate-700">
                {business.category?.name || "Vendor"}
              </span>
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
                {business.startingPrice > 0
                  ? `LKR ${business.startingPrice.toLocaleString()}`
                  : "Custom"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
