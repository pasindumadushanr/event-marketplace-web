'use client';

import { motion } from 'framer-motion';

export function AboutValues({ data }: { data: any[] }) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-slate-500">
            The principles that guide every decision we make at LuxeEvents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {data.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-shrink-0 items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
