'use client';

import React, { useCallback, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

const categoryImageMap: Record<string, string> = {
  'hotels-venues': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
  'photographers': 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop',
  'videographers': 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1200&auto=format&fit=crop',
  'beauty-makeup': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop',
  'bridal-wear': 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop',
  'decorators-florists': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
  'entertainment': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
  'catering-cakes': 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1200&auto=format&fit=crop',
  'vehicle-rental': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
  'event-planners': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
  'invitations-printing': 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
  'other': 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop',
};

const defaultImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop';

export function CategoryCarousel() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: false,
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/business-categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories from database:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section id="categories" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-end mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Explore Categories</h2>
            <p className="text-slate-600">Find exactly what you need for your perfect day.</p>
          </motion.div>
          
          <div className="hidden md:flex gap-3">
            <button 
              onClick={scrollPrev}
              className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors focus:outline-none cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors focus:outline-none cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-[0_0_80%] sm:flex-[0_0_40%] md:flex-[0_0_25%] min-w-0">
                <div className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          /* Embla Viewport */
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {categories.map((category, index) => {
                const imgUrl = category.image || category.coverImage || categoryImageMap[category.slug] || defaultImage;
                const count = category._count?.businesses ?? category.businessCount ?? 0;

                return (
                  <motion.div 
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex-[0_0_80%] sm:flex-[0_0_40%] md:flex-[0_0_25%] min-w-0 pl-4"
                  >
                    <Link href={`/search?q=${encodeURIComponent(category.name)}`}>
                      <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                        {/* Image */}
                        <img 
                          src={imgUrl} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/25 to-transparent" />
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-slate-300 text-sm font-medium">
                            {count} {count === 1 ? 'Professional' : 'Professionals'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
