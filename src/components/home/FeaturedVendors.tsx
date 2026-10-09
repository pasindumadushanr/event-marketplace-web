"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VendorCard } from "@/components/discovery/VendorCard";
import api from "@/lib/api";
import Link from "next/link";
import { WeddingSection } from "./WeddingSection";

export function FeaturedVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get(
          "/discovery/search?sortBy=RATING_DESC&limit=3",
        );
        setVendors(res.data.data);
      } catch (error) {
        console.error("Failed to load featured vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <WeddingSection
      label="Featured vendors"
      motif="rings"
      tone="blush"
      className="py-14 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="home-section-centered text-center mb-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="home-section-title text-3xl md:text-4xl font-bold mb-4">
              Premium Vendors
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover the most highly-rated and sought-after professionals in
              the industry, handpicked for their excellence.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-slate-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={false}
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
          <Link
            href="/search"
            className="home-section-action inline-flex px-7 py-3 text-sm font-semibold rounded-xl transition-colors"
          >
            View All Vendors
          </Link>
        </div>
      </div>
    </WeddingSection>
  );
}
