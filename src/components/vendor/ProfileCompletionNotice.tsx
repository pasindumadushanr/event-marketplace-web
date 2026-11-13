"use client";

import Link from "next/link";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";

export function ProfileCompletionNotice() {
  const { business } = useBusinessProfile();
  if (!business || business.status !== "ACTIVE") return null;
  const missing = [
    [business.description, "Business introduction", "/vendor/business/general"],
    [business.logo, "Business logo", "/vendor/business/general"],
    [business.coverImage, "Cover photo", "/vendor/business/general"],
    [business.address, "Business address", "/vendor/business/location"],
    [business.city, "Town or city", "/vendor/business/location"],
    [
      business.profileSettings?.policies?.bookingPolicy,
      "Booking policy",
      "/vendor/business/policies",
    ],
  ].filter(([value]) => typeof value !== "string" || !value.trim());
  if (!missing.length) return null;
  return (
    <section
      aria-label="Complete your business details"
      className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5"
    >
      <h2 className="text-sm font-semibold text-[#183e38]">
        Complete your business details
      </h2>
      <p className="mt-1 text-xs leading-5 text-slate-600">
        Your page is still live. Add these details to help customers choose your
        business.
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
        {missing.map(([, label, href]) => (
          <li key={label}>
            <Link
              href={href!}
              className="inline-flex min-h-11 items-center text-sm font-medium text-[#725427] underline underline-offset-4"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
