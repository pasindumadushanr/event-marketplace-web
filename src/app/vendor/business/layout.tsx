"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Eye, LayoutGrid } from "lucide-react";
import { businessSections } from "@/components/vendor/business-sections";

export default function BusinessManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const section = businessSections.find((item) => item.href === pathname);
  return (
    <div className="business-editor space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/vendor/business"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#36564c]"
        >
          {section ? (
            <ArrowLeft className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
          {section ? "All business sections" : "My Business Page"}
        </Link>
        <Link
          href="/vendor/preview"
          className="inline-flex items-center gap-2 rounded-xl border border-[#dce5db] bg-white px-4 py-2.5 text-xs font-semibold text-[#36564c]"
        >
          <Eye className="h-4 w-4" />
          Edit profile visually
        </Link>
      </div>
      {section && (
        <div className="business-editor-toolbar">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8eee5] text-[#446b50]">
              <section.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[.15em] text-slate-500">
                {section.group}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#183e38]">
                {section.title}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <label
              htmlFor="business-section"
              className="mb-1 block text-[11px] font-medium text-slate-500"
            >
              Jump to another section
            </label>
            <select
              id="business-section"
              value={pathname}
              onChange={(event) => {
                if (
                  window.dispatchEvent(
                    new Event("vendor:before-navigate", { cancelable: true }),
                  )
                )
                  router.push(event.target.value);
              }}
              className="w-full rounded-lg border border-[#dce5db] bg-white px-3 py-2 text-sm text-slate-700"
            >
              {["Essentials", "Showcase your business", "More options"].map(
                (group) => (
                  <optgroup key={group} label={group}>
                    {businessSections
                      .filter((item) => item.group === group)
                      .map((item) => (
                        <option key={item.key} value={item.href}>
                          {item.title}
                        </option>
                      ))}
                  </optgroup>
                ),
              )}
            </select>
          </div>
        </div>
      )}
      <div className={section ? "business-editor-surface" : ""}>{children}</div>
    </div>
  );
}
