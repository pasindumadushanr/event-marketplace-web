/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  ArrowRight,
  Mail,
  Calendar,
  Phone,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/brand/BrandLogo";
import api from "@/lib/api";

interface PrelaunchCoverProps {
  siteName?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// Official launch target: January 1, 2027 00:00:00 (Sri Lanka GMT+5:30)
const LAUNCH_DATE_MS = new Date("2027-01-01T00:00:00+05:30").getTime();

function calculateTimeRemaining(): TimeRemaining {
  const now = Date.now();
  const diff = LAUNCH_DATE_MS - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function PrelaunchCover({ siteName = "Nakathata.lk" }: PrelaunchCoverProps) {
  // Check if user previously closed the banner in this browser session
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("nakathata_prelaunch_dismissed") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining);

  // Customer Waitlist state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("nakathata_prelaunch_dismissed", "true");
    } catch {
      /* ignore */
    }
  };

  const handleReopen = () => {
    setIsDismissed(false);
    try {
      sessionStorage.removeItem("nakathata_prelaunch_dismissed");
    } catch {
      /* ignore */
    }
  };

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setSubscribeMessage("Please enter a valid email address.");
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setSubscribeMessage("");
    try {
      await api.post("/contact/newsletter", {
        email: email.trim().toLowerCase(),
        consent: true,
      });
      setIsSuccess(true);
      setSubscribeMessage("✨ You're on the waitlist! We'll notify you on launch day.");
      setEmail("");
    } catch {
      setIsSuccess(false);
      setSubscribeMessage("Could not save your email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user closed the banner, show an elegant notification bar at the top with a reopen button
  if (isDismissed) {
    return (
      <aside
        aria-label="Launch announcement"
        className="relative z-40 bg-gradient-to-r from-[#112a23] via-[#1a4438] to-[#112a23] text-white border-b border-amber-300/40 px-4 py-2.5 shadow-md"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
              <Calendar className="size-3.5" />
            </span>
            <span className="font-semibold text-amber-200">
              Official Launch: January 1, 2027
            </span>
            <span className="text-emerald-100/80 hidden md:inline">
              — Currently welcoming wedding and event vendors across Sri Lanka.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/register"
              className="font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4"
            >
              Are you a vendor? Join Free →
            </Link>
            <button
              type="button"
              onClick={handleReopen}
              className="inline-flex items-center gap-1 rounded-lg bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-semibold text-white transition cursor-pointer"
            >
              <Eye className="size-3" />
              <span>Show Launch Cover</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nakathata.lk Official Launch January 1, 2027"
      className="fixed inset-0 z-[9999] overflow-y-auto bg-[#faf6f0] font-sans"
    >
      {/* =====================================================================
          BACKGROUND: CLEAN LUXURY WEDDING PHOTOGRAPH (WITHOUT BAKED-IN TEXT)
      ===================================================================== */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Wedding Setting"
          className="h-full w-full object-cover object-center filter contrast-[1.02] brightness-[0.97]"
        />
        {/* Soft champagne-gold luminous overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbf8f2]/94 via-[#faf5eb]/88 to-[#f5eee0]/96" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.14)_0%,transparent_75%)]" />
      </div>

      {/* =====================================================================
          FLOATING TOP BAR: ORIGINAL BRAND LOGO + TOP RIGHT CLOSE BUTTON
      ===================================================================== */}
      <div className="sticky top-0 z-30 px-4 sm:px-8 py-3 bg-[#fbf8f2]/90 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Original Official Platform Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" aria-label={siteName} className="flex items-center gap-2">
              <BrandLogo priority className="w-24 sm:w-28 shadow-xs border border-amber-900/10" />
            </Link>
            <div className="hidden md:block border-l border-amber-900/15 pl-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8a6b35] font-bold block font-serif">
                Wedding & Event Services
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Sri Lanka&apos;s Premier Marketplace
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: CUSTOMER LOGIN | VENDOR LOGIN | EXPLORE WEBSITE CLOSE BUTTON */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-slate-600">
              <Link
                href="/login"
                className="hover:text-[#183e38] transition"
              >
                Customer Login
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/vendor/login"
                className="text-[#183e38] font-bold hover:underline"
              >
                Vendor Login
              </Link>
            </div>

            {/* TOP RIGHT CLOSE BUTTON */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close launch cover and view website preview"
              className="group inline-flex items-center gap-2 rounded-2xl bg-[#183e38] hover:bg-[#12302b] text-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Website</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-white font-bold group-hover:rotate-90 transition-transform duration-200">
                <X className="size-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN HERO CONTENT WITH SRI LANKAN WEDDING TEXT STYLE
      ===================================================================== */}
      <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
        <main className="my-auto py-6 sm:py-10 flex flex-col items-center text-center space-y-7 max-w-3xl mx-auto">
          {/* Traditional Auspicious Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-[#8a6b35] shadow-xs">
            <Sparkles className="size-4 text-amber-600" />
            <span>OFFICIAL PUBLIC LAUNCH • JANUARY 1, 2027</span>
          </div>

          {/* Traditional Sri Lankan Wedding Heading & Typography */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-[#14382e] tracking-tight leading-[1.18]">
              A Grand New Beginning for <br />
              <span className="text-[#8a6b35] italic font-serif">
                Weddings in Sri Lanka
              </span>
            </h1>

            {/* Lotus Motif Divider */}
            <div className="flex items-center justify-center gap-2 text-[#8a6b35] pt-1">
              <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#8a6b35]/50" />
              <span className="text-xs uppercase tracking-widest font-serif font-bold text-[#8a6b35]">
                ✦ Wedding & Event Services ✦
              </span>
              <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#8a6b35]/50" />
            </div>

            <p className="text-sm sm:text-base font-serif italic text-[#8a6b35] font-semibold">
              Personalised Sinhala Wedding Invitations & Curated Event Vendors
            </p>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-700 leading-relaxed font-sans pt-1">
              We are currently onboarding Sri Lanka&apos;s finest wedding venues,
              photographers, bridal artists, wedding cars, and caterers before
              opening to customers nationwide on January 1, 2027.
            </p>
          </div>

          {/* ===============================================================
              LIVE COUNTDOWN TIMER CARDS (CHAMPAGNE GOLD & EMERALD)
          =============================================================== */}
          <div className="w-full max-w-2xl pt-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8a6b35] mb-3">
              COUNTDOWN TO LAUNCH DAY
            </p>
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
              {/* Days */}
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-amber-900/15 bg-white/95 p-3 sm:p-5 shadow-md">
                <span className="text-2xl sm:text-5xl font-serif font-black tracking-tight text-[#14382e]">
                  {String(timeRemaining.days).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#8a6b35]">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-amber-900/15 bg-white/95 p-3 sm:p-5 shadow-md">
                <span className="text-2xl sm:text-5xl font-serif font-black tracking-tight text-[#14382e]">
                  {String(timeRemaining.hours).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#8a6b35]">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-amber-900/15 bg-white/95 p-3 sm:p-5 shadow-md">
                <span className="text-2xl sm:text-5xl font-serif font-black tracking-tight text-[#14382e]">
                  {String(timeRemaining.minutes).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#8a6b35]">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-amber-900/15 bg-white/95 p-3 sm:p-5 shadow-md">
                <span className="text-2xl sm:text-5xl font-serif font-black tracking-tight text-[#8a6b35]">
                  {String(timeRemaining.seconds).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          {/* ===============================================================
              CLEAN, MINIMAL & INTEGRATED ACTION SECTION (NO BULKY BOXES)
          =============================================================== */}
          <div className="w-full max-w-md mx-auto pt-4 space-y-5">
            {/* 1. Main Vendor Action Button */}
            <div className="space-y-2">
              <Link href="/vendor/register" className="block">
                <Button
                  size="lg"
                  className="w-full h-13 rounded-2xl bg-[#14382e] hover:bg-[#0e261f] text-white text-base font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] gap-2 cursor-pointer"
                >
                  <span>Are You a Vendor? Join Free</span>
                  <ArrowRight className="size-4 text-amber-300" />
                </Button>
              </Link>
              <p className="text-xs text-slate-600 font-medium">
                Free early registration • Direct WhatsApp inquiries • Dedicated profile
              </p>
            </div>

            {/* Subtle Divider */}
            <div className="flex items-center gap-3 pt-1">
              <span className="h-px flex-1 bg-amber-900/15" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8a6b35]">
                or get notified on launch day
              </span>
              <span className="h-px flex-1 bg-amber-900/15" />
            </div>

            {/* 2. Customer Waitlist Form */}
            <div className="space-y-2">
              <form onSubmit={handleNotifySubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for launch updates"
                    className="h-11 pl-10 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 text-xs sm:text-sm font-medium shadow-2xs"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-[#8a6b35] hover:bg-[#73582a] text-white font-bold text-xs sm:text-sm px-5 shrink-0 shadow-2xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Notify Me"
                  )}
                </Button>
              </form>

              {subscribeMessage && (
                <p
                  className={`text-xs text-center font-semibold pt-1 ${
                    isSuccess ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {subscribeMessage}
                </p>
              )}
            </div>
          </div>
        </main>

        {/* =====================================================================
            FOOTER: DIRECT CLOSE LINK & CONTACT SUPPORT
        ===================================================================== */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-900/10 pt-4 text-xs text-slate-500">
          <p>© 2026 {siteName}. Sri Lanka&apos;s Wedding Marketplace.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/94760762353"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#183e38] transition flex items-center gap-1 font-semibold"
            >
              <Phone className="size-3 text-[#183e38]" /> WhatsApp Support: 076 076 2353
            </a>
            <span>•</span>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-[#183e38] font-bold underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <Eye className="size-3" /> Close and View Website
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
