"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { GuidedSetup } from "@/components/vendor/GuidedSetup";
import { DailyOverview } from "@/components/vendor/DailyOverview";

interface BusinessProfile {
  id?: string;
  name?: string;
  status?: string;
  profileSettings?: {
    seo?: {
      slug?: string;
    };
  };
}

interface VendorDashboardV1Props {
  business: BusinessProfile;
  isTogglingStatus: boolean;
  setIsTogglingStatus: (val: boolean) => void;
  updateBusinessLocally: (data: Partial<BusinessProfile>) => void;
}

export function VendorDashboardV1({
  business,
  isTogglingStatus,
  setIsTogglingStatus,
  updateBusinessLocally,
}: VendorDashboardV1Props) {
  return (
    <div className="space-y-8">
      <div className="vendor-hero flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#dfc18b]">
            A little progress. A memorable celebration.
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Welcome back,
            <br />
            {business.name || "Vendor"}.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            Your next great event starts here. Stay connected with customers and
            keep your business moving forward.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-4 sm:items-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80">
            <span
              className={`h-1.5 w-1.5 rounded-full ${business.status === "ACTIVE" ? "bg-[#b7d7a8]" : "bg-amber-300"}`}
            />
            {business.status === "ACTIVE"
              ? "Your business page is live"
              : "Let’s get your page ready"}
          </span>
          <Link
            href="/vendor/business"
            className="inline-flex items-center gap-2 rounded-xl bg-[#e7c991] px-5 py-3 text-sm font-semibold text-[#283c30] hover:bg-[#f0d8ac]"
          >
            Manage my business <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      {business.status === "ACTIVE" && <DailyOverview />}

      <GuidedSetup />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Page visibility */}
        <div className="lg:col-span-4 space-y-6">
          <div className="vendor-status relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <h3 className="font-serif font-semibold text-primary mb-6">
              Profile Status
            </h3>
            {business.status === "ACTIVE" ? (
              <>
                <p className="text-2xl font-bold text-emerald-400 mb-2">
                  Live & Active
                </p>
                <p className="text-sm text-slate-400 font-medium mb-6">
                  Your business is visible to customers.
                </p>
                <Button
                  disabled={isTogglingStatus}
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Hide your business page? Customers will no longer find it in search. Existing bookings will remain.",
                      )
                    )
                      return;
                    setIsTogglingStatus(true);
                    try {
                      await api.patch("/vendor/business/unpublish");
                      updateBusinessLocally({ status: "INACTIVE" });
                      toast.success(
                        "Your business is now unpublished and hidden from public search.",
                      );
                    } catch (e: unknown) {
                      const msg =
                        e && typeof e === "object" && "response" in e
                          ? (e as { response?: { data?: { message?: string } } })
                              .response?.data?.message
                          : undefined;
                      toast.error(msg || "Failed to unpublish business");
                    } finally {
                      setIsTogglingStatus(false);
                    }
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold border-0 cursor-pointer"
                >
                  {isTogglingStatus ? "Updating..." : "Hide My Business Page"}
                </Button>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-slate-400 mb-2">
                  Not yet published
                </p>
                <p className="text-sm text-amber-400 font-medium mb-6">
                  Your profile is currently hidden from customers.
                </p>
                <Link
                  href="/vendor/business#business-setup"
                  className="text-sm text-white underline"
                >
                  View setup checklist
                </Link>
              </>
            )}
          </div>

          <Link
            href={
              business.status === "ACTIVE"
                ? `/business/${business.profileSettings?.seo?.slug || business.id}`
                : "/vendor/preview"
            }
          >
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl bg-white hover:bg-slate-50 text-secondary font-semibold shadow-sm border-slate-200 mt-4"
            >
              <Eye className="w-4 h-4 mr-2" />{" "}
              {business.status === "ACTIVE"
                ? "View Public Profile"
                : "Preview My Business Page"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
