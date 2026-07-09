'use client';

import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, CalendarCheck, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: '1. Search Vendors',
    description: 'Browse through our curated list of premium venues and service providers.',
  },
  {
    icon: SlidersHorizontal,
    title: '2. Compare & Select',
    description: 'Review portfolios, read verified reviews, and compare packages side-by-side.',
  },
  {
    icon: CalendarCheck,
    title: '3. Book Securely',
    description: 'Lock in your dates and pay securely through our trusted payment gateway.',
  },
  {
    icon: Sparkles,
    title: '4. Enjoy Your Event',
    description: 'Relax knowing the best professionals are handling your special day.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Planning a luxury event has never been easier. From discovery to booking, we simplify every step.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector Line (Desktop only) */}
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200 -z-10" />
              )}
              
              <div className="h-24 w-24 rounded-full bg-slate-50 border-2 border-primary/20 flex items-center justify-center text-primary mb-6 shadow-sm">
                <step.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
