"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, MessageSquare, Users } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { SRI_LANKA_DISTRICTS } from "@/lib/districts";
import { Button } from "@/components/ui/button";

type LaunchVendor = {
  id: string;
  name: string;
  district: string | null;
  city: string | null;
  category: string;
  status: string;
  vendorStatus: string;
  missing: string[];
  inquiries: {
    received: number;
    unanswered: number;
    replied: number;
    needsDetails: number;
    declined: number;
  };
};
type Overview = {
  total: number;
  page: number;
  pageSize: number;
  windowDays: number;
  vendors: LaunchVendor[];
};

export default function LaunchSupportPage() {
  const { user, isLoading } = useAuth();
  const allowed =
    user?.roleName === "ADMIN" || user?.roleName === "SUPER_ADMIN";
  const [district, setDistrict] = useState("");
  const [page, setPage] = useState(1);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!allowed) return;
    let active = true;
    setLoading(true);
    setError(false);
    setOverview(null);
    api
      .get<Overview>("/admin/vendors/applications/launch-overview", {
        params: { page, ...(district ? { district } : {}) },
      })
      .then(({ data }) => {
        if (active) setOverview(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [allowed, district, page, retry]);
  if (isLoading) return <p role="status">Loading…</p>;
  if (!allowed)
    return (
      <p role="alert">Launch support is available to administrators only.</p>
    );
  const vendors = overview?.vendors || [];
  const needsHelp = vendors.filter((v) => v.missing.length > 0).length;
  const unanswered = vendors.reduce(
    (sum, v) => sum + v.inquiries.unanswered,
    0,
  );
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Nationwide launch · all 25 districts
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          Help real vendors get ready
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Work through manageable batches of 25 businesses. Help vendors finish
          their profiles, review their public pages together, and learn from
          real customer enquiries.
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          This is a read-only support view. It does not recruit vendors, send
          messages, approve applications, or restrict district coverage.
        </p>
      </section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="space-y-2 text-sm font-medium">
          District
          <select
            aria-label="District"
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setPage(1);
            }}
            className="block min-h-11 w-64 max-w-full rounded-xl border border-slate-200 bg-white px-3"
          >
            <option value="">All districts</option>
            {SRI_LANKA_DISTRICTS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <Link
          href="/admin/vendors/approvals"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
        >
          Review applications <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {loading ? (
        <p role="status" className="rounded-2xl border bg-white p-6">
          Loading launch support…
        </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-white p-6"
        >
          <p>
            We couldn’t load launch support. This is not an empty vendor list.
          </p>
          <Button className="mt-3" onClick={() => setRetry((v) => v + 1)}>
            Try again
          </Button>
        </div>
      ) : (
        overview && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Vendors in this batch",
                  value: vendors.length,
                  icon: Users,
                },
                {
                  label: "Profiles needing help in this batch",
                  value: needsHelp,
                  icon: MapPin,
                },
                {
                  label: "Unanswered enquiries in this batch",
                  value: unanswered,
                  icon: MessageSquare,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl border bg-white p-5">
                  <Icon className="h-5 w-5 text-amber-600" />
                  <p className="mt-3 text-3xl font-semibold">{value}</p>
                  <p className="mt-2 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs leading-5 text-slate-500">
              Enquiry figures cover enquiries received in the last{" "}
              {overview.windowDays} days, using each enquiry’s latest recorded
              vendor action. Ordinary chat replies are not counted as enquiry
              actions. Profile checks are guidance, not verification or
              approval.
            </p>
            {!vendors.length ? (
              <div className="rounded-2xl border bg-white p-6">
                No registered businesses in this selection yet. Invite real
                vendors through your usual channels; do not create placeholder
                profiles.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {vendors.map((v) => (
                  <article
                    key={v.id}
                    className="min-w-0 rounded-2xl border bg-white p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="break-words text-lg font-semibold">
                        {v.name}
                      </h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                        {v.vendorStatus.toLowerCase()} ·{" "}
                        {v.status.toLowerCase()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      {v.category} ·{" "}
                      {[v.city, v.district].filter(Boolean).join(", ") ||
                        "Location missing"}
                    </p>
                    <h3 className="mt-5 text-sm font-semibold">
                      Next support step
                    </h3>
                    {v.missing.length ? (
                      <>
                        <p className="mt-2 text-sm text-slate-600">
                          Help the vendor complete:
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {v.missing.map((item) => (
                            <li
                              key={item}
                              className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-slate-600">
                        Basic profile details are present. Review the customer
                        preview with the vendor before they publish.
                      </p>
                    )}
                    <dl className="mt-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                      {[
                        ["Received", v.inquiries.received],
                        ["Unanswered", v.inquiries.unanswered],
                        ["Replied", v.inquiries.replied],
                        ["More details requested", v.inquiries.needsDetails],
                        ["Declined", v.inquiries.declined],
                      ].map(([label, value]) => (
                        <div
                          key={String(label)}
                          className="rounded-lg bg-slate-50 p-3"
                        >
                          <dt className="text-xs text-slate-500">{label}</dt>
                          <dd className="mt-1 font-semibold">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    {v.inquiries.unanswered > 0 && (
                      <p className="mt-3 text-xs leading-5 text-amber-800">
                        Ask the vendor to open Messages and reply, request more
                        details, or decline each enquiry.
                      </p>
                    )}
                    {v.status === "ACTIVE" && v.vendorStatus === "APPROVED" && (
                      <Link
                        href={`/business/${encodeURIComponent(v.id)}`}
                        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
                      >
                        View public profile <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p>
                {overview.total} businesses in this selection · batch{" "}
                {overview.page} of{" "}
                {Math.max(1, Math.ceil(overview.total / overview.pageSize))}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous batch
                </Button>
                <Button
                  variant="outline"
                  disabled={page * overview.pageSize >= overview.total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next batch
                </Button>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
