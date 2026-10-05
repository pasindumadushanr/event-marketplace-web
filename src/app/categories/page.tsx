"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import api from "@/lib/api";
import { BusinessCategory } from "@/lib/categories";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const loadCategories = useCallback(() => {
    return api
      .get("/business-categories")
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('Invalid category response');
        setCategories(data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { void loadCategories(); }, [loadCategories]);
  return (
    <div className="min-h-screen bg-[#f7f8f4]">
      <Navbar solid />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Every detail, together
          </p>
          <h1 className="text-4xl font-semibold text-[#183e38]">
            Find your wedding team
          </h1>
          <p className="mt-4 text-slate-600">
            Explore categories, discover specialist services, and find the right
            professionals for your celebration.
          </p>
        </div>
        {loading && <p role="status">Loading categories…</p>}
        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p>We couldn’t load categories. Please try again.</p>
            <button disabled={loading} onClick={() => { setLoading(true); setError(false); void loadCategories(); }} className="mt-3 rounded-lg bg-[#183e38] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Try again</button>
          </div>
        )}
        {!loading && !error && !categories.length && <p>No categories are available yet. Please check back soon.</p>}
        <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories
            .filter((item) => !item.parentId)
            .map((root, index) => (
              <section
                key={root.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <Link
                  href={`/c/${root.slug}`}
                  className="flex items-start gap-3 bg-[#edf2ea] p-6 hover:bg-[#e4ecdf]"
                >
                  <span className="rounded-xl bg-white p-2 text-amber-700">
                    <Layers3 size={20} />
                  </span>
                  <div className="flex-1">
                    <p className="mb-1 text-xs text-slate-500">
                      {String(index + 1).padStart(2, "0")} ·{" "}
                      {root.businessCount ?? 0} vendors
                    </p>
                    <h2 className="text-lg font-semibold text-[#183e38]">
                      {root.name}
                    </h2>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
                <div className="divide-y divide-slate-100 px-6">
                  {categories
                    .filter((item) => item.parentId === root.id)
                    .map((child) => (
                      <details key={child.id} className="py-4">
                        <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                          {child.name}
                        </summary>
                        <div className="mt-3 flex flex-col gap-2 border-l-2 border-amber-200 pl-4">
                          <Link
                            href={`/c/${child.slug}`}
                            className="text-sm font-medium text-amber-800 hover:underline"
                          >
                            View all {child.name}
                          </Link>
                          {categories
                            .filter((item) => item.parentId === child.id)
                            .map((leaf) => (
                              <Link
                                key={leaf.id}
                                href={`/c/${leaf.slug}`}
                                className="text-sm leading-relaxed text-slate-600 hover:text-[#183e38] hover:underline"
                              >
                                {leaf.name}
                              </Link>
                            ))}
                        </div>
                      </details>
                    ))}
                </div>
              </section>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
