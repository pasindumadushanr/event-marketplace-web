'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop';

const locations = [
  { 
    name: 'Colombo', 
    province: 'Western',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop', 
    count: 450,
    tagline: 'Luxury Ballrooms & Studios'
  },
  { 
    name: 'Kandy', 
    province: 'Central',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=800&auto=format&fit=crop', 
    count: 180,
    tagline: 'Royal Poruwa Ceremonies'
  },
  { 
    name: 'Galle', 
    province: 'Southern',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop', 
    count: 210,
    tagline: 'Historic Fort & Barefoot Beach'
  },
  { 
    name: 'Negombo', 
    province: 'Western',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop', 
    count: 140,
    tagline: 'Coastal Lagoons & Marquees'
  },
];

export function LocationGrid() {
  return (
    <section className="py-24 bg-muted/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
              <Compass className="h-4 w-4" /> Nationwide Coverage
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Browse by Location
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-1 max-w-2xl">
              Find top-rated event professionals, destination venues, and mobile teams in your specific district or region.
            </p>
          </div>

          <Link href="/locations" className="shrink-0">
            <Button variant="outline" className="border-slate-300 hover:border-slate-400 bg-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Explore All 25 Districts Map
              <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((loc, index) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                href={`/search?city=${encodeURIComponent(loc.name)}`}
                className="group block relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Background City Image with graceful fallback */}
                <img 
                  src={loc.image} 
                  alt={loc.name}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== FALLBACK_IMAGE) {
                      target.src = FALLBACK_IMAGE;
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700/50">
                    {loc.province} Province
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 left-0 w-full p-6 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {loc.tagline}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-bold mt-1">
                      {loc.count}+ Verified Vendors
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-md shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
