/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Images,
  Package,
  Phone,
  MessageCircle,
  CalendarDays,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

interface BusinessProfile {
  id?: string;
  name?: string;
  status?: string;
  phone?: string;
  city?: string;
  district?: string;
  logo?: string;
  coverImage?: string;
  category?: {
    name?: string;
  };
  profileSettings?: {
    seo?: {
      slug?: string;
    };
  };
}

interface PackageItem {
  id: string;
  name: string;
  price?: number | string;
}

interface GalleryItem {
  id: string;
  url: string;
}

interface BookingItem {
  id: string;
  status: string;
}

interface ConversationItem {
  customerId: string;
  messages?: { senderId: string; isRead: boolean }[];
}

interface VendorDashboardV2Props {
  business: BusinessProfile;
  updateBusinessLocally: (data: Partial<BusinessProfile>) => void;
}

export function VendorDashboardV2({
  business,
  updateBusinessLocally,
}: VendorDashboardV2Props) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get("/vendor/packages"),
      api.get("/vendor/gallery"),
      api.get("/bookings/vendor"),
      api.get("/chat/conversations?mode=vendor"),
    ]).then(([pkgRes, galRes, bookRes, chatRes]) => {
      if (!active) return;
      if (pkgRes.status === "fulfilled") setPackages(pkgRes.value.data || []);
      if (galRes.status === "fulfilled") setGalleries(galRes.value.data || []);
      if (bookRes.status === "fulfilled") setBookings(bookRes.value.data || []);
      if (chatRes.status === "fulfilled")
        setConversations(chatRes.value.data || []);
      setIsLoadingCounts(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const isLive = business?.status === "ACTIVE";
  const publicSlug = business?.profileSettings?.seo?.slug || business?.id;
  const publicUrl = `/business/${publicSlug}`;

  const pendingBookingsCount = bookings.filter(
    (b) => b.status === "PENDING",
  ).length;
  const unreadMessagesCount = conversations.filter(
    (c) => c.messages?.[0]?.senderId === c.customerId && !c.messages?.[0]?.isRead,
  ).length;

  const handleTogglePublish = async () => {
    setIsTogglingPublish(true);
    try {
      if (isLive) {
        if (
          !window.confirm(
            "Pause your business page? It will temporarily be hidden from public search, but existing bookings will remain.",
          )
        ) {
          setIsTogglingPublish(false);
          return;
        }
        await api.patch("/vendor/business/unpublish");
        updateBusinessLocally({ status: "INACTIVE" });
        toast.success("Your page is now paused and hidden from search.");
      } else {
        await api.patch("/vendor/business/publish");
        updateBusinessLocally({ status: "ACTIVE" });
        toast.success("Congratulations! Your business page is now Live!");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } })
              .response?.data?.message
          : undefined;
      toast.error(
        msg ||
          "Could not update status. Please make sure your basic details are filled.",
      );
    } finally {
      setIsTogglingPublish(false);
    }
  };

  return (
    <div className="space-y-8" data-testid="vendor-dashboard-v2">
      {/* 1. WELCOME & STATUS HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123028] via-[#1a4439] to-[#0d231d] p-6 sm:p-8 text-white shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              <span>Simple Vendor Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {business?.name || "My Business"}
            </h1>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-emerald-100/80">
              {business?.category?.name && (
                <span className="font-medium text-emerald-300">
                  {business.category.name}
                </span>
              )}
              {business?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {business.city}
                  {business?.district ? `, ${business.district}` : ""}
                </span>
              )}
            </p>
          </div>

          {/* Live Status and Public Preview Pill */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div
              className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 border text-xs sm:text-sm font-semibold backdrop-blur-md ${
                isLive
                  ? "bg-emerald-950/60 border-emerald-400/40 text-emerald-300"
                  : "bg-amber-950/60 border-amber-400/40 text-amber-300"
              }`}
            >
              <span
                className={`size-2.5 rounded-full animate-pulse ${
                  isLive ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span>{isLive ? "Page is Online & Live" : "Page is Paused (Offline)"}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleTogglePublish}
              disabled={isTogglingPublish}
              className={`h-11 rounded-xl font-medium transition-all ${
                isLive
                  ? "border-red-400/30 bg-red-950/30 text-red-200 hover:bg-red-900/50 hover:text-white"
                  : "border-emerald-400 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-semibold"
              }`}
            >
              {isTogglingPublish
                ? "Updating..."
                : isLive
                  ? "Pause Page"
                  : "🚀 Go Live"}
            </Button>

            <Link
              href={isLive ? publicUrl : "/vendor/preview"}
              target={isLive ? "_blank" : undefined}
              rel={isLive ? "noopener noreferrer" : undefined}
            >
              <Button
                variant="secondary"
                size="sm"
                className="h-11 w-full sm:w-auto rounded-xl bg-white/15 text-white hover:bg-white/25 border border-white/20 gap-2 font-medium"
              >
                <Eye className="size-4" />
                <span>{isLive ? "View Live Page" : "Preview Page"}</span>
                {isLive && <ExternalLink className="size-3 opacity-70" />}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. INQUIRIES & MESSAGES ALERT (IF ANY) */}
      {(pendingBookingsCount > 0 || unreadMessagesCount > 0) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <MessageCircle className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-950">
                You have customer inquiries waiting!
              </p>
              <p className="text-xs text-amber-800">
                {pendingBookingsCount > 0 &&
                  `${pendingBookingsCount} booking request${pendingBookingsCount > 1 ? "s" : ""} to review. `}
                {unreadMessagesCount > 0 &&
                  `${unreadMessagesCount} unread message${unreadMessagesCount > 1 ? "s" : ""}.`}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {pendingBookingsCount > 0 && (
              <Link href="/vendor/bookings" className="flex-1 sm:flex-initial">
                <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                  View Bookings
                </Button>
              </Link>
            )}
            <Link href="/vendor/messages" className="flex-1 sm:flex-initial">
              <Button size="sm" variant="outline" className="w-full border-amber-300 rounded-xl bg-white">
                Open Messages
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 3. THREE CORE ESSENTIAL CARDS */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Everything your profile needs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep these 3 areas updated so customers in Sri Lanka can easily find and book you.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* CARD 1: BUSINESS & CONTACT INFO */}
          <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
                  <Building2 className="size-6" />
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    business?.phone && business?.city
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {business?.phone && business?.city ? (
                    <>
                      <CheckCircle2 className="size-3" /> Ready
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3" /> Needs info
                    </>
                  )}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                1. Details & Contact
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Your business name, WhatsApp number, city, and short description.
              </p>

              <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 truncate">
                  <Phone className="size-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">
                    {business?.phone || "No phone added yet"}
                  </span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                  <span>
                    {business?.city
                      ? `${business.city}, ${business.district || "Sri Lanka"}`
                      : "Location not set"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Link href="/vendor/business/general" className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-slate-200 text-xs font-semibold group-hover:border-teal-400 group-hover:text-teal-900"
                >
                  Edit Details
                </Button>
              </Link>
              <Link href="/vendor/business/contact">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs font-semibold text-teal-800"
                  title="WhatsApp & Social Links"
                >
                  WhatsApp
                </Button>
              </Link>
            </div>
          </div>

          {/* CARD 2: PHOTOS & PORTFOLIO */}
          <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-800">
                  <Images className="size-6" />
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    galleries.length > 0 || business?.coverImage
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isLoadingCounts ? (
                    "Checking…"
                  ) : galleries.length > 0 || business?.coverImage ? (
                    <>
                      <CheckCircle2 className="size-3" />{" "}
                      {galleries.length} Photo{galleries.length === 1 ? "" : "s"}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3" /> Add photos
                    </>
                  )}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                2. Photos & Portfolio
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Show your best work. Couples and event organizers book vendors with clear photos.
              </p>

              {/* Photos miniature thumbnail preview */}
              <div className="mt-4 flex items-center gap-2 overflow-hidden rounded-xl bg-slate-50 p-2">
                {business?.logo ? (
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <img
                      src={business.logo}
                      alt="Logo"
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-[10px] text-slate-400">
                    Logo
                  </div>
                )}

                {galleries.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    <img
                      src={item.url}
                      alt="Gallery thumbnail"
                      className="size-full object-cover"
                    />
                  </div>
                ))}

                {galleries.length > 3 && (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-600">
                    +{galleries.length - 3}
                  </div>
                )}

                {galleries.length === 0 && (
                  <span className="text-xs text-slate-400 italic pl-1">
                    No portfolio photos yet
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link href="/vendor/gallery" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-slate-200 text-xs font-semibold group-hover:border-sky-400 group-hover:text-sky-900 gap-1.5"
                >
                  <span>Manage Photos</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* CARD 3: PACKAGES & PRICING */}
          <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
                  <Package className="size-6" />
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    packages.length > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isLoadingCounts ? (
                    "Checking…"
                  ) : packages.length > 0 ? (
                    <>
                      <CheckCircle2 className="size-3" /> {packages.length} Package
                      {packages.length === 1 ? "" : "s"}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3" /> Add pricing
                    </>
                  )}
                </span>
              </div>

              <h3 className="mt-5 text-base font-bold text-slate-900">
                3. Services & Pricing
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Add simple pricing packages (e.g. Standard, Premium) so clients know what you charge.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                {packages.length > 0 ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800 truncate">
                      {packages[0]?.name}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-bold">
                      LKR {Number(packages[0]?.price || 0).toLocaleString()}
                      {packages.length > 1 && (
                        <span className="text-slate-400 font-normal">
                          {" "}
                          (+{packages.length - 1} more)
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No packages added yet</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link href="/vendor/packages" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-slate-200 text-xs font-semibold group-hover:border-amber-400 group-hover:text-amber-900 gap-1.5"
                >
                  <span>Manage Packages & Prices</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAST NAVIGATION SHORTCUTS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/vendor/bookings"
          className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <CalendarDays className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900">Bookings</p>
            <p className="text-[11px] text-slate-500 truncate">
              {bookings.length} total request{bookings.length === 1 ? "" : "s"}
            </p>
          </div>
        </Link>

        <Link
          href="/vendor/messages"
          className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <MessageCircle className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900">Messages</p>
            <p className="text-[11px] text-slate-500 truncate">
              Chat directly with clients
            </p>
          </div>
        </Link>

        <Link
          href="/vendor/calendar"
          className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CalendarDays className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900">Calendar</p>
            <p className="text-[11px] text-slate-500 truncate">
              Manage your availability
            </p>
          </div>
        </Link>

        <Link
          href="/vendor/reviews"
          className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900">Reviews</p>
            <p className="text-[11px] text-slate-500 truncate">
              Customer feedback & replies
            </p>
          </div>
        </Link>
      </div>

      {/* 5. SRI LANKA VENDOR SUPPORT / WHATSAPP BANNER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-[#f0f5ee] border border-[#d6e3d2] p-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-sm">
            <HelpCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#183e38]">
              Need help setting up your profile or adding photos?
            </h3>
            <p className="mt-0.5 text-xs text-slate-600">
              Our Sri Lanka vendor support team is ready to assist you on WhatsApp anytime.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/94760762353"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b4332] px-5 py-3 text-xs font-semibold text-white shadow transition hover:bg-[#143326]"
        >
          <Phone className="size-3.5" />
          <span>Chat on WhatsApp: 076 076 2353</span>
        </a>
      </div>
    </div>
  );
}
