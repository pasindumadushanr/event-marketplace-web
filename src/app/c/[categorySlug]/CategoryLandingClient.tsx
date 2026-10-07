"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { VendorCard } from "@/components/discovery/VendorCard";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import api from "@/lib/api";
import Link from "next/link";
import { BusinessCategory, categoryPath } from "@/lib/categories";

export default function CategoryLandingPage({
  initialData,
}: {
  initialData?: {
    categories: BusinessCategory[];
    results: { data: any[]; meta?: { totalPages?: number } };
  };
}) {
  const params = useParams();
  const slug = params.categorySlug as string;
  const [categories, setCategories] = useState<BusinessCategory[]>(
    initialData?.categories || [],
  );
  const category = categories.find((item) => item.slug === slug);
  const categoryName =
    category?.name ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    initialData?.results.meta?.totalPages || 1,
  );

  const [businesses, setBusinesses] = useState<any[]>(
    initialData?.results.data || [],
  );
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(false);
    const fetchCategoryResults = async () => {
      try {
        const [res, catalog] = await Promise.all([
          api.get(
            `/discovery/search?categorySlug=${encodeURIComponent(slug)}&page=${page}`,
          ),
          api.get("/business-categories"),
        ]);
        if (cancelled) return;
        setCategories(catalog.data);
        setBusinesses(res.data.data);
        setTotalPages(res.data.meta?.totalPages || 1);
      } catch (error) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchCategoryResults();
    return () => {
      cancelled = true;
    };
  }, [slug, page]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      {/* Category Hero Header */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Explore vendors in this category and its specialist services.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav
          aria-label="Category breadcrumbs"
          className="mb-5 flex flex-wrap gap-2 text-sm text-slate-600"
        >
          <Link href="/categories" className="underline">
            All categories
          </Link>
          {categoryPath(categories, category?.id || "").map((item) => (
            <span key={item.id}>
              {" "}
              /{" "}
              <Link
                href={`/c/${item.slug}`}
                onClick={() => setPage(1)}
                className="underline"
              >
                {item.name}
              </Link>
            </span>
          ))}
        </nav>
        <div className="mb-8 flex flex-wrap gap-2">
          {categories
            .filter((item) => category && item.parentId === category.id)
            .map((item) => (
              <Link
                key={item.id}
                onClick={() => setPage(1)}
                href={`/c/${item.slug}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:border-amber-500"
              >
                {item.name}{" "}
                <span className="text-slate-400">
                  ({item.businessCount ?? 0})
                </span>
              </Link>
            ))}
        </div>
        {error && (
          <p role="alert" className="mb-4 text-red-700">
            We couldn’t load vendors. Please refresh to try again.
          </p>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-slate-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : error ? null : businesses.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-slate-900">
              No vendors found in this category yet.
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <VendorCard key={business.id} business={business} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
