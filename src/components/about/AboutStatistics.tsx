"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const metrics = [
  { key: "registeredVendors", label: "Registered vendors" },
  { key: "customerAccounts", label: "Customer accounts" },
  { key: "publishedVendors", label: "Published vendor pages" },
  { key: "serviceCategories", label: "Service categories" },
] as const;
type Statistics = Record<(typeof metrics)[number]["key"], number>;

export function AboutStatistics() {
  const [data, setData] = useState<Statistics | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let fetching = false;
    async function refresh() {
      if (fetching) return;
      fetching = true;
      try {
        const response = await api.get("/discovery/statistics", {
          timeout: 15000,
        });
        if (
          !metrics.every(
            ({ key }) =>
              Number.isSafeInteger(response.data?.[key]) &&
              response.data[key] >= 0,
          )
        )
          throw new Error("Invalid statistics");
        if (active) {
          setData(response.data);
          setFailed(false);
        }
      } catch {
        if (active) {
          setData(null);
          setFailed(true);
        }
      } finally {
        fetching = false;
      }
    }
    void refresh();
    const refreshVisible = () => {
      if (!document.hidden) void refresh();
    };
    const timer = window.setInterval(refreshVisible, 60000);
    window.addEventListener("focus", refreshVisible);
    document.addEventListener("visibilitychange", refreshVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshVisible);
      document.removeEventListener("visibilitychange", refreshVisible);
    };
  }, [attempt]);

  return (
    <section
      className="public-page-band py-16 border-y"
      aria-label="Marketplace statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                {data ? data[stat.key].toLocaleString("en-LK") : "—"}
              </div>
              <div className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
        <p role="status" className="mt-6 text-center text-xs text-slate-500">
          {failed ? (
            <>
              Statistics are temporarily unavailable.{" "}
              <button
                type="button"
                onClick={() => setAttempt((value) => value + 1)}
                className="min-h-11 underline"
              >
                Try again
              </button>
            </>
          ) : data ? (
            "Based on current active accounts and published pages. Updates automatically."
          ) : (
            "Loading current statistics…"
          )}
        </p>
      </div>
    </section>
  );
}
