"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { VendorCard } from "@/components/discovery/VendorCard";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { SearchX, SlidersHorizontal, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CategorySelector } from "@/components/categories/CategorySelector";
import { currentLocation, type Coordinates } from "@/lib/location";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCity = searchParams.get("city") || "";
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") || "",
  );
  const [categorySlug, setCategorySlug] = useState(
    searchParams.get("categorySlug") || "",
  );

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [sortBy, setSortBy] = useState("NEWEST");
  const [meta, setMeta] = useState<any>(null);
  const [nearby, setNearby] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [searchError, setSearchError] = useState("");
  const requestVersion = useRef(0);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const c = searchParams.get("city") || "";
    setQuery(q);
    setCity(c);
    const category = searchParams.get("categoryId") || "";
    setCategoryId(category);
    const slug = searchParams.get("categorySlug") || "";
    setCategorySlug(slug);
    setNearby(null);
    setSortBy("NEWEST");
    fetchResults(q, c, "NEWEST", category, slug, 1, null);
  }, [searchParams]);

  const fetchResults = async (
    searchQ = query,
    searchCity = city,
    sort = sortBy,
    selectedCategory = categoryId,
    selectedSlug = categorySlug,
    page = 1,
    position = nearby,
  ) => {
    const version = ++requestVersion.current;
    setIsLoading(true);
    setSearchError("");
    try {
      const params = new URLSearchParams();
      if (searchQ.trim()) params.append("q", searchQ.trim());
      if (searchCity.trim()) params.append("city", searchCity.trim());
      if (sort) params.append("sortBy", sort);
      if (selectedCategory) params.append("categoryId", selectedCategory);
      else if (selectedSlug) params.append("categorySlug", selectedSlug);
      params.append("page", String(page));

      const res = position
        ? await api.post("/discovery/nearby", {
            ...Object.fromEntries(params),
            ...position,
          })
        : await api.get(`/discovery/search?${params.toString()}`);
      if (version !== requestVersion.current) return;
      setBusinesses(res.data.data);
      setMeta(res.data.meta);
    } catch (error) {
      if (version === requestVersion.current) {
        setBusinesses([]);
        setMeta(null);
        setSearchError("Search could not load. Please try again.");
      }
    } finally {
      if (version === requestVersion.current) setIsLoading(false);
    }
  };

  const findNearby = async () => {
    setLocating(true);
    setLocationError("");
    try {
      const position = await currentLocation();
      setNearby(position);
      setCity("");
      setSortBy("DISTANCE");
      await fetchResults(
        query,
        "",
        "DISTANCE",
        categoryId,
        categorySlug,
        1,
        position,
      );
    } catch (error) {
      setLocationError(
        error instanceof Error
          ? error.message
          : "Location unavailable. Please search by city.",
      );
    } finally {
      setLocating(false);
    }
  };

  const clearFilters = () => {
    setQuery("");
    setCity("");
    setCategoryId("");
    setCategorySlug("");
    setNearby(null);
    setSortBy("NEWEST");
    setLocationError("");
    void fetchResults("", "", "NEWEST", "", "", 1, null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(query, city, sortBy);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      <div className="h-20 bg-slate-900" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-28">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
              <SlidersHorizontal className="h-5 w-5" /> Filters
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-6">
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={findNearby}
                  disabled={locating || isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {locating
                    ? "Finding your location…"
                    : "Use my location · 50 km"}
                </Button>
                <p className="text-xs text-slate-500">
                  Only requested when you click. Used for this search, not saved
                  to your account. Vendor distances are approximate
                  straight-line distances.
                </p>
                {locationError && (
                  <p role="alert" className="text-sm text-red-700">
                    {locationError}
                  </p>
                )}
                {nearby && (
                  <div className="space-y-2">
                    <p role="status" className="text-sm text-teal-700">
                      Searching within 50 km of your location
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setNearby(null);
                        setSortBy("NEWEST");
                        void fetchResults(
                          query,
                          city,
                          "NEWEST",
                          categoryId,
                          categorySlug,
                          1,
                          null,
                        );
                      }}
                    >
                      Turn off nearby search
                    </Button>
                  </div>
                )}
              </div>
              <CategorySelector
                value={categoryId}
                slug={categorySlug}
                onChange={(id) => {
                  setCategoryId(id);
                  setCategorySlug("");
                }}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Keyword
                </label>
                <Input
                  placeholder="Wedding, DJ, Floral..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  City / Location
                </label>
                <Input
                  placeholder="e.g. Colombo"
                  aria-label="Town or city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!!nearby}
                />
                {!nearby && (
                  <p className="text-xs text-slate-500">
                    Type any town or city, for example Walasmulla. Matches
                    vendors by their saved city name.
                  </p>
                )}
                {nearby && (
                  <p className="text-xs text-slate-500">
                    Turn off nearby search to choose a city instead.
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-primary text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </form>
          </div>
        </aside>

        {/* Search Results Area */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {query ? `Results for "${query}"` : "Explore Marketplace"}
              </h1>
              <p className="text-slate-500 mt-1">
                {isLoading
                  ? "Searching..."
                  : `Found ${meta?.total || 0} vendors`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                Sort by:
              </span>
              <Select
                value={sortBy}
                onValueChange={(val) => {
                  if (val) {
                    setSortBy(val);
                    fetchResults(query, city, val, categoryId);
                  }
                }}
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Sort order">
                    {
                      {
                        NEWEST: "Newest Additions",
                        DISTANCE: "Nearest first",
                        RATING_DESC: "Highest Rated",
                        PRICE_ASC: "Price: Low to High",
                        PRICE_DESC: "Price: High to Low",
                      }[sortBy]
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {nearby && (
                    <SelectItem value="DISTANCE">Nearest first</SelectItem>
                  )}
                  <SelectItem value="NEWEST">Newest Additions</SelectItem>
                  <SelectItem value="RATING_DESC">Highest Rated</SelectItem>
                  <SelectItem value="PRICE_ASC">Price: Low to High</SelectItem>
                  <SelectItem value="PRICE_DESC">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Grid */}
          {searchError ? (
            <div role="alert" className="rounded-2xl border bg-white p-8">
              <p>{searchError}</p>
              <Button
                onClick={() =>
                  fetchResults(
                    query,
                    city,
                    sortBy,
                    categoryId,
                    categorySlug,
                    meta?.page || 1,
                  )
                }
              >
                Retry search
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[400px] bg-slate-100 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center flex flex-col items-center">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <SearchX className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                No vendors found
              </h3>
              <p className="text-slate-500 max-w-md mb-8">
                {nearby
                  ? "No matching vendors with saved coordinates were found within 50 km. Try normal city search; some vendors have not added their coordinates yet."
                  : "We couldn't find any vendors matching your current filters. Try adjusting your search terms or location."}
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <VendorCard key={business.id} business={business} />
              ))}
            </div>
          )}
          {meta?.totalPages > 1 && !isLoading && !searchError && (
            <nav
              aria-label="Search result pages"
              className="mt-8 flex items-center justify-center gap-4"
            >
              <Button
                variant="outline"
                disabled={meta.page <= 1}
                onClick={() =>
                  fetchResults(
                    query,
                    city,
                    sortBy,
                    categoryId,
                    categorySlug,
                    meta.page - 1,
                  )
                }
              >
                Previous
              </Button>
              <span>
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={meta.page >= meta.totalPages}
                onClick={() =>
                  fetchResults(
                    query,
                    city,
                    sortBy,
                    categoryId,
                    categorySlug,
                    meta.page + 1,
                  )
                }
              >
                Next
              </Button>
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading search results...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
