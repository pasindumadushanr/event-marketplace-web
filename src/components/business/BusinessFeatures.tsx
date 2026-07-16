'use client';

import { BusinessFeatureGroup } from '@/types/business-profile';

interface BusinessFeaturesProps {
  featureGroups: BusinessFeatureGroup[];
}

export function BusinessFeatures({ featureGroups }: BusinessFeaturesProps) {
  if (!featureGroups || featureGroups.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-8">Features & Amenities</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        {featureGroups.map((group, idx) => (
          <div key={idx}>
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 pb-2 border-b border-slate-100">
              {group.groupName}
            </h4>
            <ul className="space-y-3">
              {group.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
