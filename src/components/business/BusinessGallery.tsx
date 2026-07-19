'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { BusinessGalleryImage } from '@/types/business-profile';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface BusinessGalleryProps {
  gallery: BusinessGalleryImage[];
}

export function BusinessGallery({ gallery }: BusinessGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!gallery || gallery.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 overflow-hidden text-center py-16">
        <ImageIcon className="h-16 w-16 text-slate-200 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Portfolio Coming Soon</h3>
        <p className="text-slate-500 max-w-md mx-auto">This vendor hasn't uploaded any photos or videos to their gallery yet. Check back later to see their work!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" /> Portfolio Gallery
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={scrollPrev}
            className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors focus:outline-none"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={scrollNext}
            className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors focus:outline-none"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 cursor-grab active:cursor-grabbing">
          {gallery.map((image) => (
            <div 
              key={image.id}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] min-w-0 pl-4"
            >
              <div className="h-64 rounded-2xl overflow-hidden relative group">
                <img 
                  src={image.url} 
                  alt={image.caption || 'Gallery Image'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
