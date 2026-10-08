"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Grid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { homeCategories } from "@/lib/home-categories";

import { SRI_LANKA_PROVINCES_DISTRICTS } from "@/lib/districts";
export { SRI_LANKA_PROVINCES_DISTRICTS } from "@/lib/districts";

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [customTown, setCustomTown] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.append("q", query.trim());
    const location = city === "__custom_town__" ? customTown.trim() : city;
    if (location) params.append("city", location);
    if (category) params.append("categorySlug", category);

    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
          alt="Luxury Wedding Event"
          className="w-full h-full object-cover scale-105 transform origin-center animate-out zoom-in duration-[20000ms]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight">
            Everything You Need for Your{" "}
            <span className="text-primary italic">Perfect Event</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 font-light max-w-3xl mx-auto drop-shadow-md">
            Discover and book the finest venues, photographers, and event
            professionals for weddings and corporate galas across all 25
            districts of Sri Lanka.
          </p>
        </motion.div>

        {/* Search Bar Component */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-2.5 rounded-2xl shadow-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.15fr_auto] gap-2 text-left"
          >
            {/* Keyword Input */}
            <div className="min-w-0 h-20 flex items-center gap-3 px-4 bg-slate-50 rounded-xl border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-colors">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="home-search-query"
                  className="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  Looking for
                </label>
                <Input
                  id="home-search-query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm h-8 px-0 rounded-none"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="min-w-0 h-20 flex items-center gap-3 px-4 bg-slate-50 rounded-xl border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-colors">
              <Grid className="h-5 w-5 text-slate-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="home-search-category"
                  className="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  Category
                </label>
                <select
                  id="home-search-category"
                  aria-label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full min-w-0 bg-transparent border-0 focus:ring-0 text-slate-700 h-8 outline-none cursor-pointer text-sm font-medium"
                >
                  <option value="">All Categories</option>
                  {homeCategories.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 25 Districts Location Select */}
            <div className="min-w-0 h-20 flex items-center gap-3 px-4 bg-slate-50 rounded-xl border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-colors">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={
                      city === "__custom_town__"
                        ? "home-custom-town"
                        : "home-search-location"
                    }
                    className="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {city === "__custom_town__" ? "Town / city" : "Location"}
                  </label>
                  {city === "__custom_town__" && (
                    <button
                      type="button"
                      onClick={() => setCity("")}
                      className="text-xs font-medium text-teal-700 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-primary rounded-sm"
                      aria-label="Change location selection"
                    >
                      Change
                    </button>
                  )}
                </div>
                {city !== "__custom_town__" ? (
                  <select
                    id="home-search-location"
                    aria-label="Location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full min-w-0 bg-transparent border-0 focus:ring-0 text-slate-700 h-8 outline-none cursor-pointer text-sm font-medium"
                  >
                    <option value="">All districts</option>
                    <option value="__custom_town__">Type a town / city…</option>
                    {SRI_LANKA_PROVINCES_DISTRICTS.map((group) => (
                      <optgroup key={group.province} label={group.province}>
                        {group.districts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="home-custom-town"
                    value={customTown}
                    onChange={(e) => setCustomTown(e.target.value)}
                    placeholder="e.g. Walasmulla"
                    required
                    pattern={".*\\S.*"}
                    maxLength={120}
                    autoFocus
                    className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm h-8 px-0 rounded-none"
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-14 md:h-20 px-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl w-full shadow-md gap-2"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search
            </Button>
          </form>
        </motion.div>

        {/* Popular Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="pt-4 text-slate-300 text-sm font-medium flex items-center justify-center gap-6 flex-wrap"
        >
          <span>Popular:</span>
          <Link
            href="/search?q=Cinematic%20Videography"
            className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4"
          >
            Cinematic Videography
          </Link>
          <Link
            href="/search?q=Beach%20Venues"
            className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4"
          >
            Beach Venues
          </Link>
          <Link
            href="/search?q=Bridal%20Makeup"
            className="hover:text-primary transition-colors underline decoration-white/30 underline-offset-4"
          >
            Bridal Makeup
          </Link>
          <Link
            href="/locations"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
          >
            <MapPin className="h-3.5 w-3.5 inline" /> Explore 25 Districts Map
            &rarr;
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
