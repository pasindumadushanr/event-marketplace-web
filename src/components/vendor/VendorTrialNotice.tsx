"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Trial = { startsAt: string; endsAt: string; status: "ACTIVE" | "EXPIRED" };
export function VendorTrialNotice() {
  const [trial, setTrial] = useState<Trial | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data } = await api.get("/auth/vendor-trial", {
          timeout: 15000,
        });
        if (
          !["ACTIVE", "EXPIRED"].includes(data.status) ||
          !Number.isFinite(Date.parse(data.endsAt)) ||
          !Number.isFinite(Date.parse(data.startsAt))
        )
          throw new Error("Invalid trial information");
        if (active) {
          setTrial(data);
          setError(false);
        }
      } catch {
        if (active) {
          setTrial(null);
          setError(true);
        }
      }
    }
    void load();
    const timer = window.setInterval(load, 60000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [retry]);
  if (error)
    return (
      <div
        role="status"
        className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"
      >
        We couldn’t load your free-period dates. Your page has not been changed.{" "}
        <button
          onClick={() => {
            setError(false);
            setRetry((n) => n + 1);
          }}
          className="min-h-11 underline"
        >
          Try again
        </button>
      </div>
    );
  if (!trial) return null;
  const format = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Colombo",
    });
  return (
    <section
      aria-label="Your free vendor period"
      className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 sm:p-5 ${trial.status === "ACTIVE" ? "border-emerald-100 bg-emerald-50/60" : "border-amber-200 bg-amber-50/60"}`}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#183e38]">
          {trial.status === "ACTIVE"
            ? `Free access until ${format(trial.endsAt)}`
            : "Your free period has ended"}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          {format(trial.startsAt)} – {format(trial.endsAt)} · Two months from
          your registration.
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          {trial.status === "ACTIVE"
            ? "No automatic charges. We’ll ask you to contact us about the next steps."
            : "Your page will not be hidden because of this. Contact us to discuss the next steps. No automatic charges."}
        </p>
      </div>
      <Link
        href="/vendor/support"
        className="inline-flex min-h-11 items-center rounded-xl border border-[#cbd9ce] bg-white px-4 py-2 text-sm font-semibold text-[#183e38]"
      >
        Contact our team
      </Link>
    </section>
  );
}
