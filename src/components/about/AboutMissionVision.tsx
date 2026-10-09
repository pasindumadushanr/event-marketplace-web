"use client";

import { motion } from "framer-motion";

export function AboutMissionVision({ data }: { data: any }) {
  return (
    <section className="public-page-band py-24 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="public-page-card p-8 lg:p-10 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {data.mission.title}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                {data.mission.description}
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="public-page-dark-card p-8 lg:p-10 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                {data.vision.title}
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                {data.vision.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
