'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';
import { Tag, Building2, ArrowRight } from 'lucide-react';

const defaultPackageImage = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';

export function FeaturedPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get('/discovery/packages?limit=4');
        setPackages(res.data || []);
      } catch (err) {
        console.error('Failed to load featured packages from database:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <section id="packages" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Exclusive Packages</h2>
            <p className="text-slate-600">
              Curated service packages from verified event professionals, designed to make your planning effortless.
            </p>
          </motion.div>
          <Link href="/search">
            <button className="shrink-0 px-6 py-3 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5">
              Browse All Vendors & Packages <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                <div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl p-8">
            <Tag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">New Packages Coming Soon</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Our verified vendors are crafting bespoke packages. Browse our verified vendor directory to request a custom quote directly!
            </p>
            <Link href="/search">
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
                Explore Vendors
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => {
              const vendorUrl = `/business/${pkg.business?.profileSettings?.seo?.slug || pkg.business?.id || ''}`;
              const imageSrc = pkg.image || pkg.business?.coverImage || defaultPackageImage;
              const categoryName = pkg.business?.category?.name || 'Event Service';
              const priceNumber = Number(pkg.price) || 0;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={vendorUrl} className="block cursor-pointer">
                    <div className="relative h-64 rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                      <img 
                        src={imageSrc} 
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-white/60">
                        <p className="text-sm font-extrabold text-slate-900">
                          LKR {priceNumber.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1 block">
                        {categoryName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>by {pkg.business?.name || 'Verified Vendor'}</span>
                        {pkg.business?.city && <span className="text-slate-400">• {pkg.business.city}</span>}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
