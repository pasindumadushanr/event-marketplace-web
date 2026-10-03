"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import api from "@/lib/api";

type Booking = {
  id: string;
  date: string;
  status: string;
  package?: { name: string };
  customer?: { firstName: string; lastName: string };
};
type Conversation = {
  customerId: string;
  messages?: { senderId: string; isRead: boolean }[];
};

export function DailyOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/bookings/vendor"),
      api.get("/chat/conversations?mode=vendor"),
    ])
      .then(([bookingsResponse, messagesResponse]) => {
        if (!active) return;
        setBookings(bookingsResponse.data);
        setMessages(messagesResponse.data);
        setError(false);
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
  }, [attempt]);
  const pending = bookings.filter((booking) => booking.status === "PENDING");
  const needsReply = messages.filter(
    (conversation) =>
      conversation.messages?.[0]?.senderId === conversation.customerId,
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = bookings
    .filter(
      (booking) =>
        booking.status === "CONFIRMED" && new Date(booking.date) >= today,
    )
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .slice(0, 4);
  return (
    <section className="space-y-4" aria-label="Daily overview">
      <h2 className="text-xl font-semibold text-slate-900">
        Needs your attention
      </h2>
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
        >
          We couldn’t load your latest activity.{" "}
          <button
            className="underline font-semibold"
            onClick={() => {
              setLoading(true);
              setAttempt((value) => value + 1);
            }}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                href: "/vendor/bookings",
                title: "New booking requests",
                value: pending.length,
                hint: "Review requests and confirm dates",
                icon: CalendarDays,
              },
              {
                href: "/vendor/messages",
                title: "Conversations to reply to",
                value: needsReply.length,
                hint: "Customers who sent the latest message",
                icon: MessageCircle,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center justify-between">
                  <item.icon className="h-6 w-6 text-primary" />
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                </div>
                <p className="mt-4 text-4xl font-bold text-slate-900">
                  {loading ? "…" : item.value}
                </p>
                <h3 className="mt-1 font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{item.hint}</p>
              </Link>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex justify-between gap-3">
              <h2 className="font-semibold text-slate-900">
                Upcoming bookings
              </h2>
              <Link
                href="/vendor/calendar"
                className="text-sm font-medium text-primary underline"
              >
                View availability
              </Link>
            </div>
            {loading ? (
              <p className="py-6 text-slate-500">Loading your bookings…</p>
            ) : upcoming.length ? (
              <ul className="mt-3 divide-y divide-slate-100">
                {upcoming.map((booking) => (
                  <li key={booking.id}>
                    <Link
                      href="/vendor/bookings"
                      className="flex flex-wrap items-center justify-between gap-2 py-4"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {booking.package?.name || "Event booking"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.customer?.firstName}{" "}
                          {booking.customer?.lastName}
                        </p>
                      </div>
                      <time
                        className="text-sm text-slate-600"
                        dateTime={booking.date}
                      >
                        {new Date(booking.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-slate-500">
                No upcoming confirmed bookings. New customer requests will
                appear above.
              </p>
            )}
          </div>
        </>
      )}
      <div className="flex flex-wrap gap-3">
        {[
          ["/vendor/packages", "Manage services & prices"],
          ["/vendor/gallery", "Add photos"],
          ["/vendor/business/general", "Edit business details"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-primary"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
