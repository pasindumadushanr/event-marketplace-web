'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const locations = [
  { name: 'Colombo', image: 'https://images.unsplash.com/photo-1579606037130-1c099b2eb8c1?q=80&w=1000&auto=format&fit=crop', count: 450 },
  { name: 'Kandy', image: 'https://images.unsplash.com/photo-1625736301323-9372ce661a38?q=80&w=1000&auto=format&fit=crop', count: 180 },
  { name: 'Galle', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop', count: 120 },
  { name: 'Negombo', image: 'https://images.unsplash.com/photo-1620023617195-2007eab79b0f?q=80&w=1000&auto=format&fit=crop', count: 85 },
];

export function LocationGrid() {
  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Browse by Location</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Find top-rated event professionals in your specific city or region.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((loc, index) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer relative h-72 rounded-2xl overflow-hidden"
            >
              <img 
                src={loc.image} 
                alt={loc.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    {loc.name}
                  </h3>
                  <p className="text-sm text-slate-300 font-medium">
                    {loc.count} Vendors
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
