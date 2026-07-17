'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface FaqHeroProps {
  data: { title: string; subtitle: string; };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FaqHero({ data, searchQuery, setSearchQuery }: FaqHeroProps) {
  return (
    <section className="relative bg-slate-900 py-20 lg:py-28 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px] translate-y-1/2 translate-x-1/3"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
              placeholder="Search for answers (e.g., refunds, booking process)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-7 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-2xl focus-visible:ring-primary focus-visible:border-transparent transition-all"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
