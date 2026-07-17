'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircleQuestion, Mail } from 'lucide-react';

export function FaqHelp() {
  return (
    <section className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-primary/5 rounded-3xl p-10 md:p-14 border border-primary/10"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <MessageCircleQuestion className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Still Need Help?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
            Can't find the answer you're looking for? Our dedicated support team is ready to assist you with any inquiries.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-6 text-lg">
                Contact Support
              </Button>
            </Link>
            <a href="mailto:support@luxeevents.com">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 rounded-full px-8 py-6 text-lg border-slate-200">
                <Mail className="mr-2 h-5 w-5 text-slate-500" />
                Email Us
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
