"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Camera,
  Car,
  Flower2,
  MapPin,
  Search,
  Sparkles,
  Utensils,
} from "lucide-react";
import api from "@/lib/api";
import { homeCategories } from "@/lib/home-categories";
import { useSiteMedia, fallbackImage } from "@/lib/site-media";
import type { VendorCardProps } from "@/components/discovery/VendorCard";

const heroFallback =
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop";
const popular = [
  {
    name: "Venues & halls",
    slug: "venues-locations",
    icon: Building2,
    color: "bg-[#eaf0e7] text-[#47634d]",
  },
  {
    name: "Photo & video",
    slug: "photography-media",
    icon: Camera,
    color: "bg-[#f5e9e5] text-[#95675d]",
  },
  {
    name: "Salons & makeup",
    slug: "hair-beauty-grooming",
    icon: Sparkles,
    color: "bg-[#f1e9f0] text-[#8b6580]",
  },
  {
    name: "Flowers & decor",
    slug: "floral-event-styling",
    icon: Flower2,
    color: "bg-[#edf0df] text-[#687545]",
  },
  {
    name: "Catering & cakes",
    slug: "cakes-pastries-catering",
    icon: Utensils,
    color: "bg-[#f7edda] text-[#977427]",
  },
  {
    name: "Wedding cars",
    slug: "wedding-cars",
    icon: Car,
    color: "bg-[#e7edf1] text-[#55717f]",
  },
];
type Vendor = VendorCardProps["business"];

