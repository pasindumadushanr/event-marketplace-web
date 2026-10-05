"use client";

import { VerificationStatus } from "@/types/business-profile";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface BusinessTrustProps {
  verification: VerificationStatus;
}

export function BusinessTrust({ verification }: BusinessTrustProps) {
  return (
    <section
      className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100 mb-8"
      aria-label="Trust and verification"
    >
      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" /> Trust & Verification
      </h3>
      {verification.isEmailVerified && (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" /> Vendor account email
          confirmed
        </p>
      )}
      <p className="text-sm text-slate-600 leading-relaxed mt-3">
        {verification.isEmailVerified
          ? "This confirms access to the account email, not the business’s identity or service quality. "
          : "No confirmed account email check is displayed for this profile. "}
        Identity, business registration, and phone ownership have not been
        verified by Nakathata.lk.
      </p>
      <Link
        href="/trust"
        className="inline-flex items-center min-h-11 mt-2 text-sm font-semibold underline text-slate-900"
      >
        What our checks and review labels mean
      </Link>
    </section>
  );
}
