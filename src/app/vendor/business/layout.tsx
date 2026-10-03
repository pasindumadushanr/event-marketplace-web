"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Phone,
  MapPin,
  ListChecks,
  Clock,
  Settings,
  FileText,
  Search,
  LayoutTemplate,
  Globe,
} from "lucide-react";

const tabs = [
  {
    href: "/vendor/business/general",
    label: "Business Details",
    icon: Building2,
  },
  { href: "/vendor/gallery", label: "Photos & Videos", icon: LayoutTemplate },
  { href: "/vendor/packages", label: "Services & Prices", icon: ListChecks },
  { href: "/vendor/reviews", label: "Customer Reviews", icon: Globe },
  { href: "/vendor/business/contact", label: "Contact", icon: Phone },
  { href: "/vendor/business/location", label: "Location", icon: MapPin },
  { href: "/vendor/business/features", label: "Features", icon: ListChecks },
  { href: "/vendor/business/hours", label: "Business Hours", icon: Clock },
  {
    href: "/vendor/business/booking",
    label: "Booking Settings",
    icon: Settings,
  },
  {
    href: "/vendor/business/content",
    label: "Extra Page Sections",
    icon: LayoutTemplate,
  },
  {
    href: "/vendor/business/policies",
    label: "Policies & FAQ",
    icon: FileText,
  },
  {
    href: "/vendor/business/seo",
    label: "Google Search Appearance",
    icon: Search,
  },
];

export default function BusinessManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const optionalPaths = ["features", "hours", "booking", "content", "seo"];
  const isOptional = (href: string) =>
    optionalPaths.some((path) => href.endsWith("/" + path));
  const renderTab = (tab: (typeof tabs)[number]) => (
    <Link
      key={tab.href}
      href={tab.href}
      aria-current={pathname === tab.href ? "page" : undefined}
      className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${pathname === tab.href ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
    >
      <tab.icon className="h-4 w-4 shrink-0" />
      {tab.label}
    </Link>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Internal Navigation Sidebar */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">My Business Page</h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage your public profile
            </p>
          </div>
          <nav className="flex overflow-x-auto lg:flex-col p-2">
            {tabs.filter((tab) => !isOptional(tab.href)).map(renderTab)}
          </nav>
          <details
            key={pathname}
            open={isOptional(pathname)}
            className="border-t border-slate-100 p-2"
          >
            <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-500">
              More options · optional
            </summary>
            <nav className="flex overflow-x-auto lg:flex-col">
              {tabs.filter((tab) => isOptional(tab.href)).map(renderTab)}
            </nav>
          </details>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
