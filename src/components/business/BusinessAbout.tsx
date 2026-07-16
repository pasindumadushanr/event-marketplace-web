'use client';

import { FullBusinessProfile } from '@/types/business-profile';
import { Check } from 'lucide-react';

interface BusinessAboutProps {
  business: FullBusinessProfile;
}

export function BusinessAbout({ business }: BusinessAboutProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-4">About {business.name}</h3>
      <p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-line">
        {business.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Highlights</h4>
          <ul className="space-y-3">
            {business.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 bg-primary/10 p-1 rounded-full text-primary">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-slate-700 font-medium">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="mb-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Experience</h4>
            <p className="text-slate-700 font-medium">{business.yearsOfExperience} Years in Business</p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Languages Spoken</h4>
            <div className="flex flex-wrap gap-2">
              {business.languages.map((lang, index) => (
                <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
