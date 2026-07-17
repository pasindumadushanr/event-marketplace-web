'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Heart, Settings, User } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

const navItems = [
  { href: '/account/profile', label: 'Personal Info', icon: User },
  { href: '/account/bookings', label: 'My Bookings', icon: CalendarDays },
  { href: '/account/favorites', label: 'Favorites', icon: Heart },
  { href: '/account/settings', label: 'Account Settings', icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <div className="bg-slate-900">
        <Navbar />
      </div>
      
      {/* Spacer for sticky navbar */}
      <div className="h-20 bg-slate-900" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Left Rail Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Account</h1>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive 
                      ? 'bg-white shadow-sm text-primary border border-slate-200' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 pt-2 md:pt-16">
          {children}
        </div>

      </main>

      <Footer />
    </div>
  );
}
