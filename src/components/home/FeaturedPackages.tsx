'use client';

import { motion } from 'framer-motion';
import { mockPackages } from '@/data/mock/packages';

export function FeaturedPackages() {
  return (
    <section className="py-24 bg-white">
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
              Curated service packages from top-rated vendors, designed to make your planning effortless.
            </p>
          </motion.div>
          <button className="shrink-0 px-6 py-3 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
            Browse All Packages
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                <img 
                  src={pkg.image} 
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                  <p className="text-sm font-bold text-slate-900">
                    LKR {pkg.price.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                  {pkg.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                  {pkg.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1">by {pkg.vendorName}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
