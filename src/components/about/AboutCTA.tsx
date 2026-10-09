"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutCTA({ data }: { data: any }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="public-page-dark-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
          <div
            className="absolute bottom-0 left-0 w-64 h-64 border border-[#e8ca8c]/20 rounded-full translate-y-1/3 -translate-x-1/4"
            aria-hidden="true"
          ></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {data.title}
            </h2>
            <p className="text-lg text-slate-300 mb-10">{data.description}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
