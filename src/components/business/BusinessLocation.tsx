'use client';

import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusinessLocationProps {
  location: {
    address: string;
    city: string;
    district: string;
    mapEmbedUrl?: string;
  };
}

export function BusinessLocation({ location }: BusinessLocationProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" /> Location
      </h3>
      
      <p className="text-slate-600 font-medium leading-relaxed mb-4">
        {location.address}<br />
        {location.city}, {location.district}
      </p>

      {location.mapEmbedUrl ? (
        <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-slate-200">
          <iframe 
            src={location.mapEmbedUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="w-full h-48 rounded-xl bg-slate-100 mb-4 flex items-center justify-center text-slate-400 border border-slate-200">
          Map Data Unavailable
        </div>
      )}

      <Button variant="outline" className="w-full rounded-xl font-semibold border-slate-200">
        <Navigation className="mr-2 h-4 w-4" /> Get Directions
      </Button>
    </div>
  );
}
