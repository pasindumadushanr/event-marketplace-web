'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VendorCard } from '@/components/discovery/VendorCard';
import api from '@/lib/api';
import Link from 'next/link';

export function FeaturedVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/discovery/search?sortBy=RATING_DESC&limit=3');
        setVendors(res.data.data);
      } catch (error) {
        console.error('Failed to load featured vendors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-slate-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <VendorCard business={vendor} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/search">
            <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-colors shadow-sm">
              View All Vendors
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
