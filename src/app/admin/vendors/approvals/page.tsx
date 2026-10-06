"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { SRI_LANKA_DISTRICTS } from "@/lib/districts";
import { BusinessCategory, categoryPath } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Search, Clock, ArrowUpRight, FileCheck2 } from "lucide-react";
import {
  ApplicationSummary,
  reviewDate,
  statusLabel,
  WaitingBadge,
} from "@/components/admin/application-review";

type Queue = {
  items: ApplicationSummary[];
  total: number;
  pageSize: number;
  counts: { pending: number; approved: number; rejected: number };
};
const emptyFilters = { q: "", district: "", categoryId: "", from: "", to: "" };
export default function VendorApprovalsPage() {
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);
  const [status, setStatus] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Queue | null>(null);
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [categoryError, setCategoryError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    api
      .get("/business-categories")
      .then((res) => {
        setCategories(res.data);
        setCategoryError(false);
      })
      .catch(() => setCategoryError(true));
  }, [retry]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setData(null);
    api
      .get("/admin/vendors/applications", {
        params: { ...filters, status, page, workspace: "1" },
      })
      .then((res) => {
        if (Array.isArray(res.data))
          throw new Error("Workspace backend not deployed");
        if (active) setData(res.data);
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
  }, [filters, status, page, retry]);
  const field =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm";
  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
            Review workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Vendor applications
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Review the oldest submissions first. Ask for missing information,
            keep private notes, and make clear decisions.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="xl:hidden"
          aria-controls="application-filters"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((value) => !value)}
        >
          Filters
          {Object.values(filters).filter(Boolean).length > 0
            ? ` (${Object.values(filters).filter(Boolean).length})`
            : ""}
        </Button>
        <div className="hidden rounded-2xl bg-teal-50 p-4 text-teal-800 sm:block">
          <FileCheck2 className="h-7 w-7" />
        </div>
      </header>
      <form
        aria-label="Application filters"
        id="application-filters"
        className={`${filtersOpen ? "block" : "hidden"} rounded-2xl border bg-white p-4 sm:p-6 xl:block`}
        onSubmit={(event) => {
          event.preventDefault();
          setFilters({ ...draft });
          setPage(1);
          setFiltersOpen(false);
        }}
      >
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <label className="text-xs font-medium text-slate-600">
            Search business or vendor
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                aria-label="Search applications"
                maxLength={150}
                className={field + " pl-9"}
                placeholder="Name, email or phone"
                value={draft.q}
                onChange={(e) => setDraft({ ...draft, q: e.target.value })}
              />
            </div>
          </label>
          <label className="text-xs font-medium text-slate-600">
            District
            <select
              aria-label="District"
              className={field + " mt-2"}
              value={draft.district}
              onChange={(e) => setDraft({ ...draft, district: e.target.value })}
            >
              <option value="">All districts</option>
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">
            Category
            <select
              aria-label="Category"
              className={field + " mt-2"}
              value={draft.categoryId}
              onChange={(e) =>
                setDraft({ ...draft, categoryId: e.target.value })
              }
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {categoryPath(categories, c.id)
                    .map((x) => x.name)
                    .join(" › ")}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">
            Submitted from
            <input
              aria-label="Submitted from"
              type="date"
              className={field + " mt-2"}
              value={draft.from}
              max={draft.to || undefined}
              onChange={(e) => setDraft({ ...draft, from: e.target.value })}
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Submitted to
            <input
              aria-label="Submitted to"
              type="date"
              className={field + " mt-2"}
              value={draft.to}
              min={draft.from || undefined}
              onChange={(e) => setDraft({ ...draft, to: e.target.value })}
            />
          </label>
        </div>
        {categoryError && (
          <p role="alert" className="mt-3 text-xs text-amber-800">
            Category options could not load. Other filters still work.{" "}
            <button
              type="button"
              className="underline"
              onClick={() => setRetry((v) => v + 1)}
            >
              Retry
            </button>
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="submit">Apply filters</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDraft(emptyFilters);
              setFilters(emptyFilters);
              setStatus("PENDING");
              setPage(1);
            }}
          >
            Reset filters
          </Button>
        </div>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Application queues"
          className="flex flex-wrap gap-2"
        >
          {[
            { value: "PENDING", label: "Pending", count: data?.counts.pending },
            {
              value: "APPROVED",
              label: "Approved",
              count: data?.counts.approved,
            },
            {
              value: "REJECTED",
              label: "Rejected",
              count: data?.counts.rejected,
            },
          ].map((tab) => {
            const selected =
              status === tab.value ||
              (tab.value === "PENDING" &&
                ["UNDER_REVIEW", "NEEDS_INFO"].includes(status));
            return (
              <button
                role="tab"
                aria-selected={selected}
                key={tab.value}
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className={
                  "rounded-xl px-4 py-2.5 text-sm font-medium " +
                  (selected
                    ? "bg-slate-900 text-white"
                    : "border bg-white text-slate-600")
                }
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 opacity-70">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-500">
          Status
          <select
            aria-label="Application status"
            className="max-w-48 rounded-xl border bg-white p-2 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="PENDING">All pending</option>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="NEEDS_INFO">Needs information</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="ALL">All statuses</option>
          </select>
        </label>
      </div>
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <Clock className="h-4 w-4 shrink-0" />
        Oldest submission first. Older applications use their business creation
        date; resubmissions use the new submission date.
      </p>
      {loading ? (
        <p role="status" className="rounded-2xl border bg-white p-8">
          Loading applications…
        </p>
      ) : error ? (
        <div role="alert" className="rounded-2xl border bg-white p-8">
          <p>Applications could not load. Your filters are kept.</p>
          <Button className="mt-4" onClick={() => setRetry((v) => v + 1)}>
            Try again
          </Button>
        </div>
      ) : (
        data && (
          <>
            {!data.items.length ? (
              <div className="rounded-2xl border bg-white p-10 text-center">
                <FileCheck2 className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <h2 className="font-semibold">No matching applications</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different status or clear the filters.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {data.items.map((app) => (
                  <li
                    key={app.id}
                    className="rounded-2xl border bg-white p-5 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="break-words text-lg font-semibold">
                            {app.name}
                          </h2>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                            {statusLabel(app.vendorStatus)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {app.category?.name} ·{" "}
                          {[app.city, app.district]
                            .filter(Boolean)
                            .join(", ") || "Location not provided"}
                        </p>
                        <p className="mt-2 break-all text-sm">
                          {app.vendor.firstName} {app.vendor.lastName}{" "}
                          <span className="text-slate-500">
                            · {app.vendor.email}
                          </span>
                        </p>
                      </div>
                      <WaitingBadge application={app} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                      <p className="text-xs text-slate-500">
                        Submitted {reviewDate(app.submittedAt || app.createdAt)}{" "}
                        · {app._count?.documents || 0} documents ·{" "}
                        {app._count?.galleries || 0} gallery items
                      </p>
                      <Link
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-900 px-4 py-2.5 text-sm font-medium text-white"
                        href={"/admin/vendors/approvals/" + app.id}
                      >
                        Review application
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
              <p>
                {data.total} matches · Page {page}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((v) => v - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page * data.pageSize >= data.total}
                  onClick={() => setPage((v) => v + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )
      )}
    </section>
  );
}
