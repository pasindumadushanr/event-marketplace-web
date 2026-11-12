"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  XCircle,
  FileText,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import api from "@/lib/api";
import { VendorDashboardV1 } from "@/components/vendor/VendorDashboardV1";
import { VendorDashboardV3 } from "@/components/vendor/VendorDashboardV3";

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
  const [informationRequest, setInformationRequest] = useState<string | null>(
    null,
  );
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [refreshAttempt, setRefreshAttempt] = useState(0);

  // Retain saved full-dashboard preferences; legacy V2 falls back to easy setup.
  const [viewMode, setViewMode] = useState<"v3" | "v1">(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMode = localStorage.getItem(
          "nakathata_vendor_dashboard_mode",
        );
        if (savedMode === "v1" || savedMode === "v3") return savedMode;
      } catch {
        /* localStorage unavailable */
      }
    }
    return "v3";
  });

  const handleModeChange = (mode: "v3" | "v1") => {
    setViewMode(mode);
    try {
      localStorage.setItem("nakathata_vendor_dashboard_mode", mode);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    let active = true;
    api
      .get("/vendor/business/onboarding/status")
      .then(({ data }) => {
        if (!active) return;
        setStatus(data.vendorStatus);
        setRejectionReason(data.rejectionReason);
        setInformationRequest(data.informationRequest);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (active) setIsLoadingStatus(false);
      });

    return () => {
      active = false;
    };
  }, [refreshAttempt]);

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

  if (status === "NEEDS_INFO")
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 sm:p-10 space-y-5">
        <h2 className="text-2xl font-semibold">
          A few more details are needed
        </h2>
        <p className="text-slate-600">
          Your application is not rejected. Please address the review team’s
          request, then resubmit it.
        </p>
        <div className="whitespace-pre-wrap rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          {informationRequest ||
            "Please contact support for the requested details."}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push("/vendor/onboarding")}>
            Update & Resubmit Application
          </Button>
          <Link
            className="inline-flex items-center rounded-lg border px-4 py-2 text-sm"
            href="/vendor/documents"
          >
            Verification document guidance
          </Link>
        </div>
      </div>
    );

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
              setIsLoadingStatus(true);
              setRefreshAttempt((a) => a + 1);
              void refreshBusiness();
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
    <div className="space-y-6">
      {/* Both views edit the same business. V2 is retained in source only. */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Your workspace
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Choose the view that suits you. Your saved details stay the same.
          </span>
        </div>

        <div className="inline-flex flex-wrap rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            aria-pressed={viewMode === "v3"}
            onClick={() => handleModeChange("v3")}
            className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${viewMode === "v3" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Sparkles className="size-3.5 text-emerald-600" />
            Easy setup
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("v1")}
            aria-pressed={viewMode === "v1"}
            className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "v1"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="size-3.5 text-slate-500" />
            Full dashboard
          </button>
        </div>
      </div>

      {/* RENDER SELECTED VIEW */}
      {viewMode === "v3" ? (
        <VendorDashboardV3 />
      ) : (
        <VendorDashboardV1
          business={business}
          isTogglingStatus={isTogglingStatus}
          setIsTogglingStatus={setIsTogglingStatus}
          updateBusinessLocally={updateBusinessLocally}
        />
      )}
    </div>
  );
}
