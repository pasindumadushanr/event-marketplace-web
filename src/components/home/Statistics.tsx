"use client";

import { motion } from "framer-motion";
import { Store, CalendarCheck, MapPin, Star } from "lucide-react";
import { WeddingSection } from "./WeddingSection";

const stats = [
  { icon: Store, value: "Discover", label: "Vendors & Venues" },
  { icon: CalendarCheck, value: "Plan", label: "Event Services" },
  { icon: MapPin, value: "Explore", label: "Sri Lankan Locations" },
  { icon: Star, value: "Compare", label: "Customer Reviews" },
];

export function Statistics() {
  return (
    <WeddingSection
      tone="sage"
      label="Discover and plan"
      className="py-10 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="home-discovery-icon h-12 w-12 rounded-full flex items-center justify-center mb-1">
                <stat.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-[#304239]">
                {stat.value}
              </h3>
              <p className="text-[#69715f] text-xs sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </WeddingSection>
  );
}
