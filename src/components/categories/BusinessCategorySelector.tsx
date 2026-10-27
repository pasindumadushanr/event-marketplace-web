"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  BusinessCategory,
  categoryPath,
  orderedCategories,
} from "@/lib/categories";
import { CategorySelector } from "./CategorySelector";

export function BusinessCategorySelector({
  categoryId,
  categoryIds,
  onChange,
  required = false,
}: {
  categoryId: string;
  categoryIds: string[];
  onChange: (selection: { categoryId: string; categoryIds: string[] }) => void;
  required?: boolean;
}) {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    let active = true;
    api
      .get("/business-categories")
      .then(({ data }) => {
        if (active) {
          setCategories(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);
  const selected = [...new Set([categoryId, ...categoryIds].filter(Boolean))];
  const extras = selected.filter((id) => id !== categoryId);
  const options = orderedCategories(categories).filter(
    ({ category }) =>
      category.id !== categoryId &&
      categoryPath(categories, category.id)
        .map((item) => item.name)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  function toggle(id: string) {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    onChange({ categoryId, categoryIds: next });
  }
  return (
    <div className="space-y-5" data-testid="business-category-selector">
      <CategorySelector
        value={categoryId}
        required={required}
        onChange={(id) =>
          onChange({
            categoryId: id,
            categoryIds: [...new Set([id, ...extras].filter(Boolean))],
          })
        }
      />
      <fieldset className="min-w-0 rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5 space-y-3">
        <legend className="px-1 text-sm font-semibold text-slate-900">
          Additional categories (optional)
        </legend>
        <p className="text-sm text-slate-600">
          Offer more than one service? Select other categories, such as
          Photography and Videography. Your business can appear in each selected
          category.
        </p>
        {status === "loading" ? (
          <p className="text-sm text-slate-500">
            Loading additional categories…
          </p>
        ) : status === "error" ? (
          <p role="alert" className="text-sm text-red-700">
            Additional categories could not load. Refresh to try again. Your
            selections have not changed.
          </p>
        ) : (
          <>
            {extras.length > 0 && (
              <div
                className="flex flex-wrap gap-2"
                aria-label="Selected additional categories"
              >
                {extras.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    aria-label={`Remove ${categories.find((item) => item.id === id)?.name || "unavailable category"}`}
                    className="max-w-full rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-950 break-words text-left"
                  >
                    {categories.find((item) => item.id === id)?.name ||
                      "Unavailable category"}{" "}
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}
            <label className="block text-sm font-medium text-slate-700">
              Find another category
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. Videography"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-normal"
              />
            </label>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-stone-200 bg-white p-2 space-y-1">
              {options.map(({ category }) => (
                <label
                  key={category.id}
                  className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-stone-50 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(category.id)}
                    disabled={
                      !selected.includes(category.id) &&
                      selected.length >= (categoryId ? 10 : 9)
                    }
                    onChange={() => toggle(category.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-800"
                  />
                  <span className="min-w-0 break-words">
                    {categoryPath(categories, category.id)
                      .map((item) => item.name)
                      .join(" → ")}
                  </span>
                </label>
              ))}
              {!options.length && (
                <p className="p-3 text-sm text-slate-500">
                  No matching categories.
                </p>
              )}
            </div>
          </>
        )}
        <p className="text-xs text-slate-500" aria-live="polite">
          {selected.length} of 10 categories selected, including your main
          category.
        </p>
      </fieldset>
    </div>
  );
}
