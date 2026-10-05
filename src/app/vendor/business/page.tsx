"use client";

import Link from "next/link";
import { GuidedSetup } from "@/components/vendor/GuidedSetup";
import { ArrowRight, Check, Circle } from "lucide-react";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import {
  businessSections,
  businessEssentials,
} from "@/components/vendor/business-sections";

export default function BusinessRootPage() {
  const { business, isLoading, error, refreshBusiness } = useBusinessProfile();
  if (isLoading)
    return <p className="p-8 text-slate-500">Loading your business page…</p>;
  if (error || !business)
    return (
      <div role="alert" className="vendor-panel p-6">
        We couldn’t load your business.{" "}
        <button onClick={refreshBusiness} className="underline">
          Try again
        </button>
      </div>
    );
  const essentials = businessEssentials(business);
  const renderCards = (group: string) => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {businessSections
        .filter((item) => item.group === group)
        .map((item, index) => {
          const essential = item.key in essentials;
          const done =
            essential && essentials[item.key as keyof typeof essentials];
          return (
            <Link
              href={item.href}
              key={item.key}
              className="business-section-card group"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="business-section-icon">
                  <item.icon className="h-5 w-5" />
                </span>
                {essential && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium ${done ? "text-[#527750]" : "text-[#916c32]"}`}
                  >
                    {done ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Circle className="h-2.5 w-2.5" />
                    )}
                    {done ? "Added" : "To do"}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-sm font-semibold text-slate-900">
                {essential && (
                  <span className="mr-1 text-slate-400">0{index + 1}.</span>
                )}
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {item.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#36564c]">
                {essential ? (done ? "Edit details" : "Get started") : "Manage"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
    </div>
  );
  return (
    <div className="space-y-8">
      <section className="business-overview-hero">
        <div className="max-w-xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#8a6b35]">
            Your business. Your first impression.
          </p>
          <h1 className="text-2xl font-semibold text-[#183e38] sm:text-3xl">
            Make your business page
            <br />
            one worth remembering.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Choose what you want to update. We’ve organised everything into
            simple sections, so you can spend less time editing and more time
            doing what you love.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#36564c]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${business.status === "ACTIVE" ? "bg-emerald-600" : "bg-amber-500"}`}
            />
            {business.status === "ACTIVE"
              ? "Visible to customers"
              : "Not yet visible to customers"}{" "}
            · {business.name}
          </p>
        </div>
      </section>
      <GuidedSetup />
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Start with the essentials
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            The information customers need to get to know you and book with
            confidence.
          </p>
        </div>
        {renderCards("Essentials")}
      </section>
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Bring your business to life
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Show your work, explain your offers and build trust.
          </p>
        </div>
        {renderCards("Showcase your business")}
      </section>
      <details className="vendor-panel p-5">
        <summary className="cursor-pointer text-sm font-semibold text-[#36564c]">
          More ways to personalise your page{" "}
          <span className="ml-2 text-xs font-normal text-slate-500">
            Optional
          </span>
        </summary>
        <div className="mt-5">{renderCards("More options")}</div>
      </details>
    </div>
  );
}
