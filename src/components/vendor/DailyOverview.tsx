"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  CalendarCheck2,
  ImagePlus,
  Package,
  Settings2,
} from "lucide-react";
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
  const allUpcoming = bookings
    .filter(
      (booking) =>
        booking.status === "CONFIRMED" && new Date(booking.date) >= today,
    )
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  const upcoming = allUpcoming.slice(0, 4);
  return (
    <section className="space-y-4" aria-label="Daily overview">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Needs your attention
        </h2>
        <span className="text-xs text-slate-500">
          Your business at a glance
        </span>
      </div>
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
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/vendor/bookings",
                title: "New booking requests",
                value: pending.length,
                hint: "Review requests and confirm dates",
                icon: CalendarDays,
                tone: "bg-[#fcf2df] text-[#956724]",
              },
              {
                href: "/vendor/messages",
                title: "Conversations to reply to",
                value: needsReply.length,
                hint: "Customers who sent the latest message",
                icon: MessageCircle,
                tone: "bg-[#edf1fa] text-[#526c9f]",
              },
              {
                href: "/vendor/calendar",
                title: "Upcoming bookings",
                value: allUpcoming.length,
                hint: "Confirmed events on your calendar",
                icon: CalendarCheck2,
                tone: "bg-[#eaf2e9] text-[#4f7958]",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="vendor-panel vendor-metric group p-5 sm:p-6 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                </div>
                <p className="mt-5 text-4xl font-semibold tracking-tight text-[#183e38]">
                  {loading ? "…" : item.value}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {item.hint}
                </p>
              </Link>
            ))}
          </div>
          <div className="vendor-panel p-5 sm:p-6">
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
              <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-[#dde5dc] bg-[#fafbf8] px-5 py-8 text-center">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2e9] text-[#64806a]">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-slate-700">
                  Your next event belongs here
                </p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                  No upcoming confirmed bookings. New customer requests will
                  appear above.
                </p>
              </div>
            )}
          </div>
        </>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            href: "/vendor/packages",
            label: "Manage services & prices",
            icon: Package,
            hint: "Keep your offers up to date",
          },
          {
            href: "/vendor/gallery",
            label: "Add photos",
            icon: ImagePlus,
            hint: "Showcase your best work",
          },
          {
            href: "/vendor/business/general",
            label: "Edit business details",
            icon: Settings2,
            hint: "Make a great first impression",
          },
        ].map(({ href, label, icon: Icon, hint }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl border border-transparent bg-[#ecefe8] px-4 py-4 text-sm font-medium text-[#365346] hover:border-[#c6d3c2]"
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold">
              {label}
              <span className="mt-1 block text-[11px] font-normal text-slate-500">
                {hint}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
