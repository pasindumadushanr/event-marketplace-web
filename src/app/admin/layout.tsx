'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Store, Settings, LogOut, Menu,
  CalendarCheck, FileText, CreditCard, BarChart, Bell, Shield, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const navConfig = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'User Management',
    icon: Users,
    value: 'users',
    children: [
      { href: '/admin/users', label: 'All Users' },
      { href: '/admin/users/customers', label: 'Customers' },
      { href: '/admin/users/vendors', label: 'Vendors' },
      { href: '/admin/vendors/approvals', label: 'Vendor Approvals' },
      { href: '/admin/users/admins', label: 'Admins' },
      { href: '/admin/users/roles', label: 'Roles' },
      { href: '/admin/users/permissions', label: 'Permissions' },
    ]
  },
  {
    label: 'Business Management',
    icon: Store,
    value: 'business',
    children: [
      { href: '/admin/business', label: 'Businesses' },
      { href: '/admin/business/categories', label: 'Categories' },
      { href: '/admin/business/packages', label: 'Packages' },
    ]
  },
  {
    label: 'Booking Management',
    icon: CalendarCheck,
    value: 'bookings',
    children: [
      { href: '/admin/bookings', label: 'All Bookings' },
    ]
  },
  {
    label: 'CMS',
    icon: FileText,
    value: 'cms',
    children: [
      { href: '/admin/cms/pages', label: 'Pages' },
      { href: '/admin/cms/blog', label: 'Blog' },
      { href: '/admin/cms/banners', label: 'Banners' },
      { href: '/admin/cms/faq', label: 'FAQ' },
      { href: '/admin/cms/terms', label: 'Terms & Conditions' },
      { href: '/admin/cms/privacy', label: 'Privacy Policy' },
    ]
  },
  {
    label: 'Settings',
    icon: Settings,
    value: 'settings',
    children: [
      { href: '/admin/settings/general', label: 'General' },
      { href: '/admin/settings/seo', label: 'SEO' },
      { href: '/admin/settings/email', label: 'Email' },
      { href: '/admin/settings/social', label: 'Social Media' },
      { href: '/admin/settings/api-keys', label: 'API Keys' },
    ]
  },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/reports', label: 'Reports', icon: BarChart },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/security', label: 'Security', icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const NavLinks = () => {
    const [openItems, setOpenItems] = useState<string[]>(
      navConfig
        .filter(item => item.children && item.children.some(child => pathname === child.href || pathname.startsWith(child.href + '/')))
        .map(item => item.value as string)
    );

    const toggleItem = (val: string) => {
      setOpenItems(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    };

    return (
      <div className="w-full space-y-1">
        {navConfig.map((item, index) => {
          if (!item.children) {
            const isActive = pathname === item.href;
            return (
              <div key={index} className="px-1">
                <Link
                  href={item.href!}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              </div>
            );
          }

          const isOpen = openItems.includes(item.value);

          return (
            <div key={item.value} className="px-1">
              <button
                onClick={() => toggleItem(item.value)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all hover:bg-zinc-800 hover:text-white ${
                  isOpen ? 'text-white' : 'text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col space-y-1 pl-9 pr-2">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                          isChildActive
                            ? 'bg-zinc-800 text-white font-medium'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-zinc-950 text-white fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="font-bold text-lg tracking-tight">Event Admin</span>
        </div>
        <div className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-zinc-800">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header & Desktop Topbar */}
        <header className="h-16 flex items-center justify-between md:justify-end px-4 md:px-8 border-b bg-white sticky top-0 z-10">
          <div className="md:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="p-2 hover:bg-zinc-100 rounded-md">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-zinc-950 text-white border-zinc-800 p-0 flex flex-col">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="h-16 flex items-center px-6 border-b border-zinc-800 shrink-0">
                  <span className="font-bold text-lg tracking-tight">Event Admin</span>
                </div>
                <div className="flex-1 py-4 overflow-y-auto no-scrollbar">
                  <NavLinks />
                </div>
                <div className="p-4 border-t border-zinc-800 shrink-0">
                  <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <span className="ml-4 font-bold text-lg tracking-tight md:hidden">Event Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-zinc-500 mt-1">{user?.email}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-zinc-900 text-white text-xs">
                {user?.firstName?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-zinc-50">
          {children}
        </div>
      </main>
    </div>
  );
}
