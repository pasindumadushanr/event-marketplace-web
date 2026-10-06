"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

type Activity = {
  id: string;
  actorName: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  summary: string;
  createdAt: string;
};
type History = {
  total: number;
  page: number;
  pageSize: number;
  items: Activity[];
};
export default function AdminActivityPage() {
  const { user } = useAuth();
  const allowed = ["ADMIN", "SUPER_ADMIN"].includes(user?.roleName || "");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<History | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!allowed) return;
    let active = true;
    setLoading(true);
    setError(false);
    setData(null);
    api
      .get<History>("/admin/activity", { params: { page } })
      .then((res) => {
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
  }, [allowed, page, retry]);
  if (!allowed) return null;
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Admin activity history</h1>
        <p className="mt-2 text-sm text-slate-500">
          A read-only record of application decisions, account status changes,
          and platform setting updates. Recording begins with this release;
          secret values are never shown.
        </p>
      </div>
      {loading ? (
        <p role="status">Loading activity…</p>
      ) : error ? (
        <div role="alert" className="rounded-xl border bg-white p-5">
          <p>We couldn’t load activity history. Please try again.</p>
          <Button className="mt-3" onClick={() => setRetry((v) => v + 1)}>
            Try again
          </Button>
        </div>
      ) : (
        data && (
          <>
            {!data.items.length ? (
              <p className="rounded-xl border bg-white p-5">
                No activity recorded yet.
              </p>
            ) : (
              <ol className="space-y-3">
                {data.items.map((item) => (
                  <li key={item.id} className="rounded-xl border bg-white p-5">
                    <div className="flex flex-wrap justify-between gap-2">
                      <h2 className="font-semibold">{item.actorName}</h2>
                      <time
                        dateTime={item.createdAt}
                        className="text-xs text-slate-500"
                      >
                        {new Intl.DateTimeFormat("en-LK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Asia/Colombo",
                        }).format(new Date(item.createdAt))}{" "}
                        · Sri Lanka time
                      </time>
                    </div>
                    <p className="mt-2 text-sm">{item.summary}</p>
                    <p className="mt-2 break-all text-xs text-slate-500">
                      {item.action} · {item.targetType}: {item.targetId}
                    </p>
                  </li>
                ))}
              </ol>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p>
                {data.total} recorded actions · page {page}
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
