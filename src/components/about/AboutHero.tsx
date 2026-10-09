"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutHero({ data }: { data: any }) {
  return (
    <section className="public-page-hero relative min-h-[55vh] flex items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="public-page-hero-overlay absolute inset-0 z-10" />
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2000&auto=format&fit=crop"
          alt="Elegant Event Setup"
          className="w-full h-full object-cover scale-105 transform origin-center animate-out zoom-in duration-[20000ms]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
            {data.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={data.primaryLink}>
              <Button
                size="lg"
                className="public-page-gold-button w-full sm:w-auto rounded-xl px-8 py-6 text-base"
              >
                {data.primaryCTA}
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
    </section>
  );
}
