"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function SellHero({ data }: { data: any }) {
  return (
    <section className="public-page-hero relative overflow-hidden py-16 lg:py-24">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Vendor working on event"
          className="w-full h-full object-cover"
        />
        <div className="public-page-hero-overlay absolute inset-0"></div>

        {/* Glow effect */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-80 h-80 border border-[#e8ca8c]/30 rounded-full -translate-y-1/2 translate-x-1/3"
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-semibold text-white tracking-wider uppercase backdrop-blur-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              For Professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
              {data.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
              {data.description || data.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href={data.primaryLink}>
                <Button
                  size="lg"
                  className="public-page-gold-button w-full sm:w-auto rounded-xl px-8 py-6 text-base flex items-center gap-2"
                >
                  {data.primaryCTA}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={data.secondaryLink}>
                <Button
                  variant="outline"
                  size="lg"
                  className="public-page-outline-button w-full sm:w-auto rounded-xl px-8 py-6 text-base"
                >
                  {data.secondaryCTA}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
