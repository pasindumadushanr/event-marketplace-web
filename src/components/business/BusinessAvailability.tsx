"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function BusinessAvailability({
  blockedDates = [],
}: {
  blockedDates?: string[];
}) {
  // Calendar structure for visualization
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date();
  const [shown, setShown] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const year = shown.getFullYear();
  const month = shown.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Extract day numbers from blockedDates matching current year & month
  const currentMonthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  const safeDates = Array.isArray(blockedDates) ? blockedDates : [];
  const blockedDaysInMonth = safeDates
    .filter((d) => typeof d === "string" && d.startsWith(currentMonthStr))
    .map((d) => parseInt(d.split("-")[2], 10))
    .filter((n) => !isNaN(n));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" /> Availability
      </h3>

      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={year === today.getFullYear() && month === today.getMonth()}
          onClick={() => setShown(new Date(year, month - 1, 1))}
          className="p-2 disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-slate-700">
          {shown.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setShown(new Date(year, month + 1, 1))}
          className="p-2"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {days.map((day) => (
          <div key={day} className="text-xs font-bold text-slate-400 py-1">
            {day}
          </div>
        ))}

        {/* Empty slots for start of month offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {dates.map((date) => {
          const isBlocked = blockedDaysInMonth.includes(date);
          const isPast =
            new Date(year, month, date) <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <div
              key={date}
              title={
                isPast
                  ? "Past date"
                  : isBlocked
                    ? "Unavailable / Fully booked"
                    : "Available for booking"
              }
              className={`
                h-8 w-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${
                  isPast
                    ? "text-slate-300"
                    : isBlocked
                      ? "bg-rose-100 text-rose-600 font-bold line-through cursor-not-allowed"
                      : "bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
                }
              `}
            >
              {date}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs font-medium px-4">
        <div className="flex items-center gap-1 text-slate-600">
          <div className="h-3 w-3 rounded-full bg-slate-100 border border-slate-200" />{" "}
          Available
        </div>
        <div className="flex items-center gap-1 text-rose-600">
          <div className="h-3 w-3 rounded-full bg-rose-100 border border-rose-200" />{" "}
          Unavailable / Blackout
        </div>
      </div>
    </div>
  );
}
