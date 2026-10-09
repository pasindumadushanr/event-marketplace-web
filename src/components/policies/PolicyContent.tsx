"use client";

import { useEffect, useState } from "react";
import { PolicyPage } from "@/data/policies";
import { PolicyBody } from "./PolicyBody";
import api from "@/lib/api";

export function PolicyContent({ initial }: { initial: PolicyPage }) {
  const [page, setPage] = useState(initial);
  useEffect(() => {
    let mounted = true;
    const key = `nakathata:published-policy:${initial.slug}`;
    const valid = (value: PolicyPage) =>
      value?.slug === initial.slug &&
      typeof value.title === "string" &&
      typeof value.content === "string" &&
      !!value.updatedAt &&
      Number.isFinite(Date.parse(value.updatedAt));
    try {
      const cached = JSON.parse(localStorage.getItem(key) || "null");
      if (
        valid(cached) &&
        (!initial.updatedAt ||
          Date.parse(cached.updatedAt) > Date.parse(initial.updatedAt))
      )
        queueMicrotask(() => {
          if (mounted) setPage(cached);
        });
      else if (valid(initial))
        localStorage.setItem(key, JSON.stringify(initial));
    } catch {
      /* Optional cache; retain the server-rendered published copy. */
    }
    api
      .get(`/admin/cms/public/pages/${initial.slug}`)
      .then(({ data }) => {
        if (!mounted || !valid(data)) return;
        setPage(data);
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch {
          /* Optional cache. */
        }
      })
      .catch(() => {
        /* Keep the last published copy, not a blank page. */
      });
    return () => {
      mounted = false;
    };
  }, [initial]);

  return (
    <>
      <header className="mb-10 text-center sm:text-left border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
          {page.slug === "privacy-policy"
            ? "Data Protection"
            : "Legal Agreement"}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
          {page.title}
        </h1>
        {page.updatedAt && (
          <p className="text-sm text-slate-500 mt-2">
            Last updated:{" "}
            <time dateTime={page.updatedAt}>
              {new Date(page.updatedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Colombo",
              })}
            </time>
          </p>
        )}
      </header>
      <PolicyBody content={page.content} />
    </>
  );
}
