"use client";

import { useId, useState } from "react";
import { Plus, X } from "lucide-react";

export function CustomCategoryRequests({
  value,
  onChange,
}: {
  value: string[];
  onChange: (names: string[]) => void;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState<boolean | null>(null);
  // Saved settings arrive asynchronously; reveal existing requests after loading.
  const expanded = open ?? value.length > 0;
  function add() {
    const next = name.normalize("NFC").trim().replace(/\s+/gu, " ");
    if (
      next.length < 2 ||
      next.length > 80 ||
      /[<>\u0000-\u001f\u007f]/u.test(next)
    ) {
      setError("Enter a category name between 2 and 80 characters.");
      return;
    }
    if (value.some((item) => item.toLowerCase() === next.toLowerCase())) {
      setError("You already added this category.");
      return;
    }
    if (value.length >= 5) {
      setError("You can request up to 5 categories.");
      return;
    }
    onChange([...value, next]);
    setName("");
    setError("");
  }
  return (
    <section className="min-w-0 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setOpen(!expanded)}
        aria-expanded={expanded}
        aria-controls={id}
        className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm font-semibold text-emerald-950"
      >
        Can’t find your category?
        <Plus
          aria-hidden="true"
          size={18}
          className={expanded ? "rotate-45 shrink-0" : "shrink-0"}
        />
      </button>
      <div id={id} hidden={!expanded} className="mt-3 space-y-3">
        <p className="text-sm leading-relaxed text-slate-600">
          Choose the closest category above, then add your missing service here.
          Our team will review it. It won’t appear as a public category yet.
        </p>
        {value.length > 0 && (
          <ul
            aria-label="Requested categories"
            className="flex flex-wrap gap-2"
          >
            {value.map((item) => (
              <li
                key={item}
                className="flex max-w-full items-center gap-2 rounded-xl border border-emerald-200 bg-white pl-3 text-sm text-emerald-950"
              >
                <span className="min-w-0 break-words">{item}</span>
                <button
                  type="button"
                  aria-label={`Remove requested category ${item}`}
                  onClick={() =>
                    onChange(value.filter((name) => name !== item))
                  }
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-emerald-100"
                >
                  <X aria-hidden="true" size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {value.length < 5 && (
          <div className="space-y-2">
            <label
              htmlFor={`${id}-name`}
              className="block text-sm font-medium text-slate-800"
            >
              Custom category
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id={`${id}-name`}
                value={name}
                maxLength={80}
                placeholder="e.g. Wedding invitation designer"
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    add();
                  }
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={`${id}-feedback`}
                className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              />
              <button
                type="button"
                onClick={add}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 text-sm font-semibold text-white"
              >
                <Plus aria-hidden="true" size={16} /> Add category
              </button>
            </div>
          </div>
        )}
        <p
          id={`${id}-feedback`}
          role={error ? "alert" : "status"}
          className={`text-xs ${error ? "text-red-700" : "text-slate-500"}`}
        >
          {error ||
            `${value.length} of 5 custom categories added. Click Add category before continuing.`}
        </p>
      </div>
    </section>
  );
}
