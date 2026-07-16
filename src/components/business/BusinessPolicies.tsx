'use client';

import { BusinessPolicy } from '@/types/business-profile';
import { FileText, ShieldAlert, CreditCard, ScrollText } from 'lucide-react';

interface BusinessPoliciesProps {
  policies: BusinessPolicy;
}

export function BusinessPolicies({ policies }: BusinessPoliciesProps) {
  if (!policies) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Policies & Terms</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
            <ScrollText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Booking Policy</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{policies.booking}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Cancellation Policy</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{policies.cancellation}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Payment Policy</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{policies.payment}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Terms & Conditions</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{policies.terms}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
