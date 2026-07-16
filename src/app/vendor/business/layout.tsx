'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  Phone, 
  MapPin, 
  ListChecks, 
  Clock, 
  Settings, 
  FileText, 
  Search,
  CalendarDays,
  LayoutTemplate,
  ShieldAlert,
  Globe
} from 'lucide-react';

const tabs = [
  { href: '/vendor/business/general', label: 'General', icon: Building2 },
  { href: '/vendor/business/contact', label: 'Contact', icon: Phone },
  { href: '/vendor/business/location', label: 'Location', icon: MapPin },
  { href: '/vendor/business/features', label: 'Features', icon: ListChecks },
  { href: '/vendor/business/hours', label: 'Business Hours', icon: Clock },
  { href: '/vendor/business/booking', label: 'Booking Settings', icon: Settings },
  { href: '/vendor/business/content', label: 'Content Builder', icon: LayoutTemplate },
  { href: '/vendor/business/policies', label: 'Policies & FAQ', icon: FileText },
  { href: '/vendor/business/seo', label: 'SEO', icon: Search },
];

export default function BusinessManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Internal Navigation Sidebar */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">My Business</h2>
            <p className="text-xs text-slate-500 mt-1">Manage your public profile</p>
          </div>
          <nav className="flex flex-col p-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
