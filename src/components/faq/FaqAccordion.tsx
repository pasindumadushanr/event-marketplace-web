'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface FaqAccordionProps {
  categories: any[];
  showCategoryTitles: boolean;
}

export function FaqAccordion({ categories, showCategoryTitles }: FaqAccordionProps) {
  return (
    <div className="space-y-8">
      {categories.map((category, catIndex) => (
        <motion.div 
          key={category.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: catIndex * 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm"
        >
          {showCategoryTitles && (
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.name}</h2>
          )}
          
          <Accordion type="single" collapsible className="w-full">
            {category.faqs.map((faq: any, index: number) => (
              <AccordionItem key={index} value={`item-${catIndex}-${index}`} className="border-slate-100 py-2">
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-800 hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-base leading-relaxed pt-2 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      ))}
    </div>
  );
}
