'use client';

import { motion } from 'framer-motion';
import { Store, CalendarCheck, MapPin, Star } from 'lucide-react';

const stats = [
  { icon: Store, value: '1,000+', label: 'Verified Vendors' },
  { icon: CalendarCheck, value: '5,000+', label: 'Successful Events' },
  { icon: MapPin, value: '300+', label: 'Cities Covered' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
];

export function Statistics() {
  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-2">
                <stat.icon className="h-8 w-8" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                {stat.value}
              </h3>
              <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
