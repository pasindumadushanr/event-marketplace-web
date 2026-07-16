'use client';

import { VerificationStatus } from '@/types/business-profile';
import { CheckCircle2, XCircle } from 'lucide-react';

interface BusinessTrustProps {
  verification: VerificationStatus;
}

export function BusinessTrust({ verification }: BusinessTrustProps) {
  const items = [
    { label: 'Business Verified', status: verification.isBusinessVerified },
    { label: 'Email Verified', status: verification.isEmailVerified },
    { label: 'Phone Verified', status: verification.isPhoneVerified },
    { label: 'Identity Verified', status: verification.isIdentityVerified },
    { label: 'Registration Verified', status: verification.isRegistrationVerified },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Trust & Verification</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {item.status ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <XCircle className="h-5 w-5 text-slate-300" />
            )}
            <span className={`text-sm font-medium ${item.status ? 'text-slate-700' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
