"use client";

import { useEffect, useState } from "react";
import { useLanguage, LanguageSwitch } from "@/lib/language";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  Images,
  Package,
  Phone,
  Rocket,
} from "lucide-react";
import api from "@/lib/api";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import { setupProgress } from "./setup-progress";

const icons = [Building2, Images, Package, Phone, Eye, Rocket];

export function GuidedSetup() {
  const { language, t } = useLanguage();
  const { business, updateBusinessLocally } = useBusinessProfile();
  const [resources, setResources] = useState<{
    packages: any[];
    galleries: any[];
    account: any;
  } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    setError("");
    try {
      const [packages, gallery, account] = await Promise.all([
        api.get("/vendor/packages"),
        api.get("/vendor/gallery"),
        api.get("/vendor/business/onboarding/status"),
      ]);
      setResources({
        packages: packages.data,
        galleries: gallery.data,
        account: account.data,
      });
    } catch {
      setError(
        "We couldn’t check your setup. Your saved details haven’t changed.",
      );
    }
  }
  useEffect(() => {
    void load();
  }, []);
  if (!business) return null;
  if (error && !resources)
    return (
      <section className="vendor-panel p-6" role="alert">
        {t(error)}{" "}
        <button className="underline" onClick={load}>
          {t("Try again")}
        </button>
      </section>
    );
  if (!resources)
    return (
      <section className="vendor-panel p-6" aria-busy="true">
        {t("Checking your setup…")}
      </section>
    );
  const progress = setupProgress(
    business,
    resources.packages,
    resources.account,
    resources.galleries,
  );
  const count = progress.steps.filter((step) => step.done).length;
  const next = progress.steps.find((step) => !step.done);
  async function publish() {
    if (!progress.canPublish || busy) return;
    setBusy(true);
    setError("");
    try {
      await api.patch("/vendor/business/publish");
      updateBusinessLocally({ status: "ACTIVE" });
    } catch (err: any) {
      setError(
        language === "en"
          ? err?.response?.data?.message ||
              "Could not publish your page. Please try again."
          : "Could not publish your page. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      lang={language}
      id="business-setup"
      className="vendor-panel overflow-hidden"
      aria-labelledby="setup-title"
    >
      <div className="border-b border-slate-100 bg-[#f3f6f1] p-6 sm:p-8">
        <LanguageSwitch disabled={busy} />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#867043]">
              {t("One step at a time")}
            </p>
            <h2
              id="setup-title"
              className="mt-2 text-2xl font-semibold text-[#183e38]"
            >
              {t("Your page setup checklist")}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t(
                "Start anywhere. Save each section, then check how your page looks to customers.",
              )}
            </p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#36564c]">
            {t("{count} of 6 steps complete", { count })}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Business page setup"
          aria-valuemin={0}
          aria-valuemax={6}
          aria-valuenow={count}
          className="mt-5 h-2 overflow-hidden rounded-full bg-[#dde5da]"
        >
          <div
            className="h-full rounded-full bg-[#527750] transition-all"
            style={{ width: `${(count / 6) * 100}%` }}
          />
        </div>
        {next && (
          <Link
            href={next.issues[0]?.href || next.href}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#183e38] px-5 py-3 text-sm font-semibold text-white"
          >
            {t("Continue setup:")} {t(next.title)}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
      <ol className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 xl:grid-cols-3">
        {progress.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <li
              key={step.title}
              className={`rounded-2xl border p-5 ${step.done ? "border-emerald-100 bg-emerald-50/40" : "border-slate-200 bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-white p-2.5 text-[#36564c]">
                  <Icon size={20} />
                </span>
                <span
                  className={`text-xs font-medium ${step.done ? "text-emerald-700" : "text-slate-500"}`}
                >
                  {step.done ? (
                    <span className="flex items-center gap-1">
                      <Check size={14} />
                      {t("Complete")}
                    </span>
                  ) : (
                    t("Step {number}", { number: index + 1 })
                  )}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                {index + 1}. {t(step.title)}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {t(step.issues.length ? "What’s missing:" : step.hint)}
              </p>
              {!!step.issues.length && (
                <ul className="mt-2 space-y-2">
                  {step.issues.map((issue) => (
                    <li key={issue.label}>
                      <Link
                        className="text-xs leading-5 text-[#8a632b] underline underline-offset-2"
                        href={issue.href}
                      >
                        {t(issue.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {step.title === "Publish" ? (
                !step.done && (
                  <button
                    onClick={publish}
                    disabled={!progress.canPublish || busy}
                    className="mt-4 rounded-lg bg-[#183e38] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t(busy ? "Publishing…" : "Publish my page")}
                  </button>
                )
              ) : (
                <Link
                  href={step.href}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#36564c]"
                >
                  {t(step.done ? "Review / edit" : "Open section")}
                  <ArrowRight size={14} />
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <p className="px-6 pb-6 text-xs text-slate-500 sm:px-8">
        {t(
          "Progress is based on saved details. Extra settings and portfolio photos are optional. Saving does not publish your page.",
        )}
      </p>
      {error && (
        <p role="alert" className="px-6 pb-6 text-sm text-red-700">
          {t(error)}
        </p>
      )}
    </section>
  );
}
