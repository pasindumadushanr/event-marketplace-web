"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  Images,
  MessageCircle,
} from "lucide-react";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import { setupProgress } from "./setup-progress";
import api from "@/lib/api";

type Resources = {
  packages: Parameters<typeof setupProgress>[1];
  galleries: Parameters<typeof setupProgress>[3];
  account: Parameters<typeof setupProgress>[2];
};

export function VendorDashboardV3() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [resources, setResources] = useState<Resources | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/vendor/packages"),
      api.get("/vendor/gallery"),
      api.get("/vendor/business/onboarding/status"),
    ])
      .then(([packages, galleries, account]) => {
        if (active)
          setResources({
            packages: packages.data,
            galleries: galleries.data,
            account: account.data,
          });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [reload]);

  if (!business) return null;
  const live = business.status === "ACTIVE";
  const progress = resources
    ? setupProgress(
        business,
        resources.packages,
        resources.account,
        resources.galleries,
      )
    : null;
  const nextIssue = progress?.blockers[0];
  const detailsDone = progress
    ? progress.steps[0].done && progress.steps[3].done
    : false;
  const photosDone = progress?.steps[1].done;
  const linkStyle =
    "inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#183e38] px-5 py-3 text-sm font-semibold text-white hover:bg-[#28564d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183e38]";

  async function changeVisibility() {
    if (busy || (!live && !progress?.canPublish)) return;
    if (
      live &&
      !window.confirm(
        "Hide your page from customers? You can show it again later. Existing bookings will stay saved.",
      )
    )
      return;
    setBusy(true);
    setMessage("");
    setActionError("");
    try {
      await api.patch(`/vendor/business/${live ? "unpublish" : "publish"}`);
      updateBusinessLocally({ status: live ? "INACTIVE" : "ACTIVE" });
      setMessage(
        live
          ? "Your page is now hidden from customers."
          : "Your page is now visible to customers!",
      );
    } catch (error: unknown) {
      const response = (
        error as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      setActionError(
        Array.isArray(response)
          ? response.join(". ")
          : response || "We couldn’t update your page. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      data-testid="vendor-dashboard-v3"
      className="mx-auto max-w-4xl space-y-6"
    >
      <header className="rounded-3xl border border-[#dce5db] bg-[#f3f6f1] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-[#456457]">
            Your business page
          </p>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${live ? "bg-emerald-100 text-emerald-900" : "bg-white text-slate-700"}`}
          >
            {live ? "Visible to customers" : "Not visible to customers"}
          </span>
        </div>
        <h1 className="mt-3 break-words text-2xl font-semibold text-[#183e38] sm:text-3xl">
          {business.name || "Welcome! Let’s set up your page"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {live
            ? "Keep your details and photos up to date so customers can contact you."
            : "Add your details and photos. Then check your page and share it with customers."}
        </p>
        <Link
          href={
            live
              ? `/business/${business.profileSettings?.seo?.slug || business.id}`
              : "/vendor/preview"
          }
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#183e38] underline underline-offset-4"
        >
          <Eye size={18} /> {live ? "See my page" : "See how my page looks"}
        </Link>
      </header>

      {loadError ? (
        <div
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950"
        >
          We couldn’t check your saved details. Your information has not been
          removed.
          <button
            type="button"
            onClick={() => {
              setLoadError(false);
              setResources(null);
              setReload((n) => n + 1);
            }}
            className="ml-2 min-h-11 font-semibold underline"
          >
            Try again
          </button>
        </div>
      ) : !resources ? (
        <p role="status" className="p-3 text-sm text-slate-600">
          Checking your saved details…
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <Building2
              className="text-[#527750]"
              size={26}
              aria-hidden="true"
            />
            {detailsDone && (
              <span className="flex items-center gap-1 text-xs text-emerald-800">
                <Check size={15} /> Details added
              </span>
            )}
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            1. About your business
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tell customers what you do and how to reach you.
          </p>
          <Link className={`${linkStyle} mt-5`} href="/vendor/business/general">
            Edit business details <ArrowRight size={16} />
          </Link>
          <div className="mt-4 flex flex-col items-start gap-1 text-sm text-[#36564c]">
            <Link
              className="flex min-h-11 items-center gap-2 underline underline-offset-4"
              href="/vendor/business/contact"
            >
              <MessageCircle size={17} /> WhatsApp & social links
            </Link>
            <Link
              className="flex min-h-11 items-center underline underline-offset-4"
              href="/vendor/business/location"
            >
              Business address & town
            </Link>
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <Images className="text-[#aa7d39]" size={26} aria-hidden="true" />
            {photosDone && (
              <span className="flex items-center gap-1 text-xs text-emerald-800">
                <Check size={15} /> Logo & cover added
              </span>
            )}
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            2. Show your work
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add photos of your work. You can add services and prices too.
          </p>
          <Link className={`${linkStyle} mt-5`} href="/vendor/gallery">
            Add or change photos <ArrowRight size={16} />
          </Link>
          <div className="mt-4 flex flex-col items-start gap-1 text-sm text-[#36564c]">
            <Link
              className="flex min-h-11 items-center underline underline-offset-4"
              href="/vendor/business/general"
            >
              Change logo & cover photo
            </Link>
            <Link
              className="flex min-h-11 items-center underline underline-offset-4"
              href="/vendor/packages"
            >
              Add services & prices (optional)
            </Link>
          </div>
        </section>
      </div>

      <section
        aria-labelledby="v3-publish-title"
        className="rounded-3xl border border-[#e4d6bb] bg-[#fffcf5] p-6 sm:p-8"
      >
        <h2
          id="v3-publish-title"
          className="text-xl font-semibold text-slate-900"
        >
          3. {live ? "Your page is live" : "Show your page to customers"}
        </h2>
        {live ? (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Customers can find your page. Changes you save will appear on it.
          </p>
        ) : progress ? (
          nextIssue ? (
            <div className="mt-3">
              <p className="text-sm text-slate-600">Next thing to do:</p>
              <Link
                className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#725427] underline underline-offset-4"
                href={nextIssue.href}
              >
                {nextIssue.label} <ArrowRight className="shrink-0" size={16} />
              </Link>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                We’ll guide you through anything else that is needed, one step
                at a time.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-emerald-800">
              Everything is ready. You can show your page to customers now.
            </p>
          )
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            We need to check your saved details before you can publish.
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!live && (
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold"
              href="/vendor/preview"
            >
              <Eye size={17} /> Check my page
            </Link>
          )}
          <button
            type="button"
            onClick={changeVisibility}
            disabled={busy || (!live && !progress?.canPublish)}
            className={`${linkStyle} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {busy ? "Please wait…" : live ? "Hide my page" : "Publish my page"}
          </button>
        </div>
        {message && (
          <p role="status" className="mt-4 text-sm text-emerald-800">
            {message}
          </p>
        )}
        {actionError && (
          <p role="alert" className="mt-4 text-sm text-red-800">
            {actionError}
          </p>
        )}
      </section>

      <details className="rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-slate-700">
          More options
        </summary>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#36564c]">
          {[
            ["/vendor/messages", "Customer messages"],
            ["/vendor/bookings", "Booking requests"],
            ["/vendor/business/policies", "Booking information"],
            ["/vendor/account", "Account & help"],
          ].map(([href, label]) => (
            <Link
              key={href}
              className="inline-flex min-h-11 items-center underline underline-offset-4"
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
