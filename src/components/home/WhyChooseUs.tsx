"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  HeartHandshake,
  CreditCard,
  Clock,
  CheckCircle2,
  Search,
} from "lucide-react";
import { WeddingSection } from "./WeddingSection";

const features = [
  {
    icon: ShieldCheck,
    title: "Clear Verification Labels",
    description:
      "See confirmed account email checks and learn their limits. Approval to publish is not identity or quality verification.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted Reviews",
    description:
      "See which reviews are matched to completed bookings, and which have not been booking-verified.",
  },
  {
    icon: CreditCard,
    title: "Clear Booking Terms",
    description:
      "Confirm prices, inclusions, and cancellation conditions with your vendor before committing.",
  },
  {
    icon: Clock,
    title: "Fast & Easy Search",
    description:
      "Find exactly what you need in seconds with our advanced filtering and category system.",
  },
  {
    icon: CheckCircle2,
    title: "Easy Comparison",
    description:
      "Compare packages, prices, and portfolios side-by-side to find the perfect match.",
  },
  {
    icon: Search,
    title: "Dedicated Support",
    description:
      "Contact our support team when you need help with your account or vendor enquiries.",
  },
];

export function WhyChooseUs() {
  return (
    <WeddingSection
      label="Why choose Nakathata"
      motif="rosette"
      tone="ivory"
      className="py-14 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="home-section-centered text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xs font-semibold tracking-widest text-[#947239] uppercase mb-3">
              Why Choose Nakathata.lk
            </h2>
            <h3 className="home-section-title text-3xl sm:text-4xl font-bold mb-5">
              The Gold Standard in Event Planning
            </h3>
            <p className="text-base text-[#71685e] leading-7">
              We take the stress out of event planning by bringing the best
              vendors, venues, and professionals into one secure, luxurious
              platform.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="home-feature-card p-6 rounded-2xl transition-colors group"
            >
              <div className="home-feature-icon h-11 w-11 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h4 className="text-base font-semibold text-[#304239] mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-[#71685e] leading-6">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </WeddingSection>
  );
}
