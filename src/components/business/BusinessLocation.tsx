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

      {location.mapEmbedUrl && location.mapEmbedUrl.includes('/embed') ? (
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
        <div className="w-full h-36 rounded-xl bg-slate-50 mb-4 flex flex-col items-center justify-center text-slate-500 border border-slate-200 p-4 text-center">
          <MapPin className="h-7 w-7 text-primary mb-1.5" />
          <span className="text-sm font-bold text-slate-800">{location.city || location.district || 'Location'}</span>
          <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{location.address}</span>
        </div>
      )}

      {location.mapEmbedUrl ? (
        <a 
          href={location.mapEmbedUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full block"
        >
          <Button variant="outline" className="w-full rounded-xl font-semibold border-slate-200 hover:bg-slate-50">
            <Navigation className="mr-2 h-4 w-4" /> Get Directions
          </Button>
        </a>
      ) : (
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([location.address, location.city, location.district].filter(Boolean).join(', '))}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full block"
        >
          <Button variant="outline" className="w-full rounded-xl font-semibold border-slate-200 hover:bg-slate-50">
            <Navigation className="mr-2 h-4 w-4" /> Get Directions
          </Button>
        </a>
      )}
    </div>
  );
}
