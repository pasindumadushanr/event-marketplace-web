"use client";

import { Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface FaqHeroProps {
  data: { title: string; subtitle: string };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FaqHero({ data, searchQuery, setSearchQuery }: FaqHeroProps) {
  return (
    <section className="public-page-hero relative py-16 lg:py-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 border border-[#e8ca8c]/20 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 border border-[#e8ca8c]/20 rounded-full translate-y-1/2 translate-x-1/3"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heart
            aria-hidden="true"
            className="w-5 h-5 text-[#e8ca8c] mx-auto mb-5"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {data.subtitle}
          </p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <Input
              type="text"
              aria-label="Search frequently asked questions"
              placeholder="Search for answers (e.g., refunds, booking process)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="public-hero-search pl-12 py-7 text-base rounded-2xl focus-visible:ring-primary transition-all"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
