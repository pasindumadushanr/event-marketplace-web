'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { mockTestimonials } from '@/data/mock/testimonials';

export function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    loop: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Real stories from couples and planners who found their perfect vendors through LuxeEvents.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 hidden md:block">
            <button 
              onClick={scrollPrev}
              className="h-12 w-12 rounded-full bg-white/10 hover:bg-primary border border-white/20 flex items-center justify-center text-white transition-all -ml-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 hidden md:block">
            <button 
              onClick={scrollNext}
              className="h-12 w-12 rounded-full bg-white/10 hover:bg-primary border border-white/20 flex items-center justify-center text-white transition-all -mr-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {mockTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_60%] lg:flex-[0_0_50%] min-w-0 px-4">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 relative">
                    <Quote className="absolute top-8 right-8 h-12 w-12 text-white/5" />
                    
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-slate-600'}`} 
                        />
                      ))}
                    </div>

                    <p className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-8">
                      {testimonial.text}
                    </p>

                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.customerImage} 
                        alt={testimonial.customerName}
                        className="h-14 w-14 rounded-full object-cover border-2 border-primary/50"
                      />
                      <div>
                        <h4 className="text-white font-bold">{testimonial.customerName}</h4>
                        <p className="text-primary text-sm font-medium">Booked: {testimonial.vendorName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
