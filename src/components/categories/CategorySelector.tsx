"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { BusinessCategory, categoryPath } from "@/lib/categories";

export function CategorySelector({
  value,
  slug,
  onChange,
  required = false,
}: {
  value: string;
  slug?: string;
  onChange: (id: string) => void;
  required?: boolean;
}) {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    api
      .get("/business-categories")
      .then(({ data }) => setCategories(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);
  const selectedId = value || categories.find((item) => item.slug === slug)?.id || '';
  const path = categoryPath(categories, selectedId);
  return (
    <fieldset className="space-y-3 min-w-0">
      <legend className="mb-2 text-sm font-semibold">
        Business category{required ? " *" : ""}
      </legend>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          Categories could not load. Refresh to try again. Your current
          selection has not changed.
        </p>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading categories…</p>
      ) : (
        <>
          {value && !path.length && (
            <p className="text-xs text-amber-700">
              Your existing category is no longer offered. You can keep it or
              choose a new category below.
            </p>
          )}
          {[0, 1, 2].map((depth) => {
            if (depth > 0 && !path[depth - 1]) return null;
            const parentId = depth === 0 ? null : path[depth - 1].id;
            const options = categories.filter(
              (item) =>
                (item.parentId || null) === parentId &&
                (!item.status || item.status === "ACTIVE"),
            );
            if (!options.length) return null;
            return (
              <label key={depth} className="block space-y-1 text-sm">
                <span>
                  {
                    [
                      "Main category",
                      "Subcategory (optional)",
                      "Specific service (optional)",
                    ][depth]
                  }
                </span>
                <select
                  className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
                  value={path[depth]?.id || ""}
                  required={required && depth === 0 && !value}
                  onChange={(event) =>
                    onChange(event.target.value || parentId || "")
                  }
                >
                  <option value="">
                    {depth === 0
                      ? "Choose a main category"
                      : "Keep the broader category"}
                  </option>
                  {options.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
          {!!path.length && (
            <p className="text-xs text-slate-500" aria-live="polite">
              Selected: {path.map((item) => item.name).join(" → ")}
            </p>
          )}
        </>
      )}
    </fieldset>
  );
}
