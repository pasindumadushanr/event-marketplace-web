/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  ArrowRight,
  Mail,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  // Check if the user previously dismissed the cover during this browser session
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

  // Notify Me waitlist form state
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
      setSubscribeMessage("✨ You're on the VIP waitlist! We'll notify you on launch day with exclusive vendor offers.");
      setEmail("");
    } catch {
      setIsSuccess(false);
      setSubscribeMessage("We couldn't save your email right now. Please try again or reach out on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If dismissed, render a sleek, non-intrusive floating ribbon at the top
  if (isDismissed) {
    return (
      <aside
        aria-label="Launch announcement"
        className="relative z-40 bg-gradient-to-r from-[#0d221c] via-[#16382f] to-[#0d221c] text-white border-b border-amber-400/30 px-4 py-2.5 shadow-md"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
              <Calendar className="size-3.5" />
            </span>
            <span className="font-semibold text-amber-200">
              Official Public Launch: January 1, 2027
            </span>
            <span className="text-slate-300 hidden md:inline">
              — Currently welcoming vendor applications across Sri Lanka.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/register"
              className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              Are you a vendor? Join Free →
            </Link>
            <button
              type="button"
              onClick={handleReopen}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-semibold text-white transition cursor-pointer"
            >
              <span>View Countdown</span>
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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950"
    >
      {/* Background Wedding Image with Multi-Layer Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
          alt="Sri Lankan Wedding Celebration"
          className="h-full w-full object-cover object-center scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.12)_0,transparent_70%)]" />
      </div>

      {/* Main Container */}
      <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-white">
        {/* =================================================================
            1. TOP BAR: LOGO, QUICK LOGINS & PROMINENT CLOSE BUTTON
        ================================================================= */}
        <header className="flex items-center justify-between gap-4 py-2 border-b border-white/10 pb-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-lg shadow-lg"
            >
              N✦
            </span>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white block">
                {siteName}
              </span>
              <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] text-amber-300/90 font-semibold block -mt-1">
                Sri Lanka Wedding & Event Marketplace
              </span>
            </div>
          </div>

          {/* Quick Actions & Close Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Customer Login
              </Link>
              <span className="text-slate-600">|</span>
              <Link
                href="/vendor/login"
                className="text-amber-300 hover:text-amber-200 transition"
              >
                Vendor Portal
              </Link>
            </div>

            {/* PROMINENT CLOSE BUTTON (TOP RIGHT) */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close launch cover and view website preview"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explore Website</span>
              <span className="flex size-6 items-center justify-center rounded-full bg-white text-slate-950 font-bold">
                <X className="size-3.5" />
              </span>
            </button>
          </div>
        </header>

        {/* =================================================================
            2. HERO CENTERPIECE: LAUNCH ANNOUNCEMENT + LIVE COUNTDOWN
        ================================================================= */}
        <main className="my-auto py-8 sm:py-12 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Official Launch Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-500/15 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-300 backdrop-blur-md shadow-lg animate-pulse">
            <Sparkles className="size-4 text-amber-400" />
            <span>OFFICIAL PUBLIC LAUNCH: JANUARY 1, 2027</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              A Grand New Beginning for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Weddings in Sri Lanka
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              We are currently onboarding Sri Lanka&apos;s finest wedding venues,
              photographers, bridal artists, wedding cars, and caterers before
              opening to customers nationwide on January 1, 2027.
            </p>
          </div>

          {/* ===============================================================
              LIVE COUNTDOWN TIMER TO JANUARY 1, 2027
          =============================================================== */}
          <div className="w-full max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300/80 mb-3">
              COUNTDOWN TO LAUNCH DAY
            </p>
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
              {/* Days */}
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 p-3 sm:p-5 backdrop-blur-md shadow-2xl">
                <span className="text-2xl sm:text-5xl font-black tracking-tight text-amber-300 drop-shadow">
                  {String(timeRemaining.days).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 p-3 sm:p-5 backdrop-blur-md shadow-2xl">
                <span className="text-2xl sm:text-5xl font-black tracking-tight text-amber-300 drop-shadow">
                  {String(timeRemaining.hours).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 p-3 sm:p-5 backdrop-blur-md shadow-2xl">
                <span className="text-2xl sm:text-5xl font-black tracking-tight text-amber-300 drop-shadow">
                  {String(timeRemaining.minutes).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 p-3 sm:p-5 backdrop-blur-md shadow-2xl">
                <span className="text-2xl sm:text-5xl font-black tracking-tight text-amber-300 drop-shadow">
                  {String(timeRemaining.seconds).padStart(2, "0")}
                </span>
                <span className="mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          {/* ===============================================================
              3. PRIMARY ACTION: BIG VENDOR JOIN FREE BUTTON
          =============================================================== */}
          <div className="w-full max-w-xl rounded-3xl border border-amber-400/40 bg-gradient-to-b from-amber-950/40 via-slate-900/80 to-slate-950/90 p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Building2 className="size-4" /> Are You an Event or Wedding Vendor?
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Get Your Storefront Ready for 2027 Couples
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Create your business page, upload packages and portfolio photos, and be featured at launch.
              </p>
            </div>

            <Link href="/vendor/register" className="block">
              <Button
                size="lg"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-base sm:text-lg font-black shadow-xl shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 cursor-pointer"
              >
                <span>Are You a Vendor? Join Free</span>
                <ArrowRight className="size-5" />
              </Button>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] text-amber-200/90 font-medium pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-400" /> Free pre-launch registration
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-400" /> Direct WhatsApp inquiries
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-400" /> Shareable profile link
              </span>
            </div>
          </div>

          {/* ===============================================================
              4. CUSTOMER WAITLIST / "NOTIFY ME" FORM
          =============================================================== */}
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md space-y-3">
            <div className="text-center space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Planning a Wedding or Celebration in 2027?
              </h3>
              <p className="text-xs text-slate-400">
                Leave your email below. We&apos;ll notify you on launch day with exclusive vendor offers.
              </p>
            </div>

            <form onSubmit={handleNotifySubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-11 pl-10 rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-500 border-0 focus-visible:ring-amber-400 text-xs sm:text-sm font-medium"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 shrink-0 shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-1.5" /> Saving...
                    </>
                  ) : (
                    "Notify Me"
                  )}
                </Button>
              </div>

              {subscribeMessage && (
                <p
                  className={`text-xs text-left font-medium pt-1 ${
                    isSuccess ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {subscribeMessage}
                </p>
              )}
            </form>
          </div>
        </main>

        {/* =================================================================
            5. BOTTOM FOOTER & DIRECT PREVIEW LINK
        ================================================================= */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
          <p>© 2026 {siteName}. Sri Lanka&apos;s Wedding Marketplace.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/94760762353"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition flex items-center gap-1"
            >
              <Phone className="size-3" /> Vendor Support: 076 076 2353
            </a>
            <span>•</span>
            <button
              type="button"
              onClick={handleDismiss}
              className="hover:text-white font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <Eye className="size-3" /> Preview Website (Close Banner)
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