function SimpleHero() {
  const router = useRouter();
  const { media } = useSiteMedia();
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  function search(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (service) params.set("categorySlug", service);
    if (location.trim()) params.set("city", location.trim());
    router.push(params.size ? `/search?${params.toString()}` : "/search");
  }
  return (
    <section
      aria-labelledby="simple-hero-title"
      className="bg-[#faf8f3] px-5 pb-10 pt-28 sm:px-8 sm:pb-14"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-7 lg:grid-cols-[1.1fr_1fr] lg:gap-x-16 lg:gap-y-9">
        <div className="order-1">
          <p className="mb-4 text-xs font-semibold tracking-[.16em] uppercase text-[#96763b]">
            Weddings & events in Sri Lanka
          </p>
          <h1
            id="simple-hero-title"
            className="max-w-xl text-[42px] leading-[1.06] font-semibold text-[#294737] sm:text-6xl"
          >
            Find wedding vendors{" "}
            <span className="italic text-[#96763b]">near you.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#6d726b]">
            Explore venues, photographers, salons and more. Find the right
            people for your celebration.
          </p>
        </div>
        <div className="order-3 h-44 overflow-hidden rounded-2xl bg-[#e7e4db] sm:h-64 lg:order-2 lg:h-72">
          <img
            key={media.heroImage || heroFallback}
            src={media.heroImage || heroFallback}
            alt="A beautifully arranged wedding celebration"
            className="h-full w-full object-cover"
            fetchPriority="high"
            onError={(event) => fallbackImage(event, heroFallback)}
          />
        </div>
        <form
          aria-label="Find wedding vendors"
          onSubmit={search}
          className="order-2 grid gap-3 rounded-2xl border border-[#e6e0d3] bg-white p-3 shadow-[0_12px_32px_-24px_rgba(40,60,45,.4)] sm:grid-cols-[1fr_1fr_auto] lg:order-3 lg:col-span-2"
        >
          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#f7f8f4] px-4 py-3 focus-within:ring-2 focus-within:ring-[#9d865b]">
            <Search
              className="h-5 w-5 shrink-0 text-[#879280]"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <label
                htmlFor="simple-service"
                className="block text-xs font-semibold text-[#5e6d5a]"
              >
                What service do you need?
              </label>
              <select
                id="simple-service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="mt-1 h-8 w-full min-w-0 bg-transparent text-base text-[#29382d] outline-none"
              >
                <option value="">All services</option>
                {homeCategories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#f7f8f4] px-4 py-3 focus-within:ring-2 focus-within:ring-[#9d865b]">
            <MapPin
              className="h-5 w-5 shrink-0 text-[#879280]"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <label
                htmlFor="simple-location"
                className="block text-xs font-semibold text-[#5e6d5a]"
              >
                Which town or district?
              </label>
              <input
                id="simple-location"
                value={location}
                maxLength={120}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Walasmulla"
                className="mt-1 h-8 w-full min-w-0 bg-transparent text-base text-[#29382d] outline-none placeholder:text-[#828980]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#355746] px-7 text-base font-semibold text-white transition-colors hover:bg-[#284434] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#96763b]"
          >
            Find Vendors <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}

function SimpleVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    api
      .get<{ data: Vendor[] }>("/discovery/search?sortBy=NEWEST&limit=3", {
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (!Array.isArray(data.data)) throw new Error("Invalid response");
        if (active)
          setVendors(
            data.data
              .filter(
                (item) =>
                  typeof item?.id === "string" &&
                  typeof item?.name === "string",
              )
              .slice(0, 3),
          );
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [retry]);
  return (
    <section
      aria-labelledby="simple-vendors-title"
      className="bg-[#faf8f5] px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="simple-vendors-title"
              className="text-3xl font-semibold text-[#294737] sm:text-4xl"
            >
              Meet our vendors
            </h2>
            <p className="mt-2 text-sm text-[#74776e]">
              Explore their work and get in touch.
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#355746] hover:underline"
          >
            View all vendors{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {loading ? (
          <div
            role="status"
            aria-label="Loading vendors"
            className="grid gap-5 md:grid-cols-3"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl bg-[#e9e9e1]"
              />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border bg-white p-6 text-sm text-slate-600"
          >
            <p>We couldn&apos;t load vendors right now.</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(false);
                setRetry((value) => value + 1);
              }}
              className="mt-3 min-h-11 font-semibold text-[#355746] underline"
            >
              Try again
            </button>
          </div>
        ) : vendors.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/business/${encodeURIComponent(vendor.id)}`}
                className="group overflow-hidden rounded-2xl border border-[#e4e4d9] bg-white transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#96763b]"
              >
                <div className="h-48 bg-[#eaece3]">
                  {vendor.coverImage ? (
                    <img
                      src={vendor.coverImage}
                      alt={vendor.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(event) =>
                        fallbackImage(event, "/images/brand/nakathata-logo.jpg")
                      }
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2
                        className="h-10 w-10 text-[#8b9983]"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="mb-1 text-xs text-[#7a826f]">
                    {vendor.category?.name || "Wedding & event services"}
                  </p>
                  <h3 className="text-xl font-semibold text-[#2f4231]">
                    {vendor.name}
                  </h3>
                  {vendor.city && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#757a70]">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {vendor.city}
                    </p>
                  )}
                  <span className="mt-4 inline-flex min-h-8 items-center gap-2 text-sm font-semibold text-[#355746] group-hover:underline">
                    View profile{" "}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border bg-white p-6 text-sm text-[#697461]">
            More vendor profiles are coming soon. You can explore all services
            above.
          </p>
        )}
      </div>
    </section>
  );
}

export function SimpleHomepage() {
  const { media } = useSiteMedia();
  return (
    <>
      <SimpleHero />
      <section
        id="categories"
        aria-labelledby="simple-services-title"
        className="scroll-mt-24 bg-white px-5 py-10 sm:px-8 sm:py-14"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2
              id="simple-services-title"
              className="text-3xl font-semibold text-[#294737] sm:text-4xl"
            >
              Popular services
            </h2>
            <Link
              href="/categories"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#355746] hover:underline"
            >
              View all services{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {popular.map(({ name, slug, icon: Icon, color }) => (
              <Link
                key={slug}
                href={`/search?categorySlug=${slug}`}
                className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-[#e8e8df] px-3 py-5 text-center transition-colors hover:border-[#baa477] hover:bg-[#faf9f4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#96763b]"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}
                >
                  {media.categoryImages?.[slug] ? (
                    <img
                      src={media.categoryImages[slug]}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                      loading="lazy"
                      onError={(event) =>
                        fallbackImage(event, "/images/brand/nakathata-logo.jpg")
                      }
                    />
                  ) : (
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>
                <span className="text-sm font-medium text-[#465443]">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SimpleVendors />
      <section
        aria-labelledby="simple-vendor-invitation"
        className="bg-white px-5 py-8 sm:px-8 sm:py-10"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-2xl bg-[#eaf0e7] px-6 py-7 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2
              id="simple-vendor-invitation"
              className="text-2xl font-semibold text-[#294737]"
            >
              Own a wedding business?
            </h2>
            <p className="mt-1 text-sm text-[#6b7665]">
              Help customers discover your services.
            </p>
          </div>
          <Link
            href="/vendor/register"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl border border-[#a2b199] bg-white px-5 text-sm font-semibold text-[#355746] hover:bg-[#fafcf8]"
          >
            List your business{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
