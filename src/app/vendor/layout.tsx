"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  CalendarRange,
  LineChart,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Eye,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { BusinessProfileProvider } from "@/contexts/BusinessProfileContext";
import "./vendor.css";

const navConfig = [
  { href: "/vendor", label: "Home", icon: LayoutDashboard },
  { href: "/vendor/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/vendor/messages", label: "Messages", icon: MessageCircle },
  { href: "/vendor/business", label: "My Business Page", icon: Building2 },
  { href: "/vendor/calendar", label: "Availability", icon: CalendarRange },
  { href: "/vendor/revenue", label: "Earnings", icon: LineChart },
  { href: "/vendor/account", label: "Account & Help", icon: Settings },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Routes that should NOT show the dashboard sidebar (just auth stuff now)
  const hideSidebar = [
    "/vendor/register",
    "/vendor/login",
    "/vendor/verify-email",
  ].includes(pathname);

  const [vendorStatus, setVendorStatus] = useState<string | null>(null);

  const allowedRoutes = [
    "/vendor",
    "/vendor/onboarding",
    "/vendor/settings",
    "/vendor/notifications",
    "/vendor/support",
    "/vendor/account",
  ];

  useEffect(() => {
    // We still want to skip verification on the register and login page
    if (pathname === "/vendor/register" || pathname === "/vendor/login") {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    if (!authLoading && !isAuthenticated) {
      router.push("/vendor/login");
      return;
    }
    if (authLoading || !isAuthenticated) return;

    const verifyVendorApproval = async () => {
      try {
        const { data } = await api.get("/vendor/business/onboarding/status");

        // Handle Email Verification Logic
        if (!data.emailVerified) {
          if (pathname !== "/vendor/verify-email") {
            router.push("/vendor/verify-email");
          } else {
            setIsAuthorized(true); // Allow them to stay on verify-email
          }
          return;
        } else if (pathname === "/vendor/verify-email") {
          // If already verified but on the verify page, push to dashboard
          router.push("/vendor");
          return;
        }

        setVendorStatus(data.vendorStatus);
        setIsAuthorized(true);

        if (data.vendorStatus !== "APPROVED") {
          // Check if pathname starts with any of the allowed routes, or exactly matches
          const isAllowed = allowedRoutes.some(
            (route) =>
              pathname === route ||
              (route !== "/vendor" && pathname.startsWith(route + "/")),
          );

          if (!isAllowed) {
            router.push("/vendor");
          }
        }
      } catch (error) {
        setIsAuthorized(true);
        const isAllowed = allowedRoutes.some(
          (route) =>
            pathname === route ||
            (route !== "/vendor" && pathname.startsWith(route + "/")),
        );
        if (!isAllowed) {
          router.push("/vendor");
        }
      } finally {
        setIsLoading(false);
      }
    };
    verifyVendorApproval();
  }, [pathname, hideSidebar, router, isAuthenticated, authLoading]);

  if (isLoading || !isAuthorized) {
    if (hideSidebar) return <>{children}</>;
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If we are on a page that hides the sidebar, just render children
  if (hideSidebar) {
    return <>{children}</>;
  }

  const renderNavLinks = () => {
    // If not approved, filter out links that require approval
    const filteredNavConfig = navConfig.filter((item) => {
      if (vendorStatus === "APPROVED") return true;
      return allowedRoutes.includes(item.href);
    });

    return (
      <nav
        aria-label="Vendor navigation"
        className="flex-1 space-y-2 px-4 py-4"
      >
        <p className="vendor-nav-caption">WORKSPACE</p>
        {filteredNavConfig.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/vendor" && pathname.startsWith(item.href + "/")) ||
            (item.href === "/vendor/business" &&
              [
                "/vendor/gallery",
                "/vendor/packages",
                "/vendor/reviews",
                "/vendor/preview",
              ].includes(pathname)) ||
            (item.href === "/vendor/account" &&
              [
                "/vendor/settings",
                "/vendor/support",
                "/vendor/documents",
                "/vendor/subscription",
              ].includes(pathname));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`vendor-nav-link flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                isActive
                  ? "vendor-nav-active"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="vendor-workspace flex h-dvh">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMobileMenuOpen}
          className="p-2 rounded-xl bg-white text-slate-800 border border-slate-200 shadow-sm"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`vendor-sidebar fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo / Header */}
          <div className="flex h-24 items-center gap-3 px-6 shrink-0">
            <span aria-hidden="true" className="vendor-brand-mark">
              N<span>✦</span>
            </span>
            <span className="text-xl font-serif font-bold text-slate-900 tracking-tight">
              Nakathata.lk{" "}
              <span className="mt-1 block text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-slate-500">
                Vendor workspace
              </span>
            </span>
          </div>

          {vendorStatus === "APPROVED" && (
            <div className="p-4 shrink-0">
              <Link href="/vendor/preview" className="vendor-preview-link">
                <Eye className="h-4 w-4" />
                Preview My Business Page
              </Link>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            {renderNavLinks()}
          </div>
          <div className="vendor-sidebar-help mx-5 mb-5 rounded-2xl bg-[#f4f6f3] p-4">
            <p className="text-sm font-semibold text-[#183e38]">
              A little help goes a long way.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Our team is here to help you make the most of your business page.
            </p>
            <Link
              href="/vendor/support"
              className="mt-3 inline-block text-xs font-semibold text-[#183e38] underline underline-offset-4"
            >
              Talk to our team ↗
            </Link>
          </div>

          {/* User Footer */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-10 w-10 rounded-full bg-[#e9efe9] flex items-center justify-center text-[#183e38] font-bold">
                {user?.firstName?.charAt(0) || "V"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-slate-500">Vendor Account</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="vendor-topbar flex h-20 items-center justify-between gap-4 px-5 pl-20 lg:px-9">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Your workspace
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {navConfig.find((item) => pathname === item.href)?.label ||
                "Business management"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/vendor/notifications"
              aria-label="View notifications"
              className="rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 p-3"
            >
              <Bell className="h-5 w-5" />
            </Link>
            <Link
              href="/vendor/settings"
              aria-label="Account settings"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#183e38] text-sm font-semibold text-white"
            >
              {user?.firstName?.charAt(0) || "V"}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="vendor-page-content p-4 sm:p-6 lg:p-9 max-w-[1440px] mx-auto">
          <BusinessProfileProvider>{children}</BusinessProfileProvider>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
