"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, Mail } from "lucide-react";

export function FaqHelp() {
  return (
    <section className="public-page-blush py-20 border-y border-[#e8dfd0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="public-page-card rounded-3xl p-8 md:p-12"
        >
          <div className="public-page-icon w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border">
            <MessageCircleQuestion className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Still Need Help?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
            Can't find the answer you're looking for? Our dedicated support team
            is ready to assist you with any inquiries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-6 text-lg"
              >
                Contact Support
              </Button>
            </Link>
            <a href="mailto:support@nakathata.lk">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 rounded-full px-8 py-6 text-lg border-slate-200"
              >
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
