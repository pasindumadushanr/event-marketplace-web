"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
interface Notice {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string | null;
  createdAt: string;
}
export default function VendorNotificationsPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<Notice[]>("/notifications/me");
      setNotices(data);
    } catch {
      setError("Could not load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    api.get<Notice[]>('/notifications/me')
      .then(({data}) => { if (active) setNotices(data); })
      .catch(() => { if (active) setError('Could not load notifications. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function markRead(id: string) {
    setBusy(id);
    setError("");
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotices((items) =>
        items.map((item) =>
          item.id === id ? { ...item, isRead: true } : item,
        ),
      );
    } catch {
      setError("Could not mark this notification as read. Please try again.");
    } finally {
      setBusy(null);
    }
  }
  return (
    <main className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <p className="text-slate-600">
        Updates from the Nakathata.lk team. Check Messages and Bookings for
        customer activity.
      </p>
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-white p-4"
        >
          {error}{" "}
          <button
            onClick={() => void load()}
            className="min-h-11 px-3 underline"
          >
            Try again
          </button>
        </div>
      )}
      {loading ? (
        <p role="status">Loading notifications…</p>
      ) : !error && !notices.length ? (
        <p className="rounded-xl border bg-white p-6">No notifications yet.</p>
      ) : null}
      {!loading &&
        notices.map((notice) => (
          <article
            key={notice.id}
            className="space-y-3 rounded-xl border bg-white p-5"
          >
            <h2 className="text-lg font-semibold">{notice.title}</h2>
            <p className="whitespace-pre-wrap break-words">{notice.message}</p>
            <p className="text-xs text-slate-500">
              {new Date(notice.createdAt).toLocaleString("en-GB", {
                timeZone: "Asia/Colombo",
              })}{" "}
              · Sri Lanka time
            </p>
            {notice.userId && !notice.isRead ? (
              <button
                disabled={busy !== null}
                onClick={() => void markRead(notice.id)}
                className="min-h-11 rounded-lg border px-4 disabled:opacity-50"
              >
                {busy === notice.id ? "Saving…" : "Mark as read"}
              </button>
            ) : (
              <p className="text-xs text-slate-500">
                {notice.userId ? "Read" : "Announcement"}
              </p>
            )}
          </article>
        ))}
    </main>
  );
}
