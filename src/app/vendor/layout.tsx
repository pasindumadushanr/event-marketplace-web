'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  LayoutDashboard,
  Building2,
  Image as ImageIcon,
  Package,
  CalendarDays,
  CalendarRange,
  Star,
  LineChart,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navConfig = [
  { href: '/vendor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendor/business', label: 'My Business', icon: Building2 },
  { href: '/vendor/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/vendor/packages', label: 'Packages', icon: Package },
  { href: '/vendor/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/vendor/calendar', label: 'Calendar', icon: CalendarRange },
  { href: '/vendor/reviews', label: 'Reviews', icon: Star },
  { href: '/vendor/revenue', label: 'Revenue & Analytics', icon: LineChart },
  { href: '/vendor/notifications', label: 'Notifications', icon: Bell },
  { href: '/vendor/documents', label: 'Documents', icon: FileText },
  { href: '/vendor/settings', label: 'Settings', icon: Settings },
  { href: '/vendor/support', label: 'Support', icon: HelpCircle },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Routes that should NOT show the dashboard sidebar
  const hideSidebar = [
    '/vendor/onboarding', 
    '/vendor/status', 
    '/vendor/register', 
    '/vendor/verify-email'
  ].includes(pathname);

  useEffect(() => {
    if (hideSidebar) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    const verifyVendorApproval = async () => {
      try {
        const { data } = await api.get('/vendor/business/onboarding/status');
        if (data.vendorStatus === 'APPROVED') {
          setIsAuthorized(true);
        } else if (data.vendorStatus === 'NOT_STARTED') {
          router.push('/vendor/onboarding');
        } else {
          router.push('/vendor/status');
        }
      } catch (error) {
        router.push('/vendor/onboarding');
      } finally {
        setIsLoading(false);
      }
    };
    verifyVendorApproval();
  }, [pathname, hideSidebar, router]);

  if (isLoading || !isAuthorized) {
    if (hideSidebar) return <>{children}</>;
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If we are on a page that hides the sidebar, just render children
  if (hideSidebar) {
    return <>{children}</>;
  }

  const NavLinks = () => (
    <nav className="flex-1 space-y-1 px-4 py-4">
      {navConfig.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-slate-900 text-white shadow-md"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo / Header */}
          <div className="flex h-16 items-center px-6 bg-slate-950 border-b border-slate-800 shrink-0">
            <span className="text-xl font-bold text-white tracking-tight">Vendor Portal</span>
          </div>

          <div className="p-4 shrink-0">
            <Link href="/vendor/preview">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-lg py-2 transition-colors font-medium text-sm">
                <Eye className="h-4 w-4" />
                Preview Store
              </button>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            <NavLinks />
          </nav>

          {/* User Footer */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0) || 'V'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-slate-400">Vendor Account</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
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
