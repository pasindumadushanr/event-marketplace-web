"use client";

import { motion } from "framer-motion";
import { WeddingSection } from "@/components/home/WeddingSection";

export function AboutValues({ data }: { data: any[] }) {
  return (
    <WeddingSection
      label="Our values"
      tone="blush"
      motif="ribbon"
      className="py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-slate-500">
            The principles that guide every decision we make at Nakathata.lk.
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
                className="public-page-card rounded-2xl p-6 flex gap-5 items-start"
              >
                <div className="public-page-icon w-12 h-12 rounded-full border flex flex-shrink-0 items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </WeddingSection>
  );
}
