'use client';

import { motion } from 'framer-motion';

export function AboutHowItWorks({ data }: { data: any[] }) {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 hidden md:block -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How LuxeEvents Works
          </h2>
          <p className="text-lg text-slate-400">
            A frictionless journey from finding your perfect vendor to celebrating your big day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
          {data.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative text-center px-4"
              >
                <div className="w-20 h-20 mx-auto bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-6 relative z-10 shadow-xl group hover:border-primary transition-colors duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                  {/* Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm border-2 border-slate-900">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
