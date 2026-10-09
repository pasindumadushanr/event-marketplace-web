"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User as UserIcon,
  Heart,
  CalendarDays,
  LogOut,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserAccountNav() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border border-slate-200"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage} alt={user.firstName} />
            <AvatarFallback className="bg-slate-100 text-slate-500 font-medium">
              {user.firstName ? (
                user.firstName.charAt(0)
              ) : (
                <UserIcon className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {(user.roleName === "ADMIN" || user.roleName === "SUPER_ADMIN") && (
          <>
            <DropdownMenuItem>
              <Link
                href="/admin"
                className="cursor-pointer flex items-center font-medium text-indigo-600 w-full"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin Portal</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {user.roleName === "VENDOR" && (
          <>
            <DropdownMenuItem>
              <Link
                href="/vendor"
                className="cursor-pointer flex items-center font-medium text-primary w-full"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Vendor Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <Link
            href="/account/bookings"
            className="cursor-pointer flex items-center w-full"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>My Bookings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="/account/favorites"
            className="cursor-pointer flex items-center w-full"
          >
            <Heart className="mr-2 h-4 w-4" />
            <span>My shortlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href="/account/settings"
            className="cursor-pointer flex items-center w-full"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar({ solid = false }: { solid?: boolean }) {
  const { user, logout } = useAuth();
  const [scrollPastHeader, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const usesLightHeader =
    pathname === "/careers" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/");
  const isScrolled = solid || scrollPastHeader || usesLightHeader;
  const pageNames: Record<string, string> = {
    "/about": "About Us",
    "/contact": "Contact Us",
    "/categories": "Categories",
    "/search": "Vendors",
    "/locations": "Locations",
    "/faq": "FAQ",
    "/blog": "Blog",
    "/sell": "For Vendors",
    "/careers": "Careers",
    "/trust": "Trust & Safety",
    "/terms": "Terms of Service",
    "/privacy": "Privacy Policy",
  };
  const currentPageName =
    pageNames[pathname] ||
    (pathname.startsWith("/blog/") ? "Blog Article" : null) ||
    (pathname.startsWith("/business/") ? "Vendor Profile" : null) ||
    (pathname.startsWith("/c/") ? "Category Vendors" : null);
  const isActiveLink = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/categories" && pathname.startsWith("/c/")) return true;
    if (href === "/search" && pathname.startsWith("/business/")) return true;
    return (
      pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "Vendors", href: "/search" },
    { name: "Locations", href: "/locations" },
    { name: "Packages", href: "/#packages" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  const mobileLinks = [
    ...links,
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-1"
          : "bg-transparent py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Nakathata.lk home"
            className="flex shrink-0 items-center gap-2 z-50"
          >
            <BrandLogo priority className="w-24 sm:w-28" />
          </Link>

          {currentPageName && !isMobileMenuOpen && (
            <div
              role="navigation"
              aria-label="Breadcrumb"
              className={`lg:hidden min-w-0 flex-1 px-3 ${isScrolled ? "text-[#355346]" : "text-white"}`}
            >
              <ol className="flex min-w-0 flex-col items-center gap-1">
                <li>
                  <Link
                    href="/"
                    className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-xs underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Home <ChevronRight aria-hidden="true" className="h-3 w-3" />
                  </Link>
                </li>
                <li
                  aria-current="page"
                  className="max-w-full truncate text-sm font-semibold"
                >
                  {currentPageName}
                </li>
              </ol>
            </div>
          )}

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-1 justify-center gap-8 font-medium">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActiveLink(link.href) ? "page" : undefined}
                className={`text-sm hover:text-primary transition-colors ${
                  isActiveLink(link.href)
                    ? `${isScrolled ? "text-[#355346]" : "text-primary"} underline underline-offset-8 decoration-2`
                    : isScrolled
                      ? "text-slate-600"
                      : "text-white/90 drop-shadow-sm"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center gap-4 pl-6 border-l border-slate-300/30">
              {user ? (
                <>
                  {user.roleName === "ADMIN" ||
                  user.roleName === "SUPER_ADMIN" ? (
                    <Link href="/admin">
                      <Button
                        variant={isScrolled ? "outline" : "secondary"}
                        className={`font-medium ${!isScrolled && "bg-white/10 text-white hover:bg-white/20 border-white/20"}`}
                      >
                        Admin Portal
                      </Button>
                    </Link>
                  ) : user.roleName === "VENDOR" ? (
                    <Link href="/vendor">
                      <Button
                        variant={isScrolled ? "outline" : "secondary"}
                        className={`font-medium ${!isScrolled && "bg-white/10 text-white hover:bg-white/20 border-white/20"}`}
                      >
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href="/vendor/register"
                      className={`text-sm font-medium hover:text-primary ${isScrolled ? "text-slate-600" : "text-white/90"}`}
                    >
                      Become a Vendor
                    </Link>
                  )}
                  <UserAccountNav />
                </>
              ) : (
                <>
                  <Link
                    href="/vendor/register"
                    className={`text-sm font-medium hover:text-primary ${isScrolled ? "text-slate-600" : "text-white/90"}`}
                  >
                    Become a Vendor
                  </Link>
                  <Link href="/login">
                    <Button
                      variant={isScrolled ? "outline" : "secondary"}
                      className={`font-medium ${!isScrolled && "bg-white/10 text-white hover:bg-white/20 border-white/20"}`}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg">
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className={`p-2 min-h-11 min-w-11 rounded-md ${isScrolled || isMobileMenuOpen ? "text-slate-900" : "text-white"}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden absolute top-0 left-0 w-full h-[100dvh] overflow-y-auto bg-[#fffdf8] pt-24 pb-8 px-6 flex flex-col gap-2 animate-in slide-in-from-top-5"
        >
          {currentPageName && (
            <p className="px-3 pb-2 text-sm text-[#50644b]">
              You are viewing <strong>{currentPageName}</strong>
            </p>
          )}
          {mobileLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActiveLink(link.href) ? "page" : undefined}
              className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 min-h-11 text-lg font-semibold border ${isActiveLink(link.href) ? "bg-[#edf1e7] text-[#355346] border-[#dce3d4]" : "text-slate-800 border-transparent hover:bg-[#f4efe5]"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
              {isActiveLink(link.href) && (
                <span className="text-xs font-medium">Current page</span>
              )}
            </Link>
          ))}
          <div className="flex flex-col gap-4 pt-4">
            {user ? (
              <>
                {user.roleName === "ADMIN" ||
                user.roleName === "SUPER_ADMIN" ? (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full text-lg h-12 bg-indigo-600 hover:bg-indigo-700">
                      Admin Portal
                    </Button>
                  </Link>
                ) : user.roleName === "VENDOR" ? (
                  <Link
                    href="/vendor"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full text-lg h-12 bg-primary">
                      Vendor Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link
                    href="/vendor/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full text-lg h-12">
                      Become a Vendor
                    </Button>
                  </Link>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/account/bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full h-12">
                      My Bookings
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="w-full h-12 text-red-600"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/vendor/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full text-lg h-12">
                    Become a Vendor
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="secondary" className="w-full h-12">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full h-12 bg-primary">Join Now</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
