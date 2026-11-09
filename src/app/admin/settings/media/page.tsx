"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Provider = {
  status: "ok" | "not_configured" | "unavailable" | "pending";
  level: "normal" | "warning" | "critical" | "unknown";
  message: string;
  storageBytes: number | null;
  reportedAt: string | null;
};
type Overview = {
  checkedAt: string;
  cacheSeconds: number;
  uploadMode: string;
  invitationUploadMode?: string;
  cloudinary: Provider & {
    cloudName: string | null;
    plan: string | null;
    bandwidthBytes: number | null;
    transformations: number | null;
    creditsUsed: number | null;
    creditsAllowance: number | null;
    creditsRemaining: number | null;
  };
  r2: Provider & {
    bucket: string | null;
    objects: number | null;
    freeStorageReferenceBytes: number;
    bucketHeadroomBytes: number | null;
  };
};
function bytes(value: number | null) {
  if (value === null) return "Not available";
  if (value === 0) return "0 B";
  const index = Math.min(3, Math.floor(Math.log(value) / Math.log(1000)));
  return `${(value / 1000 ** index).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${["B", "KB", "MB", "GB"][index]}`;
}
function amount(value: number | null) {
  return value === null
    ? "Not available"
    : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
function timestamp(value: string | null) {
  return value && Number.isFinite(Date.parse(value))
    ? new Date(value).toLocaleString()
    : "Not supplied";
}
function Meter({
  used,
  allowance,
  label,
}: {
  used: number | null;
  allowance: number | null;
  label: string;
}) {
  if (used === null || !allowance) return null;
  const percent = (used / allowance) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-3 text-sm">
        <span>{label}</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, percent)}
        aria-valuetext={`${percent.toFixed(1)}%`}
        className="h-2 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className={`h-full rounded-full ${percent >= 95 ? "bg-red-500" : percent >= 80 ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
}
function Status({ provider }: { provider: Provider }) {
  const text =
    provider.status === "not_configured"
      ? "Monitoring not connected"
      : provider.status === "unavailable"
        ? "Usage unavailable"
        : provider.status === "pending"
          ? "Awaiting report"
          : {
              normal: "Within reference allowance",
              warning: "Plan more capacity",
              critical: "Review capacity now",
              unknown: "Allowance not reported",
            }[provider.level];
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${provider.status !== "ok" || provider.level === "unknown" ? "bg-slate-100 text-slate-700" : provider.level === "critical" ? "bg-red-50 text-red-700" : provider.level === "warning" ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}
    >
      {text}
    </span>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export default function MediaStoragePage() {
  const { user, isLoading } = useAuth();
  const allowed =
    user?.roleName === "ADMIN" || user?.roleName === "SUPER_ADMIN";
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (!allowed) return;
    let active = true;
    api
      .get<Overview>("/admin/media-usage", { timeout: 25000 })
      .then(({ data: response }) => {
        if (active) setData(response);
      })
      .catch(() => {
        if (active) {
          setError(true);
          setData(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [allowed, refresh]);
  if (isLoading) return <p role="status">Loading account…</p>;
  if (!allowed)
    return <p role="alert">Media usage is available to administrators only.</p>;
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Media storage</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Monitor Cloudinary and R2 usage to plan capacity for vendor photos
            and other media.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setError(false);
            setRefresh((v) => v + 1);
          }}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Refresh usage
        </button>
      </div>
      {loading && <p role="status">Checking media usage…</p>}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
        >
          Could not load media usage. Select Refresh usage to try again.
        </p>
      )}
      {!loading && data && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <p>
              <strong className="text-slate-900">
                Configured upload destination:
              </strong>{" "}
              {(
                {
                  cloudinary: "Cloudinary",
                  r2: "R2",
                  "cloudinary-r2-fallback":
                    "Cloudinary first, R2 on upload quota errors",
                } as Record<string, string>
              )[data.uploadMode] || "Unknown"}
            </p>
            <p className="mt-1">
              <strong className="text-slate-900">Invitation images:</strong>{" "}
              {(
                {
                  cloudinary: "Cloudinary",
                  r2: "R2 (public images)",
                  "cloudinary-r2-fallback":
                    "Cloudinary first, R2 on upload quota errors",
                } as Record<string, string>
              )[data.invitationUploadMode || data.uploadMode] || "Unknown"}
            </p>
            <p className="mt-1">
              Checked: {timestamp(data.checkedAt)}. Results are cached for up to
              5 minutes; provider reports can be delayed.
            </p>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <section
              aria-labelledby="cloudinary-heading"
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="cloudinary-heading" className="text-xl font-bold">
                  Cloudinary
                </h2>
                <Status provider={data.cloudinary} />
              </div>
              <p className="text-sm text-slate-600">
                {data.cloudinary.cloudName || "Account not connected"}
                {data.cloudinary.plan ? ` · ${data.cloudinary.plan}` : ""}
              </p>
              <p className="text-sm text-slate-700">
                {data.cloudinary.message}
              </p>
              {data.cloudinary.status === "ok" && (
                <>
                  <Meter
                    used={data.cloudinary.creditsUsed}
                    allowance={data.cloudinary.creditsAllowance}
                    label="Shared credits used"
                  />
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <Metric
                      label="Storage used"
                      value={bytes(data.cloudinary.storageBytes)}
                    />
                    <Metric
                      label="Credits remaining"
                      value={amount(data.cloudinary.creditsRemaining)}
                    />
                    <Metric
                      label="Credits used / allowance"
                      value={`${amount(data.cloudinary.creditsUsed)} / ${amount(data.cloudinary.creditsAllowance)}`}
                    />
                    <Metric
                      label="Reported delivery usage"
                      value={bytes(data.cloudinary.bandwidthBytes)}
                    />
                    <Metric
                      label="Reported transformations"
                      value={amount(data.cloudinary.transformations)}
                    />
                  </dl>
                  <p className="text-sm text-slate-600">
                    Cloudinary has a shared credit budget for storage, delivery
                    and processing. Remaining credits are not remaining
                    gigabytes.
                  </p>
                  <p className="text-xs text-slate-500">
                    Provider report: {timestamp(data.cloudinary.reportedAt)}
                  </p>
                </>
              )}
              <a
                href="https://console.cloudinary.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-blue-700 underline"
              >
                Open Cloudinary dashboard
              </a>
            </section>
            <section
              aria-labelledby="r2-heading"
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="r2-heading" className="text-xl font-bold">
                  Cloudflare R2
                </h2>
                <Status provider={data.r2} />
              </div>
              <p className="text-sm text-slate-600">
                {data.r2.bucket || "Bucket not connected"}
              </p>
              <p className="text-sm text-slate-700">{data.r2.message}</p>
              {data.r2.status === "ok" && (
                <>
                  <Meter
                    used={data.r2.storageBytes}
                    allowance={data.r2.freeStorageReferenceBytes}
                    label="Bucket usage vs 10 GB reference"
                  />
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <Metric
                      label="Reported bucket storage"
                      value={bytes(data.r2.storageBytes)}
                    />
                    <Metric
                      label="Objects stored"
                      value={amount(data.r2.objects)}
                    />
                    <Metric
                      label="Standard free allowance reference"
                      value={bytes(data.r2.freeStorageReferenceBytes)}
                    />
                    <Metric
                      label="Bucket headroom vs reference"
                      value={bytes(data.r2.bucketHeadroomBytes)}
                    />
                  </dl>
                  <p className="text-sm text-slate-600">
                    R2 can grow beyond 10 GB with usage charges. Other buckets
                    share the account allowance. Monthly averaged storage and
                    upload/read requests affect the bill; check Cloudflare for
                    account totals and billing.
                  </p>
                  <p className="text-xs text-slate-500">
                    Provider report: {timestamp(data.r2.reportedAt)}
                  </p>
                </>
              )}
              <a
                href="https://dash.cloudflare.com/?to=/:account/r2/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-blue-700 underline"
              >
                Open R2 dashboard
              </a>
            </section>
          </div>
          <p className="text-sm text-slate-600">
            Planning alerts appear at 80% and 95% of the reported credit
            allowance or bucket storage reference. Provider dashboards remain
            the source for final usage and billing.
          </p>
        </>
      )}
    </div>
  );
}
