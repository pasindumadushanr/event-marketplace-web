'use client';

import { motion } from 'framer-motion';
import { mockVendors } from '@/data/mock/vendors';
import { Star, MapPin, BadgeCheck } from 'lucide-react';

export function FeaturedVendors() {
  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Premium Vendors</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover the most highly-rated and sought-after professionals in the industry, handpicked for their excellence.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockVendors.slice(0, 3).map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-primary/30 hover:border-primary group flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={vendor.coverImage} 
                  alt={vendor.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-sm font-bold text-slate-900">{vendor.rating}</span>
                  <span className="text-xs text-slate-500">({vendor.reviewCount})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                      {vendor.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      {vendor.name}
                      {vendor.isVerified && (
                        <BadgeCheck className="h-5 w-5 text-blue-500" />
                      )}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center text-slate-500 text-sm mb-6 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {vendor.location}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Starting from</p>
                    <p className="text-lg font-bold text-slate-900">
                      LKR {vendor.startingPrice.toLocaleString()}
                    </p>
                  </div>
                  <button className="px-5 py-2.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-700 text-sm font-semibold rounded-lg transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-colors shadow-sm">
            View All Vendors
          </button>
        </div>

      </div>
    </section>
  );
}
