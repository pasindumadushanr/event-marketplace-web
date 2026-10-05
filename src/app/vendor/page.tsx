"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, Clock, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { GuidedSetup } from "@/components/vendor/GuidedSetup";
import { DailyOverview } from "@/components/vendor/DailyOverview";

export default function VendorDashboardPage() {
  const router = useRouter();
  const {
    business,
    isLoading: businessLoading,
    updateBusinessLocally,
    refreshBusiness,
  } = useBusinessProfile();
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const [status, setStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const fetchStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    setStatus(null);
    try {
      const { data } = await api.get("/vendor/business/onboarding/status");
      setStatus(data.vendorStatus);
      setRejectionReason(data.rejectionReason);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (businessLoading || isLoadingStatus) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-slate-200 rounded-lg"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  // --- NOT STARTED STATE ---
  if (status === "NOT_STARTED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Welcome to Nakathata.lk!
        </h2>
        <p className="text-slate-500 mb-8 max-w-lg">
          You are just a few steps away from joining our exclusive vendor
          network. Submit your application today to start connecting with
          premium clients.
        </p>
        <Link href="/vendor/onboarding">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white rounded-xl h-14 px-8 text-lg shadow-lg"
          >
            Submit Application
          </Button>
        </Link>
      </div>
    );
  }

  // --- UNDER REVIEW STATE ---
  if (status === "PENDING" || status === "UNDER_REVIEW") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
          <Clock className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Application Under Review
        </h2>
        <p className="text-slate-500 max-w-lg">
          Your vendor application has been received and is currently being
          reviewed by our administrative team. We will notify you once your
          account is approved.
        </p>
      </div>
    );
  }

  // --- REJECTED STATE ---
  if (status === "REJECTED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <XCircle className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Application Rejected
        </h2>
        <p className="text-slate-500 mb-4 max-w-lg">
          Unfortunately, your application was not approved at this time.
        </p>
        {rejectionReason && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 max-w-lg">
            <strong>Reason:</strong> {rejectionReason}
          </div>
        )}
        <Button
          onClick={() => router.push("/vendor/onboarding")}
          className="bg-slate-900 hover:bg-slate-800"
        >
          Update & Resubmit Application
        </Button>
      </div>
    );
  }

  // --- APPROVED STATE (FULL DASHBOARD) ---
  if (!business || status !== "APPROVED")
    return (
      <div role="alert" className="rounded-2xl border bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {status === "APPROVED"
            ? "We couldn’t load your business profile"
            : "We couldn’t check your business status"}
        </h2>
        <p className="text-sm text-slate-600">
          Your saved details haven’t been changed. Try loading them again. If
          the problem continues, contact our team for help.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              void Promise.all([fetchStatus(), refreshBusiness()]);
            }}
          >
            Try again
          </Button>
          <Link className="text-sm underline" href="/vendor/support">
            Contact support
          </Link>
        </div>
      </div>
    );

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
                    } catch (e: any) {
                      toast.error(
                        e?.response?.data?.message ||
                          "Failed to unpublish business",
                      );
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
