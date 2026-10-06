"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  LayoutDashboard,
  Users,
  Store,
  Settings,
  LogOut,
  Menu,
  CalendarCheck,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Shield,
  ChevronDown,
  ArrowUpRight,
  ClipboardCheck,
  Headphones,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import "./admin.css";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: { href: string; label: string }[];
};
const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Workspace",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      {
        href: "/admin/vendors/approvals",
        label: "Vendor Approvals",
        icon: ClipboardCheck,
      },
      { href: "/admin/launch", label: "Launch Support", icon: Store },
      { href: "/admin/support", label: "Support Inbox", icon: Headphones },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        label: "User Management",
        icon: Users,
        children: [
          { href: "/admin/users", label: "All Users" },
          { href: "/admin/users/customers", label: "Customers" },
          { href: "/admin/users/vendors", label: "Vendors" },
          { href: "/admin/users/admins", label: "Admins" },
          { href: "/admin/users/roles", label: "Roles" },
          { href: "/admin/users/permissions", label: "Permissions" },
        ],
      },
      {
        label: "Business Management",
        icon: Store,
        children: [
          { href: "/admin/business", label: "Businesses" },
          { href: "/admin/business/categories", label: "Categories" },
          { href: "/admin/business/packages", label: "Packages" },
        ],
      },
      {
        label: "Memberships",
        icon: CreditCard,
        children: [
          { href: "/admin/subscriptions/plans", label: "Plans & Pricing" },
          {
            href: "/admin/subscriptions/vendors",
            label: "Vendor Subscriptions",
          },
        ],
      },
      {
        label: "CMS",
        icon: FileText,
        children: [
          { href: "/admin/cms/pages", label: "Pages" },
          { href: "/admin/cms/blog", label: "Blog" },
          { href: "/admin/cms/banners", label: "Banners" },
          { href: "/admin/cms/faq", label: "FAQ" },
          { href: "/admin/cms/terms", label: "Terms & Conditions" },
          { href: "/admin/cms/privacy", label: "Privacy Policy" },
          { href: "/admin/cms/settings", label: "Global Settings" },
        ],
      },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/activity", label: "Activity History", icon: FileText },
      { href: "/admin/security", label: "Security", icon: Shield },
      {
        label: "Settings",
        icon: Settings,
        children: [
          { href: "/admin/settings/general", label: "General" },
          { href: "/admin/settings/seo", label: "SEO" },
          { href: "/admin/settings/email", label: "Email" },
          { href: "/admin/settings/social", label: "Social Media" },
          { href: "/admin/settings/api-keys", label: "API Keys" },
        ],
      },
    ],
  },
];
const allItems = navGroups.flatMap((group) => group.items);
function activeHref(path: string, href: string) {
  return path === href || (href !== "/admin" && path.startsWith(href + "/"));
}
function pageContext(path: string) {
  const candidates = allItems.flatMap<{
    href: string;
    label: string;
    section: string;
  }>((item) =>
    item.children
      ? item.children.map((child) => ({ ...child, section: item.label }))
      : item.href
        ? [{ href: item.href, label: item.label, section: "Workspace" }]
        : [],
  );
  return candidates
    .filter((item) => item.href && activeHref(path, item.href))
    .sort((a, b) => (b.href?.length || 0) - (a.href?.length || 0))[0];
}
function Navigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const selectedHref = pageContext(pathname)?.href;
  return (
    <nav aria-label="Admin navigation" className="space-y-6 px-4 py-5">
      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              if (item.href)
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={
                      selectedHref === item.href ? "page" : undefined
                    }
                    className="admin-nav-link"
                  >
                    <Icon aria-hidden="true" size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              const containsActive = item.children?.some(
                (child) => child.href === selectedHref,
              );
              const expansionKey = `${pathname}:${item.label}`;
              const isOpen = expanded[expansionKey] ?? containsActive ?? false;
              const panelId = `admin-nav-${item.label.toLowerCase().replaceAll(" ", "-")}`;
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setExpanded((old) => ({
                        ...old,
                        [expansionKey]: !isOpen,
                      }))
                    }
                    className={`admin-nav-link w-full ${containsActive ? "text-white" : ""}`}
                  >
                    <Icon aria-hidden="true" size={18} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      aria-hidden="true"
                      size={15}
                      className={isOpen ? "rotate-180" : ""}
                    />
                  </button>
                  <div
                    id={panelId}
                    hidden={!isOpen}
                    className="ml-5 mt-1 space-y-1 border-l border-white/15 pl-3"
                  >
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        aria-current={
                          child.href === selectedHref ? "page" : undefined
                        }
                        className="admin-nav-link text-xs"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3 px-6 py-6">
      <BrandLogo className="w-16 rounded-lg" />
      <span>
        <span className="block font-semibold tracking-tight text-white">
          Nakathata.lk
        </span>
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.17em] text-slate-400">
          Admin workspace
        </span>
      </span>
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const authorized =
    isAuthenticated && ["ADMIN", "SUPER_ADMIN"].includes(user?.roleName || "");
  useEffect(() => {
    if (pathname !== "/admin/login" && !isLoading && !authorized)
      router.push("/admin/login");
  }, [authorized, isLoading, router, pathname]);
  if (pathname === "/admin/login") return <>{children}</>;
  if (isLoading || !authorized)
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-sm text-slate-600"
      >
        <Sparkles className="size-5 animate-pulse text-teal-700" />
        Opening your workspace…
      </div>
    );
  const context = pageContext(pathname);
  const footer = (
    <div className="border-t border-white/10 p-4">
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="admin-nav-link"
      >
        <ArrowUpRight aria-hidden="true" size={18} />
        View website
      </Link>
      <button type="button" onClick={logout} className="admin-nav-link w-full">
        <LogOut aria-hidden="true" size={18} />
        Logout
      </button>
    </div>
  );
  return (
    <div className="admin-workspace flex min-h-screen bg-[#f3f6f8] text-slate-800">
      <a
        href="#admin-page"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-3"
      >
        Skip to page content
      </a>
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-30 hidden w-[272px] flex-col lg:flex">
        <Brand />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Navigation pathname={pathname} onNavigate={() => {}} />
        </div>
        {footer}
      </aside>
      <div className="min-w-0 flex-1 lg:ml-[272px]">
        <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                aria-label="Open navigation"
                className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
              >
                <Menu size={20} />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="admin-sidebar w-[min(85vw,300px)]! gap-0 border-0 p-0 text-white"
              >
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Choose a section of the admin workspace.
                </SheetDescription>
                <Brand />
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <Navigation
                    pathname={pathname}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </div>
                {footer}
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {context?.section || "Administration"}
              </p>
              <p className="truncate text-sm font-semibold text-slate-800">
                {context?.label || "Admin workspace"}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Link
              href="/admin/support"
              aria-label="Open support inbox"
              className="hidden rounded-full border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 sm:block"
            >
              <Headphones size={18} />
            </Link>
            <div className="hidden border-l border-slate-200 pl-5 text-right sm:block">
              <p className="text-sm font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {user?.roleName === "SUPER_ADMIN"
                  ? "Super administrator"
                  : "Administrator"}
              </p>
            </div>
            <span
              aria-label={`${user?.firstName || "Admin"} account`}
              className="flex size-10 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-sm font-semibold text-teal-800"
            >
              {user?.firstName?.charAt(0) || "A"}
              {user?.lastName?.charAt(0)}
            </span>
          </div>
        </header>
        <main
          id="admin-page"
          tabIndex={-1}
          className="admin-page mx-auto max-w-[1600px] p-4 outline-none sm:p-8 xl:p-10"
        >
          {children}
        </main>
        <footer className="flex flex-wrap items-center justify-between gap-2 px-4 pb-6 text-[11px] text-slate-400 sm:px-8 xl:px-10">
          <span>Nakathata.lk · Administration</span>
          <span>Made for your everyday operations</span>
        </footer>
      </div>
    </div>
  );
}
