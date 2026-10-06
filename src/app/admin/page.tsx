"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  Store,
  CalendarCheck,
  Wallet,
  RefreshCw,
  ArrowUpRight,
  ArrowRight,
  ClipboardCheck,
  Headphones,
  ShieldCheck,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDistanceToNow } from "date-fns";

type Stats = {
  totalUsers: number;
  activeVendors: number;
  completedBookings: number;
  platformRevenue: number | null;
  chartData: { name: string; total: number }[];
  recentSignups: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  }[];
};
const shortcuts = [
  {
    href: "/admin/vendors/approvals",
    title: "Review applications",
    description: "Approve vendors or request missing details.",
    icon: ClipboardCheck,
    color: "bg-amber-50 text-amber-700",
  },
  {
    href: "/admin/launch",
    title: "Help vendors launch",
    description: "Guide businesses toward a complete profile.",
    icon: Store,
    color: "bg-teal-50 text-teal-700",
  },
  {
    href: "/admin/support",
    title: "Customer support",
    description: "Follow up on questions in your inbox.",
    icon: Headphones,
    color: "bg-sky-50 text-sky-700",
  },
];
function Metric({
  title,
  value,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  color: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex size-11 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
        {href && (
          <ArrowUpRight
            size={17}
            aria-hidden="true"
            className="text-slate-300 transition group-hover:text-teal-700"
          />
        )}
      </div>
      <p className="mt-5 text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 break-words text-[28px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </>
  );
  const style =
    "group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/20";
  return href ? (
    <Link
      href={href}
      className={`${style} transition hover:border-teal-300 hover:shadow-md`}
    >
      {content}
    </Link>
  ) : (
    <div className={style}>{content}</div>
  );
}
export default function AdminOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const fetchStats = useCallback(
    () =>
      api
        .get<Stats>("/admin/dashboard/stats")
        .then((res) => {
          setStats(res.data);
          setUpdatedAt(new Date());
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false)),
    [],
  );
  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);
  function refreshStats() {
    setLoading(true);
    setError(false);
    void fetchStats();
  }
  return (
    <div className="space-y-7" data-testid="admin-overview">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-700">
            Your marketplace, at a glance
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Keep your vendors moving and your customers supported.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={refreshStats}
          className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing" : "Refresh overview"}
        </button>
      </div>

      <section
        className="relative overflow-hidden rounded-2xl bg-[#173945] p-6 text-white sm:p-8"
        aria-label="Vendor review workspace"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-28 size-80 rounded-full border-[40px] border-white/5"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200">
              <span className="size-1.5 rounded-full bg-amber-200" />
              Start here
            </span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
              Great businesses start with your review.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Check the oldest applications first, ask for missing information,
              and help real vendors take their next step.
            </p>
          </div>
          <Link
            href="/admin/vendors/approvals"
            className="inline-flex min-h-11 items-center gap-3 rounded-xl bg-[#e8c776] px-5 text-sm font-semibold text-[#20343c] transition hover:bg-amber-200"
          >
            Open vendor approvals
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle size={19} />
          <p className="flex-1">
            {stats
              ? "Couldn’t refresh the overview. The figures below are from the last successful load."
              : "We couldn’t load your overview. Please try again."}
          </p>
          <button
            type="button"
            onClick={refreshStats}
            disabled={loading}
            className="min-h-10 rounded-lg border border-red-200 px-3 font-semibold"
          >
            Try again
          </button>
        </div>
      )}
      {loading && !stats ? (
        <div
          role="status"
          aria-label="Loading dashboard statistics"
          className="grid grid-cols-2 gap-4 xl:grid-cols-4"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
          <span className="sr-only">Loading dashboard statistics…</span>
        </div>
      ) : (
        stats && (
          <>
            <section
              aria-label="Marketplace statistics"
              className={`grid grid-cols-2 gap-3 sm:gap-5 ${stats.platformRevenue !== null ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}
            >
              <Metric
                title="Total users"
                value={stats.totalUsers.toLocaleString()}
                description="Registered accounts"
                icon={Users}
                href="/admin/users"
                color="bg-sky-50 text-sky-700"
              />
              <Metric
                title="Approved vendors"
                value={stats.activeVendors.toLocaleString()}
                description="Approved, not necessarily published"
                icon={Store}
                href="/admin/business"
                color="bg-teal-50 text-teal-700"
              />
              <Metric
                title="Completed bookings"
                value={stats.completedBookings.toLocaleString()}
                description="Successfully delivered"
                icon={CalendarCheck}
                href="/admin/bookings"
                color="bg-violet-50 text-violet-700"
              />
              {stats.platformRevenue !== null && (
                <Metric
                  title="Platform revenue"
                  value={`LKR ${Number(stats.platformRevenue).toLocaleString()}`}
                  description="Calculated commission · 10%"
                  icon={Wallet}
                  color="bg-amber-50 text-amber-700"
                />
              )}
            </section>
            <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <section
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                aria-labelledby="growth-heading"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2
                      id="growth-heading"
                      className="font-semibold text-slate-900"
                    >
                      Growing your community
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      New registrations over the last six months
                    </p>
                  </div>
                  <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-500">
                    6-month overview
                  </span>
                </div>
                {stats.chartData.length ? (
                  <div
                    className="mt-7 h-[260px] min-w-0 sm:h-[290px]"
                    role="img"
                    aria-label={`New user registrations: ${stats.chartData.map((point) => `${point.name}: ${point.total}`).join(", ")}`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={stats.chartData}
                        margin={{ top: 5, right: 8, left: -22, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient
                            id="adminUserGrowth"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#0f766e"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="100%"
                              stopColor="#0f766e"
                              stopOpacity={0.01}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="4 5"
                          vertical={false}
                          stroke="#e8edf1"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                          minTickGap={16}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            borderColor: "#e2e8f0",
                            fontSize: 12,
                          }}
                        />
                        <Area
                          name="New users"
                          type="monotone"
                          dataKey="total"
                          stroke="#0f766e"
                          strokeWidth={3}
                          fill="url(#adminUserGrowth)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="py-20 text-center text-sm text-slate-500">
                    No registration data available yet.
                  </p>
                )}
              </section>
              <section
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                aria-labelledby="signups-heading"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2
                    id="signups-heading"
                    className="font-semibold text-slate-900"
                  >
                    Recently joined
                  </h2>
                  <Link
                    href="/admin/users"
                    className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-teal-700"
                  >
                    View all
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Your newest marketplace members
                </p>
                {!stats.recentSignups.length ? (
                  <p className="py-20 text-center text-sm text-slate-500">
                    No recent signups yet.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-slate-100">
                    {stats.recentSignups.map((person) => (
                      <li
                        key={person.id}
                        className="flex items-center gap-3 py-4"
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500"
                        >
                          {person.firstName?.charAt(0)}
                          {person.lastName?.charAt(0)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {person.firstName} {person.lastName}
                          </p>
                          <p
                            className="truncate text-xs text-slate-500"
                            title={person.email}
                          >
                            {person.email}
                          </p>
                        </div>
                        <time
                          dateTime={person.createdAt}
                          className="max-w-20 text-right text-[10px] leading-relaxed text-slate-400"
                        >
                          {formatDistanceToNow(new Date(person.createdAt), {
                            addSuffix: true,
                          })}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
            {updatedAt && (
              <p className="text-right text-[11px] text-slate-400">
                Last refreshed at{" "}
                {new Intl.DateTimeFormat("en-LK", {
                  timeStyle: "short",
                  timeZone: "Asia/Colombo",
                }).format(updatedAt)}{" "}
                · Sri Lanka time
              </p>
            )}
          </>
        )
      )}
      <section aria-labelledby="tools-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="tools-heading"
            className="text-sm font-semibold text-slate-700"
          >
            Your everyday tools
          </h2>
          <Link
            href="/admin/activity"
            className="flex min-h-10 items-center gap-1.5 text-xs font-medium text-slate-500"
          >
            <ShieldCheck size={15} />
            Activity history
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {shortcuts.map(({ href, title, description, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
            >
              <span className={`rounded-xl p-2.5 ${color}`}>
                <Icon size={19} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="shrink-0 text-slate-300 group-hover:text-teal-700"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
