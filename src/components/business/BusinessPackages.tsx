'use client';

import { Package } from '@/types/business-profile';
import { Button } from '@/components/ui/button';
import { Check, Clock, Package as PackageIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { BookingRequestModal } from './BookingRequestModal';
import { Badge } from '@/components/ui/badge';

interface BusinessPackagesProps {
  packages: Package[];
  businessName: string;
  blockedDates?: string[];
}

export function BusinessPackages({ packages, businessName, blockedDates = [] }: BusinessPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  if (!packages || packages.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 text-center py-16">
        <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-slate-300 text-3xl font-serif font-bold">$</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Custom Pricing Available</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          This vendor creates custom packages tailored specifically to your event's unique needs rather than set pricing tiers.
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Request a Custom Quote
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-serif font-bold text-slate-900">
            Service Packages & Available Options
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Browse available vehicles, packages, or rental options provided directly by {businessName}.
          </p>
        </div>
        <Badge variant="outline" className="self-start sm:self-auto text-primary border-primary/20 bg-primary/5 font-semibold text-xs py-1 px-3">
          <Sparkles className="h-3 w-3 mr-1 inline" /> {packages.length} Option{packages.length !== 1 ? 's' : ''} Available
        </Badge>
      </div>
      
      <div className="space-y-6">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className="border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 bg-white group"
          >
            {/* Visual Item / Car / Package Image */}
            {pkg.image ? (
              <div className="w-full md:w-64 h-52 sm:h-56 rounded-2xl overflow-hidden shrink-0 border border-slate-100 relative bg-slate-100 shadow-xs">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  onError={(e) => {
                    // Hide if failed or fallback to placeholder
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="w-full md:w-48 h-44 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4">
                <PackageIcon className="h-10 w-10 text-slate-300 mb-1" />
                <span className="text-[11px] font-semibold text-slate-400">Package Details</span>
              </div>
            )}

            {/* Content & Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {pkg.name}
                    </h4>
                    {pkg.description && (
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      LKR {Number(pkg.price).toLocaleString()}
                    </p>
                    {pkg.duration && (
                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 sm:justify-end mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-primary" /> {pkg.duration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Features / Inclusions Checklist */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 mt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Inclusions & Specifications:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end">
                <Button 
                  onClick={() => setSelectedPackage(pkg)}
                  className="bg-slate-900 text-white hover:bg-primary font-bold text-xs sm:text-sm rounded-xl px-6 h-11 shadow-sm transition-all"
                >
                  Request this Package
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BookingRequestModal 
        pkg={selectedPackage} 
        isOpen={!!selectedPackage} 
        onClose={() => setSelectedPackage(null)} 
        businessName={businessName}
        blockedDates={blockedDates}
      />
    </div>
  );
}
