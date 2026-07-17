'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function SellPricing({ data }: { data: any }) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            {data.title}
          </h2>
          <p className="text-lg text-slate-500">
            {data.description}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row"
          >
            {/* Features Side */}
            <div className="flex-1 p-10 md:p-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h3>
              <ul className="space-y-4">
                {data.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Side */}
            <div className="w-full md:w-80 bg-slate-900 p-10 md:p-12 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -z-0"></div>
              
              <div className="relative z-10">
                <p className="text-primary font-semibold tracking-wider uppercase text-sm mb-2">Platform Fee</p>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-5xl font-bold">{data.commission}</span>
                </div>
                <p className="text-slate-300 text-sm mb-6">
                  commission only on successful bookings. No hidden fees.
                </p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-md">
                  Free to Register
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>

      </div>
    </section>
  );
}
