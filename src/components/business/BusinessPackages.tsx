'use client';

import { Package } from '@/types/business-profile';
import { Button } from '@/components/ui/button';
import { Check, Clock } from 'lucide-react';
import { useState } from 'react';
import { BookingRequestModal } from './BookingRequestModal';

interface BusinessPackagesProps {
  packages: Package[];
  businessName: string;
}

export function BusinessPackages({ packages, businessName }: BusinessPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  if (!packages || packages.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 text-center py-16">
        <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-slate-300 text-3xl font-serif font-bold">$</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Custom Pricing Available</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-6">This vendor creates custom packages tailored specifically to your event's unique needs rather than set pricing tiers.</p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Request a Custom Quote
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-2xl font-serif font-bold text-secondary mb-6">Service Packages</h3>
      
      <div className="space-y-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-primary/50 hover:shadow-md transition-all">
            
            {/* Optional Package Image */}
            {pkg.image && (
              <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0">
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{pkg.description}</p>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <p className="text-2xl font-bold text-primary">LKR {Number(pkg.price).toLocaleString()}</p>
                  {pkg.duration && (
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1 md:justify-end mt-1">
                      <Clock className="h-4 w-4" /> {pkg.duration}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Includes</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setSelectedPackage(pkg)}
                  className="bg-slate-900 text-white hover:bg-primary font-semibold"
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
      />
    </div>
  );
}
