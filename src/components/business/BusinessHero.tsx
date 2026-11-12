"use client";

import { FullBusinessProfile } from "@/types/business-profile";
import { Star, MapPin, Clock } from "lucide-react";

interface BusinessHeroProps {
  business: FullBusinessProfile;
}

export function BusinessHero({ business }: BusinessHeroProps) {
  return (
    <div className="business-profile-hero bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-8">
      {/* Cover Image */}
      <div className="business-profile-cover relative h-48 sm:h-64 md:h-96 w-full bg-slate-100">
        <img
          src={business.coverImage}
          alt={`${business.name} Cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-6 flex flex-wrap gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md">
            {business.categoryName}
          </span>
        </div>
      </div>

      {/* Main Info Section */}
      <div className="px-4 sm:px-6 md:px-10 pb-6 md:pb-10 pt-6 relative">
        {/* Logo (Overlapping) */}
        <div className="business-profile-logo absolute -top-12 left-4 sm:left-6 md:-top-16 md:left-10 h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-white p-1.5 md:p-2 shadow-lg border border-slate-100">
          <img
            src={business.logo}
            alt={`${business.name} Logo`}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="business-profile-summary ml-0 md:ml-40 mt-8 md:mt-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="min-w-0 w-full">
            <h1 className="text-2xl leading-tight md:text-4xl font-bold text-slate-900 mb-3 break-words [overflow-wrap:anywhere]">
              {business.name}
            </h1>
            {business.categoryNames && business.categoryNames.length > 1 && (
              <div
                aria-label="Business categories"
                className="mb-3 flex flex-wrap gap-2"
              >
                {business.categoryNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-950"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center text-slate-500 gap-2 sm:gap-x-4 text-sm font-medium">
              <span className="flex items-start gap-2 min-w-0">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />{" "}
                <span className="break-words">
                  {[business.location.city, business.location.district]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </span>
              <span className="flex items-center gap-2 text-primary">
                <Star className="h-4 w-4 shrink-0 fill-primary" />{" "}
                {business.rating} ({business.reviewCount} Reviews)
              </span>
              <span className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />{" "}
                <span>Responds {business.responseTime}</span>
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start md:items-end bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full md:w-auto">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
              {business.startingPrice > 0 ? "Starting From" : "Pricing"}
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {business.startingPrice > 0
                ? `LKR ${business.startingPrice.toLocaleString()}`
                : "Custom Quote"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
