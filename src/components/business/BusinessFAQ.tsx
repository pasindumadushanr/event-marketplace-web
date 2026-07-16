'use client';

import { FAQ } from '@/types/business-profile';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BusinessFAQProps {
  faq: FAQ[];
}

export function BusinessFAQ({ faq }: BusinessFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faq || faq.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
      
      <div className="space-y-4">
        {faq.map((item, index) => (
          <div 
            key={index} 
            className={`border rounded-2xl overflow-hidden transition-colors ${openIndex === index ? 'border-primary/50 bg-primary/5' : 'border-slate-200 bg-white'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between font-semibold text-slate-900 text-left focus:outline-none"
            >
              {item.question}
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-primary shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 pt-1 text-slate-600 leading-relaxed text-sm md:text-base">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
