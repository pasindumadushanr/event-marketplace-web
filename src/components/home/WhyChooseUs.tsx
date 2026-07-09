'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, CreditCard, Clock, CheckCircle2, Search } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    description: 'Every vendor is strictly vetted by our team to ensure premium quality and reliability.',
  },
  {
    icon: HeartHandshake,
    title: 'Trusted Reviews',
    description: 'Read genuine reviews and ratings from past clients before making any booking decisions.',
  },
  {
    icon: CreditCard,
    title: 'Secure Booking',
    description: 'Your payments are protected. We hold the funds securely until your event is successful.',
  },
  {
    icon: Clock,
    title: 'Fast & Easy Search',
    description: 'Find exactly what you need in seconds with our advanced filtering and category system.',
  },
  {
    icon: CheckCircle2,
    title: 'Easy Comparison',
    description: 'Compare packages, prices, and portfolios side-by-side to find the perfect match.',
  },
  {
    icon: Search,
    title: 'Dedicated Support',
    description: 'Our concierge team is available 24/7 to help you plan your perfect event.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
              Why Choose LuxeEvents
            </h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">
              The Gold Standard in Event Planning
            </h3>
            <p className="text-lg text-slate-600">
              We take the stress out of event planning by bringing the best vendors, venues, and professionals into one secure, luxurious platform.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-md border border-primary/20 hover:border-primary hover:shadow-2xl transition-all group"
            >
              <div className="h-14 w-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white text-primary transition-colors">
                <feature.icon className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
