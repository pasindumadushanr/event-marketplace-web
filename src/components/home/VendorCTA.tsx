'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function VendorCTA() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Grow Your Event Business with Us
          </h2>
          <p className="text-xl text-primary-foreground/90 font-light mb-10">
            Join the most exclusive event marketplace. Reach high-budget clients, manage bookings, and scale your business from a single dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sell">
              <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 text-white hover:bg-slate-800 w-full sm:w-auto rounded-xl">
                Register Your Business
              </Button>
            </Link>
            <Link href="/about-vendors">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white text-slate-800 hover:bg-white/10 w-full sm:w-auto rounded-xl">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
