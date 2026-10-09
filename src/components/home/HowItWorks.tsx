"use client";

import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { WeddingSection } from "./WeddingSection";

const steps = [
  {
    icon: Search,
    title: "1. Search Vendors",
    description:
      "Browse through our curated list of premium venues and service providers.",
  },
  {
    icon: SlidersHorizontal,
    title: "2. Compare & Select",
    description:
      "Review portfolios, check review labels, and compare your saved vendors side-by-side.",
  },
  {
    icon: CalendarCheck,
    title: "3. Book Securely",
    description:
      "Lock in your dates and pay securely through our trusted payment gateway.",
  },
  {
    icon: Sparkles,
    title: "4. Enjoy Your Event",
    description:
      "Relax knowing the best professionals are handling your special day.",
  },
];

export function HowItWorks() {
  return (
    <WeddingSection
      label="How it works"
      motif="hearts"
      tone="ivory"
      className="py-14 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="home-section-centered text-center mb-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="home-section-title text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Planning a luxury event has never been easier. From discovery to
              booking, we simplify every step.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="home-step-card relative rounded-2xl p-6 flex flex-col items-center text-center"
            >
              <span
                className="home-step-number absolute top-4 right-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
                aria-hidden="true"
              >
                0{index + 1}
              </span>

              <div className="home-feature-icon h-14 w-14 rounded-full flex items-center justify-center mb-5">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-[#304239] mb-2">
                {step.title}
              </h3>
              <p className="text-sm leading-6 text-[#71685e]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </WeddingSection>
  );
}
