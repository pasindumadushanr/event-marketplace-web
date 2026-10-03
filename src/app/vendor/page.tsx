"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CircleDashed,
  ArrowRight,
  Eye,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { DailyOverview } from "@/components/vendor/DailyOverview";

export default function VendorDashboardPage() {
  const router = useRouter();
  const {
    business,
    isLoading: businessLoading,
    updateBusinessLocally,
  } = useBusinessProfile();
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const [status, setStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get("/vendor/business/onboarding/status");
        setStatus(data.vendorStatus);
        setRejectionReason(data.rejectionReason);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

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
      <div role="alert" className="rounded-2xl border bg-white p-6">
        We couldn’t load your business status. Please refresh the page or{" "}
        <Link className="underline" href="/vendor/support">
          contact support
        </Link>
        .
      </div>
    );

  // Dynamic completion logic based on business object
  const hasPolicies = business.profileSettings?.policies?.bookingPolicy;

  const completionTasks = [
    {
      name: "Business name, description & photos",
      isComplete: !!(
        business.name &&
        business.description &&
        business.logo &&
        business.coverImage
      ),
      href: "/vendor/business/general",
    },
    {
      name: "Contact Details",
      isComplete: !!(business.phone && business.email),
      href: "/vendor/business/contact",
    },
    {
      name: "Location Details",
      isComplete: !!(business.address && business.city),
      href: "/vendor/business/location",
    },
    {
      name: "Policies & FAQ",
      isComplete: !!hasPolicies,
      href: "/vendor/business/policies",
    },
  ];

  const completedCount = completionTasks.filter((t) => t.isComplete).length;
  const progressPercentage = Math.round(
    (completedCount / completionTasks.length) * 100,
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-secondary">
          Welcome back, {business.name || "Vendor"}!
        </h2>
        <p className="text-slate-500 mt-1">
          Manage your bookings, reply to customers and keep your business page
          up to date.
        </p>
      </div>
      {business.status === "ACTIVE" && <DailyOverview />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Completion Widget */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-secondary">
                Profile Setup
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Application approved.{" "}
                {business.status === "ACTIVE"
                  ? "Your page is visible to customers."
                  : "Finish these essentials before making your page visible."}{" "}
                Advanced page settings are optional.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-primary">
                  {progressPercentage}%
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Completed
                </p>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-primary"
                    strokeDasharray={`${progressPercentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {progressPercentage < 100 && (
            <Link
              href={completionTasks.find((task) => !task.isComplete)!.href}
              className="mb-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white"
            >
              Continue setup <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <details open={business.status !== "ACTIVE"}>
            <summary className="mb-4 cursor-pointer text-sm font-medium text-slate-600">
              {completedCount} of {completionTasks.length} essentials completed
              · View checklist
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completionTasks.map((task, idx) => (
                <Link key={idx} href={task.href}>
                  <div
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between group h-full ${
                      task.isComplete
                        ? "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <CircleDashed className="h-5 w-5 text-slate-300 shrink-0 group-hover:text-primary transition-colors" />
                      )}
                      <span
                        className={`font-medium ${task.isComplete ? "text-emerald-900" : "text-slate-700"}`}
                      >
                        {task.name}
                      </span>
                    </div>
                    {!task.isComplete && (
                      <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </details>
        </div>

        {/* Quick Stats Placeholder */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-secondary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
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
            ) : progressPercentage === 100 ? (
              <>
                <p className="text-2xl font-bold text-emerald-400 mb-2">
                  Ready to Publish
                </p>
                <p className="text-sm text-slate-400 font-medium mb-6">
                  Your profile is 100% complete.
                </p>
                <Button
                  disabled={isTogglingStatus}
                  onClick={async () => {
                    setIsTogglingStatus(true);
                    try {
                      await api.patch("/vendor/business/publish");
                      updateBusinessLocally({ status: "ACTIVE" });
                      toast.success(
                        "Your business is now live on the marketplace!",
                      );
                    } catch (e: any) {
                      toast.error(
                        e?.response?.data?.message ||
                          "Failed to publish business",
                      );
                    } finally {
                      setIsTogglingStatus(false);
                    }
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold border-0 cursor-pointer"
                >
                  {isTogglingStatus ? "Publishing..." : "Make My Page Visible"}
                </Button>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-slate-400 mb-2">
                  Incomplete
                </p>
                <p className="text-sm text-amber-400 font-medium mb-6">
                  Your profile is currently hidden from customers.
                </p>
                <Button
                  disabled
                  className="w-full bg-slate-800 text-slate-500 font-bold border-0"
                >
                  Complete Setup to Publish
                </Button>
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
